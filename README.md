# Shivam Pratap Raj — Portfolio

Personal portfolio built with Next.js 16, React 19, Tailwind CSS v4, Framer Motion and Lenis.

## Highlights

- **Boot-sequence preloader**: counts to 100%, then the curtain lifts. It's shortened on repeat visits.
- **ASCII hero**: a real-time ASCII torus (a homage to `donut.c`) rendered on a canvas character grid. The cursor steers its spin and "decodes" nearby characters in the accent colour.
- **Variable-font name**: letters of the full-bleed name thicken as the cursor approaches.
- **Smooth scrolling** with Lenis, a **custom cursor** that grows over links and labels project previews, and **magnetic buttons**.
- **Kinetic typography**: masked per-character/word reveals, a manifesto whose words light up as you scroll, and a scroll-velocity marquee.
- **Stacked project cards** with 3D tilt + spotlight, each with a bespoke live visual: a self-balancing double-entry ledger (Reckon) and a placement pipeline simulation (TnP portal).
- **⌘K command palette**, **⌘` interactive terminal** (`help`, `theme cyan`, `sudo hire shivam`…), a JSON **API view**, and switchable accent colours (default: ember orange).
- Respects `prefers-reduced-motion`; hides the custom cursor on touch devices.

Content lives in `src/lib/data.ts`.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```
