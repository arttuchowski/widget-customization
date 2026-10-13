import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  CircleCheck,
  CircleX,
  Droplet,
  MousePointerClick,
  Palette,
  Rows3,
  Scan,
  TextCursorInput,
  Type as TypeIcon,
  X,
} from 'lucide-react'

import { MerchantTopHeader } from '@/components/layout/MerchantTopHeader'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppGraphics } from '@/context/AppGraphicsContext'
import { useAppUserRole } from '@/context/AppUserRoleContext'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { SidebarNav, SidebarNavButton } from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'

const mainTabs = ['Dashboard', 'Transactions', 'Settings', 'PSP Settings', 'User Management', 'Notifications', 'Widget Customization']
const widgetDesignSections = [
  { id: 'widget-your-brand', label: 'Your Brand' },
  { id: 'widget-advanced', label: 'Advanced' },
  { id: 'widget-elements-visibility', label: 'Elements visibility' },
]

const defaultCardBrand = 'visa' as const

const cardBrandIconByType = {
  visa: 'visaCardIcon',
  mastercard: 'mastercardCardIcon',
  amex: 'amexCardIcon',
} as const

const cardBrandLabelByType = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  amex: 'American Express',
} as const

const supportedCardBrands = ['visa', 'mastercard', 'amex'] as const
const otherMethodIconKeys = ['applePayIcon', 'payPalIcon', 'googlePayIcon'] as const
const paymentOptionRowHeight = 53
// Temporarily hide per-field descriptions under section headings.
const showFieldDescriptions = false
const defaultWidgetSectionId = widgetDesignSections[0].id
const primaryPaymentVisibilityKeys = ['setUpWallet', 'payByNewCard', 'payByOtherMethods', 'payByBank'] as const
const defaultElementVisibility = {
  setUpWallet: true,
  payByNewCard: true,
  savedCards: true,
  payByOtherMethods: true,
  payByBank: true,
}

const defaultWidgetTheme = {
  primary: '#3465eb',
  surface: '#ffffff',
  border: '#d8e1ee',
  buttonOutlineBorder: '#d8e1ee',
  inputFilledSurface: '#eef3fa',
  textPrimary: '#111827',
  textMuted: '#64748b',
  textOnPrimary: '#ffffff',
  textOnPrimaryMuted: '#ffffff',
}

type WidgetTypographyCategory = 'sans-serif' | 'serif'

const widgetTypographyOptions = [
  {
    id: 'dm-sans',
    label: 'DM Sans',
    fontFamily: "'DM Sans', sans-serif",
    googleFamily: 'DM+Sans:wght@400;500;600;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'manrope',
    label: 'Manrope',
    fontFamily: "'Manrope', sans-serif",
    googleFamily: 'Manrope:wght@400;500;600;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'space-grotesk',
    label: 'Space Grotesk',
    fontFamily: "'Space Grotesk', sans-serif",
    googleFamily: 'Space+Grotesk:wght@400;500;600;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'nunito',
    label: 'Nunito',
    fontFamily: "'Nunito', sans-serif",
    googleFamily: 'Nunito:wght@400;500;600;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'inter',
    label: 'Inter',
    fontFamily: "'Inter', sans-serif",
    googleFamily: 'Inter:wght@400;500;600;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'poppins',
    label: 'Poppins',
    fontFamily: "'Poppins', sans-serif",
    googleFamily: 'Poppins:wght@400;500;600;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'lato',
    label: 'Lato',
    fontFamily: "'Lato', sans-serif",
    googleFamily: 'Lato:wght@400;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'rubik',
    label: 'Rubik',
    fontFamily: "'Rubik', sans-serif",
    googleFamily: 'Rubik:wght@400;500;600;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'work-sans',
    label: 'Work Sans',
    fontFamily: "'Work Sans', sans-serif",
    googleFamily: 'Work+Sans:wght@400;500;600;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'source-sans-3',
    label: 'Source Sans 3',
    fontFamily: "'Source Sans 3', sans-serif",
    googleFamily: 'Source+Sans+3:wght@400;500;600;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'plus-jakarta-sans',
    label: 'Plus Jakarta Sans',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    googleFamily: 'Plus+Jakarta+Sans:wght@400;500;600;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'outfit',
    label: 'Outfit',
    fontFamily: "'Outfit', sans-serif",
    googleFamily: 'Outfit:wght@400;500;600;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'mulish',
    label: 'Mulish',
    fontFamily: "'Mulish', sans-serif",
    googleFamily: 'Mulish:wght@400;500;600;700',
    category: 'sans-serif' as WidgetTypographyCategory,
  },
  {
    id: 'lora',
    label: 'Lora',
    fontFamily: "'Lora', serif",
    googleFamily: 'Lora:wght@400;500;600;700',
    category: 'serif' as WidgetTypographyCategory,
  },
  {
    id: 'merriweather',
    label: 'Merriweather',
    fontFamily: "'Merriweather', serif",
    googleFamily: 'Merriweather:wght@400;700',
    category: 'serif' as WidgetTypographyCategory,
  },
  {
    id: 'playfair-display',
    label: 'Playfair Display',
    fontFamily: "'Playfair Display', serif",
    googleFamily: 'Playfair+Display:wght@400;500;600;700',
    category: 'serif' as WidgetTypographyCategory,
  },
  {
    id: 'source-serif-4',
    label: 'Source Serif 4',
    fontFamily: "'Source Serif 4', serif",
    googleFamily: 'Source+Serif+4:wght@400;500;600;700',
    category: 'serif' as WidgetTypographyCategory,
  },
] as const

const defaultWidgetTypographyId = widgetTypographyOptions[0].id
type WidgetButtonType = 'outline' | 'filled' | 'tonal'
type WidgetInputType = 'outline' | 'filled'
type WidgetDensityPreset = 'compact' | 'comfortable' | 'spacius'

const defaultWidgetButtonStyle = {
  type: 'outline' as WidgetButtonType,
  radius: 64,
}

const defaultWidgetInputStyle = {
  type: 'outline' as WidgetInputType,
  radius: 8,
}

const defaultWidgetSurfaceStyle = {
  radius: 16,
}

const widgetDensityPresetOptions = [
  { id: 'compact' as const, label: 'Compact', horizontalPadding: 16, verticalSpacing: 10 },
  { id: 'comfortable' as const, label: 'Comfortable', horizontalPadding: 20, verticalSpacing: 12 },
  { id: 'spacius' as const, label: 'Spacius', horizontalPadding: 24, verticalSpacing: 16 },
]

const defaultWidgetDensityPreset: WidgetDensityPreset = 'comfortable'

interface WidgetFontDropdownProps {
  value: (typeof widgetTypographyOptions)[number]['id']
  onChange: (id: (typeof widgetTypographyOptions)[number]['id']) => void
}

function WidgetFontDropdown({ value, onChange }: WidgetFontDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | WidgetTypographyCategory>('all')
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const selectedOption = widgetTypographyOptions.find((o) => o.id === value) ?? widgetTypographyOptions[0]

  const filteredOptions = widgetTypographyOptions.filter((option) => {
    if (categoryFilter !== 'all' && option.category !== categoryFilter) {
      return false
    }
    const query = searchQuery.trim().toLowerCase()
    return !query || option.label.toLowerCase().includes(query)
  })

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !dropdownRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-1 text-sm text-[var(--sidebar-text-primary)] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)]"
        onClick={() => {
          setIsOpen((prev) => {
            if (prev) {
              setSearchQuery('')
            }
            return !prev
          })
        }}
        aria-label="Select widget font family"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span style={{ fontFamily: selectedOption.fontFamily }}>{selectedOption.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-[var(--sidebar-text-secondary)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          className="absolute z-30 mt-1 w-full rounded-md border border-[var(--sidebar-border-color)] bg-[var(--sidebar-menu-bg)] shadow-md"
          role="listbox"
          aria-label="Widget font options"
        >
          <div className="border-b border-[var(--sidebar-border-color)] p-2">
            <div className="mb-2 flex flex-wrap gap-2">
              {([{ id: 'all', label: 'All fonts' }, { id: 'sans-serif', label: 'Sans Serif' }, { id: 'serif', label: 'Serif' }] as const).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`rounded-full border px-2 py-1 text-xs font-semibold transition-colors ${
                    categoryFilter === cat.id
                      ? 'border-[var(--sidebar-focus-ring)] bg-[var(--sidebar-item-active-bg)] text-[var(--sidebar-text-primary)]'
                      : 'border-[var(--sidebar-border-color)] bg-[var(--sidebar-menu-bg)] text-[var(--sidebar-text-secondary)] hover:bg-[var(--sidebar-item-hover-bg)]'
                  }`}
                  onClick={() => setCategoryFilter(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search font by name"
              aria-label="Search font by name"
              className="h-8"
            />
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)] ${
                      isSelected
                        ? 'bg-[var(--sidebar-item-active-bg)] text-[var(--sidebar-text-primary)]'
                        : 'text-[var(--sidebar-text-primary)] hover:bg-[var(--sidebar-item-hover-bg)]'
                    }`}
                    style={{ fontFamily: option.fontFamily }}
                    onClick={() => {
                      onChange(option.id)
                      setSearchQuery('')
                      setIsOpen(false)
                    }}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span>{option.label}</span>
                    {isSelected ? <CircleCheck className="h-4 w-4 shrink-0 text-[var(--sidebar-focus-ring)]" aria-hidden="true" /> : null}
                  </button>
                )
              })
            ) : (
              <p className="px-3 py-2 text-sm text-[var(--sidebar-text-secondary)]">No fonts found.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

const WCAG_AA_TEXT_CONTRAST = 4.5

const normalizeHexColor = (value: string): string | null => {
  const trimmed = value.trim()
  const hexMatch = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(trimmed)
  if (!hexMatch) {
    return null
  }

  const hex = hexMatch[1]
  if (hex.length === 3) {
    return `#${hex
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
      .toLowerCase()}`
  }

  return `#${hex.toLowerCase()}`
}

const normalizeColorToHex = (value: string): string | null => {
  const normalizedHex = normalizeHexColor(value)
  if (normalizedHex) {
    return normalizedHex
  }

  const rgbMatch = /^rgba?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})(?:\s*[,/]\s*(?:\d*\.?\d+%?))?\s*\)$/i.exec(value.trim())
  if (!rgbMatch) {
    return null
  }

  const channels = rgbMatch.slice(1, 4).map((channel) => Number.parseInt(channel, 10))
  if (channels.some((channel) => Number.isNaN(channel) || channel < 0 || channel > 255)) {
    return null
  }

  return rgbToHex(channels[0], channels[1], channels[2])
}

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = normalizeHexColor(hex)
  if (!normalized) {
    throw new Error('Invalid hex color')
  }

  return [
    parseInt(normalized.slice(1, 3), 16),
    parseInt(normalized.slice(3, 5), 16),
    parseInt(normalized.slice(5, 7), 16),
  ]
}

const channelToLinear = (channel: number): number => {
  const normalized = channel / 255
  if (normalized <= 0.03928) {
    return normalized / 12.92
  }
  return ((normalized + 0.055) / 1.055) ** 2.4
}

const relativeLuminance = (hex: string): number => {
  const [red, green, blue] = hexToRgb(hex)
  return 0.2126 * channelToLinear(red) + 0.7152 * channelToLinear(green) + 0.0722 * channelToLinear(blue)
}

const getContrastRatio = (firstHex: string, secondHex: string): number | null => {
  const normalizedFirst = normalizeColorToHex(firstHex)
  const normalizedSecond = normalizeColorToHex(secondHex)
  if (!normalizedFirst || !normalizedSecond) {
    return null
  }

  const firstLuminance = relativeLuminance(normalizedFirst)
  const secondLuminance = relativeLuminance(normalizedSecond)
  const lighter = Math.max(firstLuminance, secondLuminance)
  const darker = Math.min(firstLuminance, secondLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

const rgbToHex = (red: number, green: number, blue: number): string => {
  const toHexChannel = (value: number) => value.toString(16).padStart(2, '0')
  return `#${toHexChannel(red)}${toHexChannel(green)}${toHexChannel(blue)}`
}

const mixRgb = (
  source: [number, number, number],
  target: [number, number, number],
  ratio: number,
): [number, number, number] => {
  const clampRatio = Math.max(0, Math.min(1, ratio))
  return [0, 1, 2].map((index) => Math.round(source[index] + (target[index] - source[index]) * clampRatio)) as [number, number, number]
}

const rgbDistance = (first: [number, number, number], second: [number, number, number]): number => {
  const redDelta = first[0] - second[0]
  const greenDelta = first[1] - second[1]
  const blueDelta = first[2] - second[2]
  return Math.sqrt(redDelta ** 2 + greenDelta ** 2 + blueDelta ** 2)
}

const compositeHexOverHex = (overlayHex: string, baseHex: string, alpha: number): string | null => {
  const normalizedOverlay = normalizeColorToHex(overlayHex)
  const normalizedBase = normalizeColorToHex(baseHex)
  if (!normalizedOverlay || !normalizedBase) {
    return null
  }

  const overlayRgb = hexToRgb(normalizedOverlay)
  const baseRgb = hexToRgb(normalizedBase)
  const compositedRgb = mixRgb(baseRgb, overlayRgb, Math.max(0, Math.min(1, alpha)))
  return rgbToHex(compositedRgb[0], compositedRgb[1], compositedRgb[2])
}

const findNearestCompliantTextColor = (
  backgroundHex: string,
  currentTextHex: string,
  minContrastRatio: number,
): string | null => {
  const normalizedBackground = normalizeHexColor(backgroundHex)
  const normalizedCurrent = normalizeHexColor(currentTextHex)
  if (!normalizedBackground || !normalizedCurrent) {
    return null
  }

  const existingContrast = getContrastRatio(normalizedBackground, normalizedCurrent)
  if (existingContrast !== null && existingContrast >= minContrastRatio) {
    return normalizedCurrent
  }

  const sourceRgb = hexToRgb(normalizedCurrent)
  const candidateTargets: Array<[number, number, number]> = [
    [0, 0, 0],
    [255, 255, 255],
  ]
  const candidates: Array<{ color: string; distance: number }> = []

  for (const targetRgb of candidateTargets) {
    const targetHex = rgbToHex(targetRgb[0], targetRgb[1], targetRgb[2])
    const targetContrast = getContrastRatio(normalizedBackground, targetHex)
    if (targetContrast === null || targetContrast < minContrastRatio) {
      continue
    }

    let left = 0
    let right = 1
    for (let iteration = 0; iteration < 24; iteration += 1) {
      const mid = (left + right) / 2
      const midRgb = mixRgb(sourceRgb, targetRgb, mid)
      const midHex = rgbToHex(midRgb[0], midRgb[1], midRgb[2])
      const midContrast = getContrastRatio(normalizedBackground, midHex)
      if (midContrast !== null && midContrast >= minContrastRatio) {
        right = mid
      } else {
        left = mid
      }
    }

    const candidateRgb = mixRgb(sourceRgb, targetRgb, right)
    const candidateHex = rgbToHex(candidateRgb[0], candidateRgb[1], candidateRgb[2])
    candidates.push({
      color: candidateHex,
      distance: rgbDistance(sourceRgb, candidateRgb),
    })
  }

  if (candidates.length === 0) {
    return null
  }

  candidates.sort((first, second) => first.distance - second.distance)
  return candidates[0].color
}

const findNearestCompliantBackgroundColor = (
  currentBackgroundHex: string,
  textHexes: string[],
  minContrastRatio: number,
): string | null => {
  const normalizedBackground = normalizeHexColor(currentBackgroundHex)
  if (!normalizedBackground) {
    return null
  }

  const normalizedTextHexes = textHexes
    .map((value) => normalizeHexColor(value))
    .filter((value): value is string => value !== null)

  if (normalizedTextHexes.length !== textHexes.length) {
    return null
  }

  const isCompliantForAllTexts = (backgroundHex: string): boolean => {
    return normalizedTextHexes.every((textHex) => {
      const contrastRatio = getContrastRatio(backgroundHex, textHex)
      return contrastRatio !== null && contrastRatio >= minContrastRatio
    })
  }

  if (isCompliantForAllTexts(normalizedBackground)) {
    return normalizedBackground
  }

  const sourceRgb = hexToRgb(normalizedBackground)
  const candidateTargets: Array<[number, number, number]> = [
    [255, 255, 255],
    [0, 0, 0],
  ]
  const candidates: Array<{ color: string; distance: number }> = []

  for (const targetRgb of candidateTargets) {
    const targetHex = rgbToHex(targetRgb[0], targetRgb[1], targetRgb[2])
    if (!isCompliantForAllTexts(targetHex)) {
      continue
    }

    let left = 0
    let right = 1

    for (let iteration = 0; iteration < 24; iteration += 1) {
      const mid = (left + right) / 2
      const midRgb = mixRgb(sourceRgb, targetRgb, mid)
      const midHex = rgbToHex(midRgb[0], midRgb[1], midRgb[2])

      if (isCompliantForAllTexts(midHex)) {
        right = mid
      } else {
        left = mid
      }
    }

    const candidateRgb = mixRgb(sourceRgb, targetRgb, right)
    const candidateHex = rgbToHex(candidateRgb[0], candidateRgb[1], candidateRgb[2])
    candidates.push({
      color: candidateHex,
      distance: rgbDistance(sourceRgb, candidateRgb),
    })
  }

  if (candidates.length === 0) {
    return null
  }

  candidates.sort((first, second) => first.distance - second.distance)
  return candidates[0].color
}

const deriveInputFilledSurfaceFromPrimary = (
  primaryHex: string,
  textPrimaryHex: string,
  textMutedHex: string,
): string => {
  const normalizedPrimary = normalizeHexColor(primaryHex)
  if (!normalizedPrimary) {
    return defaultWidgetTheme.inputFilledSurface
  }

  const primaryRgb = hexToRgb(normalizedPrimary)
  const whiteRgb: [number, number, number] = [255, 255, 255]
  const tintedRgb = mixRgb(whiteRgb, primaryRgb, 0.14)
  const tintedHex = rgbToHex(tintedRgb[0], tintedRgb[1], tintedRgb[2])

  return findNearestCompliantBackgroundColor(
    tintedHex,
    [textPrimaryHex, textMutedHex],
    WCAG_AA_TEXT_CONTRAST,
  ) ?? tintedHex
}

const ensureGoogleFontStylesheet = (fontId: string, googleFamily: string) => {
  const stylesheetId = `widget-google-font-${fontId}`
  if (document.getElementById(stylesheetId)) {
    return
  }

  const stylesheet = document.createElement('link')
  stylesheet.id = stylesheetId
  stylesheet.rel = 'stylesheet'
  stylesheet.href = `https://fonts.googleapis.com/css2?family=${googleFamily}&display=swap`
  document.head.appendChild(stylesheet)
}

interface WidgetDesignPageProps {
  section?: 'merchants' | 'psp-providers'
}

interface PaymentOptionRowProps {
  children: React.ReactNode
  isCompact: boolean
  buttonType?: WidgetButtonType
  buttonRadius?: number
  useFilledTextColors?: boolean
  className?: string
  style?: React.CSSProperties
  active?: boolean
  withBorder?: boolean
  hoverable?: boolean
  onClick?: () => void
  ariaExpanded?: boolean
  ariaControls?: string
}

function PaymentOptionRow({
  children,
  isCompact,
  buttonType = 'outline',
  buttonRadius = defaultWidgetButtonStyle.radius,
  useFilledTextColors = buttonType === 'filled',
  className,
  style,
  active = false,
  withBorder = true,
  hoverable = true,
  onClick,
  ariaExpanded,
  ariaControls,
}: PaymentOptionRowProps) {
  const isFilledButton = buttonType === 'filled'
  const isTonalButton = buttonType === 'tonal'
  const baseClassName = [
    `w-full ${useFilledTextColors ? 'text-[var(--widget-option-filled-text)] [&_.widget-option-muted]:text-[var(--widget-option-filled-muted-text)]' : 'text-[var(--widget-text-primary)]'} transition-colors`,
    withBorder
      ? active
        ? `border border-[var(--widget-color-primary)] ${isFilledButton ? 'bg-[var(--widget-option-button-bg)]' : isTonalButton ? 'bg-[var(--widget-option-button-tonal-bg)]' : 'bg-[var(--widget-button-outline-bg)]'}`
        : isFilledButton
          ? `border border-transparent bg-[var(--widget-option-button-bg)] ${hoverable ? 'hover:bg-[var(--widget-option-button-bg-hover)]' : ''}`
          : isTonalButton
            ? `border border-transparent bg-[var(--widget-option-button-tonal-bg)] ${hoverable ? 'hover:bg-[var(--widget-option-button-tonal-bg-hover)]' : ''}`
          : `border border-[var(--widget-button-outline-border)] bg-[var(--widget-button-outline-bg)] ${hoverable ? 'hover:border-[var(--widget-color-primary)] hover:bg-[var(--widget-option-hover-bg)]' : ''}`
      : '',
    !withBorder && onClick && hoverable
      ? isFilledButton
        ? 'hover:bg-[var(--widget-option-button-bg-hover)]'
        : isTonalButton
          ? 'hover:bg-[var(--widget-option-button-tonal-bg-hover)]'
        : 'hover:bg-[var(--widget-option-hover-bg)]'
      : '',
    onClick ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--widget-color-primary)]' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={baseClassName}
      style={{
        borderRadius: `${buttonRadius}px`,
        height: isCompact ? undefined : `${paymentOptionRowHeight}px`,
        paddingInline: isCompact ? 'var(--widget-option-padding-x-compact)' : 'var(--widget-option-padding-x)',
        paddingBlock: isCompact ? 'var(--widget-option-padding-y-compact)' : 'var(--widget-option-padding-y)',
        fontSize: 'var(--widget-font-size-body)',
        ...style,
      }}
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      {children}
    </button>
  )
}

export function WidgetDesignPage({ section = 'merchants' }: WidgetDesignPageProps) {
  const { graphics } = useAppGraphics()
  const { userRole } = useAppUserRole()
  const initialWidgetTheme = {
    ...defaultWidgetTheme,
    inputFilledSurface: deriveInputFilledSurfaceFromPrimary(
      defaultWidgetTheme.primary,
      defaultWidgetTheme.textPrimary,
      defaultWidgetTheme.textMuted,
    ),
  }
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeWidgetSectionId, setActiveWidgetSectionId] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultWidgetSectionId
    }

    const hashSectionId = window.location.hash.replace('#', '')
    return widgetDesignSections.some((item) => item.id === hashSectionId) ? hashSectionId : defaultWidgetSectionId
  })
  const [widgetWidth, setWidgetWidth] = useState(360)
  const [widgetSurfaceMode, setWidgetSurfaceMode] = useState<'filled' | 'border-only'>('filled')
  const [widgetTheme, setWidgetTheme] = useState(initialWidgetTheme)
  const [widgetThemeDraft, setWidgetThemeDraft] = useState(initialWidgetTheme)
  const [isInputFilledSurfaceLinkedToPrimary, setIsInputFilledSurfaceLinkedToPrimary] = useState(true)
  const [widgetTypography, setWidgetTypography] = useState<(typeof widgetTypographyOptions)[number]['id']>(defaultWidgetTypographyId)
  const [widgetButtonStyle, setWidgetButtonStyle] = useState(defaultWidgetButtonStyle)
  const [widgetInputStyle, setWidgetInputStyle] = useState(defaultWidgetInputStyle)
  const [widgetSurfaceStyle, setWidgetSurfaceStyle] = useState(defaultWidgetSurfaceStyle)
  const [widgetDensityPreset, setWidgetDensityPreset] = useState<WidgetDensityPreset>(defaultWidgetDensityPreset)
  const [isPayByNewCardOpen, setIsPayByNewCardOpen] = useState(false)
  const [isPayByOtherMethodsOpen, setIsPayByOtherMethodsOpen] = useState(false)
  const [isSaveCardEnabled, setIsSaveCardEnabled] = useState(false)
  const [elementVisibility, setElementVisibility] = useState(defaultElementVisibility)
  const widgetSectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const dragStartXRef = useRef(0)
  const dragStartWidthRef = useRef(360)
  const pointerMoveHandlerRef = useRef<((event: PointerEvent) => void) | null>(null)
  const pointerUpHandlerRef = useRef<(() => void) | null>(null)
  const sidebarColumnWidth = isSidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)'
  const isMerchantUser = userRole === 'merchant'
  const layoutColumns = isMerchantUser ? 'minmax(0, 1fr)' : `${sidebarColumnWidth} minmax(0, 1fr)`
  const stickyPanelsTopOffset = '56px'
  const stickyPreviewTopOffset = '72px'
  const globalSectionScrollOffset = isMerchantUser ? 130 : 100
  const entityName = section === 'psp-providers' ? 'PSP Providers' : 'Leon'
  const rootLabel = section === 'psp-providers' ? 'PSP Providers' : 'Merchants'
  const widgetMinWidth = 260
  const widgetMaxWidth = 1000
  const widgetPanelHorizontalPadding = 64
  const widgetPanelWidth = widgetWidth + widgetPanelHorizontalPadding
  const isWidgetCompact = widgetWidth < 360
  const isCardInformationSingleRow = widgetWidth >= 420
  const isConfigurationCompact = widgetWidth >= 520
  const payByNewCardOpenRadius = Math.min(widgetButtonStyle.radius, 24)
  const payByOtherMethodsOpenRadius = Math.min(widgetButtonStyle.radius, 24)
  const activeCardBrand = defaultCardBrand
  const isPreviewStickyEnabled = true
  const activeWidgetDensityPreset = widgetDensityPresetOptions.find((option) => option.id === widgetDensityPreset) ?? widgetDensityPresetOptions[1]
  const widgetPreviewVerticalGap = activeWidgetDensityPreset.verticalSpacing

  const clampWidgetWidth = (width: number) => {
    return Math.max(widgetMinWidth, Math.min(widgetMaxWidth, width))
  }

  const stopWidgetResize = () => {
    if (pointerMoveHandlerRef.current) {
      window.removeEventListener('pointermove', pointerMoveHandlerRef.current)
      pointerMoveHandlerRef.current = null
    }
    if (pointerUpHandlerRef.current) {
      window.removeEventListener('pointerup', pointerUpHandlerRef.current)
      pointerUpHandlerRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      stopWidgetResize()
    }
  }, [])

  useEffect(() => {
    const updateActiveSectionFromHash = () => {
      const hashSectionId = window.location.hash.replace('#', '')
      setActiveWidgetSectionId(widgetDesignSections.some((item) => item.id === hashSectionId) ? hashSectionId : defaultWidgetSectionId)
    }

    updateActiveSectionFromHash()
    window.addEventListener('hashchange', updateActiveSectionFromHash)

    return () => {
      window.removeEventListener('hashchange', updateActiveSectionFromHash)
    }
  }, [])

  const handleWidgetResizeStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    stopWidgetResize()
    dragStartXRef.current = event.clientX
    dragStartWidthRef.current = widgetWidth

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - dragStartXRef.current
      setWidgetWidth(clampWidgetWidth(dragStartWidthRef.current - deltaX))
    }

    const onPointerUp = () => {
      stopWidgetResize()
    }

    pointerMoveHandlerRef.current = onPointerMove
    pointerUpHandlerRef.current = onPointerUp
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  const handleWidgetResizeKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return
    }

    event.preventDefault()
    const delta = event.key === 'ArrowRight' ? 8 : -8
    setWidgetWidth((prev) => clampWidgetWidth(prev + delta))
  }

  const handleWidgetThemeChange = (token: keyof typeof widgetTheme, value: string) => {
    const normalizedValue = normalizeColorToHex(value) ?? value

    if (token === 'inputFilledSurface') {
      setIsInputFilledSurfaceLinkedToPrimary(false)
      setWidgetTheme((prev) => ({ ...prev, inputFilledSurface: normalizedValue }))
      return
    }

    setWidgetTheme((prev) => {
      const nextTheme = { ...prev, [token]: normalizedValue }

      if (
        isInputFilledSurfaceLinkedToPrimary
        && (token === 'primary' || token === 'textPrimary' || token === 'textMuted')
      ) {
        nextTheme.inputFilledSurface = deriveInputFilledSurfaceFromPrimary(
          nextTheme.primary,
          nextTheme.textPrimary,
          nextTheme.textMuted,
        )
      }

      return nextTheme
    })
  }

  const handleWidgetThemeHexInputChange = (token: keyof typeof widgetTheme, value: string) => {
    setWidgetThemeDraft((prev) => ({ ...prev, [token]: value }))
    const normalized = normalizeHexColor(value)
    if (normalized) {
      handleWidgetThemeChange(token, normalized)
    }
  }

  const handleWidgetThemeHexInputBlur = (token: keyof typeof widgetTheme) => {
    setWidgetThemeDraft((prev) => ({ ...prev, [token]: widgetTheme[token] }))
  }

  const resetWidgetThemeToken = (token: keyof typeof widgetTheme) => {
    if (token === 'inputFilledSurface') {
      setIsInputFilledSurfaceLinkedToPrimary(true)
      setWidgetTheme((prev) => ({
        ...prev,
        inputFilledSurface: deriveInputFilledSurfaceFromPrimary(prev.primary, prev.textPrimary, prev.textMuted),
      }))
      return
    }

    setWidgetTheme((prev) => ({ ...prev, [token]: defaultWidgetTheme[token] }))
  }

  const resetWidgetTheme = () => {
    const resetTheme = {
      ...defaultWidgetTheme,
      inputFilledSurface: deriveInputFilledSurfaceFromPrimary(
        defaultWidgetTheme.primary,
        defaultWidgetTheme.textPrimary,
        defaultWidgetTheme.textMuted,
      ),
    }

    setWidgetSurfaceMode('filled')
    setWidgetSurfaceStyle(defaultWidgetSurfaceStyle)
    setIsInputFilledSurfaceLinkedToPrimary(true)
    setWidgetTheme(resetTheme)
    setWidgetThemeDraft(resetTheme)
  }

  const handleWidgetSurfaceRadiusChange = (value: number) => {
    const normalizedValue = Number.isFinite(value) ? Math.max(0, Math.min(32, Math.round(value))) : defaultWidgetSurfaceStyle.radius
    setWidgetSurfaceStyle({ radius: normalizedValue })
  }

  const resetYourBrandSection = () => {
    handleWidgetThemeChange('primary', defaultWidgetTheme.primary)
    setWidgetThemeDraft((prev) => ({ ...prev, primary: defaultWidgetTheme.primary }))
    setWidgetTypography(defaultWidgetTypographyId)
    setWidgetButtonStyle(defaultWidgetButtonStyle)
    setWidgetDensityPreset(defaultWidgetDensityPreset)
  }

  const handleWidgetButtonTypeChange = (value: string) => {
    if (value !== 'outline' && value !== 'filled' && value !== 'tonal') {
      return
    }

    setWidgetButtonStyle((prev) => ({ ...prev, type: value }))
  }

  const handleWidgetButtonRadiusChange = (value: number) => {
    const normalizedValue = Number.isFinite(value) ? Math.max(0, Math.min(64, Math.round(value))) : defaultWidgetButtonStyle.radius
    setWidgetButtonStyle((prev) => ({ ...prev, radius: normalizedValue }))
  }

  const handleWidgetInputTypeChange = (value: string) => {
    if (value !== 'outline' && value !== 'filled') {
      return
    }

    setWidgetInputStyle((prev) => ({ ...prev, type: value }))
  }

  const handleWidgetInputRadiusChange = (value: number) => {
    const normalizedValue = Number.isFinite(value) ? Math.max(0, Math.min(16, Math.round(value))) : defaultWidgetInputStyle.radius
    setWidgetInputStyle((prev) => ({ ...prev, radius: normalizedValue }))
  }

  const resetWidgetInputStyleSection = () => {
    setWidgetInputStyle(defaultWidgetInputStyle)
  }

  useEffect(() => {
    setWidgetThemeDraft(widgetTheme)
  }, [widgetTheme])

  useEffect(() => {
    const selectedOption = widgetTypographyOptions.find((option) => option.id === widgetTypography)
    if (!selectedOption) {
      return
    }

    ensureGoogleFontStylesheet(selectedOption.id, selectedOption.googleFamily)
  }, [widgetTypography])

  const primaryVisibleOptionsCount = primaryPaymentVisibilityKeys.filter((key) => elementVisibility[key]).length

  const togglePrimaryPaymentVisibility = (
    key: (typeof primaryPaymentVisibilityKeys)[number],
    checked: boolean,
  ) => {
    if (!checked && elementVisibility[key] && primaryVisibleOptionsCount <= 1) {
      return
    }

    setElementVisibility((prev) => ({
      ...prev,
      [key]: checked,
      savedCards: key === 'payByNewCard' && !checked ? false : prev.savedCards,
    }))
  }

  const resetElementVisibilitySection = () => {
    setElementVisibility(defaultElementVisibility)
  }

  useEffect(() => {
    if (!elementVisibility.payByNewCard && isPayByNewCardOpen) {
      setIsPayByNewCardOpen(false)
    }
  }, [elementVisibility.payByNewCard, isPayByNewCardOpen])

  useEffect(() => {
    if (!elementVisibility.payByOtherMethods && isPayByOtherMethodsOpen) {
      setIsPayByOtherMethodsOpen(false)
    }
  }, [elementVisibility.payByOtherMethods, isPayByOtherMethodsOpen])

  const registerWidgetSectionRef = (sectionId: string) => (node: HTMLElement | null) => {
    widgetSectionRefs.current[sectionId] = node
  }

  const scrollToWidgetSection = (sectionId: string) => {
    const targetSection = widgetSectionRefs.current[sectionId]
    if (!targetSection) {
      return
    }

    const sectionTop = window.scrollY + targetSection.getBoundingClientRect().top
    const offsetTop = Math.max(0, sectionTop - globalSectionScrollOffset)
    window.scrollTo({ top: offsetTop, behavior: 'smooth' })
    setActiveWidgetSectionId(sectionId)
    if (window.location.hash !== `#${sectionId}`) {
      window.history.replaceState(null, '', `#${sectionId}`)
    }
  }

  useEffect(() => {
    const updateActiveSectionFromScroll = () => {
      const sectionMarker = globalSectionScrollOffset + 24
      let nextActiveSectionId = defaultWidgetSectionId
      let nearestSectionId = defaultWidgetSectionId
      let nearestDistance = Number.POSITIVE_INFINITY
      let isMarkerInsideSection = false

      for (const section of widgetDesignSections) {
        const node = widgetSectionRefs.current[section.id]
        if (!node) {
          continue
        }

        const sectionRect = node.getBoundingClientRect()
        const markerDistance = Math.abs(sectionRect.top - sectionMarker)
        if (markerDistance < nearestDistance) {
          nearestDistance = markerDistance
          nearestSectionId = section.id
        }

        if (sectionRect.top <= sectionMarker && sectionRect.bottom > sectionMarker) {
          nextActiveSectionId = section.id
          isMarkerInsideSection = true
          break
        }
      }

      if (!isMarkerInsideSection) {
        nextActiveSectionId = nearestSectionId
      }

      setActiveWidgetSectionId(nextActiveSectionId)
    }

    updateActiveSectionFromScroll()
    window.addEventListener('scroll', updateActiveSectionFromScroll)
    window.addEventListener('resize', updateActiveSectionFromScroll)

    return () => {
      window.removeEventListener('scroll', updateActiveSectionFromScroll)
      window.removeEventListener('resize', updateActiveSectionFromScroll)
    }
  }, [globalSectionScrollOffset])

  const effectiveWidgetSurfaceColor = widgetSurfaceMode === 'filled' ? widgetTheme.surface : '#ffffff'
  const normalizedPrimaryColor = normalizeHexColor(widgetTheme.primary)
  const widgetOptionHoverBg = normalizedPrimaryColor
    ? (() => {
        const [red, green, blue] = hexToRgb(normalizedPrimaryColor)
        return `rgb(${red} ${green} ${blue} / 0.10)`
      })()
    : 'rgb(52 101 235 / 0.10)'
  const widgetOptionButtonBg = normalizedPrimaryColor
    ? normalizedPrimaryColor
    : '#3465eb'
  const widgetOptionButtonBgHover = normalizedPrimaryColor
    ? (() => {
        const [red, green, blue] = hexToRgb(normalizedPrimaryColor)
        return `rgb(${Math.round(red * 0.88)} ${Math.round(green * 0.88)} ${Math.round(blue * 0.88)})`
      })()
    : '#2d57cb'
  const widgetOptionButtonTonalBg = normalizedPrimaryColor
    ? (() => {
        const [red, green, blue] = hexToRgb(normalizedPrimaryColor)
        return `rgb(${red} ${green} ${blue} / 0.12)`
      })()
    : 'rgb(52 101 235 / 0.12)'
  const widgetOptionButtonTonalBgHover = normalizedPrimaryColor
    ? (() => {
        const [red, green, blue] = hexToRgb(normalizedPrimaryColor)
        return `rgb(${red} ${green} ${blue} / 0.18)`
      })()
    : 'rgb(52 101 235 / 0.18)'
  const derivedInputFilledSurfaceDefault = deriveInputFilledSurfaceFromPrimary(
    widgetTheme.primary,
    widgetTheme.textPrimary,
    widgetTheme.textMuted,
  )
  const widgetInputFilledBg = normalizeHexColor(widgetTheme.inputFilledSurface) ?? derivedInputFilledSurfaceDefault
  const widgetOptionButtonTonalBgSolid = compositeHexOverHex(
    normalizedPrimaryColor ?? widgetTheme.primary,
    effectiveWidgetSurfaceColor,
    0.12,
  ) ?? '#e8effd'

  const widgetThemeStyles = {
    '--widget-color-primary': widgetTheme.primary,
    '--widget-color-surface': effectiveWidgetSurfaceColor,
    '--widget-color-border': widgetTheme.border,
    '--widget-button-outline-border': widgetTheme.buttonOutlineBorder,
    '--widget-text-primary': widgetTheme.textPrimary,
    '--widget-text-muted': widgetTheme.textMuted,
    '--widget-text-on-primary': widgetTheme.textOnPrimary,
    '--widget-text-on-primary-muted': widgetTheme.textOnPrimaryMuted,
    '--widget-option-hover-bg': widgetOptionHoverBg,
    '--widget-option-button-bg': widgetOptionButtonBg,
    '--widget-option-button-bg-hover': widgetOptionButtonBgHover,
    '--widget-option-button-tonal-bg': widgetOptionButtonTonalBg,
    '--widget-option-button-tonal-bg-hover': widgetOptionButtonTonalBgHover,
    '--widget-option-filled-text': widgetTheme.textOnPrimary,
    '--widget-option-filled-muted-text': widgetTheme.textOnPrimaryMuted,
    '--widget-input-bg': widgetInputStyle.type === 'filled' ? widgetInputFilledBg : effectiveWidgetSurfaceColor,
    '--widget-input-border': widgetInputStyle.type === 'filled' ? 'transparent' : widgetTheme.border,
    '--widget-input-text': widgetTheme.textPrimary,
    '--widget-input-placeholder': widgetTheme.textMuted,
    '--widget-input-ring': widgetTheme.primary,
    '--widget-input-radius': `${widgetInputStyle.radius}px`,
    '--widget-radius-card': `${widgetSurfaceStyle.radius}px`,
    '--widget-switch-checked-bg': widgetTheme.primary,
    '--widget-switch-unchecked-bg': widgetTheme.border,
    '--widget-switch-thumb-bg': effectiveWidgetSurfaceColor,
    '--widget-switch-ring': widgetTheme.primary,
    '--widget-font-family': widgetTypographyOptions.find((option) => option.id === widgetTypography)?.fontFamily ?? "'DM Sans', sans-serif",
    '--widget-heading-font-family': widgetTypographyOptions.find((option) => option.id === widgetTypography)?.fontFamily ?? "'DM Sans', sans-serif",
    '--widget-density-padding-inline': `${activeWidgetDensityPreset.horizontalPadding}px`,
    '--widget-density-gap': `${widgetPreviewVerticalGap}px`,
  } as React.CSSProperties

  const widgetPreviewPanelStyles = {
    '--widget-color-primary': widgetTheme.primary,
    '--widget-color-border': widgetTheme.border,
    '--widget-text-on-primary': widgetTheme.textOnPrimary,
  } as React.CSSProperties

  const buttonStyleSectionOptions = [
    {
      type: 'outline' as const,
      label: 'Outline',
      description: 'Border + Text primary. Hover uses Primary.',
      sampleStyle: {
        borderColor: widgetTheme.buttonOutlineBorder,
        color: widgetTheme.textPrimary,
        backgroundColor: effectiveWidgetSurfaceColor,
        borderRadius: `${widgetButtonStyle.radius}px`,
      } as React.CSSProperties,
    },
    {
      type: 'filled' as const,
      label: 'Filled',
      description: 'Primary fill with On-primary text colors.',
      sampleStyle: {
        borderColor: 'transparent',
        color: widgetTheme.textOnPrimary,
        backgroundColor: widgetTheme.primary,
        borderRadius: `${widgetButtonStyle.radius}px`,
      } as React.CSSProperties,
    },
  ]

  const textOnPrimaryContrastRatio = getContrastRatio(widgetTheme.primary, widgetTheme.textOnPrimary)
  const normalizedTextOnPrimary = normalizeHexColor(widgetTheme.textOnPrimary)
  const suggestedTextOnPrimary = findNearestCompliantTextColor(widgetTheme.primary, widgetTheme.textOnPrimary, WCAG_AA_TEXT_CONTRAST)
  const isTextOnPrimaryContrastPassing = textOnPrimaryContrastRatio !== null && textOnPrimaryContrastRatio >= WCAG_AA_TEXT_CONTRAST
  const textOnPrimaryMutedContrastRatio = getContrastRatio(widgetTheme.primary, widgetTheme.textOnPrimaryMuted)
  const normalizedTextOnPrimaryMuted = normalizeHexColor(widgetTheme.textOnPrimaryMuted)
  const suggestedTextOnPrimaryMuted = findNearestCompliantTextColor(widgetTheme.primary, widgetTheme.textOnPrimaryMuted, WCAG_AA_TEXT_CONTRAST)
  const isTextOnPrimaryMutedContrastPassing = textOnPrimaryMutedContrastRatio !== null && textOnPrimaryMutedContrastRatio >= WCAG_AA_TEXT_CONTRAST
  const textPrimaryOnSurfaceContrastRatio = getContrastRatio(effectiveWidgetSurfaceColor, widgetTheme.textPrimary)
  const textMutedOnSurfaceContrastRatio = getContrastRatio(effectiveWidgetSurfaceColor, widgetTheme.textMuted)
  const textPrimaryOnTonalContrastRatio = getContrastRatio(widgetOptionButtonTonalBgSolid, widgetTheme.textPrimary)
  const textMutedOnTonalContrastRatio = getContrastRatio(widgetOptionButtonTonalBgSolid, widgetTheme.textMuted)
  const textPrimaryOnInputFilledSurfaceContrastRatio = getContrastRatio(widgetInputFilledBg, widgetTheme.textPrimary)
  const textMutedOnInputFilledSurfaceContrastRatio = getContrastRatio(widgetInputFilledBg, widgetTheme.textMuted)
  const normalizedTextPrimary = normalizeHexColor(widgetTheme.textPrimary)
  const normalizedTextMuted = normalizeHexColor(widgetTheme.textMuted)
  const suggestedTextPrimaryOnSurface = findNearestCompliantTextColor(effectiveWidgetSurfaceColor, widgetTheme.textPrimary, WCAG_AA_TEXT_CONTRAST)
  const suggestedTextMutedOnSurface = findNearestCompliantTextColor(effectiveWidgetSurfaceColor, widgetTheme.textMuted, WCAG_AA_TEXT_CONTRAST)
  const suggestedTextPrimaryOnTonal = findNearestCompliantTextColor(widgetOptionButtonTonalBgSolid, widgetTheme.textPrimary, WCAG_AA_TEXT_CONTRAST)
  const suggestedTextMutedOnTonal = findNearestCompliantTextColor(widgetOptionButtonTonalBgSolid, widgetTheme.textMuted, WCAG_AA_TEXT_CONTRAST)
  const suggestedTextPrimaryOnInputFilledSurface = findNearestCompliantTextColor(widgetInputFilledBg, widgetTheme.textPrimary, WCAG_AA_TEXT_CONTRAST)
  const suggestedTextMutedOnInputFilledSurface = findNearestCompliantTextColor(widgetInputFilledBg, widgetTheme.textMuted, WCAG_AA_TEXT_CONTRAST)
  const normalizedInputFilledSurface = normalizeHexColor(widgetTheme.inputFilledSurface)
  const normalizedDefaultInputFilledSurface = normalizeHexColor(derivedInputFilledSurfaceDefault)
  const isInputFilledSurfaceDefault = normalizedInputFilledSurface !== null && normalizedDefaultInputFilledSurface !== null
    ? normalizedInputFilledSurface === normalizedDefaultInputFilledSurface
    : widgetTheme.inputFilledSurface.trim().toLowerCase() === derivedInputFilledSurfaceDefault.trim().toLowerCase()
  const isTextPrimaryOnSurfacePassing = textPrimaryOnSurfaceContrastRatio !== null && textPrimaryOnSurfaceContrastRatio >= WCAG_AA_TEXT_CONTRAST
  const isTextMutedOnSurfacePassing = textMutedOnSurfaceContrastRatio !== null && textMutedOnSurfaceContrastRatio >= WCAG_AA_TEXT_CONTRAST
  const isTextPrimaryOnTonalPassing = textPrimaryOnTonalContrastRatio !== null
    && textPrimaryOnTonalContrastRatio >= WCAG_AA_TEXT_CONTRAST
  const isTextMutedOnTonalPassing = textMutedOnTonalContrastRatio !== null
    && textMutedOnTonalContrastRatio >= WCAG_AA_TEXT_CONTRAST
  const isTextPrimaryOnInputFilledSurfacePassing = textPrimaryOnInputFilledSurfaceContrastRatio !== null
    && textPrimaryOnInputFilledSurfaceContrastRatio >= WCAG_AA_TEXT_CONTRAST
  const isTextMutedOnInputFilledSurfacePassing = textMutedOnInputFilledSurfaceContrastRatio !== null
    && textMutedOnInputFilledSurfaceContrastRatio >= WCAG_AA_TEXT_CONTRAST
  const areSurfaceTextColorsPassing = isTextPrimaryOnSurfacePassing && isTextMutedOnSurfacePassing
  const areTonalTextColorsPassing = isTextPrimaryOnTonalPassing && isTextMutedOnTonalPassing
  const areInputFilledSurfaceTextColorsPassing = isTextPrimaryOnInputFilledSurfacePassing && isTextMutedOnInputFilledSurfacePassing
  const shouldCheckTonalTextColors = widgetButtonStyle.type === 'tonal'

  const themeControls = [
    {
      label: 'Primary color',
      token: 'primary' as const,
      description: 'Used for primary buttons, badges and key accents.',
    },
    {
      label: 'Surface color',
      token: 'surface' as const,
      description: 'Main background color of the widget card.',
    },
    {
      label: 'Surface border color',
      token: 'border' as const,
      description: 'Used for the widget surface outline, dividers and separators.',
    },
    {
      label: 'Button outline border',
      token: 'buttonOutlineBorder' as const,
      description: 'Border color used specifically for Outline-style buttons. Independent from the general Border color.',
    },
    {
      label: 'Text primary',
      token: 'textPrimary' as const,
      description: 'Main text color for titles and primary content.',
    },
    {
      label: 'Text muted',
      token: 'textMuted' as const,
      description: 'Secondary text color for supporting copy.',
    },
    {
      label: 'On primary text',
      token: 'textOnPrimary' as const,
      description: 'Text color shown on top of primary elements.',
    },
    {
      label: 'On primary text muted',
      token: 'textOnPrimaryMuted' as const,
      description: 'Secondary text color shown on top of primary elements.',
    },
  ]

  const colorManagementGroups: Array<{
    id: string
    title: string
    description: string
    tokens: Array<(typeof themeControls)[number]['token']>
    hasWarning: boolean
  }> = [
    {
      id: 'primary-action',
      title: 'Primary color',
      description: 'Control how your key actions and highlight labels look.',
      tokens: ['primary', 'textOnPrimary', 'textOnPrimaryMuted'],
      hasWarning: !isTextOnPrimaryContrastPassing || !isTextOnPrimaryMutedContrastPassing,
    },
    {
      id: 'surface-readability',
      title: 'Surface and Text Readability',
      description: 'Set your card background and make sure text stays easy to read.',
      tokens: ['surface', 'textPrimary', 'textMuted'],
      hasWarning: !areSurfaceTextColorsPassing || (shouldCheckTonalTextColors && !areTonalTextColorsPassing),
    },
    {
      id: 'structural',
      title: 'Borders and Dividers',
      description: 'Fine-tune separation lines and visual boundaries.',
      tokens: ['border', 'buttonOutlineBorder'],
      hasWarning: false,
    },
  ]
  const hasAppearanceAccessibilityWarning = colorManagementGroups.some((group) => group.id !== 'structural' && group.hasWarning)

  return (
    <div className="min-h-screen bg-white text-[#1f2430]">
      {isMerchantUser ? <MerchantTopHeader /> : null}
      <div className="grid w-full transition-[grid-template-columns] duration-200" style={{ gridTemplateColumns: layoutColumns, minHeight: isMerchantUser ? 'calc(100vh - 57px)' : '100vh' }}>
        {!isMerchantUser ? <Sidebar collapsed={isSidebarCollapsed} onToggleCollapsed={() => setIsSidebarCollapsed((prev) => !prev)} /> : null}

        <main className="flex flex-col">
          <div className="px-5 pt-4">
            {!isMerchantUser ? (
              <Breadcrumb className="mb-1">
                <BreadcrumbList>
                  <BreadcrumbItem>{rootLabel}</BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{entityName}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            ) : null}

            <h1 className="mb-3 text-[34px] font-semibold leading-none">{entityName}</h1>
          </div>

          <div className="sticky top-0 z-20 border-b border-[#e7eaf0] bg-white px-5 pb-3 pt-4">
            <div className="flex gap-6 overflow-x-auto text-sm text-[#6b7280]">
              {mainTabs.map((tab) => (
                <button
                  key={tab}
                  className={tab === 'Widget Customization' ? 'border-b-2 border-[#3465eb] pb-2 text-[#111827]' : 'pb-2'}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid flex-1" style={{ gridTemplateColumns: `minmax(0, 1fr) ${widgetPanelWidth}px` }}>
            <section className={`grid pb-[320px] ${isConfigurationCompact ? 'gap-8 grid-cols-1 px-8 py-5' : 'gap-16 grid-cols-[220px_minmax(0,1fr)] pr-16'}`}>
              <aside
                className={`${isConfigurationCompact ? 'self-start' : 'sticky self-start'} overflow-hidden bg-white p-0`}
                style={isConfigurationCompact ? undefined : { top: stickyPanelsTopOffset }}
              >
                <p className="px-4 pb-[var(--space-2)] pt-4 text-sm font-semibold text-[#334155]">Options</p>
                <SidebarNav className="gap-[var(--space-1)] px-4 py-[var(--space-2)]">
                  {widgetDesignSections.map((item) => (
                    <SidebarNavButton key={item.id} active={activeWidgetSectionId === item.id} asChild>
                      <a
                        href={`#${item.id}`}
                        onClick={(event) => {
                          event.preventDefault()
                          scrollToWidgetSection(item.id)
                        }}
                      >
                        {item.label}
                      </a>
                    </SidebarNavButton>
                  ))}
                </SidebarNav>
              </aside>

              <div className={`min-w-0 space-y-8 py-5 text-sm ${isConfigurationCompact ? 'max-w-none' : 'w-full'}`}>
                <section id="widget-your-brand" ref={registerWidgetSectionRef('widget-your-brand')} className="space-y-6 scroll-mt-6 pb-8">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-[var(--sidebar-text-primary)]">Your Brand</p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 px-3 text-sm"
                        onClick={resetYourBrandSection}
                        disabled={
                          (normalizeHexColor(widgetTheme.primary) ?? widgetTheme.primary.trim().toLowerCase())
                          === (normalizeHexColor(defaultWidgetTheme.primary) ?? defaultWidgetTheme.primary.trim().toLowerCase())
                          && widgetTypography === defaultWidgetTypographyId
                          && widgetButtonStyle.type === defaultWidgetButtonStyle.type
                          && widgetButtonStyle.radius === defaultWidgetButtonStyle.radius
                          && widgetDensityPreset === defaultWidgetDensityPreset
                        }
                      >
                        Reset section
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--sidebar-text-secondary)]">Quickly define the widget brand identity: color and font, button style, and spacing density.</p>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sidebar-text-secondary)]">Identity</p>
                      <div className="divide-y divide-[var(--sidebar-border-color)]">
                        <div className={`grid gap-3 py-4 ${isConfigurationCompact ? 'grid-cols-1' : 'md:grid-cols-[minmax(0,1fr)_220px] md:items-start'}`}>
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <Palette className="h-4 w-4 text-[var(--sidebar-text-secondary)]" strokeWidth={2} aria-hidden="true" />
                              <p className="font-medium text-[var(--sidebar-text-primary)]">Brand / Primary color</p>
                            </div>
                            {showFieldDescriptions ? (
                              <p className="text-sm text-[var(--sidebar-text-secondary)]">Used for primary actions, active highlights, and key brand accents in preview.</p>
                            ) : null}
                          </div>

                          <div className="relative">
                            <input
                              id="widget-color-picker-your-brand-primary"
                              type="color"
                              value={normalizeHexColor(widgetTheme.primary) ?? defaultWidgetTheme.primary}
                              onChange={(event) => handleWidgetThemeChange('primary', event.target.value)}
                              className="absolute h-0 w-0 opacity-0"
                              aria-label="Widget primary color picker"
                              tabIndex={-1}
                            />
                            <label
                              htmlFor="widget-color-picker-your-brand-primary"
                              className="absolute left-2 top-1/2 z-10 block h-5 w-5 -translate-y-1/2 rounded border border-[var(--sidebar-border-color-strong)]"
                              style={{ backgroundColor: widgetTheme.primary }}
                              title="Open primary color picker"
                            />
                            <Input
                              value={widgetThemeDraft.primary}
                              onChange={(event) => handleWidgetThemeHexInputChange('primary', event.target.value)}
                              onBlur={() => handleWidgetThemeHexInputBlur('primary')}
                              placeholder="#000000"
                              spellCheck={false}
                              aria-label="Widget primary color hex value"
                              className="h-9 pl-10"
                            />
                          </div>
                        </div>

                        <div className="grid gap-3 py-4 grid-cols-1">
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <TypeIcon className="h-4 w-4 text-[var(--sidebar-text-secondary)]" strokeWidth={2} aria-hidden="true" />
                              <p className="font-medium text-[var(--sidebar-text-primary)]">Font</p>
                            </div>
                            {showFieldDescriptions ? (
                              <p className="text-sm text-[var(--sidebar-text-secondary)]">Main font applied to the whole widget.</p>
                            ) : null}
                          </div>

                          <div className="w-full">
                            <WidgetFontDropdown value={widgetTypography} onChange={setWidgetTypography} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sidebar-text-secondary)]">Buttons</p>
                      <div className="divide-y divide-[var(--sidebar-border-color)]">
                        <div className="grid gap-3 py-4 grid-cols-1">
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <MousePointerClick className="h-4 w-4 text-[var(--sidebar-text-secondary)]" strokeWidth={2} aria-hidden="true" />
                              <p className="font-medium text-[var(--sidebar-text-primary)]">Button style</p>
                            </div>
                            {showFieldDescriptions ? (
                              <p className="text-sm text-[var(--sidebar-text-secondary)]">Manage button structure for the whole widget. Action buttons keep their current visual hierarchy.</p>
                            ) : null}
                          </div>

                          <fieldset className="grid gap-3 min-w-0 w-full">
                            <legend className="sr-only">Button type</legend>
                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                              {buttonStyleSectionOptions.map((option) => {
                                const isSelected = widgetButtonStyle.type === option.type

                                return (
                                  <label key={option.type} className="block cursor-pointer">
                                    <input
                                      type="radio"
                                      name="widget-button-type"
                                      value={option.type}
                                      checked={isSelected}
                                      onChange={(event) => handleWidgetButtonTypeChange(event.target.value)}
                                      className="peer sr-only"
                                    />
                                    <span className={`flex min-w-[220px] flex-col gap-3 rounded-xl border p-3 transition-colors hover:border-[var(--sidebar-border-color-strong)] ${
                                      isSelected
                                        ? 'border-[var(--sidebar-border-color-strong)] bg-[var(--sidebar-bg)]'
                                        : 'border-[var(--sidebar-border-color)] bg-[var(--sidebar-menu-bg)]'
                                    }`}>
                                      <span className="space-y-1">
                                        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--sidebar-text-primary)]">
                                          <span className={`flex h-4 w-4 items-center justify-center rounded-full border bg-white ${
                                            isSelected
                                              ? 'border-[var(--sidebar-text-primary)]'
                                              : 'border-[var(--sidebar-border-color-strong)]'
                                          }`}>
                                            <span className={`h-2 w-2 rounded-full bg-[var(--sidebar-text-primary)] transition-opacity ${
                                              isSelected ? 'opacity-100' : 'opacity-0'
                                            }`} />
                                          </span>
                                          <span>{option.label}</span>
                                        </span>
                                        <span className="block min-h-10 text-sm leading-5 text-[var(--sidebar-text-secondary)]">
                                          {option.description}
                                        </span>
                                      </span>
                                      <span
                                        className="inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold"
                                        style={option.sampleStyle}
                                      >
                                        Sample text
                                      </span>
                                    </span>
                                  </label>
                                )
                              })}
                            </div>
                          </fieldset>
                        </div>

                        <div className={`grid gap-3 py-4 ${isConfigurationCompact ? 'grid-cols-1' : 'md:grid-cols-[minmax(0,1fr)_220px] md:items-start'}`}>
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <Scan className="h-4 w-4 text-[var(--sidebar-text-secondary)]" strokeWidth={2} aria-hidden="true" />
                              <p className="font-medium text-[var(--sidebar-text-primary)]">Button border radius</p>
                            </div>
                            {showFieldDescriptions ? (
                              <p className="text-sm text-[var(--sidebar-text-secondary)]">Set corner roundness for widget buttons (0 to 64px).</p>
                            ) : null}
                          </div>

                          <div className="space-y-3">
                            <Input
                              type="number"
                              min={0}
                              max={64}
                              step={1}
                              value={widgetButtonStyle.radius}
                              onChange={(event) => handleWidgetButtonRadiusChange(Number(event.target.value))}
                              aria-label="Widget button radius in pixels"
                              className="h-9"
                            />
                            <input
                              type="range"
                              min={0}
                              max={64}
                              step={1}
                              value={widgetButtonStyle.radius}
                              onChange={(event) => handleWidgetButtonRadiusChange(Number(event.target.value))}
                              aria-label="Widget button radius slider"
                              className="h-2 w-full cursor-pointer accent-[var(--widget-color-primary)]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sidebar-text-secondary)]">Layout</p>
                      <div className="divide-y divide-[var(--sidebar-border-color)]">
                        <div className="grid gap-3 py-4 grid-cols-1">
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <Rows3 className="h-4 w-4 text-[var(--sidebar-text-secondary)]" strokeWidth={2} aria-hidden="true" />
                              <p className="font-medium text-[var(--sidebar-text-primary)]">Density</p>
                            </div>
                            {showFieldDescriptions ? (
                              <p className="text-sm text-[var(--sidebar-text-secondary)]">Presets for widget spacing: Compact, Comfortable, Spacius.</p>
                            ) : null}
                          </div>

                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              {widgetDensityPresetOptions.map((option) => {
                                const isActive = widgetDensityPreset === option.id

                                return (
                                  <Button
                                    key={option.id}
                                    type="button"
                                    variant="outline"
                                    aria-pressed={isActive}
                                    className={`h-9 px-4 text-sm ${isActive ? 'border-[var(--widget-color-primary)] bg-[var(--sidebar-menu-bg)] text-[var(--sidebar-text-primary)]' : ''}`}
                                    onClick={() => setWidgetDensityPreset(option.id)}
                                  >
                                    {option.label}
                                  </Button>
                                )
                              })}
                            </div>
                            <p className="text-xs text-[var(--sidebar-text-secondary)]">
                              Horizontal padding: {activeWidgetDensityPreset.horizontalPadding}px. Vertical spacing: {activeWidgetDensityPreset.verticalSpacing}px.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="widget-advanced" ref={registerWidgetSectionRef('widget-advanced')} className="space-y-8 scroll-mt-6 border-t-2 border-[var(--sidebar-border-color-strong)] pt-8 pb-8">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-[var(--sidebar-text-primary)]">Advanced</p>
                    <p className="text-sm text-[var(--sidebar-text-secondary)]">Fine-tune appearance, typography, and input styling.</p>
                  </div>

                <section id="widget-theme" className="space-y-6 scroll-mt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold text-[var(--sidebar-text-primary)]">Appearance</p>
                        <span
                          className="inline-flex items-center rounded-full border px-2 py-0.5 text-sm font-semibold"
                          style={
                            hasAppearanceAccessibilityWarning
                              ? {
                                  borderColor: 'var(--widget-status-warning-border)',
                                  backgroundColor: 'var(--widget-status-warning-bg)',
                                  color: 'var(--widget-status-warning-text)',
                                }
                              : {
                                  borderColor: 'var(--widget-color-border)',
                                  backgroundColor: 'var(--sidebar-menu-bg)',
                                  color: 'var(--sidebar-text-secondary)',
                                }
                          }
                        >
                          {hasAppearanceAccessibilityWarning ? 'Needs attention' : 'No Accessibility issues'}
                        </span>
                      </div>
                      <Button type="button" variant="outline" className="h-8 px-3 text-sm" onClick={resetWidgetTheme}>
                        Reset section
                      </Button>
                    </div>
                    <p className="text-sm text-[var(--sidebar-text-secondary)]">
                      Update widget colors in real time. Use contrast hints to keep text accessible.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {colorManagementGroups.map((group, index) => (
                          <section key={group.id} className={`${index === 0 ? '' : 'border-t border-[var(--sidebar-border-color)] pt-6'} space-y-2`}>
                          {group.id !== 'primary-action' ? (
                            <>
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold text-[var(--sidebar-text-primary)]">{group.title}</p>
                              </div>
                              <p className="text-sm text-[var(--sidebar-text-secondary)]">{group.description}</p>
                            </>
                          ) : null}

                          <div className="divide-y divide-[var(--sidebar-border-color)]">
                            {group.id === 'surface-readability' ? (
                              <div className={`grid gap-3 py-3 ${isConfigurationCompact ? 'grid-cols-1' : 'md:grid-cols-[minmax(0,1fr)_220px] md:items-start'}`}>
                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Scan className="h-4 w-4 text-[var(--sidebar-text-secondary)]" strokeWidth={2} aria-hidden="true" />
                                    <p className="font-medium text-[var(--sidebar-text-primary)]">Surface border radius</p>
                                  </div>
                                  {showFieldDescriptions ? (
                                    <p className="text-sm text-[var(--sidebar-text-secondary)]">Set corner roundness for the whole widget surface (0 to 32px).</p>
                                  ) : null}
                                </div>

                                <div className="space-y-3">
                                  <Input
                                    type="number"
                                    min={0}
                                    max={32}
                                    step={1}
                                    value={widgetSurfaceStyle.radius}
                                    onChange={(event) => handleWidgetSurfaceRadiusChange(Number(event.target.value))}
                                    aria-label="Widget surface radius in pixels"
                                    className="h-9"
                                  />
                                  <input
                                    type="range"
                                    min={0}
                                    max={32}
                                    step={1}
                                    value={widgetSurfaceStyle.radius}
                                    onChange={(event) => handleWidgetSurfaceRadiusChange(Number(event.target.value))}
                                    aria-label="Widget surface radius slider"
                                    className="h-2 w-full cursor-pointer accent-[var(--widget-color-primary)]"
                                  />
                                </div>
                              </div>
                            ) : null}

                            {group.tokens.map((token) => {
                              const control = themeControls.find((item) => item.token === token)
                              if (!control) {
                                return null
                              }
                              const normalizedCurrentValue = normalizeHexColor(widgetTheme[control.token])
                              const normalizedDefaultValue = normalizeHexColor(defaultWidgetTheme[control.token])
                              const isDefaultColorValue = normalizedCurrentValue !== null && normalizedDefaultValue !== null
                                ? normalizedCurrentValue === normalizedDefaultValue
                                : widgetTheme[control.token].trim().toLowerCase() === defaultWidgetTheme[control.token].trim().toLowerCase()

                              let warningContent: React.ReactNode = null
                              if (control.token === 'surface' && !areSurfaceTextColorsPassing) {
                                warningContent = (
                                  <>
                                    <p className="font-semibold">Text contrast check ({WCAG_AA_TEXT_CONTRAST}:1 required).</p>
                                    <p className="mt-1 flex items-center gap-2">
                                      {isTextPrimaryOnSurfacePassing ? (
                                        <CircleCheck className="h-4 w-4 shrink-0" style={{ color: 'var(--sidebar-text-secondary)' }} />
                                      ) : (
                                        <CircleX className="h-4 w-4 shrink-0" style={{ color: 'var(--widget-status-warning-text)' }} />
                                      )}
                                      <span>
                                        Text Primary: {textPrimaryOnSurfaceContrastRatio !== null ? `${textPrimaryOnSurfaceContrastRatio.toFixed(2)}:1` : 'n/a'}
                                        {!isTextPrimaryOnSurfacePassing ? <span className="font-semibold"> - does not meet accessibility.</span> : ''}
                                      </span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      {isTextMutedOnSurfacePassing ? (
                                        <CircleCheck className="h-4 w-4 shrink-0" style={{ color: 'var(--sidebar-text-secondary)' }} />
                                      ) : (
                                        <CircleX className="h-4 w-4 shrink-0" style={{ color: 'var(--widget-status-warning-text)' }} />
                                      )}
                                      <span>
                                        Text Muted: {textMutedOnSurfaceContrastRatio !== null ? `${textMutedOnSurfaceContrastRatio.toFixed(2)}:1` : 'n/a'}
                                        {!isTextMutedOnSurfacePassing ? <span className="font-semibold"> - does not meet accessibility.</span> : ''}
                                      </span>
                                    </p>
                                    {widgetSurfaceMode === 'border-only' ? <p className="mt-1">In White mode, checks use a white card background.</p> : null}
                                  </>
                                )
                              }

                              if (control.token === 'textPrimary' && (!isTextPrimaryOnSurfacePassing || (shouldCheckTonalTextColors && !isTextPrimaryOnTonalPassing))) {
                                warningContent = (
                                  <>
                                    <p>
                                      Surface ratio: {textPrimaryOnSurfaceContrastRatio !== null ? `${textPrimaryOnSurfaceContrastRatio.toFixed(2)}:1` : 'n/a'} (required {WCAG_AA_TEXT_CONTRAST}:1)
                                    </p>
                                    {shouldCheckTonalTextColors ? (
                                      <p className="mt-1">
                                        Tonal button ratio: {textPrimaryOnTonalContrastRatio !== null ? `${textPrimaryOnTonalContrastRatio.toFixed(2)}:1` : 'n/a'} (required {WCAG_AA_TEXT_CONTRAST}:1)
                                      </p>
                                    ) : null}
                                    <p className="mt-1 font-semibold">This color does not meet WCAG AA in one or more UI contexts.</p>
                                    {!isTextPrimaryOnSurfacePassing && suggestedTextPrimaryOnSurface && suggestedTextPrimaryOnSurface !== normalizedTextPrimary ? (
                                      <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span>Try this accessible value: {suggestedTextPrimaryOnSurface}</span>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          className="h-8 px-3 text-sm"
                                          onClick={() => handleWidgetThemeChange('textPrimary', suggestedTextPrimaryOnSurface)}
                                        >
                                          Apply
                                        </Button>
                                      </div>
                                    ) : null}
                                    {shouldCheckTonalTextColors && !isTextPrimaryOnTonalPassing && suggestedTextPrimaryOnTonal ? (
                                      <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span>Suggested Text Primary for Tonal buttons: {suggestedTextPrimaryOnTonal}</span>
                                        {suggestedTextPrimaryOnTonal !== normalizedTextPrimary ? (
                                          <Button
                                            type="button"
                                            variant="outline"
                                            className="h-8 px-3 text-sm"
                                            onClick={() => handleWidgetThemeChange('textPrimary', suggestedTextPrimaryOnTonal)}
                                          >
                                            Apply
                                          </Button>
                                        ) : null}
                                      </div>
                                    ) : null}
                                  </>
                                )
                              }

                              if (control.token === 'textMuted' && (!isTextMutedOnSurfacePassing || (shouldCheckTonalTextColors && !isTextMutedOnTonalPassing))) {
                                warningContent = (
                                  <>
                                    <p>
                                      Surface ratio: {textMutedOnSurfaceContrastRatio !== null ? `${textMutedOnSurfaceContrastRatio.toFixed(2)}:1` : 'n/a'} (required {WCAG_AA_TEXT_CONTRAST}:1)
                                    </p>
                                    {shouldCheckTonalTextColors ? (
                                      <p className="mt-1">
                                        Tonal button ratio: {textMutedOnTonalContrastRatio !== null ? `${textMutedOnTonalContrastRatio.toFixed(2)}:1` : 'n/a'} (required {WCAG_AA_TEXT_CONTRAST}:1)
                                      </p>
                                    ) : null}
                                    <p className="mt-1 font-semibold">This color does not meet WCAG AA in one or more UI contexts.</p>
                                    {!isTextMutedOnSurfacePassing && suggestedTextMutedOnSurface && suggestedTextMutedOnSurface !== normalizedTextMuted ? (
                                      <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span>Try this accessible value: {suggestedTextMutedOnSurface}</span>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          className="h-8 px-3 text-sm"
                                          onClick={() => handleWidgetThemeChange('textMuted', suggestedTextMutedOnSurface)}
                                        >
                                          Apply
                                        </Button>
                                      </div>
                                    ) : null}
                                    {shouldCheckTonalTextColors && !isTextMutedOnTonalPassing && suggestedTextMutedOnTonal ? (
                                      <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span>Suggested Text Muted for Tonal buttons: {suggestedTextMutedOnTonal}</span>
                                        {suggestedTextMutedOnTonal !== normalizedTextMuted ? (
                                          <Button
                                            type="button"
                                            variant="outline"
                                            className="h-8 px-3 text-sm"
                                            onClick={() => handleWidgetThemeChange('textMuted', suggestedTextMutedOnTonal)}
                                          >
                                            Apply
                                          </Button>
                                        ) : null}
                                      </div>
                                    ) : null}
                                  </>
                                )
                              }

                              if (control.token === 'textOnPrimary' && !isTextOnPrimaryContrastPassing) {
                                warningContent = (
                                  <>
                                    <p>
                                      Contrast ratio: {textOnPrimaryContrastRatio !== null ? `${textOnPrimaryContrastRatio.toFixed(2)}:1` : 'n/a'} (required {WCAG_AA_TEXT_CONTRAST}:1)
                                    </p>
                                    <p className="mt-1 font-semibold">This color does not meet WCAG AA on the primary color.</p>
                                    {!isTextOnPrimaryContrastPassing && suggestedTextOnPrimary && suggestedTextOnPrimary !== normalizedTextOnPrimary ? (
                                      <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span>Try this accessible value: {suggestedTextOnPrimary}</span>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          className="h-8 px-3 text-sm"
                                          onClick={() => handleWidgetThemeChange('textOnPrimary', suggestedTextOnPrimary)}
                                        >
                                          Apply
                                        </Button>
                                      </div>
                                    ) : null}
                                    {!isTextOnPrimaryContrastPassing && textOnPrimaryContrastRatio === null ? (
                                      <p className="mt-1 font-semibold">Enter a valid hex value to run the contrast check.</p>
                                    ) : null}
                                  </>
                                )
                              }

                              if (control.token === 'textOnPrimaryMuted' && !isTextOnPrimaryMutedContrastPassing) {
                                warningContent = (
                                  <>
                                    <p>
                                      Contrast ratio: {textOnPrimaryMutedContrastRatio !== null ? `${textOnPrimaryMutedContrastRatio.toFixed(2)}:1` : 'n/a'} (required {WCAG_AA_TEXT_CONTRAST}:1)
                                    </p>
                                    <p className="mt-1 font-semibold">This color does not meet WCAG AA on the primary color.</p>
                                    {!isTextOnPrimaryMutedContrastPassing && suggestedTextOnPrimaryMuted && suggestedTextOnPrimaryMuted !== normalizedTextOnPrimaryMuted ? (
                                      <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span>Try this accessible value: {suggestedTextOnPrimaryMuted}</span>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          className="h-8 px-3 text-sm"
                                          onClick={() => handleWidgetThemeChange('textOnPrimaryMuted', suggestedTextOnPrimaryMuted)}
                                        >
                                          Apply
                                        </Button>
                                      </div>
                                    ) : null}
                                    {!isTextOnPrimaryMutedContrastPassing && textOnPrimaryMutedContrastRatio === null ? (
                                      <p className="mt-1 font-semibold">Enter a valid hex value to run the contrast check.</p>
                                    ) : null}
                                  </>
                                )
                              }

                              return (
                                <div
                                  key={control.token}
                                  className={`grid gap-3 py-3 ${isConfigurationCompact ? 'grid-cols-1' : 'md:grid-cols-[minmax(0,1fr)_220px] md:items-start'} ${control.token === 'surface' && widgetSurfaceMode === 'border-only' ? 'opacity-60' : ''}`}
                                >
                                  <div className="min-w-0 space-y-1">
                                    <div className="flex items-start justify-between gap-3">
                                      <p className="font-medium text-[var(--sidebar-text-primary)]">{control.label}</p>
                                      <div className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border border-[var(--sidebar-border-color-strong)] ${isConfigurationCompact ? 'block' : 'md:hidden'}`} style={{ backgroundColor: widgetTheme[control.token] }} />
                                    </div>
                                    <p className="text-sm text-[var(--sidebar-text-secondary)]">{control.description}</p>
                                    {control.token === 'surface' && widgetSurfaceMode === 'border-only' ? (
                                      <p className="text-sm text-[var(--sidebar-text-disabled)]">Ignored in White mode.</p>
                                    ) : null}
                                  </div>

                                  <div className="relative">
                                    <input
                                      id={`widget-color-picker-${control.token}`}
                                      type="color"
                                      value={normalizeHexColor(widgetTheme[control.token]) ?? defaultWidgetTheme[control.token]}
                                      onChange={(event) => handleWidgetThemeChange(control.token, event.target.value)}
                                      className="absolute h-0 w-0 opacity-0"
                                      aria-label={`${control.label} picker`}
                                      disabled={control.token === 'surface' && widgetSurfaceMode === 'border-only'}
                                      tabIndex={-1}
                                    />
                                    <label
                                      htmlFor={`widget-color-picker-${control.token}`}
                                      className="absolute left-2 top-1/2 z-10 block h-5 w-5 -translate-y-1/2 rounded border border-[var(--sidebar-border-color-strong)]"
                                      style={{ backgroundColor: widgetTheme[control.token] }}
                                      title={`Open ${control.label.toLowerCase()} picker`}
                                    />
                                    <Input
                                      value={widgetThemeDraft[control.token]}
                                      onChange={(event) => handleWidgetThemeHexInputChange(control.token, event.target.value)}
                                      onBlur={() => handleWidgetThemeHexInputBlur(control.token)}
                                      placeholder="#000000"
                                      spellCheck={false}
                                      aria-label={`${control.label} hex value`}
                                      className="h-9 pl-10 pr-10"
                                      disabled={control.token === 'surface' && widgetSurfaceMode === 'border-only'}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      className="absolute right-1 top-1/2 z-20 h-7 w-7 -translate-y-1/2 p-0 text-[var(--sidebar-text-secondary)] hover:bg-[var(--sidebar-item-hover-bg)] hover:text-[var(--sidebar-text-primary)]"
                                      title={`Reset ${control.label} to default (${defaultWidgetTheme[control.token]}).`}
                                      aria-label={`Reset ${control.label} to default`}
                                      onClick={() => resetWidgetThemeToken(control.token)}
                                      disabled={(control.token === 'surface' && widgetSurfaceMode === 'border-only') || isDefaultColorValue}
                                    >
                                      <X className="h-4 w-4" strokeWidth={2.5} />
                                    </Button>
                                  </div>

                                  {warningContent ? (
                                    <div
                                      className="md:col-span-2 w-full rounded-lg border px-4 py-3 text-sm"
                                      style={{
                                        borderColor: 'var(--widget-status-warning-border)',
                                        backgroundColor: 'var(--widget-status-warning-bg)',
                                        color: 'var(--widget-status-warning-text)',
                                      }}
                                    >
                                      {warningContent}
                                    </div>
                                  ) : null}
                                </div>
                              )
                            })}
                          </div>
                      </section>
                    ))}
                  </div>
                </section>

                <section id="widget-input-style" className="space-y-4 border-t border-[var(--sidebar-border-color)] pt-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-[var(--sidebar-text-primary)]">Input style</p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 px-3 text-sm"
                        onClick={resetWidgetInputStyleSection}
                        disabled={widgetInputStyle.type === defaultWidgetInputStyle.type && widgetInputStyle.radius === defaultWidgetInputStyle.radius}
                      >
                        Reset section
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--sidebar-text-secondary)]">Manage input field structure for the widget form without duplicating colors from Appearance.</p>

                  <div className="divide-y divide-[var(--sidebar-border-color)]">
                    <div className="grid gap-3 py-3 grid-cols-1">
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <TextCursorInput className="h-4 w-4 text-[var(--sidebar-text-secondary)]" strokeWidth={2} aria-hidden="true" />
                          <p className="font-medium text-[var(--sidebar-text-primary)]">Input type</p>
                        </div>
                        {showFieldDescriptions ? (
                          <p className="text-sm text-[var(--sidebar-text-secondary)]">Switch input fields between Outline and Filled styles.</p>
                        ) : null}
                      </div>

                      <fieldset className="grid gap-3 min-w-0 w-full">
                        <legend className="sr-only">Input type</legend>
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              name="widget-input-type"
                              value="outline"
                              checked={widgetInputStyle.type === 'outline'}
                              onChange={(event) => handleWidgetInputTypeChange(event.target.value)}
                              className="peer sr-only"
                            />
                            <span className={`flex min-w-[220px] flex-col gap-3 rounded-xl border p-3 transition-colors hover:border-[var(--sidebar-border-color-strong)] ${
                              widgetInputStyle.type === 'outline'
                                ? 'border-[var(--sidebar-border-color-strong)] bg-[var(--sidebar-bg)]'
                                : 'border-[var(--sidebar-border-color)] bg-[var(--sidebar-menu-bg)]'
                            }`}>
                              <span className="space-y-1">
                                <span className="flex items-center gap-2 text-sm font-semibold text-[var(--sidebar-text-primary)]">
                                  <span className={`flex h-4 w-4 items-center justify-center rounded-full border bg-white ${
                                    widgetInputStyle.type === 'outline'
                                      ? 'border-[var(--sidebar-text-primary)]'
                                      : 'border-[var(--sidebar-border-color-strong)]'
                                  }`}>
                                    <span className={`h-2 w-2 rounded-full bg-[var(--sidebar-text-primary)] transition-opacity ${
                                      widgetInputStyle.type === 'outline' ? 'opacity-100' : 'opacity-0'
                                    }`} />
                                  </span>
                                  <span>Outline</span>
                                </span>
                                <span className="block min-h-10 text-sm leading-5 text-[var(--sidebar-text-secondary)]">
                                  Surface background with Border color outline.
                                </span>
                              </span>
                              <span
                                className="inline-flex h-9 items-center rounded-md border px-3 text-sm"
                                style={{
                                  borderColor: widgetTheme.border,
                                  color: widgetTheme.textMuted,
                                  backgroundColor: effectiveWidgetSurfaceColor,
                                  borderRadius: `${widgetInputStyle.radius}px`,
                                }}
                              >
                                Sample text
                              </span>
                            </span>
                          </label>

                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              name="widget-input-type"
                              value="filled"
                              checked={widgetInputStyle.type === 'filled'}
                              onChange={(event) => handleWidgetInputTypeChange(event.target.value)}
                              className="peer sr-only"
                            />
                            <span className={`flex min-w-[220px] flex-col gap-3 rounded-xl border p-3 transition-colors hover:border-[var(--sidebar-border-color-strong)] ${
                              widgetInputStyle.type === 'filled'
                                ? 'border-[var(--sidebar-border-color-strong)] bg-[var(--sidebar-bg)]'
                                : 'border-[var(--sidebar-border-color)] bg-[var(--sidebar-menu-bg)]'
                            }`}>
                              <span className="space-y-1">
                                <span className="flex items-center gap-2 text-sm font-semibold text-[var(--sidebar-text-primary)]">
                                  <span className={`flex h-4 w-4 items-center justify-center rounded-full border bg-white ${
                                    widgetInputStyle.type === 'filled'
                                      ? 'border-[var(--sidebar-text-primary)]'
                                      : 'border-[var(--sidebar-border-color-strong)]'
                                  }`}>
                                    <span className={`h-2 w-2 rounded-full bg-[var(--sidebar-text-primary)] transition-opacity ${
                                      widgetInputStyle.type === 'filled' ? 'opacity-100' : 'opacity-0'
                                    }`} />
                                  </span>
                                  <span>Filled</span>
                                </span>
                                <span className="block min-h-10 text-sm leading-5 text-[var(--sidebar-text-secondary)]">
                                  Uses dedicated Input filled surface color configured below.
                                </span>
                              </span>
                              <span
                                className="inline-flex h-9 items-center rounded-md border px-3 text-sm"
                                style={{
                                  borderColor: 'transparent',
                                  color: widgetTheme.textMuted,
                                  backgroundColor: widgetTheme.inputFilledSurface,
                                  borderRadius: `${widgetInputStyle.radius}px`,
                                }}
                              >
                                Sample text
                              </span>
                            </span>
                          </label>
                        </div>
                      </fieldset>
                    </div>

                    {widgetInputStyle.type === 'filled' ? (
                      <div className={`grid gap-3 py-3 ${isConfigurationCompact ? 'grid-cols-1' : 'md:grid-cols-[minmax(0,1fr)_220px] md:items-start'}`}>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Droplet className="h-4 w-4 text-[var(--sidebar-text-secondary)]" strokeWidth={2} aria-hidden="true" />
                              <p className="font-medium text-[var(--sidebar-text-primary)]">Input filled surface</p>
                            </div>
                            <div className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border border-[var(--sidebar-border-color-strong)] ${isConfigurationCompact ? 'block' : 'md:hidden'}`} style={{ backgroundColor: widgetTheme.inputFilledSurface }} />
                          </div>
                          {showFieldDescriptions ? (
                            <p className="text-sm text-[var(--sidebar-text-secondary)]">Background color used by inputs in Filled style.</p>
                          ) : null}
                        </div>

                        <div className="relative">
                          <input
                            id="widget-color-picker-inputFilledSurface"
                            type="color"
                            value={normalizedInputFilledSurface ?? derivedInputFilledSurfaceDefault}
                            onChange={(event) => handleWidgetThemeChange('inputFilledSurface', event.target.value)}
                            className="absolute h-0 w-0 opacity-0"
                            aria-label="Input filled surface picker"
                            tabIndex={-1}
                          />
                          <label
                            htmlFor="widget-color-picker-inputFilledSurface"
                            className="absolute left-2 top-1/2 z-10 block h-5 w-5 -translate-y-1/2 rounded border border-[var(--sidebar-border-color-strong)]"
                            style={{ backgroundColor: widgetTheme.inputFilledSurface }}
                            title="Open input filled surface picker"
                          />
                          <Input
                            value={widgetThemeDraft.inputFilledSurface}
                            onChange={(event) => handleWidgetThemeHexInputChange('inputFilledSurface', event.target.value)}
                            onBlur={() => handleWidgetThemeHexInputBlur('inputFilledSurface')}
                            placeholder="#000000"
                            spellCheck={false}
                            aria-label="Input filled surface hex value"
                            className="h-9 pl-10 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-1 top-1/2 z-20 h-7 w-7 -translate-y-1/2 p-0 text-[var(--sidebar-text-secondary)] hover:bg-[var(--sidebar-item-hover-bg)] hover:text-[var(--sidebar-text-primary)]"
                            title={`Reset Input filled surface to default (${derivedInputFilledSurfaceDefault}).`}
                            aria-label="Reset Input filled surface to default"
                            onClick={() => resetWidgetThemeToken('inputFilledSurface')}
                            disabled={isInputFilledSurfaceDefault}
                          >
                            <X className="h-4 w-4" strokeWidth={2.5} />
                          </Button>
                        </div>

                        {!areInputFilledSurfaceTextColorsPassing ? (
                          <div
                            className="md:col-span-2 w-full rounded-lg border px-4 py-3 text-sm"
                            style={{
                              borderColor: 'var(--widget-status-warning-border)',
                              backgroundColor: 'var(--widget-status-warning-bg)',
                              color: 'var(--widget-status-warning-text)',
                            }}
                          >
                            <p className="font-semibold">Filled input contrast check ({WCAG_AA_TEXT_CONTRAST}:1 required).</p>
                            <p className="mt-1 flex items-center gap-2">
                              {isTextPrimaryOnInputFilledSurfacePassing ? (
                                <CircleCheck className="h-4 w-4 shrink-0" style={{ color: 'var(--sidebar-text-secondary)' }} />
                              ) : (
                                <CircleX className="h-4 w-4 shrink-0" style={{ color: 'var(--widget-status-warning-text)' }} />
                              )}
                              <span>
                                Text Primary: {textPrimaryOnInputFilledSurfaceContrastRatio !== null ? `${textPrimaryOnInputFilledSurfaceContrastRatio.toFixed(2)}:1` : 'n/a'}
                                {!isTextPrimaryOnInputFilledSurfacePassing ? <span className="font-semibold"> - does not meet accessibility.</span> : ''}
                              </span>
                            </p>
                            {!isTextPrimaryOnInputFilledSurfacePassing && suggestedTextPrimaryOnInputFilledSurface ? (
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span>Suggested accessible Text Primary in Appearance: {suggestedTextPrimaryOnInputFilledSurface}</span>
                                {suggestedTextPrimaryOnInputFilledSurface !== normalizedTextPrimary ? (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-8 px-3 text-sm"
                                    onClick={() => handleWidgetThemeChange('textPrimary', suggestedTextPrimaryOnInputFilledSurface)}
                                  >
                                    Apply
                                  </Button>
                                ) : null}
                              </div>
                            ) : null}

                            <p className="mt-2 flex items-center gap-2">
                              {isTextMutedOnInputFilledSurfacePassing ? (
                                <CircleCheck className="h-4 w-4 shrink-0" style={{ color: 'var(--sidebar-text-secondary)' }} />
                              ) : (
                                <CircleX className="h-4 w-4 shrink-0" style={{ color: 'var(--widget-status-warning-text)' }} />
                              )}
                              <span>
                                Text Muted: {textMutedOnInputFilledSurfaceContrastRatio !== null ? `${textMutedOnInputFilledSurfaceContrastRatio.toFixed(2)}:1` : 'n/a'}
                                {!isTextMutedOnInputFilledSurfacePassing ? <span className="font-semibold"> - does not meet accessibility.</span> : ''}
                              </span>
                            </p>
                            {!isTextMutedOnInputFilledSurfacePassing && suggestedTextMutedOnInputFilledSurface ? (
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span>Suggested accessible Text Muted in Appearance: {suggestedTextMutedOnInputFilledSurface}</span>
                                {suggestedTextMutedOnInputFilledSurface !== normalizedTextMuted ? (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-8 px-3 text-sm"
                                    onClick={() => handleWidgetThemeChange('textMuted', suggestedTextMutedOnInputFilledSurface)}
                                  >
                                    Apply
                                  </Button>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className={`grid gap-3 py-3 ${isConfigurationCompact ? 'grid-cols-1' : 'md:grid-cols-[minmax(0,1fr)_220px] md:items-start'}`}>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <Scan className="h-4 w-4 text-[var(--sidebar-text-secondary)]" strokeWidth={2} aria-hidden="true" />
                          <p className="font-medium text-[var(--sidebar-text-primary)]">Border radius</p>
                        </div>
                        {showFieldDescriptions ? (
                          <p className="text-sm text-[var(--sidebar-text-secondary)]">Set corner roundness for widget inputs (0 to 16px).</p>
                        ) : null}
                      </div>

                      <div className="space-y-3">
                        <Input
                          type="number"
                          min={0}
                          max={16}
                          step={1}
                          value={widgetInputStyle.radius}
                          onChange={(event) => handleWidgetInputRadiusChange(Number(event.target.value))}
                          aria-label="Widget input radius in pixels"
                          className="h-9"
                        />
                        <input
                          type="range"
                          min={0}
                          max={16}
                          step={1}
                          value={widgetInputStyle.radius}
                          onChange={(event) => handleWidgetInputRadiusChange(Number(event.target.value))}
                          aria-label="Widget input radius slider"
                          className="h-2 w-full cursor-pointer accent-[var(--widget-color-primary)]"
                        />
                      </div>
                    </div>
                  </div>
                </section>
                </section>

                <section id="widget-elements-visibility" ref={registerWidgetSectionRef('widget-elements-visibility')} className="space-y-3 scroll-mt-6 border-t-2 border-[var(--sidebar-border-color-strong)] pt-8 pb-8">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-[var(--sidebar-text-primary)]">Elements visibility</p>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" className="h-8 px-3 text-sm" onClick={resetElementVisibilitySection}>
                        Reset section
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--sidebar-text-secondary)]">
                    Manage which payment options are visible in preview. At least one payment option must stay enabled.
                  </p>

                  <div className="divide-y divide-[var(--sidebar-border-color)]">
                    <div className="flex items-start justify-between gap-3 py-3">
                      <div className="min-w-0 space-y-1">
                        <p className="font-semibold text-[var(--sidebar-text-primary)]">Set up wallet</p>
                        <p className="text-sm text-[var(--sidebar-text-secondary)]">Controls visibility of the wallet quick-start payment option.</p>
                      </div>
                      <Switch
                        checked={elementVisibility.setUpWallet}
                        onCheckedChange={(checked) => togglePrimaryPaymentVisibility('setUpWallet', checked)}
                        aria-label="Toggle Set up wallet visibility"
                        disabled={elementVisibility.setUpWallet && primaryVisibleOptionsCount <= 1}
                      />
                    </div>

                    <div className="space-y-3 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <p className="font-semibold text-[var(--sidebar-text-primary)]">Pay by new card</p>
                          <p className="text-sm text-[var(--sidebar-text-secondary)]">Controls visibility of the option to open card form and enter new payment details.</p>
                        </div>
                        <Switch
                          checked={elementVisibility.payByNewCard}
                          onCheckedChange={(checked) => togglePrimaryPaymentVisibility('payByNewCard', checked)}
                          aria-label="Toggle Pay by new card visibility"
                          disabled={elementVisibility.payByNewCard && primaryVisibleOptionsCount <= 1}
                        />
                      </div>

                      <div className="ml-4 flex items-start justify-between gap-3 py-1">
                        <div className="min-w-0 space-y-1">
                          <p className="font-medium text-[var(--sidebar-text-primary)]">Saved cards visibility</p>
                          <p className="text-sm text-[var(--sidebar-text-secondary)]">Controls visibility of the saved card row above the new card form.</p>
                        </div>
                        <Switch
                          checked={elementVisibility.savedCards && elementVisibility.payByNewCard}
                          onCheckedChange={(checked) => setElementVisibility((prev) => ({ ...prev, savedCards: checked }))}
                          aria-label="Toggle saved cards visibility"
                          disabled={!elementVisibility.payByNewCard}
                        />
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-3 py-3">
                      <div className="min-w-0 space-y-1">
                        <p className="font-semibold text-[var(--sidebar-text-primary)]">Pay by other methods</p>
                        <p className="text-sm text-[var(--sidebar-text-secondary)]">Controls visibility of alternative methods such as Apple Pay, PayPal, and Google Pay.</p>
                      </div>
                      <Switch
                        checked={elementVisibility.payByOtherMethods}
                        onCheckedChange={(checked) => togglePrimaryPaymentVisibility('payByOtherMethods', checked)}
                        aria-label="Toggle Pay by other methods visibility"
                        disabled={elementVisibility.payByOtherMethods && primaryVisibleOptionsCount <= 1}
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3 py-3">
                      <div className="min-w-0 space-y-1">
                        <p className="font-semibold text-[var(--sidebar-text-primary)]">Pay by bank</p>
                        <p className="text-sm text-[var(--sidebar-text-secondary)]">Controls visibility of the dedicated bank payment option.</p>
                      </div>
                      <Switch
                        checked={elementVisibility.payByBank}
                        onCheckedChange={(checked) => togglePrimaryPaymentVisibility('payByBank', checked)}
                        aria-label="Toggle Pay by bank visibility"
                        disabled={elementVisibility.payByBank && primaryVisibleOptionsCount <= 1}
                      />
                    </div>
                  </div>

                  {primaryVisibleOptionsCount === 1 ? (
                    <div
                      className="rounded-lg border px-4 py-3 text-sm"
                      style={{
                        borderColor: 'var(--widget-status-warning-border)',
                        backgroundColor: 'var(--widget-status-warning-bg)',
                        color: 'var(--widget-status-warning-text)',
                      }}
                    >
                      At least one payment option must be enabled.
                    </div>
                  ) : null}
                </section>
              </div>
            </section>

            <section className="border-l border-[#e2e8f0] bg-white px-8 py-4" style={widgetPreviewPanelStyles}>
              <div
                className={`${isPreviewStickyEnabled ? 'sticky' : 'relative'} relative w-full`}
                style={{ top: isPreviewStickyEnabled ? stickyPreviewTopOffset : undefined }}
              >
                <button
                type="button"
                aria-label="Resize widget width"
                role="slider"
                aria-valuemin={widgetMinWidth}
                aria-valuemax={widgetMaxWidth}
                aria-valuenow={widgetWidth}
                aria-valuetext={`${widgetWidth}px`}
                aria-orientation="horizontal"
                onPointerDown={handleWidgetResizeStart}
                onKeyDown={handleWidgetResizeKeyDown}
                  className="absolute -left-10 top-1/2 z-10 -translate-y-1/2 cursor-col-resize rounded-full border bg-[var(--widget-resize-handle-bg)] shadow-sm transition-colors hover:bg-[var(--widget-resize-handle-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)]"
                style={{
                  width: 'var(--widget-resize-handle-width)',
                  height: 'var(--widget-resize-handle-height)',
                  borderColor: 'var(--widget-resize-handle-border)',
                  boxShadow: '0 0 0 2px var(--widget-resize-handle-bg), 0 1px 3px rgb(15 23 42 / 0.16)',
                }}
                >
                  <span className="sr-only">Drag to resize widget width</span>
                  <span aria-hidden className="mx-auto block h-6 w-[2px] rounded-full bg-[var(--widget-color-primary)]/50" />
                </button>

              <div className="ml-auto w-full">
              <Card
                className="widget-preview-instance relative ml-auto border-[var(--widget-color-border)] bg-[var(--widget-color-surface)] text-[var(--widget-text-primary)] shadow-none"
                style={{
                  ...widgetThemeStyles,
                  width: `${widgetWidth}px`,
                  borderRadius: 'var(--widget-radius-card)',
                  fontFamily: 'var(--widget-font-family)',
                  fontSize: 'var(--widget-font-size-body)',
                  fontWeight: 'var(--widget-font-weight-regular)',
                  lineHeight: 'var(--widget-line-height-normal)',
                }}
              >
                <CardHeader className="pb-7 pt-5 text-center">
                  <CardTitle
                    className="text-[var(--widget-text-primary)]"
                    style={{
                      fontFamily: 'var(--widget-heading-font-family)',
                      fontSize: 'calc(var(--widget-heading-font-size) - 2px)',
                      fontWeight: 'var(--widget-font-weight-regular)',
                      lineHeight: 'var(--widget-heading-line-height)',
                    }}
                  >
                    Select your preferred payment option
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className="flex flex-col"
                  style={{
                    gap: 'var(--widget-density-gap)',
                    paddingInline: 'var(--widget-density-padding-inline)',
                    paddingBottom: 'var(--widget-space-lg)',
                  }}
                >
                  {elementVisibility.setUpWallet ? (
                    <PaymentOptionRow
                      isCompact={isWidgetCompact}
                      buttonType={widgetButtonStyle.type}
                      buttonRadius={widgetButtonStyle.radius}
                      className="relative"
                      style={{
                        paddingLeft: isWidgetCompact ? 'var(--widget-option-padding-x-compact)' : 'var(--widget-option-padding-x)',
                        paddingRight: isWidgetCompact ? '72px' : '84px',
                        fontWeight: 'var(--widget-font-weight-semibold)',
                        lineHeight: 'var(--widget-line-height-snug)',
                      }}
                    >
                      <img
                        src={graphics.walletSetupIcon}
                        alt=""
                        aria-hidden="true"
                        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 object-contain"
                      />
                      <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center text-center">
                        <span>Set Up Wallet</span>
                      </span>
                      <span
                        className="absolute rounded-full px-2 py-0.5"
                        style={{
                          top: '50%',
                          right: isWidgetCompact ? '10px' : '12px',
                          transform: 'translateY(-50%)',
                          borderRadius: 'var(--widget-radius-pill)',
                          fontSize: 'var(--widget-font-size-caption)',
                          fontWeight: 'var(--widget-font-weight-semibold)',
                          lineHeight: 'var(--widget-line-height-snug)',
                          backgroundColor: widgetButtonStyle.type === 'filled' ? 'var(--widget-button-outline-bg)' : 'var(--widget-color-primary)',
                          color: widgetButtonStyle.type === 'filled' ? 'var(--widget-text-primary)' : 'var(--widget-text-on-primary)',
                        }}
                      >
                        <span>10%</span>{' '}
                        <span style={{ fontSize: '0.9em' }}>Cashback</span>
                      </span>
                    </PaymentOptionRow>
                  ) : null}

                  {elementVisibility.payByNewCard && elementVisibility.savedCards ? (
                    <PaymentOptionRow
                      isCompact={isWidgetCompact}
                      buttonType={widgetButtonStyle.type}
                      buttonRadius={widgetButtonStyle.radius}
                      className="relative"
                      style={{
                        paddingLeft: isWidgetCompact ? 'var(--widget-option-padding-x-compact)' : 'var(--widget-option-padding-x)',
                        paddingRight: isWidgetCompact ? '74px' : '90px',
                      }}
                    >
                      <img
                        src={graphics[cardBrandIconByType[activeCardBrand]]}
                        alt=""
                        aria-hidden="true"
                        className="absolute left-4 top-1/2 h-4 w-7 -translate-y-1/2 object-contain"
                      />
                      <span className="absolute left-1/2 top-1/2 min-w-0 -translate-x-1/2 -translate-y-1/2 text-center">
                        <span
                          className="block truncate uppercase"
                          style={{
                            fontSize: 'var(--widget-font-size-body)',
                            fontWeight: 'var(--widget-font-weight-semibold)',
                            letterSpacing: '0.02em',
                            lineHeight: 'var(--widget-line-height-snug)',
                          }}
                        >
                          Bank of Swiss
                        </span>
                        <span
                          className="widget-option-muted block truncate"
                          style={{
                            fontSize: 'var(--widget-font-size-caption)',
                            fontWeight: 'var(--widget-font-weight-regular)',
                            lineHeight: 'var(--widget-line-height-snug)',
                          }}
                        >
                          John Doe •••• 4242
                        </span>
                      </span>
                      <span
                        className="absolute rounded-full px-2 py-0.5"
                        style={{
                          top: '50%',
                          right: isWidgetCompact ? '10px' : '12px',
                          transform: 'translateY(-50%)',
                          borderRadius: 'var(--widget-radius-pill)',
                          fontSize: 'var(--widget-font-size-caption)',
                          fontWeight: 'var(--widget-font-weight-semibold)',
                          lineHeight: 'var(--widget-line-height-snug)',
                          backgroundColor: widgetButtonStyle.type === 'filled' ? 'var(--widget-button-outline-bg)' : 'var(--widget-color-primary)',
                          color: widgetButtonStyle.type === 'filled' ? 'var(--widget-text-primary)' : 'var(--widget-text-on-primary)',
                        }}
                      >
                        Default
                      </span>
                    </PaymentOptionRow>
                  ) : null}

                  {elementVisibility.payByNewCard ? (
                    <div
                      className={`w-full border text-[var(--widget-text-primary)] transition-colors ${
                        isPayByNewCardOpen
                          ? widgetButtonStyle.type === 'outline'
                            ? 'border-[var(--widget-color-primary)] bg-[var(--widget-button-outline-bg)]'
                            : 'border-[var(--widget-color-primary)]'
                          : widgetButtonStyle.type === 'filled'
                            ? 'border-transparent bg-[var(--widget-option-button-bg)] hover:bg-[var(--widget-option-button-bg-hover)]'
                            : widgetButtonStyle.type === 'tonal'
                              ? 'border-transparent bg-[var(--widget-option-button-tonal-bg)] hover:bg-[var(--widget-option-button-tonal-bg-hover)]'
                              : 'border-[var(--widget-button-outline-border)] bg-[var(--widget-button-outline-bg)] hover:border-[var(--widget-color-primary)] hover:bg-[var(--widget-option-hover-bg)]'
                      }`}
                      style={{
                        borderRadius: isPayByNewCardOpen ? `${payByNewCardOpenRadius}px` : `${widgetButtonStyle.radius}px`,
                        boxShadow: isPayByNewCardOpen
                          ? `0 0 0 var(--widget-form-ring-width) hsl(var(--primary) / var(--widget-form-ring-opacity))`
                          : 'none',
                      }}
                    >
                      <PaymentOptionRow
                        isCompact={isWidgetCompact}
                        buttonType={widgetButtonStyle.type}
                        buttonRadius={widgetButtonStyle.radius}
                        useFilledTextColors={!isPayByNewCardOpen && widgetButtonStyle.type === 'filled'}
                        withBorder={false}
                        hoverable={false}
                        className="w-full"
                        style={{
                          borderRadius: isPayByNewCardOpen ? `${payByNewCardOpenRadius}px` : `${widgetButtonStyle.radius}px`,
                        }}
                        onClick={() => setIsPayByNewCardOpen((prev) => !prev)}
                        aria-expanded={isPayByNewCardOpen}
                        aria-controls="widget-pay-by-new-card-form"
                      >
                        <span className="inline-flex w-full items-center justify-center gap-2">
                          <span style={{ fontWeight: 'var(--widget-font-weight-semibold)' }}>Pay by new card</span>
                          <span className="inline-flex items-center gap-1" aria-label="Supported cards">
                            {supportedCardBrands.map((brand) => (
                              <img
                                key={brand}
                                src={graphics[cardBrandIconByType[brand]]}
                                alt={`${cardBrandLabelByType[brand]} card`}
                                className="h-4 w-6 object-contain"
                              />
                            ))}
                          </span>
                        </span>
                        </PaymentOptionRow>

                      {isPayByNewCardOpen ? (
                        <form
                          id="widget-pay-by-new-card-form"
                          className="flex flex-col"
                          style={{
                            gap: 'var(--widget-density-gap)',
                            padding: '0 var(--widget-density-padding-inline) var(--widget-density-padding-inline)',
                          }}
                          onSubmit={(event) => event.preventDefault()}
                        >

                    <div className="space-y-2">
                      <label className="block text-[var(--widget-text-primary)]" style={{ fontSize: 'var(--widget-font-size-caption)', fontWeight: 'var(--widget-font-weight-regular)' }} htmlFor="widget-name-on-card">Name on card</label>
                      <Input id="widget-name-on-card" placeholder="John Doe" className="border-[var(--widget-input-border)] bg-[var(--widget-input-bg)] text-[var(--widget-input-text)] placeholder:text-[var(--widget-input-placeholder)] focus-visible:ring-[var(--widget-input-ring)]" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)', borderRadius: 'var(--widget-input-radius)' }} />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[var(--widget-text-primary)]" style={{ fontSize: 'var(--widget-font-size-caption)', fontWeight: 'var(--widget-font-weight-regular)' }} htmlFor="widget-card-number">Card Information</label>
                      {isCardInformationSingleRow ? (
                        <div className="grid grid-cols-[minmax(0,1fr)_96px_84px] gap-2">
                          <Input id="widget-card-number" placeholder="1234 5678 9012 3456" className="w-full border-[var(--widget-input-border)] bg-[var(--widget-input-bg)] text-[var(--widget-input-text)] placeholder:text-[var(--widget-input-placeholder)] focus-visible:ring-[var(--widget-input-ring)]" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)', borderRadius: 'var(--widget-input-radius)' }} />
                          <Input placeholder="MM/YY" className="border-[var(--widget-input-border)] bg-[var(--widget-input-bg)] text-[var(--widget-input-text)] placeholder:text-[var(--widget-input-placeholder)] focus-visible:ring-[var(--widget-input-ring)]" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)', borderRadius: 'var(--widget-input-radius)' }} aria-label="Expiry date" />
                          <Input placeholder="CVC" className="border-[var(--widget-input-border)] bg-[var(--widget-input-bg)] text-[var(--widget-input-text)] placeholder:text-[var(--widget-input-placeholder)] focus-visible:ring-[var(--widget-input-ring)]" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)', borderRadius: 'var(--widget-input-radius)' }} aria-label="Security code" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Input id="widget-card-number" placeholder="1234 5678 9012 3456" className="w-full border-[var(--widget-input-border)] bg-[var(--widget-input-bg)] text-[var(--widget-input-text)] placeholder:text-[var(--widget-input-placeholder)] focus-visible:ring-[var(--widget-input-ring)]" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)', borderRadius: 'var(--widget-input-radius)' }} />
                          <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="MM/YY" className="border-[var(--widget-input-border)] bg-[var(--widget-input-bg)] text-[var(--widget-input-text)] placeholder:text-[var(--widget-input-placeholder)] focus-visible:ring-[var(--widget-input-ring)]" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)', borderRadius: 'var(--widget-input-radius)' }} aria-label="Expiry date" />
                            <Input placeholder="CVC" className="border-[var(--widget-input-border)] bg-[var(--widget-input-bg)] text-[var(--widget-input-text)] placeholder:text-[var(--widget-input-placeholder)] focus-visible:ring-[var(--widget-input-ring)]" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)', borderRadius: 'var(--widget-input-radius)' }} aria-label="Security code" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[var(--widget-text-primary)]" style={{ fontSize: 'var(--widget-font-size-caption)', fontWeight: 'var(--widget-font-weight-regular)' }} htmlFor="widget-postal-code">Postal code</label>
                      <Input id="widget-postal-code" placeholder="Postal code" className="border-[var(--widget-input-border)] bg-[var(--widget-input-bg)] text-[var(--widget-input-text)] placeholder:text-[var(--widget-input-placeholder)] focus-visible:ring-[var(--widget-input-ring)]" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)', borderRadius: 'var(--widget-input-radius)' }} />
                    </div>

                    <label className={`text-[var(--widget-text-primary)] ${isWidgetCompact ? 'grid grid-cols-[auto_1fr] items-start gap-2' : 'flex items-center gap-2'}`} style={{ fontSize: 'var(--widget-font-size-caption)' }}>
                      <Switch
                        aria-label="Save this card"
                        checked={isSaveCardEnabled}
                        onCheckedChange={setIsSaveCardEnabled}
                        className="data-[state=checked]:bg-[var(--widget-switch-checked-bg)] data-[state=unchecked]:bg-[var(--widget-switch-unchecked-bg)] focus-visible:ring-[var(--widget-switch-ring)]"
                      />
                      Save this card for faster checkout
                    </label>

                    <Button
                      type="submit"
                      className="w-full rounded-full bg-[var(--widget-color-primary)] text-[var(--widget-text-on-primary)] hover:bg-[var(--widget-color-primary)]/90"
                      style={{
                        height: 'var(--widget-control-height-button)',
                        borderRadius: `${widgetButtonStyle.radius}px`,
                        fontSize: 'var(--widget-font-size-body)',
                        fontWeight: 'var(--widget-font-weight-semibold)',
                      }}
                    >
                      Pay 7.55 GBP
                    </Button>
                        </form>
                      ) : null}
                    </div>
                  ) : null}

                  {elementVisibility.payByOtherMethods ? (
                    <div
                      className={`w-full border text-[var(--widget-text-primary)] transition-colors ${
                        isPayByOtherMethodsOpen
                          ? widgetButtonStyle.type === 'outline'
                            ? 'border-[var(--widget-color-primary)] bg-[var(--widget-button-outline-bg)]'
                            : 'border-[var(--widget-color-primary)]'
                          : widgetButtonStyle.type === 'filled'
                            ? 'border-transparent bg-[var(--widget-option-button-bg)] hover:bg-[var(--widget-option-button-bg-hover)]'
                            : widgetButtonStyle.type === 'tonal'
                              ? 'border-transparent bg-[var(--widget-option-button-tonal-bg)] hover:bg-[var(--widget-option-button-tonal-bg-hover)]'
                              : 'border-[var(--widget-button-outline-border)] bg-[var(--widget-button-outline-bg)] hover:border-[var(--widget-color-primary)] hover:bg-[var(--widget-option-hover-bg)]'
                      }`}
                      style={{
                        borderRadius: isPayByOtherMethodsOpen ? `${payByOtherMethodsOpenRadius}px` : `${widgetButtonStyle.radius}px`,
                        boxShadow: isPayByOtherMethodsOpen
                          ? `0 0 0 var(--widget-form-ring-width) hsl(var(--primary) / var(--widget-form-ring-opacity))`
                          : 'none',
                      }}
                    >
                      <PaymentOptionRow
                        isCompact={isWidgetCompact}
                        buttonType={widgetButtonStyle.type}
                        buttonRadius={widgetButtonStyle.radius}
                        useFilledTextColors={!isPayByOtherMethodsOpen && widgetButtonStyle.type === 'filled'}
                        withBorder={false}
                        hoverable={false}
                        className="w-full"
                        style={{
                          borderRadius: isPayByOtherMethodsOpen ? `${payByOtherMethodsOpenRadius}px` : `${widgetButtonStyle.radius}px`,
                        }}
                        onClick={() => setIsPayByOtherMethodsOpen((prev) => !prev)}
                        ariaExpanded={isPayByOtherMethodsOpen}
                        ariaControls="widget-pay-by-other-methods-list"
                      >
                        <span className="inline-flex w-full items-center justify-center gap-2" style={{ fontWeight: 'var(--widget-font-weight-semibold)' }}>
                          <span>Pay by other methods</span>
                          <span className="inline-flex items-center gap-1" aria-label="Apple Pay, PayPal, Google Pay">
                            {otherMethodIconKeys.map((iconKey) => (
                              <img
                                key={iconKey}
                                src={graphics[iconKey]}
                                alt=""
                                aria-hidden="true"
                                className="h-[18px] w-[18px] rounded-[4px] object-contain"
                              />
                            ))}
                          </span>
                        </span>
                      </PaymentOptionRow>

                      {isPayByOtherMethodsOpen ? (
                        <div
                          id="widget-pay-by-other-methods-list"
                          className="flex flex-col"
                          style={{
                            gap: 'var(--widget-density-gap)',
                            padding: '0 var(--widget-density-padding-inline) var(--widget-density-padding-inline)',
                          }}
                        >
                          <button
                            type="button"
                            className="inline-flex w-full items-center justify-center gap-2 border transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--widget-color-primary)]"
                            style={{
                              height: 'var(--widget-control-height-button)',
                              borderRadius: `${widgetButtonStyle.radius}px`,
                              backgroundColor: 'var(--widget-brand-apple-pay-bg)',
                              color: 'var(--widget-brand-apple-pay-text)',
                              borderColor: 'var(--widget-brand-apple-pay-border)',
                              fontSize: 'var(--widget-font-size-body)',
                              fontWeight: 'var(--widget-font-weight-semibold)',
                            }}
                          >
                            <span>Pay with</span>
                            <img src={graphics.applePayIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px] rounded-[4px] object-contain" />
                            <span>Pay</span>
                            <span className="sr-only">Apple Pay</span>
                          </button>

                          <button
                            type="button"
                            className="inline-flex w-full items-center justify-center gap-2 border transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--widget-color-primary)]"
                            style={{
                              height: 'var(--widget-control-height-button)',
                              borderRadius: `${widgetButtonStyle.radius}px`,
                              backgroundColor: 'var(--widget-brand-paypal-bg)',
                              color: 'var(--widget-brand-paypal-text)',
                              borderColor: 'var(--widget-brand-paypal-border)',
                              fontSize: 'var(--widget-font-size-body)',
                              fontWeight: 'var(--widget-font-weight-semibold)',
                            }}
                          >
                            <img src={graphics.payPalIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px] rounded-[4px] object-contain" />
                            <span>PayPal</span>
                          </button>

                          <button
                            type="button"
                            className="inline-flex w-full items-center justify-center gap-2 border transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--widget-color-primary)]"
                            style={{
                              height: 'var(--widget-control-height-button)',
                              borderRadius: `${widgetButtonStyle.radius}px`,
                              backgroundColor: 'var(--widget-brand-google-pay-bg)',
                              color: 'var(--widget-brand-google-pay-text)',
                              borderColor: 'var(--widget-brand-google-pay-border)',
                              fontSize: 'var(--widget-font-size-body)',
                              fontWeight: 'var(--widget-font-weight-semibold)',
                            }}
                          >
                            <span>Pay with</span>
                            <img src={graphics.googlePayIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px] rounded-[4px] object-contain" />
                            <span>Pay</span>
                            <span className="sr-only">Google Pay</span>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {elementVisibility.payByBank ? (
                    <PaymentOptionRow isCompact={isWidgetCompact} buttonType={widgetButtonStyle.type} buttonRadius={widgetButtonStyle.radius}>
                      <span className="inline-flex w-full items-center justify-center gap-2" style={{ fontWeight: 'var(--widget-font-weight-semibold)' }}>
                        <span>Pay by Bank</span>
                        <img src={graphics.bankPayIcon} alt="Bank" className="h-5 w-5 rounded-[4px] object-contain" />
                      </span>
                    </PaymentOptionRow>
                  ) : null}

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full rounded-full text-[var(--widget-color-primary)] hover:text-[var(--widget-color-primary)]"
                    style={{
                      height: 'var(--widget-control-height-button)',
                      borderRadius: `${widgetButtonStyle.radius}px`,
                      fontSize: 'var(--widget-font-size-body)',
                      fontWeight: 'var(--widget-font-weight-semibold)',
                    }}
                  >
                    Edit Payment Methods
                  </Button>

                  <Separator className="my-2" style={{ backgroundColor: 'var(--widget-color-border)' }} />

                  <small
                    className="block text-center text-[var(--widget-text-muted)]"
                    style={{ fontSize: 'var(--widget-font-size-caption)', lineHeight: 'var(--widget-line-height-normal)' }}
                  >
                    By paying you agree to our{' '}
                    <a
                      href="#"
                      onClick={(event) => event.preventDefault()}
                      className="font-semibold underline decoration-[1.5px] underline-offset-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)]"
                      style={{ color: 'var(--widget-color-primary)' }}
                    >
                      Terms &amp; Conditions
                    </a>
                    <span className="block">
                      Powered &amp; Secured by{' '}
                      <a
                        href="#"
                        onClick={(event) => event.preventDefault()}
                        className="font-semibold underline decoration-[1.5px] underline-offset-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)]"
                        style={{ color: 'var(--widget-color-primary)' }}
                      >
                        rezolve.com
                      </a>
                    </span>
                  </small>
                </CardContent>
              </Card>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
