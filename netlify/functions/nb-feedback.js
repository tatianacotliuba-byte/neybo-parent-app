// POST /.netlify/functions/nb-feedback
// Insert one post-test feedback record.
'use strict';
const { json, sbInsert, isUuid, str, boolOrNull, intOrNull, handle, retryOn, FK_VIOLATION } = require('./lib/util');

exports.handler = handle(async (body) => {
  if (!isUuid(body.test_session_id)) return json(400, { error: 'test_session_id' });

  await retryOn([FK_VIOLATION], () => sbInsert('feedback', {
    test_session_id: body.test_session_id,
    ease_score: intOrNull(body.ease_score, 1, 5),
    control_score: intOrNull(body.control_score, 1, 5),
    trust_score: intOrNull(body.trust_score, 1, 5),
    room_audio_clarity_score: intOrNull(body.room_audio_clarity_score, 1, 5),
    most_confusing: str(body.most_confusing, 2000),
    missing_feature: str(body.missing_feature, 2000),
    concern: str(body.concern, 2000),
    would_use: boolOrNull(body.would_use),
  }));

  return json(200, { ok: true });
});
