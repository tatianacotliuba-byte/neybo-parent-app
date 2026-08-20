// POST /.netlify/functions/nb-participant
// Create the participant + consent record. PII lives ONLY here (Supabase), never PostHog.
'use strict';
const { json, sbInsert, isUuid, str, boolOrNull, handle } = require('./lib/util');

exports.handler = handle(async (body) => {
  if (!isUuid(body.participant_code)) return json(400, { error: 'participant_code' });

  const first = str(body.first_name, 120);
  const last = str(body.last_name, 120);
  if (!first || !first.trim() || !last || !last.trim()) return json(400, { error: 'name_required' });

  const consent_analytics = boolOrNull(body.consent_analytics);
  const consent_session_recording = boolOrNull(body.consent_session_recording);
  if (consent_analytics !== true || consent_session_recording !== true) {
    return json(400, { error: 'consent_required' });
  }

  await sbInsert('participants', {
    participant_code: body.participant_code,
    first_name: first.trim(),
    last_name: last.trim(),
    email: str(body.email, 254),
    child_age_group: str(body.child_age_group, 40),
    consent_analytics,
    consent_session_recording,
  });

  return json(200, { ok: true });
});
