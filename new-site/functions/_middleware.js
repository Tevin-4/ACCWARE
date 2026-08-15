const WINDOW_SECONDS = 600;
const MAX_REQUESTS = 10;

export async function onRequest(context) {
  const { request, env, next } = context;

  if (!env.RATE_LIMIT_KV) {
    return next();
  }

  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/") && request.method === "POST") {
    const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
    const bucket = Math.floor(Date.now() / (WINDOW_SECONDS * 1000));
    const key = "rl:" + ip + ":" + bucket;

    let count = 0;
    try {
      count = parseInt((await env.RATE_LIMIT_KV.get(key)) || "0", 10) || 0;
    } catch (e) {
      console.error("KV read error", e);
    }

    if (count >= MAX_REQUESTS) {
      return new Response(JSON.stringify({ error: "Too many requests — please try again later." }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(WINDOW_SECONDS)
        }
      });
    }

    try {
      await env.RATE_LIMIT_KV.put(key, String(count + 1), { expirationTtl: WINDOW_SECONDS });
    } catch (e) {
      console.error("KV write error", e);
    }
  }

  return next();
}
