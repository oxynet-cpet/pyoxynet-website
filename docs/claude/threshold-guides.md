# The threshold guides

Moved verbatim from CLAUDE.md on 2026-11-23, which now keeps a briefing and points here.

## The threshold guides (`/ventilatory-thresholds`)

Written for the person holding a CPET file and for the assistant answering them, so they sit
outside the developer hub: `/ventilatory-thresholds` answers "how do I get VT1 and VT2 out of
my file", and one page per vendor (`/ventilatory-thresholds/cosmed`, `/cortex`) says which of
that vendor's exports are read and what the parser deals with in them. They exist because on
2026-10-28 a web search for those questions found the papers and never this site (baseline in
the orchestration repo, `docs/visibility.md`).

- **A vendor gets a page only when core's parser was checked on that vendor's real files.**
  PNOE and VO2 Master are in core's `UNVERIFIED_FORMATS` and VO2 Master carries no CO2, so the
  thresholds cannot run on it; Vyaire is unconfirmed. Adding a guide is an entry in
  `content/thresholds.ts`. The route, the sitemap, the cards on the general page and `/llms.txt` follow from it.
- The formats on a vendor page are `PUBLIC_FORMATS` filtered by vendor, so they cannot
  disagree with `/developers/formats`. The `handles` bullets are restated from the comments in
  core's loaders and carry no cohort codes or institution names.
- Each vendor page names the vendor descriptively and says Oxynet is not affiliated with it.
  Shared frame and sections are in `components/thresholds/guide.tsx`.

**Getting a new page fetched.** The site is a verified Domain property in Google Search
Console, and Bing Webmaster Tools imported it from there (2026-10-28). After a deploy that adds
or substantially changes a page, run `scripts/indexnow.sh <path> ...` (no arguments submits the
whole live sitemap). That tells Bing and the other IndexNow engines; Google does not read
IndexNow, so request indexing in Search Console's URL Inspection instead. The key file
`public/1b409840bb393cb886a19730b82a760b.txt` is public by design and must stay deployed,
because IndexNow verifies ownership by fetching it.
