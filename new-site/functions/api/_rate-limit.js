const WINDOW_SECONDS = 600;
const MAX_REQUESTS = 10;

export async function checkRateLimit(env, ip) {
  if (!env.RATE_LIMIT_KV) return false;

  var bucket = Math.floor(Date.now() / (WINDOW_SECONDS * 1000));
  var key = "rl:" + ip + ":" + bucket;

  var count = 0;
  try {
    count = parseInt((await env.RATE_LIMIT_KV.get(key)) || "0", 10) || 0;
  } catch (e) {
    console.error("KV read error", e);
  }

  if (count >= MAX_REQUESTS) return true;

  try {
    await env.RATE_LIMIT_KV.put(key, String(count + 1), { expirationTtl: WINDOW_SECONDS });
  } catch (e) {
    console.error("KV write error", e);
  }

  return false;
}

export function rateLimitResponse() {
  return new Response(JSON.stringify({ error: "Too many requests — please try again later." }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(WINDOW_SECONDS)
    }
  });
}
