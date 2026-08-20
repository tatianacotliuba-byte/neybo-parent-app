/* Minimal PostgREST stand-in: enough of the contract to exercise the handlers.
   Enforces the participants -> test_sessions -> task_results/feedback FKs and
   primary-key uniqueness, so the real failure modes are reproducible offline. */
const http = require('http');
const db = { participants: [], test_sessions: [], task_results: [], feedback: [] };
const PK = { participants: 'participant_code', test_sessions: 'test_session_id' };
const FK = {
  test_sessions: ['participant_code', 'participants', 'participant_code'],
  task_results:  ['test_session_id', 'test_sessions', 'test_session_id'],
  feedback:      ['test_session_id', 'test_sessions', 'test_session_id'],
};
const state = { missingTable: null, unauthorized: false, latency: 0 };

function send(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(obj === undefined ? '' : JSON.stringify(obj));
}
const srv = http.createServer((req, res) => {
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => setTimeout(() => {
    const [pathname, qs] = req.url.split('?');
    const table = pathname.replace('/rest/v1/', '');
    if (pathname === '/__ctl') { Object.assign(state, JSON.parse(raw || '{}')); return send(res, 200, state); }
    if (pathname === '/__db')  return send(res, 200, db);

    if (state.unauthorized || req.headers.apikey !== process.env.FAKE_KEY) {
      return send(res, 401, { message: 'Invalid API key', hint: 'Double check your Supabase `service_role` API key.' });
    }
    if (state.missingTable === table) {
      return send(res, 404, { code: 'PGRST205', message: "Could not find the table 'public." + table + "' in the schema cache" });
    }
    if (!db[table]) return send(res, 404, { code: 'PGRST205', message: "Could not find the table 'public." + table + "'" });

    const body = raw ? JSON.parse(raw) : {};
    const prefer = req.headers.prefer || '';

    if (req.method === 'POST') {
      const fk = FK[table];
      if (fk && !db[fk[1]].some((r) => r[fk[2]] === body[fk[0]])) {
        return send(res, 409, {
          code: '23503',
          message: 'insert or update on table "' + table + '" violates foreign key constraint',
          details: 'Key (' + fk[0] + ')=(' + body[fk[0]] + ') is not present in table "' + fk[1] + '".',
        });
      }
      const pk = PK[table];
      if (pk && db[table].some((r) => r[pk] === body[pk])) {
        if (!prefer.includes('resolution=merge-duplicates')) {
          return send(res, 409, { code: '23505', message: 'duplicate key value violates unique constraint "' + table + '_pkey"' });
        }
        Object.assign(db[table].find((r) => r[pk] === body[pk]), body);
        return send(res, 201, undefined);
      }
      db[table].push({ ...body });
      return send(res, 201, undefined);
    }
    if (req.method === 'PATCH') {
      const m = Object.fromEntries((qs || '').split('&').filter(Boolean)
        .map((p) => { const [k, v] = p.split('='); return [k, decodeURIComponent(v.replace(/^eq\./, ''))]; }));
      db[table].filter((r) => Object.entries(m).every(([k, v]) => String(r[k]) === v))
               .forEach((r) => Object.assign(r, body));
      return send(res, 204, undefined);
    }
    send(res, 405, { message: 'method' });
  }, state.latency));
});
srv.listen(5599, () => console.log('fake postgrest on 5599'));
