# Architecture

Moved verbatim from CLAUDE.md on 2026-11-23, which now keeps a briefing and points here.

## Architecture

### Directory Structure

```
src/
  app/
    layout.tsx          # Root layout: Geist fonts, metadata, Navbar
    page.tsx            # Home page: assembles all section components
    globals.css         # Tailwind base + CSS vars + .glass + .gradient-text utilities
    not-found.tsx       # 404 page
    demo/
      page.tsx          # The standalone, shareable demo page
      clip/page.tsx     # Bare recording stage for `npm run clip` (noindex)
  components/
    demo/
      demo-player-lazy.tsx # Mounts the player only within 600px of the viewport
      demo-player.tsx      # The demo shell: timing, tool status, transport
      chat-message.tsx     # User prompt and agent reply
      thinking-indicator.tsx
      mcp-panel.tsx        # The connected server and its tool list, in the transcript
      tool-call.tsx        # One call, from issue to answer, via ToolInvoker
      tool-result.tsx
      metrics-panel.tsx    # The prominent result, with the chart
      physiological-chart.tsx  # Abstract VE against VO2, markers from the script
      final-screen.tsx     # The reveal
      attachment.tsx       # The + press, and the file chip in the header
      shell-step.tsx       # A curl the agent runs, not a tool it calls
      demo-text.tsx        # Typewriter, **bold** parser, eyebrow
    layout/
      navbar.tsx        # Fixed glassmorphism nav ('use client')
      footer.tsx        # Disclaimer, acknowledgments, links
    sections/
      hero-section.tsx        # Full-viewport hero, duck mark + CTAs ('use client')
      about-section.tsx       # Problem / solution pair, then the slider
      compare-demo.tsx        # Before/after compare slider + domain legend (#demo)
      doors-section.tsx       # One engine, three doors: Browser / API / MCP (#doors)
      doors-explorer.tsx      # The flow map, the tab state, the door panel + demo
      outputs-section.tsx     # Output families incl. oscillation + signal integrity
      validation-section.tsx  # Evidence, with the beta caveat
      custom-models-section.tsx # Fine-tuned models for labs, clinics, universities
      package-section.tsx     # async: pyoxynet package + Shiki code tabs (#usage)
      usage-tabs.tsx          # Radix Tabs client component
      publications-section.tsx # Publication cards
      contact-section.tsx     # Three contact intents with mailto links
      measurement-section.tsx # NOT MOUNTED: "From classification to measurement"
    shared/
      duck-mark.tsx        # The Oxynet mark, inlined (generated from the app repo)
      section-wrapper.tsx  # Framer Motion useInView entrance animation ('use client')
      glass-card.tsx       # Glassmorphism card with hover animation ('use client')
      gradient-text.tsx    # Gradient text span
      code-block.tsx       # async Server Component wrapping Shiki highlight()
    ui/                  # shadcn/ui components (button, badge, tabs, separator)
  content/
    code-examples.ts     # Typed code snippet strings (install, usage, generation)
    publications.ts      # Typed array of all 11 publications
    demos/
      types.ts           # The DemoEvent contract and the ToolInvoker seam
      mcp-demo.ts        # The MCP demo script: every word, value and pause
      index.ts           # The demo registry, live and planned
  hooks/
    use-demo-timeline.ts # Walks a script on wall-clock timers
  lib/
    shiki.ts             # Module-level Shiki singleton + highlight() helper
    demo-invoker.ts      # Scripted ToolInvoker + tool-input JSON formatting
    utils.ts             # shadcn cn() helper
  types/
    index.ts             # Publication, CodeExample, NavItem types
public/
  hero-bg.jpg            # Hero background image (from Unsplash / Pawel Czerwinski)
```

### Key Architecture Decisions

**Server/Client boundary for code tabs:**
`package-section.tsx` is an async Server Component that pre-renders all Shiki HTML and passes the strings to `usage-tabs.tsx` (Client Component with Radix Tabs). Shiki never ships to the client.

**Shiki singleton:**
`src/lib/shiki.ts` creates one `Highlighter` instance reused across requests. Theme: `github-dark-dimmed`, langs: `python`, `sh`, `bash`.

**Glass morphism utility:**
The `.glass` class is defined in `globals.css` — `background: rgba(255,255,255,0.04)` + `backdrop-filter: blur(12px)`.

### Design Tokens
- Background: `#0a0a0a` (CSS var `--background`)
- Accent green: `#00dc82` (Tailwind `accent.DEFAULT`)
- Secondary blue: `#155799` (Tailwind `accent.blue`)
- Gradient text: `#00dc82 → #155799`
