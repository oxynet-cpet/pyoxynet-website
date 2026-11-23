# /llms.txt

Moved verbatim from CLAUDE.md on 2026-11-23, which now keeps a briefing and points here.

## `/llms.txt`

`src/app/llms.txt/route.ts` serves www.oxynet.net/llms.txt as a static text route (added
2026-10-15; the address was a 404 before). It says what Oxynet is and links to the app's
`llms.txt` and `llms-full.txt` for the API rather than restating them. Nothing in it is
typed: the format count is `VENDOR_FORMATS`, the documentation list is `DEV_NAV`, and the
publications are filtered with `isPeerReviewed` from `content/publications.ts`, the rule
the site and the manual count by. A new developer page appears there automatically.

### DNS / Domain
Point `www.oxynet.net` to Vercel using the A records or CNAME provided in the Vercel dashboard under "Domains".
