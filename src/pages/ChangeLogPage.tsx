import { SiteNav } from '@/components/site-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const entries = [
  {
    date: '2026-08-06',
    title: 'Sidebar UX and navigation hardening',
    items: [
      'Refined sidebar spacing, collapse behavior, and width synchronization with the main content area.',
      'Stabilized profile row and profile menu trigger behavior in expanded and collapsed states.',
      'Aligned sidebar navigation with route-driven active states and improved interactive semantics.',
    ],
  },
  {
    date: '2026-08-06',
    title: 'Widget preview design-system pass',
    items: [
      'Scoped widget colors and typography with dedicated widget tokens that inherit app palette by default.',
      'Reduced widget color and typography surface area, including a dedicated 18px heading style.',
      'Added legal caption links for Terms & Conditions and rezolve.com with hover and focus-visible states.',
    ],
  },
  {
    date: '2026-08-06',
    title: 'Widget form UX and responsive behavior',
    items: [
      'Converted widget inputs from prefilled values to placeholder-based default state.',
      'Standardized widget CTA buttons to full-width rounded pills and tuned form active outline styling.',
      'Improved narrow-width behavior for option rows and card fields to avoid cramped layouts.',
    ],
  },
  {
    date: '2026-08-06',
    title: 'Widget resize and production-readiness updates',
    items: [
      'Added draggable widget preview width resizing with keyboard support and a 360px default width.',
      'Moved resize handle to the settings/preview boundary and refined its visual layering.',
      'Introduced widget layout tokens for spacing, radius, heights, and resize handle dimensions, then documented them in Design System.',
    ],
  },
  {
    date: '2026-08-06',
    title: 'Live widget theme controls',
    items: [
      'Added a Widget Design-only local sidebar for in-page navigation, titled Widget configuration, with Theme as the first menu item and heading typography aligned to the Design System.',
      'Moved the Widget configuration naming into the local sidebar and removed the redundant inner content heading.',
      'Replaced placeholder configuration content with a focused Theme section for widget color management.',
      'Simplified the Widget configuration panel into a flatter, less boxy layout using lighter dividers instead of stacked bordered cards, fewer decorative styles and better use of horizontal space.',
      'Added responsive behavior so the Widget configuration sidebar and panel stack into a compact layout as the preview widget expands.',
      'Connected primary, surface, border, text primary and text muted controls directly to widget preview token overrides.',
      'Added a live surface-style switch between Filled and Border only modes for immediate preview feedback.',
      'Added a reset action to restore default widget theme values and the default Filled surface mode.',
      'Added an on-primary text color control so button and badge text remains readable for light primary colors.',
      'Disabled the Surface color control in Border only mode and added helper copy explaining that the surface token is not applied there.',
    ],
  },
  {
    date: '2026-08-06',
    title: 'Project setup and design replication',
    items: [
      'Configured React + Vite + TypeScript + Tailwind + shadcn components.',
      'Replicated the main Widget Design view based on Figma.',
      'Fix: app now always uses 100% of viewport width.',
    ],
  },
  {
    date: '2026-08-06',
    title: 'Documentation subpages added',
    items: [
      'Created pages: /design-system, /change-log, /documentation.',
      'Added routing and navigation between pages.',
      'Prepared a structure for ongoing technical and UX documentation.',
      'Added a current screen snapshot section describing the present Widget Design layout, controls and preview behavior.',
    ],
  },
]

export function ChangeLogPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <SiteNav />
      <main className="mx-auto w-full px-6 py-6">
        <h1 className="mb-6 text-3xl font-semibold text-[#111827]">Change Log</h1>

        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={`${entry.date}-${entry.title}`}>
              <CardHeader>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">{entry.date}</p>
                <CardTitle>{entry.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-5 text-sm text-[#1f2430]">
                  {entry.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
