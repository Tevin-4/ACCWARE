const WINDOW_SECONDS = 600;
const MAX_REQUESTS = 10;

export async function checkRateLimit(env, ip, scope) {
  if (!env.RATE_LIMIT_KV) return false;

  const now = Date.now();
  const windowStart = now - WINDOW_SECONDS * 1000;
  const key = "rl:" + (scope || "default") + ":" + ip;

  let timestamps = [];
  try {
    const raw = await env.RATE_LIMIT_KV.get(key);
    if (raw) timestamps = JSON.parse(raw);
  } catch (e) {
    console.error("KV read error", e);
  }

  // Drop entries outside the window (fail-open if parsing broke the array).
  if (!Array.isArray(timestamps)) timestamps = [];
  timestamps = timestamps.filter(function (t) { return t > windowStart; });

  if (timestamps.length >= MAX_REQUESTS) return true;

  timestamps.push(now);

  try {
    await env.RATE_LIMIT_KV.put(
      key,
      JSON.stringify(timestamps),
      { expirationTtl: WINDOW_SECONDS + 30 }
    );
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
