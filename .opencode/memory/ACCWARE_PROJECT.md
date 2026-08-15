## Objective
- Rebuild Accware Solutions as a modern static site on Cloudflare Pages + DNS (replacing Wix at accware.ug), then add a working contact form (Resend-backed Cloudflare Pages Function) and harden security headers — fixing the broken inline-JS CSP meta in the stale live build.

## Important Details
- Palette: Orange `#F44A22`, Silver `#FEF8E8`, Midnight `#161616`, Grey `#E4E2E3`, Stone `#A8AAAC`
- Fonts: Archivo, Instrument Sans, IBM Plex Mono via Google Fonts (`display=optional`)
- Repo: `github.com/Tevin-4/ACCWARE` (local `main` pushed to `origin/main`; HEAD `584450e`)
- Deploy: Cloudflare Pages **direct upload** via `npx wrangler pages deploy .` run from **inside `new-site`** (functions only discovered with `.` arg, not from repo root). **No `wrangler.jsonc` exists.** Project name is exactly `accware` (confirmed via `npx wrangler pages project list`; maps accware.pages.dev + accware.ug + www.accware.ug).
- Wrangler CLI: use `npx wrangler` (not globally installed); `npx wrangler login` OAuth completed.
- DNS (Cloudflare, Proxied): `accware.ug` CNAME → `accware.pages.dev`; `www.accware.ug` CNAME → `accware.pages.dev`. Old Wix records deleted. 522 resolved; both return 200 OK.
- Resend: API key created & set as Pages secret `RESEND_API_KEY`; domain `accware.ug` verified in Resend; DKIM `resend._domainkey` TXT present in Cloudflare DNS. Optional `FROM_EMAIL` = `Accware Solutions <info@accware.ug>`.
- Contact endpoint `/api/contact`: returns `{"ok":true}` for valid JSON POST (Resend forwards to info@accware.ug); returns 400 `Invalid request body.` for malformed bodies. Honeypot field `_honey`. Validation: name/message required, email regex, 10k char cap.
- Front-end form (`reach-us.html` + `main.js initContactForm`) posts JSON with `Content-Type: application/json` and shows success/error UI.
- Live site now serves the new build: broken CSP `<meta>` removed; security headers delivered via `new-site/_headers`.

## Work State
### Completed
- Full static site (11 pages), ERP hero animation, mobile fixes, blog migration, JSON-LD SEO, sitemap.
- 6 promo videos compressed <25 MB (ffmpeg) and committed.
- DNS fixed: both domains → `accware.pages.dev` (Proxied); 522 gone; both 200 OK.
- Contact form Worker: `new-site/functions/api/contact.js` (Resend POST, validation, honeypot, 10k cap).
- Rewired `main.js` `initContactForm` → `fetch('/api/contact', JSON)`; added honeypot `<input name="_honey">` to `reach-us.html`.
- Regenerated `main.min.js`; bumped JS cache `?v=3` → `?v=4` on all 11 html files.
- Added `new-site/_headers` (CSP allowing `unsafe-inline` scripts, HSTS, Referrer-Policy, Permissions-Policy, no-store on `/api/contact`).
- Recompressed oversized logo webp (5.7 MB / 1.4 MB → 26 KB / 6.6 KB); added `.wrangler/` to `.gitignore`.
- Git: committed → rebased onto remote (incl. navbar/video/Formspree `d2a5ee7`) → resolved conflicts keeping Resend + removing remote's broken CSP meta → pushed `584450e` (`d2a5ee7..584450e main -> main`). Clean.
- Deployed: `npx wrangler pages deploy . --project-name accware` → success (preview `6a85b27f.accware.pages.dev`, promoted to prod).
- Verified live: both domains identical headers (HSTS/CSP/Permissions-Policy/etc.), CSP `<meta>` gone, `POST /api/contact` returns `{"ok":true}` for valid JSON (Resend accepted) and 400 for malformed.

### Active
- (none) — deployment + verification complete.

### Blocked
- (none).

## Next Move
- Optional: confirm a test enquiry email arrived at `info@accware.ug`; optionally set Pages env var `FROM_EMAIL` to branded `Accware Solutions <info@accware.ug>` for a nicer sender name.
- Optional future: visual/browser smoke test of the contact form UI; routine content updates.

## Relevant Files
- `new-site/functions/api/contact.js` — Pages Function sending enquiries via Resend using env `RESEND_API_KEY`.
- `new-site/_headers` — security headers (CSP/HSTS/Referrer-Policy/Permissions-Policy, no-store on `/api/contact`).
- `new-site/js/main.js` — `initContactForm` posts to `/api/contact` (honeypot, JSON).
- `new-site/js/main.min.js` — `?v=4` (terser).
- `new-site/reach-us.html` — contact form + honeypot `_honey`; broken CSP meta removed.
- `new-site/*.html` (11) — JS cache `?v=4`; broken CSP meta removed during rebase.
- `.gitignore` — added `.wrangler/`.
