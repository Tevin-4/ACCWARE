/* Accware Solutions — shared site script: layout injection, nav, reveals, accordions */

(function () {
  "use strict";

  var NAV_LINKS = [
    { href: "index.html", label: "Home" },
    { href: "products.html", label: "Products" },
    { href: "services.html", label: "Services" },
    {
      label: "Solutions",
      children: [
        { href: "industry.html", label: "Industry" },
        { href: "business-function.html", label: "Business Function" }
      ]
    },
    { href: "resources.html", label: "Resources" },
    { href: "about.html", label: "About" },
    { href: "blog.html", label: "Blog" }
  ];

  var FOOTER_COLS = [
    {
      title: "Business Solutions",
      links: [
        { href: "business-function.html#financial-management", label: "Financial Management" },
        { href: "business-function.html#order-management", label: "Order Management" },
        { href: "business-function.html#inventory-management", label: "Inventory Management" },
        { href: "business-function.html#project-accounting", label: "Project Accounting & Management" },
        { href: "business-function.html#production-management", label: "Production Management" },
        { href: "business-function.html#customer-relationship", label: "Customer Relationship Management" },
        { href: "business-function.html#payroll-hr", label: "Payroll & Human Resource" },
        { href: "business-function.html#equipment-service", label: "Equipment Maintenance & Service" },
        { href: "business-function.html#ecommerce-pos", label: "Online Stores & Point of Sale" },
        { href: "business-function.html#reporting-analytics", label: "Reporting & Business Analytics" }
      ]
    },
    {
      title: "Industry Solutions",
      links: [
        { href: "industry.html#construction", label: "Construction" },
        { href: "industry.html#distribution", label: "Distribution" },
        { href: "industry.html#manufacturing", label: "Manufacturing" },
        { href: "industry.html#general-business", label: "General Business (Non Profit)" },
        { href: "industry.html#field-service", label: "Field Service" },
        { href: "industry.html#retail-commerce", label: "Retail Commerce" }
      ]
    },
    {
      title: "Company",
      links: [
        { href: "about.html", label: "About" },
        { href: "reach-us.html", label: "Contacts" },
        { href: "blog.html", label: "Blog" },
        { href: "privacy.html", label: "Privacy" },
        { href: "https://www.linkedin.com/company/accware-solutions/about/", label: '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="vertical-align:middle;margin-right:4px"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.5 10.5H6v7h2.5v-7zM7.25 9a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zM18 13.6c0-2-1.1-3.1-2.7-3.1-1.2 0-1.9.7-2.2 1.2V10.5H10.5v7H13v-3.7c0-1 .5-1.7 1.4-1.7.8 0 1.3.5 1.3 1.7V17.5H18v-3.9z"/></svg>LinkedIn', external: true }
      ]
    }
  ];

  var current = document.body.getAttribute("data-page") || "";

  function navMarkup() {
    var items = NAV_LINKS.map(function (link) {
      if (link.children) {
        var childItems = link.children
          .map(function (c) {
            return '<li><a href="' + c.href + '">' + c.label + "</a></li>";
          })
          .join("");
        return (
          '<li class="has-dropdown">' +
          '<button type="button" class="drop-toggle" aria-haspopup="true" aria-expanded="false">' +
          link.label +
          "</button>" +
          '<ul class="dropdown">' + childItems + "</ul>" +
          "</li>"
        );
      }
      var cls = current === link.href ? ' class="active" aria-current="page"' : "";
      return '<li><a href="' + link.href + '"' + cls + ">" + link.label + "</a></li>";
    });
    items.push(
      '<li class="nav-cta"><a class="btn btn-gold" href="reach-us.html">Get in Touch</a></li>'
    );
    return items.join("");
  }

  function footerMarkup() {
    var cols = FOOTER_COLS.map(function (col) {
      var links = col.links
        .map(function (l) {
          var ext = l.external ? '" target="_blank" rel="noopener' : "";
          return "<li><a href=\"" + l.href + ext + '">' + l.label + "</a></li>";
        })
        .join("");
      return '<div class="footer-col"><h4>' + col.title + "</h4><ul>" + links + "</ul></div>";
    });
    var year = new Date().getFullYear();
    return (
      '<div class="container">' +
      '<div class="footer-grid">' +
      cols +
      "</div>" +
      '<div class="footer-bottom">' +
      "<div>© " + year + " Accware Solutions. All rights reserved.</div>" +
      '<div><a href="privacy.html">Privacy</a> · <a href="reach-us.html">Contact</a> · <a href="https://selfservice.accware.ug:8443/" target="_blank" rel="noopener">Support Portal</a></div>' +
      "</div>" +
      "</div>"
    );
  }

  function renderHeader() {
    var el = document.getElementById("site-header");
    if (!el) return;
    el.insertAdjacentHTML("beforebegin",
      '<header class="site-header">' +
      '<div class="header-inner">' +
      '<a class="brand" href="index.html" aria-label="Accware Solutions — home">' +
      '<img src="assets/logos/topbar%20design.webp" alt="Accware Solutions" />' +
      "</a>" +
      '<button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="primary-nav">' +
      '<span class="bar"></span><span class="bar"></span><span class="bar"></span>' +
      "</button>" +
      '<div class="header-right">' +
      '<nav id="primary-nav" class="primary-nav" aria-label="Main navigation"><ul>' +
      navMarkup() +
      "</ul></nav>" +
      '<a class="header-cta btn btn-gold" href="reach-us.html">Get in Touch</a>' +
      "</div>" +
      "</div>" +
      "</header>" +
      '<div class="header-spacer"></div>');
    el.remove();
  }

  function renderFooter() {
    var el = document.getElementById("site-footer");
    if (!el) return;
    el.insertAdjacentHTML("beforebegin", '<footer class="site-footer">' + footerMarkup() + "</footer>");
    el.remove();
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    var header = document.querySelector(".site-header");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
      });
      nav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          if (window.matchMedia("(max-width: 760px)").matches) {
            nav.classList.remove("open");
            toggle.classList.remove("open");
          }
        });
      });
    }
    if (header) {
      window.addEventListener("scroll", function () {
        header.classList.toggle("scrolled", window.scrollY > 80);
      }, { passive: true });
    }
    document.querySelectorAll(".has-dropdown .drop-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var parent = btn.closest(".has-dropdown");
        var open = parent.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function initReveals() {
    var els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  function openItem(item) {
    var head = item.querySelector(".acc-head");
    var body = item.querySelector(".acc-body");
    if (!item.classList.contains("open")) {
      item.classList.add("open");
      if (head) head.setAttribute("aria-expanded", "true");
    }
    if (body) body.style.maxHeight = body.scrollHeight + "px";
  }

  function closeItem(item) {
    var head = item.querySelector(".acc-head");
    var body = item.querySelector(".acc-body");
    item.classList.remove("open");
    if (head) head.setAttribute("aria-expanded", "false");
    if (body) body.style.maxHeight = "0";
  }

  function initAccordions() {
    var groups = [];
    document.querySelectorAll(".acc").forEach(function (group) {
      groups.push(group.querySelectorAll(".acc-item"));
    });

    document.querySelectorAll(".acc-item").forEach(function (item) {
      var head = item.querySelector(".acc-head");
      var body = item.querySelector(".acc-body");
      if (!head || !body) return;
      if (item.classList.contains("open")) {
        body.style.maxHeight = body.scrollHeight + "px";
      }
      head.addEventListener("click", function () {
        var wasOpen = item.classList.contains("open");
        groups.forEach(function (items) {
          items.forEach(closeItem);
        });
        if (!wasOpen) openItem(item);
      });
    });

    if (location.hash) {
      var target = document.querySelector(location.hash);
      if (target && target.classList.contains("acc-item")) {
        groups.forEach(function (items) {
          items.forEach(function (it) {
            if (it !== target) closeItem(it);
          });
        });
        openItem(target);
        setTimeout(function () {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    }
  }

  function initVideos() {
    document.querySelectorAll(".img-card .media").forEach(function (media) {
      var video = media.querySelector("video");
      var btn = media.querySelector(".play-btn");
      if (!video || !btn) return;
      video.addEventListener("click", function () {
        if (!video.paused) {
          video.pause();
          media.classList.remove("playing");
          btn.setAttribute("aria-label", "Play video");
        }
      });
      video.addEventListener("ended", function () {
        media.classList.remove("playing");
        btn.setAttribute("aria-label", "Play video");
      });
      btn.addEventListener("click", function () {
        if (video.paused) {
          document.querySelectorAll(".img-card .media.playing").forEach(function (m) {
            var v = m.querySelector("video");
            if (v && v !== video) { v.pause(); m.classList.remove("playing"); }
          });
          video.muted = false;
          video.volume = 1;
          video.play();
          media.classList.add("playing");
          btn.setAttribute("aria-label", "Pause video");
        } else {
          video.pause();
          media.classList.remove("playing");
          btn.setAttribute("aria-label", "Play video");
        }
      });
    });
  }

  function initCounters() {
    var nums = document.querySelectorAll(".num[data-target]");
    if (!nums.length) return;
    if (!("IntersectionObserver" in window)) {
      nums.forEach(function (el) {
        var target = parseInt(el.getAttribute("data-target"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        el.textContent = target + suffix;
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          io.unobserve(el);
          var target = parseInt(el.getAttribute("data-target"), 10);
          var suffix = el.getAttribute("data-suffix") || "";
          var duration = 1800;
          var start = performance.now();
          function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
          function tick(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var value = Math.round(ease(progress) * target);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.3 }
    );
    nums.forEach(function (el) { io.observe(el); });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("form-status");
      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.innerHTML : "";
      var fields = ["name", "email", "company", "phone", "topic", "message"];
      var data = {};
      fields.forEach(function (f) {
        var el = form.elements[f];
        data[f] = el ? el.value.trim() : "";
      });
      var honey = form.elements["_honey"];
      if (honey && honey.value) return;
      if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
      if (status) status.textContent = "";
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) {
          return r.json().then(function (j) { return { ok: r.ok, body: j }; });
        })
        .then(function (res) {
          if (res.ok && res.body && res.body.ok) {
            if (status) {
              status.textContent = "Thank you — your message is on its way. We'll reply to " + data.email + " shortly.";
            }
            form.reset();
          } else {
            throw new Error((res.body && res.body.error) || "Something went wrong.");
          }
        })
        .catch(function (err) {
          if (status) {
            status.textContent = "Sorry — " + err.message + " Please email info@accware.ug directly.";
          }
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = original; }
        });
    });
  }

  function addJSONLD(obj) {
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }

  function injectSEO() {
    var head = document.head;
    if (!head) return;
    if (!document.querySelector('meta[name="theme-color"]')) {
      var tc = document.createElement("meta");
      tc.name = "theme-color";
      tc.content = "#161616";
      head.appendChild(tc);
    }
    function hasType(t) {
      return [].some.call(document.querySelectorAll('script[type="application/ld+json"]'), function (s) {
        try { return (JSON.parse(s.textContent)["@type"] || "") === t; } catch (e) { return false; }
      });
    }
    if (!hasType("Organization")) {
      addJSONLD({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Accware Solutions",
        "url": "https://accware.ug",
        "logo": "https://accware.ug/assets/logos/accware-logo.png",
        "description": "Acumatica Gold Partner delivering modern cloud ERP and integrated business management solutions for growing businesses across East Africa and the Middle East.",
        "foundingDate": "2012",
        "address": { "@type": "PostalAddress", "addressLocality": "Kampala", "addressCountry": "UG" },
        "contactPoint": { "@type": "ContactPoint", "telephone": "+256-705-969313", "contactType": "sales", "email": "info@accware.ug", "areaServed": ["UG", "KE", "TZ", "AE"], "availableLanguage": ["en"] },
        "sameAs": ["https://www.linkedin.com/company/accware-solutions/"]
      });
    }
    if (!hasType("WebSite")) {
      addJSONLD({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Accware Solutions",
        "url": "https://accware.ug"
      });
    }
  }

  injectSEO();
  renderHeader();
  renderFooter();
  initNav();
  initReveals();
  initAccordions();
  initVideos();
  initCounters();
  initContactForm();

  // Pause SMIL particle motion for users who prefer reduced motion
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".erp-connections").forEach(function (svg) {
      if (svg.pauseAnimations) svg.pauseAnimations();
    });
  }

  var CHAT_WIDGET_HTML = `
  <div id="chat-widget" class="chat-widget">
    <button class="chat-toggle" id="chat-toggle" aria-label="Chat with us">
      <div class="chat-bubble-body">
        <div class="chat-eyes">
          <div class="chat-eye"><div class="chat-pupil"></div></div>
          <div class="chat-eye"><div class="chat-pupil"></div></div>
        </div>
      </div>
    </button>
    <div class="chat-panel" id="chat-panel">
      <div class="chat-resize-handle" id="chat-resize-handle"></div>
      <div class="chat-header">
        <div>
          <strong>Accware Assistant</strong>
          <span class="chat-status">Online</span>
        </div>
        <button class="chat-close-btn" id="chat-close" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="18" height="18"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="chat-msg bot">
          <p>Hi! I'm the Accware assistant. Ask me about our ERP products, services, or how to get started.</p>
        </div>
        <div class="chat-quick-replies">
          <button class="chat-quick-btn" data-msg="What products do you offer?">What products do you offer?</button>
          <button class="chat-quick-btn" data-msg="How do I get started with ERP?">How do I get started?</button>
          <button class="chat-quick-btn" data-msg="What industries do you serve?">Industries you serve</button>
        </div>
      </div>
      <form class="chat-input-area" id="chat-form">
        <input type="text" id="chat-input" placeholder="Ask a question..." autocomplete="off" />
        <button type="submit" class="chat-send" id="chat-send" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="18" height="18"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </form>
    </div>
  </div>`;

  function injectChatWidget() {
    if (document.getElementById("chat-widget")) return;
    document.body.insertAdjacentHTML("beforeend", CHAT_WIDGET_HTML);
  }

  /* Animate ERP module cards into view on the home page. */
  function initErpModules() {
    var modules = document.querySelectorAll(".erp-module");
    if (!modules.length) return;
    modules.forEach(function (module, index) {
      var isCentered = module.classList.contains("finance") || module.classList.contains("hr");
      var base = isCentered ? "translateX(-50%) " : "";
      module.style.opacity = "0";
      module.style.transform = base + "scale(0.85)";
      setTimeout(function () {
        module.style.transition = "opacity 700ms ease, transform 700ms ease";
        module.style.opacity = "1";
        module.style.transform = base + "scale(1)";
      }, 500 + index * 180);
    });
  }

  /* Draw ERP connection lines from the core ring to each module's inner edge.
     Uses the SVG screen transform so it stays correct at every viewport / aspect ratio. */
  function initErpConnections() {
    function run() {
      var svg = document.querySelector(".erp-connections");
      if (!svg) return;
      var panel = svg.closest(".erp-animation");
      var core = panel && panel.querySelector(".erp-core");
      if (!core) return;
      var ctm = svg.getScreenCTM();
      if (!ctm) return;
      var inv = ctm.inverse();
      var cr = core.getBoundingClientRect();
      var ccx = cr.left + cr.width / 2;
      var ccy = cr.top + cr.height / 2;
      var ring = svg.querySelector(".ring-outer");
      var rPx = (ring ? parseFloat(ring.getAttribute("r")) : 105) * ctm.a;
      var modules = panel.querySelectorAll(".erp-module");
      var paths = svg.querySelectorAll(".connection");
      var particles = svg.querySelectorAll(".data-particle animateMotion");
      modules.forEach(function (m, i) {
        var r = m.getBoundingClientRect();
        var mcx = r.left + r.width / 2;
        var mcy = r.top + r.height / 2;
        var dx = mcx - ccx, dy = mcy - ccy;
        var dlen = Math.hypot(dx, dy) || 1;
        dx /= dlen; dy /= dlen;
        var rx = ccx + dx * rPx, ry = ccy + dy * rPx;
        var ex, ey;
        if (mcx < ccx - 5) { ex = r.right; ey = mcy; }
        else if (mcx > ccx + 5) { ex = r.left; ey = mcy; }
        else { ex = mcx; ey = (mcy < ccy) ? r.bottom : r.top; }
        function toUser(px, py) {
          var pt = svg.createSVGPoint();
          pt.x = px; pt.y = py;
          return pt.matrixTransform(inv);
        }
        var R = toUser(rx, ry), E = toUser(ex, ey);
        var dd = "M" + R.x.toFixed(1) + " " + R.y.toFixed(1) + " L" + E.x.toFixed(1) + " " + E.y.toFixed(1);
        if (paths[i]) paths[i].setAttribute("d", dd);
        if (particles[i]) particles[i].setAttribute("path", dd);
      });
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
    else run();
    window.addEventListener("load", run);
    window.addEventListener("resize", run);
    setTimeout(run, 300);
    setTimeout(run, 1200);
    setTimeout(run, 2200);
  }

  /* Cycle the core text through a series of phrases with a fade transition. */
  function initCoreRotator() {
    var el = document.getElementById("coreRotator");
    if (!el) return;
    var phrases = ["Integrate", "Connect", "All In One Place"];
    var i = 0;
    setInterval(function () {
      el.style.opacity = "0";
      setTimeout(function () {
        i = (i + 1) % phrases.length;
        el.textContent = phrases[i];
        el.style.opacity = "1";
      }, 450);
    }, 2200);
  }

  /* ---------- AI Chat Widget ---------- */
  function initChatWidget() {
    var widget = document.getElementById("chat-widget");
    var toggle = document.getElementById("chat-toggle");
    var panel = document.getElementById("chat-panel");
    var closeBtn = document.getElementById("chat-close");
    var messages = document.getElementById("chat-messages");
    var form = document.getElementById("chat-form");
    var input = document.getElementById("chat-input");
    var sendBtn = document.getElementById("chat-send");
    if (!widget || !toggle) return;

    var isOpen = false;
    var isStreaming = false;
    var chatHistory = [];

    function scrollToBottom() {
      messages.scrollTop = messages.scrollHeight;
    }

    function addMessage(role, text) {
      var div = document.createElement("div");
      div.className = "chat-msg " + role;
      var p = document.createElement("p");
      p.textContent = text;
      div.appendChild(p);
      messages.appendChild(div);
      scrollToBottom();
      return div;
    }

    function showTyping() {
      var div = document.createElement("div");
      div.className = "chat-typing";
      div.id = "chat-typing";
      for (var s = 0; s < 3; s++) div.appendChild(document.createElement("span"));
      messages.appendChild(div);
      scrollToBottom();
    }

    function removeTyping() {
      var el = document.getElementById("chat-typing");
      if (el) el.remove();
    }

    function toggleWidget() {
      isOpen = !isOpen;
      widget.classList.toggle("open", isOpen);
      if (isOpen) input.focus();
    }

    toggle.addEventListener("click", toggleWidget);
    if (closeBtn) closeBtn.addEventListener("click", function () { isOpen = false; widget.classList.remove("open"); });

    var resizeHandle = document.getElementById("chat-resize-handle");
    if (resizeHandle) {
      var startX = 0, startW = 0;
      function onMove(e) {
        var x = e.touches ? e.touches[0].clientX : e.clientX;
        var dx = startX - x;
        var minW = Math.min(320, window.innerWidth - 40);
        var w = Math.min(560, Math.max(minW, startW + dx));
        panel.style.width = w + "px";
      }
      function onUp() {
        panel.classList.remove("resizing");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onUp);
      }
      resizeHandle.addEventListener("mousedown", function (e) {
        e.preventDefault();
        startX = e.clientX;
        startW = panel.offsetWidth;
        panel.classList.add("resizing");
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
      resizeHandle.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX;
        startW = panel.offsetWidth;
        panel.classList.add("resizing");
        document.addEventListener("touchmove", onMove);
        document.addEventListener("touchend", onUp);
      }, { passive: true });
    }

    document.querySelectorAll(".chat-quick-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        input.value = btn.getAttribute("data-msg");
        form.dispatchEvent(new Event("submit"));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text || isStreaming) return;

      addMessage("user", text);
      chatHistory.push({ role: "user", content: text });
      input.value = "";
      sendBtn.disabled = true;
      isStreaming = true;
      showTyping();

      var botDiv = document.createElement("div");
      botDiv.className = "chat-msg bot";
      messages.appendChild(botDiv);
      var pEl = document.createElement("p");
      botDiv.appendChild(pEl);
      var fullText = "";

      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      })
        .then(function (response) {
          removeTyping();
          if (!response.ok) throw new Error("Service unavailable");
          var reader = response.body.getReader();
          var decoder = new TextDecoder();
          function read() {
            return reader.read().then(function (result) {
              if (result.done) {
                isStreaming = false;
                sendBtn.disabled = false;
                chatHistory.push({ role: "assistant", content: fullText });
                scrollToBottom();
                return;
              }
              var chunk = decoder.decode(result.value, { stream: true });
              var lines = chunk.split("\n");
              for (var i = 0; i < lines.length; i++) {
                var line = lines[i].replace(/^data: /, "");
                if (line === "[DONE]") continue;
                try {
                  var parsed = JSON.parse(line);
                  var token = parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content;
                  if (token) {
                    fullText += token;
                    pEl.textContent = fullText;
                    scrollToBottom();
                  }
                } catch (err) { /* skip malformed lines */ }
              }
              return read();
            });
          }
          return read();
        })
        .catch(function (err) {
          removeTyping();
          isStreaming = false;
          sendBtn.disabled = false;
          pEl.textContent = "Sorry, I'm unavailable right now. Please email info@accware.ug or call +256 705 969313.";
        });
    });
  }

  injectChatWidget();
  initChatWidget();
  initErpModules();
  initErpConnections();
  initCoreRotator();

  /* ---------- Eye Tracking ---------- */
  (function () {
    var pupils = document.querySelectorAll(".chat-pupil");
    if (!pupils.length) return;

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var currentX = mouseX;
    var currentY = mouseY;
    var rafId = null;

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateEyes() {
      rafId = null;
      if (document.hidden) return;
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      for (var i = 0; i < pupils.length; i++) {
        var eye = pupils[i].parentElement;
        var rect = eye.getBoundingClientRect();

        var eyeX = rect.left + rect.width / 2;
        var eyeY = rect.top + rect.height / 2;

        var dx = currentX - eyeX;
        var dy = currentY - eyeY;

        var angle = Math.atan2(dy, dx);
        var distance = Math.sqrt(dx * dx + dy * dy);

        var maxDistance = 5;
        var movement = Math.min(distance / 180, 1) * maxDistance;

        var x = Math.cos(angle) * movement;
        var y = Math.sin(angle) * movement;

        pupils[i].style.transform = "translate(calc(-50% + " + x + "px), calc(-50% + " + y + "px))";
      }

      rafId = requestAnimationFrame(animateEyes);
    }

    function start() {
      if (!rafId) rafId = requestAnimationFrame(animateEyes);
    }

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) start();
    });

    start();
  })();
})();
