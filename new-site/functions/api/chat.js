import { checkRateLimit, rateLimitResponse } from "./_rate-limit.js";

const SYSTEM_PROMPT_BASE = `You are the Accware Solutions AI assistant — a helpful, professional chatbot for a Uganda-based IT firm and Acumatica Gold Partner. You answer questions about ERP software, products, services, and how to get started.

RULES:
- Be concise, warm, and professional. Keep answers under 3 sentences unless the user asks for detail.
- Only answer questions about Accware Solutions, ERP, and related topics.
- If asked about pricing, say pricing depends on business size and modules — invite them to book a consultation.
- If asked about something unrelated, politely redirect: "I'm focused on ERP and Accware Solutions. Can I help with something like that?"
- Never make up information. If unsure, say "I'm not certain — please email info@accware.ug or call +256 705 969313 for specifics."
- Always end with a helpful next step when appropriate (e.g., "Would you like to book a consultation?").

ACCWARE SOLUTIONS:
- Location: Plot 1716 Soweto Rd, Kansanga, Kampala, Uganda
- Phone: +256 705 969313, +256 774 666045, +256 703 413120
- Email: info@accware.ug
- Website: https://accware.ug
- LinkedIn: https://www.linkedin.com/company/accware-solutions/about/
- Support Portal: https://selfservice.accware.ug:8443/
- Acumatica Gold Partner since 2012
- Serves East Africa and the Middle East

PRODUCTS:
1. Acumatica Cloud ERP — flagship product. Cloud-native, scales with business. Modules: financials, distribution, manufacturing, CRM, project accounting, field service, retail. Mobile app included. AI-powered insights.
2. Microsoft Dynamics SL — legacy ERP for project-heavy and government organizations. Strong in project accounting and fund accounting.
3. Payspace — cloud payroll and HR management. Automated payslips, tax compliance, leave management. Integrates with Acumatica.
4. Microsoft 365 — Word, Excel, Outlook, Teams, OneDrive, PowerPoint.
5. Microsoft Power Platform — (not actively promoted).
6. Microsoft Azure — cloud hosting and infrastructure.
7. Amazon Web Services (AWS) — cloud infrastructure.

SERVICES:
- ERP Implementation — structured 5-phase methodology (Discovery, Design, Deploy, Train, Support)
- Training — hands-on training for end users and administrators
- Custom Development — tailored modifications and integrations
- Unlimited Support — ongoing helpdesk and system maintenance

INDUSTRIES:
- Construction — project costing, WBS budgets, eFRIS compliance, commitment tracking
- Distribution — warehouse management, inventory, multi-location, barcoding
- Manufacturing — production planning, BOM, MRP, shop floor control
- General Business / Non Profit — fund accounting, donor management, grant tracking
- Field Service — work orders, scheduling, mobile workforce, equipment maintenance
- Retail Commerce — POS, ecommerce, multi-channel, customer loyalty

BUSINESS FUNCTIONS:
Financial Management, Order Management, Inventory Management, Project Accounting, Production Management, CRM, Payroll & HR, Equipment Maintenance & Service, eCommerce & POS, Reporting & Analytics.

HOW TO GET STARTED:
Visit https://accware.ug/reach-us.html or call +256 705 969313 for a free consultation.`;

const CONTACT_REQUEST = `\n\nFIRST INTERACTION RULE (IMPORTANT):\nAfter answering the user's very first question, you MUST add this exact message at the end of your response:\n\n"To better assist you, could you share your name and preferred contact method (phone number or email)? This will help us follow up if needed."\n\nDo NOT ask for contact info on subsequent messages — only after the first question.`;

async function sendChatEmail(env, allMessages, latestAssistantResponse) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = env.FROM_EMAIL || "Accware Solutions <onboarding@resend.dev>";
  const to = env.TO_EMAIL || "info@accware.ug";

  const lines = ["=== Chat Conversation ===", ""];

  allMessages.forEach(function (msg) {
    if (msg.role === "user") {
      lines.push("Visitor: " + msg.content);
    } else if (msg.role === "assistant") {
      lines.push("AI: " + msg.content);
    }
    lines.push("");
  });

  if (latestAssistantResponse) {
    lines.push("AI: " + latestAssistantResponse);
    lines.push("");
  }

  lines.push("========================");
  lines.push("Source: accware.ug chat widget");
  lines.push("Time: " + new Date().toISOString());

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: from,
        to: [to],
        subject: "Chat Conversation — " + (allMessages[0]?.content || "New chat").substring(0, 60),
        text: lines.join("\n")
      })
    });
  } catch (e) {
    console.error("Failed to send chat email", e);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "AI service not configured." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
  if (await checkRateLimit(env, ip)) {
    return rateLimitResponse();
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Messages array required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const MAX_MSG_LEN = 4000;
  for (var i = 0; i < messages.length; i++) {
    var m = messages[i];
    if (
      !m || typeof m.role !== "string" || typeof m.content !== "string" ||
      (m.role !== "user" && m.role !== "assistant") || m.content.length > MAX_MSG_LEN
    ) {
      return new Response(JSON.stringify({ error: "Invalid or too-long message." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  const userMessages = messages.filter(function (m) { return m.role === "user"; });
  const isFirstInteraction = userMessages.length === 1;

  const openaiMessages = [
    { role: "system", content: SYSTEM_PROMPT_BASE + (isFirstInteraction ? CONTACT_REQUEST : "") },
    ...messages.slice(-20)
  ];

  try {
    const response = await fetch("https://gateway.ai.cloudflare.com/v1/4fcbd0af111d7cbc1159e7eda5c63b21/accware-chat/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: openaiMessages,
        max_tokens: 500,
        temperature: 0.7,
        stream: true
      })
    });

    if (!response.ok) {
      var detail = await response.text().catch(function () { return ""; });
      console.error("AI gateway error", response.status, detail);
      return new Response(JSON.stringify({ error: "AI service error." }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    const [clientStream, emailStream] = response.body.tee();

    context.waitUntil((async function () {
      try {
        var reader = emailStream.getReader();
        var decoder = new TextDecoder();
        var fullText = "";

        while (true) {
          var result = await reader.read();
          if (result.done) break;
          var chunk = decoder.decode(result.value, { stream: true });
          var lines = chunk.split("\n");
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].replace(/^data: /, "");
            if (line === "[DONE]") continue;
            try {
              var parsed = JSON.parse(line);
              var token = parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content;
              if (token) fullText += token;
            } catch (e) { /* skip */ }
          }
        }

        await sendChatEmail(env, messages, fullText);
      } catch (e) {
        console.error("Email logging failed", e);
      }
    })());

    return new Response(clientStream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store",
        "Connection": "keep-alive"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "AI service unavailable." }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
}
