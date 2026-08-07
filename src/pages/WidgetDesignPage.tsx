import { useEffect, useRef, useState } from 'react'
import { ChevronDown, CircleCheck, CircleX, X } from 'lucide-react'

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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const mainTabs = ['Dashboard', 'Transactions', 'Settings', 'PSP Settings', 'User Management', 'Notifications', 'Widget Customization']
const widgetDesignSections = [
  { id: 'widget-elements-visibility', label: 'Elements visibility' },
  { id: 'widget-theme', label: 'Appearance' },
  { id: 'widget-typography', label: 'Typography' },
  { id: 'widget-button-style', label: 'Button style' },
  { id: 'widget-input-style', label: 'Input style' },
  { id: 'widget-density', label: 'Density' },
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
  textPrimary: '#111827',
  textMuted: '#64748b',
  textOnPrimary: '#ffffff',
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
  const normalizedFirst = normalizeHexColor(firstHex)
  const normalizedSecond = normalizeHexColor(secondHex)
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
  className,
  style,
  active = false,
  withBorder = true,
  hoverable = true,
  onClick,
  ariaExpanded,
  ariaControls,
}: PaymentOptionRowProps) {
  const baseClassName = [
    'w-full text-[var(--widget-text-primary)] transition-colors',
    withBorder
      ? active
        ? 'border border-[var(--widget-color-primary)]'
        : `border border-[var(--widget-color-border)] ${hoverable ? 'hover:border-[var(--widget-color-primary)] hover:bg-[var(--widget-option-hover-bg)]' : ''}`
      : '',
    !withBorder && onClick && hoverable ? 'hover:bg-[var(--widget-option-hover-bg)]' : '',
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
        borderRadius: 'var(--widget-radius-pill)',
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
  const [widgetTheme, setWidgetTheme] = useState(defaultWidgetTheme)
  const [widgetThemeDraft, setWidgetThemeDraft] = useState(defaultWidgetTheme)
  const [widgetTypography, setWidgetTypography] = useState<(typeof widgetTypographyOptions)[number]['id']>(defaultWidgetTypographyId)
  const [isTypographyDropdownOpen, setIsTypographyDropdownOpen] = useState(false)
  const [typographySearchQuery, setTypographySearchQuery] = useState('')
  const [typographyCategoryFilter, setTypographyCategoryFilter] = useState<'all' | WidgetTypographyCategory>('all')
  const [isPayByNewCardOpen, setIsPayByNewCardOpen] = useState(false)
  const [elementVisibility, setElementVisibility] = useState(defaultElementVisibility)
  const widgetSectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const typographyDropdownRef = useRef<HTMLDivElement | null>(null)
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
  const activeCardBrand = defaultCardBrand
  const isPreviewStickyEnabled = true

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
    setWidgetTheme((prev) => ({ ...prev, [token]: value }))
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
    setWidgetTheme((prev) => ({ ...prev, [token]: defaultWidgetTheme[token] }))
  }

  const resetWidgetTheme = () => {
    setWidgetSurfaceMode('filled')
    setWidgetTheme(defaultWidgetTheme)
    setWidgetThemeDraft(defaultWidgetTheme)
  }

  const resetWidgetTypographySection = () => {
    setWidgetTypography(defaultWidgetTypographyId)
    setTypographySearchQuery('')
    setTypographyCategoryFilter('all')
    setIsTypographyDropdownOpen(false)
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

  useEffect(() => {
    if (!isTypographyDropdownOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const eventTarget = event.target
      if (!(eventTarget instanceof Node)) {
        return
      }

      if (!typographyDropdownRef.current?.contains(eventTarget)) {
        setIsTypographyDropdownOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsTypographyDropdownOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isTypographyDropdownOpen])

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

  const widgetThemeStyles = {
    '--widget-color-primary': widgetTheme.primary,
    '--widget-color-surface': effectiveWidgetSurfaceColor,
    '--widget-color-border': widgetTheme.border,
    '--widget-text-primary': widgetTheme.textPrimary,
    '--widget-text-muted': widgetTheme.textMuted,
    '--widget-text-on-primary': widgetTheme.textOnPrimary,
    '--widget-option-hover-bg': widgetOptionHoverBg,
    '--widget-font-family': widgetTypographyOptions.find((option) => option.id === widgetTypography)?.fontFamily ?? "'DM Sans', sans-serif",
    '--widget-heading-font-family': widgetTypographyOptions.find((option) => option.id === widgetTypography)?.fontFamily ?? "'DM Sans', sans-serif",
  } as React.CSSProperties

  const widgetPreviewPanelStyles = {
    '--widget-color-primary': widgetTheme.primary,
    '--widget-color-border': widgetTheme.border,
    '--widget-text-on-primary': widgetTheme.textOnPrimary,
  } as React.CSSProperties

  const textOnPrimaryContrastRatio = getContrastRatio(widgetTheme.primary, widgetTheme.textOnPrimary)
  const normalizedTextOnPrimary = normalizeHexColor(widgetTheme.textOnPrimary)
  const suggestedTextOnPrimary = findNearestCompliantTextColor(widgetTheme.primary, widgetTheme.textOnPrimary, WCAG_AA_TEXT_CONTRAST)
  const isTextOnPrimaryContrastPassing = textOnPrimaryContrastRatio !== null && textOnPrimaryContrastRatio >= WCAG_AA_TEXT_CONTRAST
  const textPrimaryOnSurfaceContrastRatio = getContrastRatio(effectiveWidgetSurfaceColor, widgetTheme.textPrimary)
  const textMutedOnSurfaceContrastRatio = getContrastRatio(effectiveWidgetSurfaceColor, widgetTheme.textMuted)
  const normalizedTextPrimary = normalizeHexColor(widgetTheme.textPrimary)
  const normalizedTextMuted = normalizeHexColor(widgetTheme.textMuted)
  const suggestedTextPrimaryOnSurface = findNearestCompliantTextColor(effectiveWidgetSurfaceColor, widgetTheme.textPrimary, WCAG_AA_TEXT_CONTRAST)
  const suggestedTextMutedOnSurface = findNearestCompliantTextColor(effectiveWidgetSurfaceColor, widgetTheme.textMuted, WCAG_AA_TEXT_CONTRAST)
  const isTextPrimaryOnSurfacePassing = textPrimaryOnSurfaceContrastRatio !== null && textPrimaryOnSurfaceContrastRatio >= WCAG_AA_TEXT_CONTRAST
  const isTextMutedOnSurfacePassing = textMutedOnSurfaceContrastRatio !== null && textMutedOnSurfaceContrastRatio >= WCAG_AA_TEXT_CONTRAST
  const areSurfaceTextColorsPassing = isTextPrimaryOnSurfacePassing && isTextMutedOnSurfacePassing

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
      label: 'Border color',
      token: 'border' as const,
      description: 'Used for outlines, dividers and option row borders.',
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
      title: 'Buttons and Highlights',
      description: 'Control how your key actions and highlight labels look.',
      tokens: ['primary', 'textOnPrimary'],
      hasWarning: !isTextOnPrimaryContrastPassing,
    },
    {
      id: 'surface-readability',
      title: 'Surface and Text Readability',
      description: 'Set your card background and make sure text stays easy to read.',
      tokens: ['surface', 'textPrimary', 'textMuted'],
      hasWarning: !areSurfaceTextColorsPassing,
    },
    {
      id: 'structural',
      title: 'Borders and Dividers',
      description: 'Fine-tune separation lines and visual boundaries.',
      tokens: ['border'],
      hasWarning: false,
    },
  ]

  const selectedWidgetTypographyOption = widgetTypographyOptions.find((option) => option.id === widgetTypography) ?? widgetTypographyOptions[0]
  const filteredWidgetTypographyOptions = widgetTypographyOptions.filter((option) => {
    if (typographyCategoryFilter !== 'all' && option.category !== typographyCategoryFilter) {
      return false
    }

    const query = typographySearchQuery.trim().toLowerCase()
    if (!query) {
      return true
    }

    return option.label.toLowerCase().includes(query)
  })

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
                <section id="widget-elements-visibility" ref={registerWidgetSectionRef('widget-elements-visibility')} className="space-y-3 scroll-mt-6 pb-6">
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

                <section id="widget-theme" ref={registerWidgetSectionRef('widget-theme')} className="space-y-6 scroll-mt-6 border-t-2 border-[var(--sidebar-border-color-strong)] pt-8 pb-8">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-lg font-semibold text-[var(--sidebar-text-primary)]">Appearance</p>
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
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-[var(--sidebar-text-primary)]">{group.title}</p>
                            {group.id !== 'structural' ? (
                              <span
                                className="inline-flex items-center rounded-full border px-2 py-0.5 text-sm font-semibold"
                                style={
                                  group.hasWarning
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
                                {group.hasWarning ? 'Needs attention' : 'No issues'}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-sm text-[var(--sidebar-text-secondary)]">{group.description}</p>

                          <div className="divide-y divide-[var(--sidebar-border-color)]">
                            {group.id === 'surface-readability' ? (
                              <div className={`grid gap-3 py-3 ${isConfigurationCompact ? 'grid-cols-1' : 'md:grid-cols-[minmax(0,1fr)_auto] md:items-start'}`}>
                                <div className="space-y-1">
                                  <p className="font-medium text-[var(--sidebar-text-primary)]">Surface mode</p>
                                  <p className="text-sm text-[var(--sidebar-text-secondary)]">Choose a themed background or keep a white card with accent borders.</p>
                                </div>

                                <Tabs value={widgetSurfaceMode} onValueChange={(value) => setWidgetSurfaceMode(value as 'filled' | 'border-only')} className="w-fit justify-self-start">
                                  <TabsList>
                                    <TabsTrigger value="filled">Filled</TabsTrigger>
                                    <TabsTrigger value="border-only">White</TabsTrigger>
                                  </TabsList>
                                </Tabs>
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

                              if (control.token === 'textPrimary' && !isTextPrimaryOnSurfacePassing) {
                                warningContent = (
                                  <>
                                    <p>
                                      Contrast ratio: {textPrimaryOnSurfaceContrastRatio !== null ? `${textPrimaryOnSurfaceContrastRatio.toFixed(2)}:1` : 'n/a'} (required {WCAG_AA_TEXT_CONTRAST}:1)
                                    </p>
                                    <p className="mt-1 font-semibold">This color does not meet WCAG AA on the current surface.</p>
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
                                  </>
                                )
                              }

                              if (control.token === 'textMuted' && !isTextMutedOnSurfacePassing) {
                                warningContent = (
                                  <>
                                    <p>
                                      Contrast ratio: {textMutedOnSurfaceContrastRatio !== null ? `${textMutedOnSurfaceContrastRatio.toFixed(2)}:1` : 'n/a'} (required {WCAG_AA_TEXT_CONTRAST}:1)
                                    </p>
                                    <p className="mt-1 font-semibold">This color does not meet WCAG AA on the current surface.</p>
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

                <section id="widget-typography" ref={registerWidgetSectionRef('widget-typography')} className="space-y-4 border-t-2 border-[var(--sidebar-border-color-strong)] pt-8 pb-8">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-[var(--sidebar-text-primary)]">Typography</p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 px-3 text-sm"
                        onClick={resetWidgetTypographySection}
                        disabled={widgetTypography === defaultWidgetTypographyId}
                      >
                        Reset section
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--sidebar-text-secondary)]">Choose a Google Font for the widget. Changes are applied instantly in preview.</p>

                  <div className="divide-y divide-[var(--sidebar-border-color)]">
                    <div className="grid gap-3 py-3 grid-cols-1">
                      <div className="min-w-0 space-y-1">
                        <p className="font-medium text-[var(--sidebar-text-primary)]">Widget font family</p>
                        <p className="text-sm text-[var(--sidebar-text-secondary)]">Applies to all text inside the widget, including headings and form labels.</p>
                      </div>

                      <div className="w-full space-y-3">
                        <div className="relative" ref={typographyDropdownRef}>
                          <button
                            type="button"
                            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-1 text-sm text-[var(--sidebar-text-primary)] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)]"
                            onClick={() => {
                              setIsTypographyDropdownOpen((prev) => {
                                if (prev) {
                                  setTypographySearchQuery('')
                                }
                                return !prev
                              })
                            }}
                            aria-label="Select widget font family"
                            aria-expanded={isTypographyDropdownOpen}
                            aria-haspopup="listbox"
                          >
                            <span style={{ fontFamily: selectedWidgetTypographyOption.fontFamily }}>{selectedWidgetTypographyOption.label}</span>
                            <ChevronDown
                              className={`h-4 w-4 text-[var(--sidebar-text-secondary)] transition-transform ${isTypographyDropdownOpen ? 'rotate-180' : ''}`}
                              aria-hidden="true"
                            />
                          </button>

                          {isTypographyDropdownOpen ? (
                            <div
                              className="absolute z-30 mt-1 w-full rounded-md border border-[var(--sidebar-border-color)] bg-[var(--sidebar-menu-bg)] shadow-md"
                              role="listbox"
                              aria-label="Widget font options"
                            >
                              <div className="border-b border-[var(--sidebar-border-color)] p-2">
                                <div className="mb-2 flex flex-wrap gap-2">
                                  {[
                                    { id: 'all', label: 'All fonts' },
                                    { id: 'sans-serif', label: 'Sans Serif' },
                                    { id: 'serif', label: 'Serif' },
                                  ].map((categoryOption) => {
                                    const isActive = typographyCategoryFilter === categoryOption.id

                                    return (
                                      <button
                                        key={categoryOption.id}
                                        type="button"
                                        className={`rounded-full border px-2 py-1 text-xs font-semibold transition-colors ${
                                          isActive
                                            ? 'border-[var(--sidebar-focus-ring)] bg-[var(--sidebar-item-active-bg)] text-[var(--sidebar-text-primary)]'
                                            : 'border-[var(--sidebar-border-color)] bg-[var(--sidebar-menu-bg)] text-[var(--sidebar-text-secondary)] hover:bg-[var(--sidebar-item-hover-bg)]'
                                        }`}
                                        onClick={() => setTypographyCategoryFilter(categoryOption.id as 'all' | WidgetTypographyCategory)}
                                      >
                                        {categoryOption.label}
                                      </button>
                                    )
                                  })}
                                </div>

                                <Input
                                  value={typographySearchQuery}
                                  onChange={(event) => setTypographySearchQuery(event.target.value)}
                                  placeholder="Search font by name"
                                  aria-label="Search font by name"
                                  className="h-8"
                                />
                              </div>

                              <div className="max-h-56 overflow-y-auto py-1">
                                {filteredWidgetTypographyOptions.length > 0 ? (
                                  filteredWidgetTypographyOptions.map((option) => {
                                    const isSelected = widgetTypography === option.id

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
                                          setWidgetTypography(option.id)
                                          setTypographySearchQuery('')
                                          setIsTypographyDropdownOpen(false)
                                        }}
                                        role="option"
                                        aria-selected={isSelected}
                                      >
                                        <span>{option.label}</span>
                                        {isSelected ? (
                                          <CircleCheck className="h-4 w-4 shrink-0 text-[var(--sidebar-focus-ring)]" aria-hidden="true" />
                                        ) : null}
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

                        <div className="space-y-1">
                          <p className="text-sm font-medium text-[var(--sidebar-text-primary)]">Preview</p>
                          <p
                            className="text-sm text-[var(--sidebar-text-primary)]"
                            style={{ fontFamily: selectedWidgetTypographyOption.fontFamily }}
                          >
                            The quick brown fox jumps over the lazy dog.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="widget-button-style" ref={registerWidgetSectionRef('widget-button-style')} className="space-y-3 border-t-2 border-[var(--sidebar-border-color-strong)] pt-8">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-[var(--sidebar-text-primary)]">Button style</p>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-[var(--sidebar-border-color)] bg-[var(--sidebar-menu-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--sidebar-text-secondary)]">
                        Placeholder
                      </span>
                      <Button type="button" variant="outline" className="h-8 px-3 text-sm" disabled>
                        Reset section
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--sidebar-text-secondary)]">Temporary section placeholder. Button style controls will be connected here.</p>
                </section>

                <section id="widget-input-style" ref={registerWidgetSectionRef('widget-input-style')} className="space-y-3 border-t-2 border-[var(--sidebar-border-color-strong)] pt-8">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-[var(--sidebar-text-primary)]">Input style</p>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-[var(--sidebar-border-color)] bg-[var(--sidebar-menu-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--sidebar-text-secondary)]">
                        Placeholder
                      </span>
                      <Button type="button" variant="outline" className="h-8 px-3 text-sm" disabled>
                        Reset section
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--sidebar-text-secondary)]">Temporary section placeholder. Input controls will be connected here.</p>
                </section>

                <section id="widget-density" ref={registerWidgetSectionRef('widget-density')} className="space-y-3 border-t-2 border-[var(--sidebar-border-color-strong)] pt-8">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-[var(--sidebar-text-primary)]">Density</p>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-[var(--sidebar-border-color)] bg-[var(--sidebar-menu-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--sidebar-text-secondary)]">
                        Placeholder
                      </span>
                      <Button type="button" variant="outline" className="h-8 px-3 text-sm" disabled>
                        Reset section
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--sidebar-text-secondary)]">Temporary section placeholder. Density controls will be connected here.</p>
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
                    gap: 'var(--widget-space-md)',
                    paddingInline: 'var(--widget-space-md)',
                    paddingBottom: 'var(--widget-space-lg)',
                  }}
                >
                  {elementVisibility.setUpWallet ? (
                    <PaymentOptionRow
                      isCompact={isWidgetCompact}
                      className="relative flex items-center justify-center"
                      style={{
                        paddingLeft: isWidgetCompact ? 'var(--widget-option-padding-x-compact)' : 'var(--widget-option-padding-x)',
                        paddingRight: isWidgetCompact ? '72px' : '84px',
                        fontWeight: 'var(--widget-font-weight-semibold)',
                        lineHeight: 'var(--widget-line-height-snug)',
                      }}
                    >
                      <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-center">
                        <span>Set Up Wallet</span>
                        <img src={graphics.walletSetupIcon} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
                      </span>
                      <span
                        className="absolute rounded-full bg-[var(--widget-color-primary)] px-2 py-0.5 text-[var(--widget-text-on-primary)]"
                        style={{
                          top: 0,
                          right: isWidgetCompact ? '10px' : '12px',
                          transform: 'translateY(-50%)',
                          borderRadius: 'var(--widget-radius-pill)',
                          fontSize: 'var(--widget-font-size-caption)',
                          fontWeight: 'var(--widget-font-weight-semibold)',
                          lineHeight: 'var(--widget-line-height-snug)',
                        }}
                      >
                        10% Cashback
                      </span>
                    </PaymentOptionRow>
                  ) : null}

                  {elementVisibility.payByNewCard && elementVisibility.savedCards ? (
                    <PaymentOptionRow
                      isCompact={isWidgetCompact}
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
                          className="block truncate text-[var(--widget-text-muted)]"
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
                        className="absolute rounded-full bg-[var(--widget-color-primary)] px-2 py-0.5 text-[var(--widget-text-on-primary)]"
                        style={{
                          top: 0,
                          right: isWidgetCompact ? '10px' : '12px',
                          transform: 'translateY(-50%)',
                          borderRadius: 'var(--widget-radius-pill)',
                          fontSize: 'var(--widget-font-size-caption)',
                          fontWeight: 'var(--widget-font-weight-semibold)',
                          lineHeight: 'var(--widget-line-height-snug)',
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
                          ? 'border-[var(--widget-color-primary)]'
                          : 'border-[var(--widget-color-border)] hover:border-[var(--widget-color-primary)]'
                      }`}
                      style={{
                        borderRadius: isPayByNewCardOpen ? 'var(--widget-radius-card)' : 'var(--widget-radius-pill)',
                        boxShadow: isPayByNewCardOpen
                          ? `0 0 0 var(--widget-form-ring-width) hsl(var(--primary) / var(--widget-form-ring-opacity))`
                          : 'none',
                      }}
                    >
                      <PaymentOptionRow
                        isCompact={isWidgetCompact}
                        withBorder={false}
                        hoverable={!isPayByNewCardOpen}
                        className="w-full"
                        style={{
                          borderRadius: isPayByNewCardOpen ? 'var(--widget-radius-card)' : 'var(--widget-radius-pill)',
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
                            gap: 'var(--widget-space-lg)',
                            padding: '0 var(--widget-space-md) var(--widget-space-md)',
                          }}
                          onSubmit={(event) => event.preventDefault()}
                        >

                    <div className="space-y-2">
                      <label className="block text-[var(--widget-text-primary)]" style={{ fontSize: 'var(--widget-font-size-caption)', fontWeight: 'var(--widget-font-weight-regular)' }} htmlFor="widget-name-on-card">Name on card</label>
                      <Input id="widget-name-on-card" placeholder="John Doe" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)' }} />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[var(--widget-text-primary)]" style={{ fontSize: 'var(--widget-font-size-caption)', fontWeight: 'var(--widget-font-weight-regular)' }} htmlFor="widget-card-number">Card Information</label>
                      {isCardInformationSingleRow ? (
                        <div className="grid grid-cols-[minmax(0,1fr)_96px_84px] gap-2">
                          <Input id="widget-card-number" placeholder="1234 5678 9012 3456" className="w-full" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)' }} />
                          <Input placeholder="MM/YY" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)' }} aria-label="Expiry date" />
                          <Input placeholder="CVC" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)' }} aria-label="Security code" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Input id="widget-card-number" placeholder="1234 5678 9012 3456" className="w-full" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)' }} />
                          <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="MM/YY" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)' }} aria-label="Expiry date" />
                            <Input placeholder="CVC" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)' }} aria-label="Security code" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[var(--widget-text-primary)]" style={{ fontSize: 'var(--widget-font-size-caption)', fontWeight: 'var(--widget-font-weight-regular)' }} htmlFor="widget-postal-code">Postal code</label>
                      <Input id="widget-postal-code" placeholder="Postal code" style={{ height: 'var(--widget-control-height-input)', fontSize: 'var(--widget-font-size-caption)' }} />
                    </div>

                    <label className={`text-[var(--widget-text-primary)] ${isWidgetCompact ? 'grid grid-cols-[auto_1fr] items-start gap-2' : 'flex items-center gap-2'}`} style={{ fontSize: 'var(--widget-font-size-caption)' }}>
                      <Switch aria-label="Save this card" />
                      Save this card for faster checkout
                    </label>

                    <Button
                      type="submit"
                      className="w-full rounded-full bg-[var(--widget-color-primary)] text-[var(--widget-text-on-primary)] hover:bg-[var(--widget-color-primary)]/90"
                      style={{
                        height: 'var(--widget-control-height-button)',
                        borderRadius: 'var(--widget-radius-pill)',
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
                    <PaymentOptionRow isCompact={isWidgetCompact}>
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
                  ) : null}

                  {elementVisibility.payByBank ? (
                    <PaymentOptionRow isCompact={isWidgetCompact}>
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
                      borderRadius: 'var(--widget-radius-pill)',
                      fontSize: 'var(--widget-font-size-body)',
                      fontWeight: 'var(--widget-font-weight-semibold)',
                    }}
                  >
                    Edit Payment Methods
                  </Button>

                  <Separator className="my-2" />

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
