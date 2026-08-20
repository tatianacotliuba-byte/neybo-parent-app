// Shared helpers for the Supabase write functions.
// Not a function endpoint itself (it lives in a subdirectory, so Netlify's
// function scanner ignores it, but the sibling functions can require it).
'use strict';

const CORS = {
  'Access-Control-Allow-Origin': '*', // same-site in practice; validation below is the real guard
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

function json(statusCode, obj) {
  return { statusCode, headers: CORS, body: JSON.stringify(obj) };
}

function env() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // service role — server only
  return { url: url.replace(/\/+$/, ''), key };
}

/* A PostgREST failure carried as a real error object instead of a string, so
   callers can branch on the status / SQLSTATE instead of parsing a message. */
class SbError extends Error {
  constructor(status, payload, path) {
    const code = (payload && payload.code) || '';
    const message = (payload && (payload.message || payload.hint)) || '';
    super('supabase_' + status + (code ? '_' + code : '') + (message ? ': ' + message : ''));
    this.name = 'SbError';
    this.status = status;
    this.code = code;
    this.details = (payload && payload.details) || '';
    this.hint = (payload && payload.hint) || '';
    this.pgMessage = message;
    this.path = path;
  }
}

async function sbFetch(path, opts) {
  const { url, key } = env();
  if (!url || !key) throw new Error('supabase_not_configured');
  const res = await fetch(url + '/rest/v1/' + path, {
    ...opts,
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
      ...(opts && opts.headers),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let payload = null;
    try { payload = JSON.parse(text); } catch (e) { payload = { message: text.slice(0, 300) }; }
    throw new SbError(res.status, payload, path);
  }
  return res;
}

/* insert. opts.upsert -> ON CONFLICT DO UPDATE, so replaying the same row is
   a no-op instead of a 409. */
const sbInsert = (table, row, opts) =>
  sbFetch(table, {
    method: 'POST',
    body: JSON.stringify(row),
    headers: (opts && opts.upsert)
      ? { Prefer: 'return=minimal,resolution=merge-duplicates' }
      : undefined,
  });

const sbUpdate = (table, match, patch) => {
  const q = Object.entries(match)
    .map(([k, v]) => k + '=eq.' + encodeURIComponent(v))
    .join('&');
  return sbFetch(table + '?' + q, { method: 'PATCH', body: JSON.stringify(patch) });
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* PostgREST/Postgres codes worth naming */
const FK_VIOLATION = '23503';      // referenced row does not exist yet
const UNIQUE_VIOLATION = '23505';  // row already there

/* Run fn, retrying only while it fails with one of `codes`. Used to absorb the
   participant/session write race without forcing the client to serialise. */
async function retryOn(codes, fn, attempts = 3, baseMs = 250) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); } catch (e) {
      last = e;
      if (!(e instanceof SbError) || !codes.includes(e.code) || i === attempts - 1) throw e;
      await sleep(baseMs * Math.pow(2, i));
    }
  }
  throw last;
}

// ---- validation helpers ----
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isUuid = (s) => typeof s === 'string' && UUID_RE.test(s);
const str = (v, max = 500) => (v == null ? null : String(v).slice(0, max));
const boolOrNull = (v) => (v === true || v === false ? v : null);
const intOrNull = (v, lo = -2147483648, hi = 2147483647) => {
  if (v == null || v === '') return null;
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : null;
};

function parseBody(event) {
  try {
    return JSON.parse(event.body || '{}');
  } catch (e) {
    return null;
  }
}

/* Wraps a handler with method/CORS/parse guards. `fn(body,event)` -> object.
   Failures are logged in full to the function log (never to the client) and
   answered with the PostgREST status + SQLSTATE so a 500 is diagnosable from
   the browser without leaking the key or the row contents. */
function handle(fn) {
  return async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
    if (event.httpMethod !== 'POST') return json(405, { error: 'method' });
    const body = parseBody(event);
    if (!body) return json(400, { error: 'bad_json' });
    const name = (event.path || '').split('/').pop() || 'fn';
    try {
      return await fn(body, event);
    } catch (e) {
      if (e && e.message === 'supabase_not_configured') {
        console.error('[%s] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in this deploy context', name);
        return json(503, { error: 'supabase_not_configured' });
      }
      if (e instanceof SbError) {
        console.error('[%s] supabase %d %s on %s :: %s | details=%s hint=%s',
          name, e.status, e.code || '-', e.path, e.pgMessage, e.details, e.hint);
        // 4xx from PostgREST is a client/schema problem, not a server crash
        const out = e.status >= 400 && e.status < 500 ? e.status : 502;
        return json(out, {
          error: 'supabase',
          supabase_status: e.status,
          supabase_code: e.code || null,
          detail: String(e.pgMessage || '').slice(0, 200),
        });
      }
      console.error('[%s] unhandled', name, e);
      return json(500, { error: 'server', detail: String((e && e.message) || e).slice(0, 200) });
    }
  };
}

module.exports = {
  CORS, json, sbInsert, sbUpdate, sbFetch, SbError,
  isUuid, str, boolOrNull, intOrNull, handle,
  retryOn, FK_VIOLATION, UNIQUE_VIOLATION, sleep,
};
