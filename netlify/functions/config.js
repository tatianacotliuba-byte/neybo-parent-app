// GET /.netlify/functions/config
// Returns ONLY public, client-safe config (the PostHog *project* key is a public
// client key by design). No Supabase keys are ever returned to the browser.
'use strict';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: CORS, body: '{"error":"method"}' };

  const posthog_key  = process.env.POSTHOG_PROJECT_KEY || process.env.VITE_POSTHOG_KEY || '';
  const posthog_host = process.env.POSTHOG_HOST || process.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';
  const test_version = process.env.TEST_VERSION || 'parent-app-proto-1';

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({
      posthog_key,
      posthog_host,
      test_version,
      // tells the client the write endpoints are live (Supabase configured)
      supabase_ready: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    }),
  };
};
