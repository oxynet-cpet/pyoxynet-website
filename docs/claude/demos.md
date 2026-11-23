# The demos

Moved verbatim from CLAUDE.md on 2026-11-23, which now keeps a briefing and points here.

## The demos

Three scripted demos, one per door: the browser (`browser-demo.ts`), the REST
API (`api-demo.ts`) and the MCP server (`mcp-demo.ts`). On the landing page they
live in the **three doors section** (`doors-section.tsx`, `#doors`): a flow map
(export → engine → Browser / API / MCP) that is also the tab selector, and a
panel under it with the chosen door's copy and its demo. The map is drawn in one
1000 x 400 frame shared by the SVG viewBox and the percentage-positioned HTML
nodes, in a box held at the same 5:2 ratio, so rails always meet their nodes;
below `lg` it becomes a vertical stack. `doors-section.tsx` is a server component
so the scripts travel as props, not in the client bundle. Old anchors still
land: `#agents` and `#agent-demo` select the MCP door, `#how-it-works`,
`#deployment` and `#audience` sit on the section, `#demo` is the slider inside
`#about`, `#usage` the code tabs inside `#package`.

The demos are built as a player plus a script rather than as animations:

- `src/content/demos/types.ts` is the contract: a demo is a list of `DemoEvent`s,
  each carrying its own `durationMs`. Nothing in `src/components/demo/` knows what
  a ventilatory threshold is.
- `src/content/demos/mcp-demo.ts` is the whole story: dialogue, tool calls,
  latencies, results, threshold values, pacing. A second demo is a second file
  registered in `src/content/demos/index.ts` and rendered by the same player.
- `src/hooks/use-demo-timeline.ts` reveals event `i` at the sum of the durations
  before it, and knows nothing else.
- `src/lib/demo-invoker.ts` holds the seam. Tool results arrive through a
  `ToolInvoker` promise, so replacing the scripted one with a live MCP client is a
  prop on `<DemoPlayer>`, not a rewrite.

**The agent never discovers anything.** The narrative is: connect your provider
to the Oxynet MCP server, then ask it to analyse a CPET with Oxynet
capabilities. The run opens on the reader attaching a spreadsheet and asking,
and the connected server appears *inside the agent's turn*, after it says it
will look at what tools it has. No copy anywhere may suggest the assistant went
looking for a physiological engine and happened to find one. Someone chose
Oxynet; everything after that is what the choice buys.

**The reader's line is set larger than the agent's**, and there is no standing
tool inventory beside the transcript. Both were tried the other way. A rail
listing ten tools and their summaries was the most detailed thing on screen and
the least important, and it pulled the eye out of the conversation, which is
the only thing the section is selling.

**The player is lazily mounted and must stay that way.** It pulls in Framer
Motion, the chart and the script, which put about 32 kB on the landing page's
First Load JS (229 kB to 261 kB) for a section several screens down that does
not animate until scrolled to. `demo-player-lazy.tsx` fetches it once the
reader is within 600 px and holds the space with a skeleton until then, which
puts the page back to 231 kB. Import `DemoPlayerLazy` on the landing page, not
`DemoPlayer`.

**The window is 4:5 (34rem wide), not a wide console.** It is meant to be
screen-recorded and posted, and a 16:9 developer console crops to nothing in a
LinkedIn feed. On a wide page the copy sits beside it and takes the space the
window gives back. Anything added to the stage has to survive at 544px.

**The MCP surface in the script is checked against `scripts/mcp_server.py` in
the app repo and must stay that way.** The tool list is typed
`satisfies Record<McpToolName, string>`, and `McpToolName` is generated from the
server, so a tool added or removed there fails `tsc` here; `registry.py check`
covers the individual `tool:` calls. Three things there are easy to get wrong and are wrong in
any script that guesses: `get_capabilities` is called first, because the
analyses are licensed separately; a file named by path goes through
`create_upload` and then a **curl**, because Oxynet mints a one-shot URL rather
than taking bytes through the conversation; and `analyze_vt` returns a
`quality` that describes the recording, never a confidence in the answer. The
demo says so out loud, and the values are invented, which is what the
"simulated interaction" line under the window is for.

The chart is the app's VT view, not a new picture. Two panels share one VO2
axis: breath-by-breath VE on top, every point coloured by the domain the model
assigned it, and the un-stacked zone probabilities underneath, drawn as
`ProbabilityTraceChart` draws them. There is deliberately **no fitted line**
through the scatter, because a regression a reader could have drawn themselves
would say the opposite of what the section says. The dashed threshold lines run
through both panels, because the point of stacking them is that the crossings
are the thresholds: moderate meets heavy at VT1, heavy meets severe at VT2. One
probability function feeds both the point colours and the traces, and the
marker positions come from the VO2 numbers in the script, so editing a
threshold moves the crossing, the colour change and the label together. The rest of the stage uses the fixed `demo.*`
palette in `tailwind.config.ts` rather than the themed ink ramp, so it stays
dark when the page is in the light theme.

### Sharing it

Three surfaces, one script and one component behind all of them:

```bash
npm run build && npm run clip   # writes oxynet-mcp-demo.mp4, 1080x1372
CLIP_WIDTH=1080 CLIP_MS=48000 npm run clip
```

- `/demo` is the link to send someone. It carries its own OpenGraph card at
  `public/og-agent-demo.png`, so pasting the URL into LinkedIn or an email
  unfurls with the chart rather than with the site's default hero.
- `/desktop-preview` is Oxynet Desktop for people given the link: unlisted on purpose while the
  application is tested with a few people. Nothing links to it, it is out of the sitemap and
  `/llms.txt`, and it is `noindex` rather than in `robots.txt`, which is public and would stop a
  crawler seeing the `noindex`. A licence, not the address, is what controls use. Everything about
  a release comes from `latest.json` in the `oxynet-downloads` bucket (`content/desktop.ts`), which
  `tools/publish_installers.py` in oxynet-desktop writes, so a release needs no change here.
- `/demo/clip` is the recording stage: no navbar, no page ground, no disclosure
  line, the window pinned to a fixed height and rendered at 2x. Nobody should
  land on it, hence `robots: noindex`.
- `scripts/record-clip.mjs` serves the production build, takes a CDP
  screencast, and encodes with the ffmpeg on the machine. It **measures** the
  window and crops to it, so the output ratio follows the component: change the
  header and the clip still frames correctly. Frames arrive on paint rather than
  on a clock, so ffmpeg gets a concat list with real per-frame durations; a
  fixed frame rate drifts against the animation.

To screenshot rather than record, drive Chrome over CDP on the wall clock and
scroll the section into view first (the player starts on `useInView`).
`--virtual-time-budget` fast-forwards the timers but leaves Framer Motion
unstarted, so the capture comes back blank. And never pipe `next build` into
`head`: the SIGPIPE kills it mid-write and leaves `.next` unusable.
