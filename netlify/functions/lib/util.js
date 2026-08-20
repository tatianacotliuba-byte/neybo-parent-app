// Shared helpers for the Supabase write functions.
// Not a function endpoint itself (leading underscore -> ignored by Netlify's
// function scanner, but still importable by the sibling functions).
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
    const t = await res.text().catch(() => '');
    throw new Error('supabase_' + res.status + ':' + t.slice(0, 300));
  }
  return res;
}

const sbInsert = (table, row) =>
  sbFetch(table, { method: 'POST', body: JSON.stringify(row) });

const sbUpdate = (table, match, patch) => {
  const q = Object.entries(match)
    .map(([k, v]) => k + '=eq.' + encodeURIComponent(v))
    .join('&');
  return sbFetch(table + '?' + q, { method: 'PATCH', body: JSON.stringify(patch) });
};

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

// Wraps a handler with method/CORS/parse guards. `fn(body,event)` -> object.
function handle(fn) {
  return async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
    if (event.httpMethod !== 'POST') return json(405, { error: 'method' });
    const body = parseBody(event);
    if (!body) return json(400, { error: 'bad_json' });
    try {
      return await fn(body, event);
    } catch (e) {
      // Never leak internals; keep client resilient (it treats non-200 as soft-fail).
      const msg = String((e && e.message) || e);
      const code = msg === 'supabase_not_configured' ? 503 : 500;
      return json(code, { error: 'server', detail: msg.slice(0, 120) });
    }
  };
}

module.exports = {
  CORS, json, sbInsert, sbUpdate, isUuid, str, boolOrNull, intOrNull, handle,
};
