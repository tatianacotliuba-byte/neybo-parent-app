// POST /.netlify/functions/nb-feedback-full
// One row per completed questionnaire, answers and all, as jsonb.
//
// Why this exists next to nb-feedback: the analytics wrapper cannot tell the
// browser whether anything arrived — capture() is fire-and-forget, and any
// tracker blocker kills it silently. The 200 from here is the only honest
// proof the answers left the tester's machine, so it is what the room waits
// for before it says "Sent".
//
// The whole payload goes in as jsonb on purpose: a new question, a new rating
// or a new diagnostic never needs a migration, and no answer can be dropped
// for want of a column.
'use strict';
const {
  json, sbInsert, isUuid, str, handle, retryOn,
  FK_VIOLATION, UNIQUE_VIOLATION, SbError,
} = require('./lib/util');

const MAX_BYTES = 262144;   // 256 KB — many times the largest real answer set

exports.handler = handle(async (body) => {
  if (!isUuid(body.submission_id)) return json(400, { error: 'submission_id' });

  const payload = body.payload;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return json(400, { error: 'payload' });
  }
  const bytes = Buffer.byteLength(JSON.stringify(payload), 'utf8');
  if (bytes > MAX_BYTES) return json(413, { error: 'payload_too_large', bytes });

  const row = {
    test_session_id: isUuid(body.test_session_id) ? body.test_session_id : null,
    participant_code: str(body.participant_code, 64),
    submission_id: body.submission_id,
    payload,
  };

  try {
    // the session row is written by nb-session and can still be in flight
    await retryOn([FK_VIOLATION], () => sbInsert('feedback_full', row));
  } catch (e) {
    if (e instanceof SbError && e.code === UNIQUE_VIOLATION) {
      // the same submission twice: a retry after a lost response must succeed
      return json(200, { ok: true, duplicate: true });
    }
    if (e instanceof SbError && e.code === FK_VIOLATION) {
      // the session row never showed up. The answers matter more than the
      // link, and participant_code still says who wrote them.
      console.error('[nb-feedback-full] session %s unknown — storing unlinked',
        row.test_session_id);
      await sbInsert('feedback_full', Object.assign({}, row, { test_session_id: null }));
      return json(200, { ok: true, unlinked: true });
    }
    throw e;
  }

  return json(200, { ok: true });
});
