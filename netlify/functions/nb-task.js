// POST /.netlify/functions/nb-task
// Insert one finished task_result (client posts the complete record once the
// task ends: completed / skipped / abandoned / timeout).
'use strict';
const { json, sbInsert, isUuid, str, boolOrNull, intOrNull, handle } = require('./lib/util');

const COMPLETION = ['completed', 'skipped', 'abandoned', 'timeout', 'incorrect'];

exports.handler = handle(async (body) => {
  if (!isUuid(body.test_session_id)) return json(400, { error: 'test_session_id' });
  const task_id = str(body.task_id, 60);
  if (!task_id) return json(400, { error: 'task_id' });

  let completion_type = str(body.completion_type, 20);
  if (completion_type && !COMPLETION.includes(completion_type)) completion_type = null;

  await sbInsert('task_results', {
    test_session_id: body.test_session_id,
    task_id,
    started_at: str(body.started_at, 40),
    completed_at: str(body.completed_at, 40),
    success: boolOrNull(body.success),
    duration_sec: intOrNull(body.duration_sec, 0, 86400),
    incorrect_clicks: intOrNull(body.incorrect_clicks, 0, 100000) || 0,
    dead_clicks: intOrNull(body.dead_clicks, 0, 100000) || 0,
    hints_used: intOrNull(body.hints_used, 0, 100000) || 0,
    completion_type,
    self_reported_difficulty: intOrNull(body.self_reported_difficulty, 1, 5),
    comment: str(body.comment, 2000),
  });

  return json(200, { ok: true });
});
