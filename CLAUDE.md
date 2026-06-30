# CLAUDE.md

Guidance for working in this repo.

## What this is

**Vanta Polish** — a single-page marketing site for a premium auto-detailing studio.
Stack: **Next.js 14 (App Router) + React 18 + TypeScript**. Dark "liquid chrome" aesthetic.

Originally imported from the Claude Design file **Apex Gloss.dc.html** (design project
*Car Polishing Website Design*, id `42b53f10-14fc-46f3-98b4-7a85db8e66c5`) via the design MCP,
then rebuilt by hand as idiomatic Next.js.

Repo: **https://github.com/myronmalyk/polish-website** (public, default branch `main`).

## Environment gotcha (read first)

Node is **not on the default PATH** — it was installed to `~/.local`. Prefix shell commands:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Common commands (run from the project root):

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build / typecheck
```

## Layout

```
app/
  layout.tsx            # <html> shell, metadata, Google Fonts <link> (Archivo / Manrope / Space Mono)
  page.tsx              # renders <VantaPolish> with the design-time variant props
  globals.css           # resets, keyframes, hover/focus rules, responsive + mobile-hero media queries
  components/
    VantaPolish.tsx     # THE WHOLE PAGE — all state, interactions, every section (client component)
    Emblem.tsx          # chrome roundel logo (rings / monogram / crest)
public/assets/          # 9 images (see below)
```

Sections in `VantaPolish.tsx`, in order: fixed nav + mobile menu → hero → marquee → services →
before/after slider → work gallery → process → booking form → footer.

## Conventions

- **One big client component.** The page is highly interactive (scroll state, mobile menu,
  pointer-drag before/after slider, validating form), so it all lives in `VantaPolish.tsx`
  as a `"use client"` component. Small presentational helpers (`Emblem`, `Field`, `FooterCol`)
  are split out. Don't prematurely split the page into server components.
- **Styling = inline styles + CSS classes.** Base appearance is inline `style={{...}}` (ported
  faithfully from the design). Interactions the design runtime used to handle —
  `hover`/`focus` and responsive breakpoints — live in `globals.css` as `.vp-*` classes.
  Because inline styles win on specificity, **CSS overrides of inline properties must use
  `!important`** (see the mobile-hero block).
- **Fonts** load via Google Fonts `<link>` in `layout.tsx` (not `next/font`) so the literal
  `font-family` strings in inline styles resolve exactly.
- The shared chrome gradient is one `<linearGradient id="agChrome">` defined once at the top of
  `VantaPolish.tsx`; all emblems reference `url(#agChrome)`.

## Design-time variants (in `app/page.tsx`)

| Prop          | Values                         | Default | Notes |
| ------------- | ------------------------------ | ------- | ----- |
| `emblemStyle` | `rings` / `monogram` / `crest` | `rings` | logo style |
| `heroImage`   | `front` / `side`               | `front` | `front` → Audi Q7 hero, `side` → Mercedes GLA |
| `heroLayout`  | `left` / `center`              | `left`  | hero text alignment |

## Images (`public/assets/`)

All 9 slots use **real photos** the user supplied. Slot → file:

- Hero: `work-audi-q7.jpeg` (front) or `gla-side.jpeg` (side)
- Before/after slider: `ba-before.png` (swirled) / `ba-after.png` (clean) — same BMW X5 panel
- Gallery: `work-audi-q7.jpeg`, `work-bmw-x6-front.jpeg`, `work-mercedes-gla.jpeg`, `work-bmw-x6-rear.jpeg`
- Process backdrop: `at-work.jpeg`

Note: there is **no real founder-at-work photo** — `at-work.jpeg` is currently a Mercedes GLA
stand-in (darkened behind the quote). If a real action shot arrives, overwrite that file; no
code change needed. The big iPhone originals (5712×3213) were downscaled to ~2200px JPEGs for
performance — keep new gallery photos web-sized too.

## Verifying changes visually

No project test suite. To eyeball changes, screenshot with headless Chrome via `puppeteer-core`
(installed in the scratchpad, not this repo). Chrome lives at
`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. For mobile, set a phone viewport
(390/360/320) and check `document.documentElement.scrollWidth` for horizontal overflow.

## Placeholder content to replace before launch

Phone `(206) 555-0188`, email `hello@vantapolish.co`, the WhatsApp number `12065550188`, and
the `@vantapolish` Instagram link are all design placeholders.
