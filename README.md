# Wall Calendar Component

An interactive, polished wall calendar built with **Next.js 14**, **TypeScript**, and **CSS Modules** — no external UI libraries.

## Live Demo

> Deploy to Vercel with one click: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com)

---

## Features

### Core
- **Wall calendar aesthetic** — binding-hole strip, hero image panel, physical paper feel
- **Day range selector** — click to set start, click again to set end; live hover preview shows the range before committing; clear visual states for start/end (filled circles) and in-between days (tinted fill)
- **Integrated notes** — notes are scoped to the active selection (single day, date range, or full month); auto-saved to `localStorage` with a save indicator
- **Fully responsive** — two-column desktop layout collapses to stacked single-column on mobile (≤740px), fully touch-friendly

### Creative Extras
- **5 procedural themes** — Coral, Ocean, Forest, Lavender, Amber — each repaints the hero canvas with a hand-coded generative scene and re-tokens the entire calendar palette via CSS variables
- **Holiday markers** — 18 US holidays annotated directly on day cells
- **Note dot indicators** — subtle dot under any day that has a saved note
- **Live range preview** — hover after picking a start date shows the range live before the second click
- **Accessible** — full keyboard navigation (Tab + Enter), ARIA labels, `aria-pressed`, `aria-live` regions

---

## Tech Choices

| Decision | Rationale |
|---|---|
| Next.js 14 App Router | Modern, production-grade, easy Vercel deploy |
| TypeScript | Type-safe component props, calendar date logic |
| CSS Modules | Scoped styles, zero runtime cost, no external dep |
| `localStorage` for persistence | Assignment spec says no backend; survives page refreshes |
| HTML5 Canvas for hero | Procedural generative art, zero image assets, theme-reactive |
| No UI library | Keeps bundle lean; demonstrates raw CSS skill |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npx vercel
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + Google Fonts
│   ├── page.tsx            # Entry page
│   └── globals.css         # Design tokens & resets
├── components/
│   ├── WallCalendar.tsx    # Main calendar component
│   ├── WallCalendar.module.css  # Scoped styles
│   ├── HeroCanvas.tsx      # Procedural scene canvas
│   └── calendarUtils.ts    # Types, constants, pure helpers
└── hooks/
    └── useCalendarNotes.ts # Notes state + localStorage sync
```

---

## How Range Selection Works

1. **First click** → sets `rangeStart`, enters selecting mode
2. **Hover** → live preview updates `rangeEnd` to hovered date
3. **Second click** → finalises `rangeEnd`, exits selecting mode
4. Clicking a date *before* the start automatically swaps start/end
5. **Clear** button resets both endpoints

---

## Accessibility

- All interactive elements are keyboard-navigable (Tab + Enter)
- Day cells have descriptive `aria-label` (date + today flag + holiday name)
- Notes textarea has dynamic `aria-label` reflecting current selection
- Theme buttons have `aria-label` and `aria-pressed`
- `aria-live="polite"` on the save confirmation message
- Semantic landmarks: `<main>`, `<aside>`, `<section>`, `<h1>`, `<h2>`
