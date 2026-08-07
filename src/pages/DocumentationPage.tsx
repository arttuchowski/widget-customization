import { SiteNav } from '@/components/site-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const documentationDate = '2026-08-07'

const screenStructureItems = [
  'Main layout is split into configuration area (left) and Widget Preview (right).',
  'Section navigation is handled by the sidebar options list and anchors each section by id.',
  'Page uses global page scroll for section navigation and active-section tracking.',
  'Widget Preview supports width resize through a drag handle on the seam between both panels.',
]

const navigationBehaviorItems = [
  'Clicking a sidebar option scrolls to the mapped section using hash navigation.',
  'Active option is synchronized with viewport position while scrolling.',
  'Active section fallback uses nearest section when marker is between boundaries.',
  'Sticky offsets are used for top header and section alignment.',
]

const elementsVisibilityOptions = [
  {
    title: 'Set up wallet',
    description: 'Controls visibility of the wallet quick-start payment option in preview.',
  },
  {
    title: 'Pay by new card',
    description: 'Controls visibility of the option to open card form and enter new payment details.',
  },
  {
    title: 'Saved cards visibility',
    description: 'Controls visibility of the saved card row above the new card form.',
  },
  {
    title: 'Pay by other methods',
    description: 'Controls visibility of alternative methods such as Apple Pay, PayPal, and Google Pay.',
  },
  {
    title: 'Pay by bank',
    description: 'Controls visibility of the dedicated bank payment option.',
  },
]

const appearanceControls = [
  'Primary color',
  'Surface color',
  'Border color',
  'Text primary',
  'Text muted',
  'On primary text',
]

const typographyCapabilities = [
  'Google Fonts selector with real-time preview updates in Widget Preview.',
  'Search by font name in dropdown list.',
  'Category filters: All fonts, Sans Serif, Serif.',
  'Selected font is highlighted in list and marked with a check icon.',
  'Preview sample text is shown below selector.',
  'Reset section restores default typography selection.',
]

const previewBehaviorItems = [
  'Preview panel remains sticky during page scroll to keep live result visible.',
  'Opening Pay by new card does not switch preview positioning mode (prevents scroll jumps).',
  'Preview card updates instantly after control changes in Appearance, Typography, and Elements visibility.',
  'Preview width controls compact behavior thresholds for selected rows and form layouts.',
]

const accessibilityAndQualityItems = [
  'WCAG contrast checks are displayed for key text and background combinations.',
  'Appearance validation provides inline hints and suggested accessible color replacements.',
  'Hex color input uses draft typing and applies only when value is valid.',
  'Controls include semantic labels and interactive states consistent with keyboard usage.',
]

export function DocumentationPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <SiteNav />
      <main className="mx-auto w-full px-6 py-6">
        <h1 className="mb-2 text-3xl font-semibold text-[#111827]">Documentation</h1>
        <p className="mb-6 text-sm text-[#6b7280]">Technical and UX documentation for screen structure, behaviors, and controls used on route /.</p>

        <Card className="mb-6">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">{documentationDate}</p>
            <CardTitle>Screen structure and navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-[#1f2430]">
            <div>
              <p className="mb-2 font-semibold">Layout structure</p>
              <ul className="list-disc space-y-1 pl-5">
                {screenStructureItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 font-semibold">Navigation behavior</p>
              <ul className="list-disc space-y-1 pl-5">
                {navigationBehaviorItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Elements visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-[#1f2430]">
            <div>
              <p className="mb-2 font-semibold">Purpose</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Controls visibility of payment options in Widget preview in real time.</li>
                <li>Changes apply immediately without page reload.</li>
              </ul>
            </div>

            <div>
              <p className="mb-2 font-semibold">Available controls</p>
              <ul className="list-disc space-y-1 pl-5">
                {elementsVisibilityOptions.map((item) => (
                  <li key={item.title}>
                    <span className="font-semibold">{item.title}:</span> {item.description}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 font-semibold">Rules and dependencies</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>At least one primary payment option must stay enabled: Set up wallet, Pay by new card, Pay by other methods, or Pay by bank.</li>
                <li>When only one primary option remains enabled, an inline warning is shown: At least one payment option must be enabled.</li>
                <li>Saved cards visibility is a sub-option of Pay by new card and is disabled when Pay by new card is turned off.</li>
                <li>If Pay by new card is disabled while its form is open, the form is closed automatically.</li>
                <li>Reset section resets all visibility switches in Elements visibility to default on state.</li>
                <li>Visibility toggles directly control whether related preview rows are rendered.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-[#1f2430]">
            <div>
              <p className="mb-2 font-semibold">Purpose</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Controls visual styling of the widget through color and surface settings.</li>
                <li>All changes are reflected immediately in Widget preview.</li>
              </ul>
            </div>

            <div>
              <p className="mb-2 font-semibold">Available controls</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Surface mode: Filled / White</li>
                {appearanceControls.map((control) => (
                  <li key={control}>{control}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 font-semibold">Validation and safeguards</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Hex inputs use draft typing plus validation; preview updates only after valid hex value.</li>
                <li>Color picker always receives valid hex fallback.</li>
                <li>Contrast hints are shown when configured colors do not meet required text contrast thresholds.</li>
                <li>Reset section resets only Appearance controls, without changing Elements visibility.</li>
                <li>Surface checks also validate readability of Text Primary and Text Muted against active surface mode.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-[#1f2430]">
            <div>
              <p className="mb-2 font-semibold">Capabilities</p>
              <ul className="list-disc space-y-1 pl-5">
                {typographyCapabilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Widget Preview behavior</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-[#1f2430]">
            <div>
              <p className="mb-2 font-semibold">Sticky and interaction rules</p>
              <ul className="list-disc space-y-1 pl-5">
                {previewBehaviorItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accessibility and quality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-[#1f2430]">
            <div>
              <p className="mb-2 font-semibold">Standards and safeguards</p>
              <ul className="list-disc space-y-1 pl-5">
                {accessibilityAndQualityItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
