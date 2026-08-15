function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "Content-Type": "application/json" }
  });
}

// Basic in-memory per-IP rate limiter (note: Pages Functions run across many
// isolates, so this is a best-effort deterrent, not a hard guarantee).
const rateHits = new Map();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const prev = rateHits.get(ip);
  const recent = prev ? prev.filter(function (t) { return now - t < RATE_WINDOW_MS; }) : [];
  if (recent.length >= RATE_MAX) {
    rateHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateHits.set(ip, recent);
  return false;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ ok: false, error: "Invalid request body." }, 400);
    }

    const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
    if (isRateLimited(ip)) {
      return json({ ok: false, error: "Too many messages — please try again later." }, 429);
    }

    if (body._honey) {
      return json({ ok: true });
    }

    var name = clean(body.name);
    var email = clean(body.email);
    var company = clean(body.company);
    var phone = clean(body.phone);
    var topic = clean(body.topic);
    var message = clean(body.message);

    if (!name || !email || !message) {
      return json({ ok: false, error: "Name, email and message are required." }, 400);
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ ok: false, error: "Please enter a valid email address." }, 400);
    }
    if (message.length > 10000 || name.length > 200 || email.length > 200) {
      return json({ ok: false, error: "Some fields are too long." }, 400);
    }

    var apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
      return json({ ok: false, error: "Email service is not configured yet." }, 500);
    }

    var from = env.FROM_EMAIL || "Accware Solutions <onboarding@resend.dev>";
    var to = env.TO_EMAIL || "info@accware.ug";
    var lines = [
      "Name: " + name,
      "Email: " + email,
      "Company: " + (company || "-"),
      "Phone: " + (phone || "-"),
      "Topic: " + (topic || "-"),
      "",
      message
    ];

    var res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: from,
        to: [to],
        subject: "New website enquiry" + (topic ? " \u2014 " + topic : ""),
        reply_to: email,
        text: lines.join("\n")
      })
    });

    if (!res.ok) {
      var detail = await res.text();
      console.error("Resend error", res.status, detail);
      return json({ ok: false, error: "The email could not be sent. Please try again or email us directly." }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("contact function error", err);
    return json({ ok: false, error: "Server error." }, 500);
  }
}
