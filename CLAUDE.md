# Bloom Chiropractic website

Static site for Dr. Melissa Crestani's chiropractic practice, live at https://www.bloomchiro.co.za. The owner is not a developer: explain git, deploys and DNS in plain terms.

## Workflow

- **Default: commit and push every finished, verified change to `main` without asking.** GitHub Pages publishes it in about 40 seconds. Keep each change in its own commit so it can be reverted on its own. Don't build preview pages unless asked.
- **Staging:** when the owner says "put it on staging", "preview" or "show me first", make the change, run `scripts/deploy-staging.sh`, and send https://staging.bloomchiro.co.za. Push to `main` only after they say "push it live".
- **Undo:** "revert the last change" means `git revert` the relevant commit and push.
- On a Mac that hasn't been used for a while, `git pull` before making changes.
- Pushing must use the GitHub account **cameronferreira** (`gh auth switch -u cameronferreira`, `gh auth setup-git`). The account rebelcameron cannot push to this repo.

## Structure

- `index.html` (homepage), `privacy.html` (served at `/privacy`; link to `privacy`, not `privacy.html`)
- `css/style.css`: design tokens at the top, plus the mobile alignment rules in its header comment
- `js/main.js` (nav, smooth scroll, animations), `js/consent.js` (cookie notice), `js/tracking.js` (contact-click events)
- `CNAME` = `www.bloomchiro.co.za`. Never delete it.
- `scripts/deploy-staging.sh` publishes the staging copy. `_config.yml` keeps `scripts/` and this file off the live site.

## Hosting and DNS

- **Live:** GitHub Pages, repo `cameronferreira/bloomchiropractic`, custom domain `www.bloomchiro.co.za` (apex redirects to www), HTTPS enforced. Domain verified on the GitHub account.
- **Staging:** repo `cameronferreira/bloomchiropractic-staging`, domain `staging.bloomchiro.co.za`. The deploy script strips GTM, suppresses Bookem tracking via its `bookem-tracking-preview:<business id>` sessionStorage flag, and adds noindex, robots.txt and a "Staging preview" badge. Bookings on staging are real.
- **DNS:** Afrihost (nameservers ns.dns1.co.za, ns.dns2.co.za, ns.otherdns.net, ns.otherdns.com). Email is Google Workspace (MX smtp.google.com). Afrihost's editor rejects record names that start with `_` when entered in full; enter the short name instead.

## Tracking

- Google Tag Manager `GTM-KD7XTSG` in `<head>`, preceded by Consent Mode v2 defaults (opt-out: granted unless the visitor declined, stored in localStorage `bloom-consent`), with `ads_data_redaction`.
- GA4 `G-0K7MTC4NCR`, configured inside GTM. Bookem's own Google Analytics setting is off; its GTM setting stays on so it pushes `booking_created` and `booking_cancelled`.
- dataLayer events from the site: `whatsapp_click`, `email_click`, `phone_click`, `cookie_consent_update`.

## Gotchas

- The Bookem widget (`embed.bookem.com/embed.js`, a custom element, not an iframe) rewrites the `href` of every clicked link to an absolute URL. Read `anchor.hash`, never `getAttribute('href')`, when handling in-page links.
- The hero `<img>` keeps its `aspect-ratio` in CSS so a replacement photo doesn't change the layout or the arch frame.
- The About illustration has an opaque white background; `mix-blend-mode: multiply` blends it into the section.
