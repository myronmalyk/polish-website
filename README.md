# Vanta Polish

A premium auto-detailing landing site — **Next.js (App Router) + React + TypeScript**.
Built from the Claude Design file **Apex Gloss.dc.html** (project: *Car Polishing Website Design*).

Dark "liquid chrome" aesthetic: animated chrome wordmark + emblem, film grain, scroll-aware
glass nav, entrance animations, a draggable before/after paint-correction slider, a services
grid, a work gallery, a four-stage process section, and a validating booking form with a
prefilled WhatsApp hand-off.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build` (production build) · `npm run start` (serve the build) · `npm run lint`.

> Requires Node 18.18+ (developed against Node 22).

## Project structure

```
app/
  layout.tsx              # <html> shell, metadata, Google Fonts (Archivo / Manrope / Space Mono)
  page.tsx                # renders <VantaPolish> with the design-time variant props
  globals.css             # resets, keyframes, hover/focus rules, responsive breakpoints
  components/
    VantaPolish.tsx       # the whole page — state, interactions, all sections (client component)
    Emblem.tsx            # the chrome roundel logo (rings / monogram / crest variants)
public/
  assets/                 # images (see note below)
```

### Design-time variants

The original design exposed three configurable props. They're wired through and can be changed
in `app/page.tsx`:

| Prop          | Values                              | Default  |
| ------------- | ----------------------------------- | -------- |
| `emblemStyle` | `rings` · `monogram` · `crest`      | `rings`  |
| `heroImage`   | `front` · `side`                    | `front`  |
| `heroLayout`  | `left` · `center`                   | `left`   |

## ⚠️ Images — please read

Three source photos imported fully and are used as-is:

- `gla-front.jpeg`, `gla-side.jpeg` — hero (white Mercedes GLA)
- `work-mercedes-gla.jpeg` — gallery

The remaining **six** source images could **not** be exported through the design API: each
original is larger than the API's 256 KiB per-file transfer cap and came back truncated. They
are currently shown as **on-brand SVG placeholders** (dark chrome panels with the correct
captions) so the layout stays complete and intentional:

| Slot                    | Placeholder file              | Drop-in replacement      |
| ----------------------- | ----------------------------- | ------------------------ |
| Gallery — wide          | `work-audi-q7.svg`            | a real Audi Q7 photo     |
| Gallery — BMW front     | `work-bmw-x6-front.svg`       | a real BMW X6 photo      |
| Gallery — BMW rear      | `work-bmw-x6-rear.svg`        | a real BMW X6 photo      |
| Process portrait        | `at-work.svg`                 | the founder-at-work shot |
| Before/after — before   | `ba-before.svg`               | the swirled "before" PNG |
| Before/after — after    | `ba-after.svg`                | the corrected "after" PNG|

**To use the real photos:** export them from the Claude Design project (or supply your own),
drop them into `public/assets/`, and update the matching `src` in
`app/components/VantaPolish.tsx` (search for `.svg` — the gallery, before/after, and process
`<img>`/placeholder references). Tip: name the new files with the same base name and a real
extension, then change only the extension in the `src`.

## Notes

- Everything is a single client component (`VantaPolish`) because the page is highly interactive
  (scroll state, mobile menu, pointer-drag slider, form). Static helpers (`Emblem`, `Field`,
  `FooterCol`) are split out for readability.
- Fonts are loaded via Google Fonts `<link>` tags (matching the original) so the literal
  `font-family` names in the inline styles resolve exactly.
- The contact details (phone `(206) 555-0188`, `hello@vantapolish.co`, WhatsApp number) are
  placeholders from the design — swap them for the real business details before going live.
