/* Local check for the netlify/functions Supabase writers — see footer for usage. */
process.env.FAKE_KEY = 'fake-service-role';
process.env.SUPABASE_URL = 'http://127.0.0.1:5599';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'fake-service-role';

const participant = require('../netlify/functions/nb-participant').handler;
const session     = require('../netlify/functions/nb-session').handler;
const task        = require('../netlify/functions/nb-task').handler;
const feedback    = require('../netlify/functions/nb-feedback').handler;

const PC = '11111111-1111-4111-8111-111111111111';
const TS = '22222222-2222-4222-8222-222222222222';
const ev = (b) => ({ httpMethod: 'POST', path: '/.netlify/functions/x', body: JSON.stringify(b) });
const ctl = (o) => fetch('http://127.0.0.1:5599/__ctl', { method: 'POST', body: JSON.stringify(o) }).then(r => r.json());
const dump = () => fetch('http://127.0.0.1:5599/__db').then(r => r.json());

let pass = 0, fail = 0;
function check(name, got, want) {
  const ok = got === want;
  ok ? pass++ : fail++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}  -> ${got}${ok ? '' : '  (expected ' + want + ')'}`);
}

(async () => {
  console.log('\n=== 1. happy path: participant, then session, then events ===');
  let r = await participant(ev({ participant_code: PC, first_name: 'Alex', last_name: 'Miller',
    email: 'a@b.co', child_age_group: '4-5', consent_analytics: true, consent_session_recording: true }));
  check('nb-participant create', r.statusCode, 200);
  r = await session(ev({ op: 'create', test_session_id: TS, participant_code: PC, test_version: 'v1', device_type: 'desktop' }));
  check('nb-session create', r.statusCode, 200);
  r = await session(ev({ op: 'update', test_session_id: TS, last_screen: 'home' }));
  check('nb-session update last_screen', r.statusCode, 200);
  r = await task(ev({ test_session_id: TS, task_id: 'onboarding', completion_type: 'completed', duration_sec: 42, success: true }));
  check('nb-task insert', r.statusCode, 200);
  r = await feedback(ev({ test_session_id: TS, ease_score: 4, would_use: true }));
  check('nb-feedback insert', r.statusCode, 200);
  r = await session(ev({ op: 'update', test_session_id: TS, completion_status: 'completed' }));
  check('nb-session complete', r.statusCode, 200);

  console.log('\n=== 2. replay / reload must not 409 ===');
  r = await participant(ev({ participant_code: PC, first_name: 'Alex', last_name: 'Miller',
    consent_analytics: true, consent_session_recording: true }));
  check('nb-participant replayed (upsert)', r.statusCode, 200);
  r = await session(ev({ op: 'create', test_session_id: TS, participant_code: PC }));
  check('nb-session create replayed (upsert)', r.statusCode, 200);

  console.log('\n=== 3. THE BUG: session create races ahead of the participant row ===');
  const PC2 = '33333333-3333-4333-8333-333333333333';
  const TS2 = '44444444-4444-4444-8444-444444444444';
  const raced = session(ev({ op: 'create', test_session_id: TS2, participant_code: PC2 }));
  setTimeout(() => participant(ev({ participant_code: PC2, first_name: 'Rae', last_name: 'Kim',
    consent_analytics: true, consent_session_recording: true })), 300);   // arrives late
  r = await raced;
  check('nb-session create survives FK race (retry)', r.statusCode, 200);

  console.log('\n=== 4. failures are now diagnosable, not a blind 500 ===');
  await ctl({ missingTable: 'test_sessions' });
  r = await session(ev({ op: 'create', test_session_id: '55555555-5555-4555-8555-555555555555', participant_code: PC }));
  check('missing table -> 404 not 500', r.statusCode, 404);
  console.log('        body:', r.body);
  await ctl({ missingTable: null, unauthorized: true });
  r = await session(ev({ op: 'create', test_session_id: '66666666-6666-4666-8666-666666666666', participant_code: PC }));
  check('bad service_role key -> 401 not 500', r.statusCode, 401);
  console.log('        body:', r.body);
  await ctl({ unauthorized: false });

  console.log('\n=== 5. env not configured ===');
  const saved = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_SERVICE_ROLE_KEY = '';
  r = await session(ev({ op: 'create', test_session_id: '77777777-7777-4777-8777-777777777777', participant_code: PC }));
  check('missing env -> 503', r.statusCode, 503);
  process.env.SUPABASE_SERVICE_ROLE_KEY = saved;

  console.log('\n=== 6. validation unchanged ===');
  check('bad uuid -> 400', (await session(ev({ op: 'create', test_session_id: 'nope', participant_code: PC }))).statusCode, 400);
  check('bad status -> 400', (await session(ev({ op: 'update', test_session_id: TS, completion_status: 'weird' }))).statusCode, 400);
  check('GET -> 405', (await session({ httpMethod: 'GET' })).statusCode, 405);

  const db = await dump();
  console.log('\n=== rows written ===');
  for (const k of Object.keys(db)) console.log('  %s: %d', k, db[k].length);
  console.log('  session row:', JSON.stringify(db.test_sessions[0]));
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
/* Run:  node tools/fake-postgrest.js &   FAKE_KEY=fake-service-role
 *       node tools/functions-test.js
 * Exercises the Supabase write functions against a local PostgREST stand-in.
 * Never touches the real project and needs no service_role key.            */
