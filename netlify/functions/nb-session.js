// POST /.netlify/functions/nb-session
// op:'create'  -> insert a test_sessions row (idempotent)
// op:'update'  -> patch ONLY the row addressed by its own test_session_id
// A client can therefore only touch the session whose id it holds; it cannot
// enumerate or modify other sessions (RLS also denies anon entirely).
'use strict';
const {
  json, sbInsert, sbUpdate, isUuid, str, handle, retryOn, FK_VIOLATION,
} = require('./lib/util');

const STATUS = ['started', 'in_progress', 'completed', 'abandoned'];

exports.handler = handle(async (body) => {
  const op = body.op === 'update' ? 'update' : 'create';
  if (!isUuid(body.test_session_id)) return json(400, { error: 'test_session_id' });

  if (op === 'create') {
    if (!isUuid(body.participant_code)) return json(400, { error: 'participant_code' });

    // The client fires nb-participant and nb-session in parallel, so this
    // insert can land before the participants row exists and trip the FK.
    // Retry briefly instead of failing the session for the whole test.
    // upsert: replaying the same test_session_id must not 409 either.
    await retryOn([FK_VIOLATION], () =>
      sbInsert('test_sessions', {
        test_session_id: body.test_session_id,
        participant_code: body.participant_code,
        test_version: str(body.test_version, 60) || 'unknown',
        device_type: str(body.device_type, 20),
      }, { upsert: true }));

    return json(200, { ok: true, op });
  }

  // update — whitelist patchable fields only
  const patch = {};
  if (body.last_screen !== undefined) patch.last_screen = str(body.last_screen, 60);
  if (body.last_task !== undefined) patch.last_task = str(body.last_task, 60);
  if (body.posthog_session_id !== undefined) patch.posthog_session_id = str(body.posthog_session_id, 80);
  if (body.device_type !== undefined) patch.device_type = str(body.device_type, 20);
  if (body.completion_status !== undefined) {
    const s = str(body.completion_status, 20);
    if (!STATUS.includes(s)) return json(400, { error: 'completion_status' });
    patch.completion_status = s;
    if (s === 'completed') patch.completed_at = new Date().toISOString();
  }
  if (Object.keys(patch).length === 0) return json(400, { error: 'nothing_to_update' });

  await sbUpdate('test_sessions', { test_session_id: body.test_session_id }, patch);
  return json(200, { ok: true, op });
});
