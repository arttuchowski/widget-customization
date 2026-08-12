# Widget Customization (Figma -> React + shadcn/ui)

This project reproduces the Figma screen (node: `393:1131`) as a React + TypeScript application built with **shadcn/ui**-style components.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 3
- Radix UI primitives (used under shadcn-style components)
- lucide-react

## Requirements

- Node.js 20+ (LTS recommended)
- npm 10+![alt text](image.png)

Check versions:

```bash
node -v
npm -v
```

## Installation

1. Go to the project folder.
2. Install dependencies.

```bash
npm install
```

## Development

```bash
npm run dev
```

After startup, open the address shown in the terminal, by default:

- http://localhost:5173/

## Production Build

```bash
npm run build
```

The build output is generated in the `dist/` folder.

## Local Build Preview (Recommended)

```bash
npm run preview
```

## Sharing the Project

There are two safe options:

### Option A (best): share the source code

Share the entire project folder (without `node_modules`).

The other person runs:

```bash
npm install
npm run dev
```

Or for a production build:

```bash
npm run build
npm run preview
```

### Option B: share the production build

Share the contents of `dist/`.

This project uses `base: "./"` in Vite, so you can open:

- `dist/index.html`

with a double-click.

Note: for full browser compatibility and correct routing/static asset handling, a simple static server is still recommended.

Example:

```bash
npx serve dist
```

## npm Scripts

- `npm run dev` - start the development environment
- `npm run build` - TypeScript compilation + Vite build
- `npm run preview` - local preview of the production build
- `npm run lint` - code linting

## Routes

- `/` - main Widget Design screen
- `/design-system` - catalog of colors, fonts, and UI components
- `/change-log` - project change history
- `/documentation` - technical and UX documentation for controls

## Structure

- `src/App.tsx` - main application layout
- `src/pages/WidgetDesignPage.tsx` - widget configuration screen
- `src/pages/DesignSystemPage.tsx` - design system page
- `src/pages/ChangeLogPage.tsx` - change log page
- `src/pages/DocumentationPage.tsx` - UX and technical behavior documentation
- `src/components/site-nav.tsx` - navigation between subpages
- `src/components/ui/*` - base shadcn/ui-style components
- `src/lib/utils.ts` - helper `cn()` (clsx + tailwind-merge)
- `src/index.css` - tokens, Tailwind, and base styles
- `tailwind.config.js` - Tailwind configuration
- `vite.config.ts` - Vite configuration (alias `@`, `base: "./"`)

## Further 1:1 Refinement

If you want to push the screen closer to pixel-perfect parity, iterate in this order:

1. Typography (sizes/line-height)
2. Spacing (margins and section heights)
3. Border radius + border widths
4. Token colors
5. Component states (hover/focus/disabled)

## Figma Note

The project was based on MCP access to the following file:

- `QXVCaQRlHreWggB7Fv7xPt`
- node: `393:1131`
