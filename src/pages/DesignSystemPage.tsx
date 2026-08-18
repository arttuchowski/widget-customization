import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { House, WalletCards } from 'lucide-react'

import { defaultGraphicsAssets, type GraphicsAssetKey, useAppGraphics } from '@/context/AppGraphicsContext'
import {
  clearStoredProjectRootDirectory,
  loadStoredProjectRootDirectory,
  pickProjectRootDirectory,
  saveAllGraphicsToProject,
  saveGraphicAssetToProject,
  storeProjectRootDirectory,
} from '@/lib/project-assets'
import { SidebarProfileMenu } from '@/components/sidebar/SidebarProfileMenu'
import { SiteNav } from '@/components/site-nav'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { SidebarNav, SidebarNavButton } from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const colors = [
  { name: 'Primary', value: 'var(--color-primary)', usage: 'Primary actions, active tabs, CTA' },
  { name: 'Background', value: 'var(--color-background)', usage: 'Main application background' },
  { name: 'Sidebar Background', value: 'var(--sidebar-bg)', usage: 'Sidebar container surface' },
  { name: 'Sidebar Border', value: 'var(--sidebar-border-color)', usage: 'Sidebar separators and outlines' },
  { name: 'Sidebar Active', value: 'var(--sidebar-item-active-bg)', usage: 'Active nav item background' },
  { name: 'Sidebar Hover', value: 'var(--sidebar-item-hover-bg)', usage: 'Hover state for interactive elements' },
  { name: 'Text Primary', value: 'var(--sidebar-text-primary)', usage: 'Primary copy with WCAG-friendly contrast' },
  { name: 'Text Secondary', value: 'var(--sidebar-text-secondary)', usage: 'Secondary/supporting copy with WCAG-friendly contrast' },
]

const widgetColors = [
  { name: 'Widget Surface', value: 'var(--widget-color-surface)', usage: 'Widget card surface background' },
  { name: 'Widget Primary', value: 'var(--widget-color-primary)', usage: 'Primary CTA, labels, status pills' },
  { name: 'Widget Border', value: 'var(--widget-color-border)', usage: 'Widget card and option row borders' },
  { name: 'Widget Text Primary', value: 'var(--widget-text-primary)', usage: 'General widget copy' },
  { name: 'Widget Text Muted', value: 'var(--widget-text-muted)', usage: 'Supporting legal and helper copy' },
  { name: 'Widget Text On Primary', value: 'var(--widget-text-on-primary)', usage: 'Text on primary backgrounds' },
]

const widgetTypography = {
  fontFamily: "var(--widget-font-family)",
  fallback: 'DM Sans, sans-serif',
  heading: {
    family: 'var(--widget-heading-font-family)',
    size: 'var(--widget-heading-font-size)',
    weight: 'var(--widget-heading-font-weight)',
    lineHeight: 'var(--widget-heading-line-height)',
  },
  weights: [
    { name: 'Regular', token: 'var(--widget-font-weight-regular)', value: '400' },
    { name: 'Semibold', token: 'var(--widget-font-weight-semibold)', value: '600' },
  ],
  sizes: [
    { name: 'Caption', token: 'var(--widget-font-size-caption)', value: '12px', usage: 'Labels, input text, legal/support copy' },
    { name: 'Body', token: 'var(--widget-font-size-body)', value: '14px', usage: 'Primary content rows and CTA text' },
  ],
}

const widgetLayoutTokenGroups = [
  {
    title: 'Spacing',
    items: [
      { name: 'Widget Space SM', token: 'var(--widget-space-sm)', value: '8px', usage: 'Small vertical and inline gaps inside widget controls' },
      { name: 'Widget Space MD', token: 'var(--widget-space-md)', value: '12px', usage: 'Default card content and form paddings/gaps' },
      { name: 'Widget Space LG', token: 'var(--widget-space-lg)', value: '16px', usage: 'Larger form section spacing' },
    ],
  },
  {
    title: 'Radius',
    items: [
      { name: 'Widget Radius Pill', token: 'var(--widget-radius-pill)', value: '9999px', usage: 'Pill rows, badges, CTA buttons' },
      { name: 'Widget Radius Card', token: 'var(--widget-radius-card)', value: '16px', usage: 'Widget card and open form container corners' },
    ],
  },
  {
    title: 'Controls',
    items: [
      { name: 'Widget Input Height', token: 'var(--widget-control-height-input)', value: '32px', usage: 'All text inputs in widget form' },
      { name: 'Widget Button Height', token: 'var(--widget-control-height-button)', value: '40px', usage: 'Primary and secondary widget buttons' },
    ],
  },
  {
    title: 'Option Rows',
    items: [
      { name: 'Widget Option Padding X', token: 'var(--widget-option-padding-x)', value: '16px', usage: 'Horizontal padding for option rows at regular widths' },
      { name: 'Widget Option Padding Y', token: 'var(--widget-option-padding-y)', value: '10px', usage: 'Vertical padding for option rows at regular widths' },
      { name: 'Widget Option Padding X Compact', token: 'var(--widget-option-padding-x-compact)', value: '12px', usage: 'Horizontal padding for option rows at compact widths' },
      { name: 'Widget Option Padding Y Compact', token: 'var(--widget-option-padding-y-compact)', value: '10px', usage: 'Vertical padding for option rows at compact widths' },
    ],
  },
  {
    title: 'Form Active State',
    items: [
      { name: 'Widget Form Ring Width', token: 'var(--widget-form-ring-width)', value: '3px', usage: 'Open form active outline thickness' },
      { name: 'Widget Form Ring Opacity', token: 'var(--widget-form-ring-opacity)', value: '0.1', usage: 'Open form active outline opacity' },
    ],
  },
  {
    title: 'Resize Handle',
    items: [
      { name: 'Widget Resize Handle Width', token: 'var(--widget-resize-handle-width)', value: '16px', usage: 'Drag handle visual width' },
      { name: 'Widget Resize Handle Height', token: 'var(--widget-resize-handle-height)', value: '40px', usage: 'Drag handle visual height' },
    ],
  },
]

const fonts = [
  { family: 'DM Sans', weights: '400, 500, 700', usage: 'Whole application' },
]

const componentGroups = [
  {
    title: 'Core UI',
    items: ['Button', 'Input', 'Switch', 'Tabs', 'Card', 'Breadcrumb', 'Separator'],
  },
  {
    title: 'Sidebar System',
    items: [
      'SidebarRoot',
      'SidebarHeader',
      'SidebarNav',
      'SidebarNavButton',
      'SidebarProfileArea',
      'SidebarProfileTrigger',
      'SidebarMenuPanel',
      'SidebarMenuLink',
      'SidebarMenuDisabledAction',
    ],
  },
]

const graphicsItems: Array<{ key: GraphicsAssetKey; title: string; description: string }> = [
  {
    key: 'platformSidebarLogo',
    title: 'Platform Sidebar Logo',
    description: 'Main logo shown in the left sidebar for Platform User.',
  },
  {
    key: 'profileImage',
    title: 'Default Profile Image',
    description: 'Default profile image used in sidebar and merchant header profile trigger.',
  },
  {
    key: 'merchantHeaderLogo',
    title: 'Merchant Header Logo',
    description: 'Logo shown in the top header for Merchant User.',
  },
  {
    key: 'walletSetupIcon',
    title: 'Wallet Setup Icon',
    description: 'Icon used in the "Set Up Wallet" button inside widget preview.',
  },
  {
    key: 'visaCardIcon',
    title: 'VISA Card Icon',
    description: 'Icon used for VISA card rows in widget preview.',
  },
  {
    key: 'mastercardCardIcon',
    title: 'Mastercard Card Icon',
    description: 'Icon used for Mastercard card rows in widget preview.',
  },
  {
    key: 'amexCardIcon',
    title: 'American Express Card Icon',
    description: 'Icon used for American Express card rows in widget preview.',
  },
  {
    key: 'applePayIcon',
    title: 'Apple Pay Icon',
    description: 'Small icon shown in the "Pay by other methods" button.',
  },
  {
    key: 'payPalIcon',
    title: 'PayPal Icon',
    description: 'Small icon shown in the "Pay by other methods" button.',
  },
  {
    key: 'googlePayIcon',
    title: 'Google Pay Icon',
    description: 'Small icon shown in the "Pay by other methods" button.',
  },
  {
    key: 'bankPayIcon',
    title: 'Bank Pay Icon',
    description: 'Small icon shown in the "Pay by Bank" button.',
  },
]

function resolveColorValue(value: string) {
  if (!value.startsWith('var(')) {
    return value
  }

  const varName = value.replace('var(', '').replace(')', '').trim()
  return `var(${varName})`
}

function resolveGraphicsWriteErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes('Project folder not connected')) {
      return 'Project folder not connected. Connect folder and retry Save to files.'
    }

    if (error.message.includes('project root, public folder, or public/graphics folder')) {
      return 'Connected folder is invalid. Connect project root, public, or public/graphics and retry.'
    }

    if (error.message.includes('not a supported image format')) {
      return 'Selected file is not a supported image.'
    }

    if (error.message.includes('is not supported for project save')) {
      return 'Selected image type is not supported for project save.'
    }

    if (error.name === 'NotAllowedError') {
      return 'No write permission for selected folder. Reconnect folder and allow write access.'
    }

    if (error.name === 'NotFoundError') {
      return 'Could not find public/graphics in the selected location. Reconnect correct project folder.'
    }
  }

  return 'Preview updated, but saving to project files failed. Click Save to files to retry.'
}

export function DesignSystemPage() {
  const [buttonClicks, setButtonClicks] = useState(0)
  const [sampleInput, setSampleInput] = useState('John Doe')
  const [isWalletEnabled, setIsWalletEnabled] = useState(true)
  const [selectedPlaygroundTab, setSelectedPlaygroundTab] = useState('filled')
  const [activeSidebarItem, setActiveSidebarItem] = useState<'merchants' | 'providers'>('merchants')
  const { graphics, updateGraphic, resetGraphic, resetAllGraphics } = useAppGraphics()
  const [pendingGraphics, setPendingGraphics] = useState<Partial<Record<GraphicsAssetKey, string>>>({})
  const [projectRootHandle, setProjectRootHandle] = useState<FileSystemDirectoryHandle | null>(null)
  const [isWritingFiles, setIsWritingFiles] = useState(false)
  const [graphicsWriteError, setGraphicsWriteError] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<GraphicsAssetKey, HTMLInputElement | null>>({
    platformSidebarLogo: null,
    profileImage: null,
    merchantHeaderLogo: null,
    walletSetupIcon: null,
    visaCardIcon: null,
    mastercardCardIcon: null,
    amexCardIcon: null,
    applePayIcon: null,
    payPalIcon: null,
    googlePayIcon: null,
    bankPayIcon: null,
  })

  const removePendingGraphic = (assetKey: GraphicsAssetKey) => {
    setPendingGraphics((prev) => {
      const next = { ...prev }
      delete next[assetKey]
      return next
    })
  }

  const connectProjectFolder = async () => {
    const selectedDirectory = await pickProjectRootDirectory()
    setProjectRootHandle(selectedDirectory)
    await storeProjectRootDirectory(selectedDirectory)
    setGraphicsWriteError(null)
    return selectedDirectory
  }

  const handleGraphicUpload = async (assetKey: GraphicsAssetKey, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const isLikelyImageFile = !!file && (
      file.type.startsWith('image/')
      || /\.(png|jpe?g|svg|webp|gif|avif|bmp|ico)$/i.test(file.name)
    )

    if (!file || !isLikelyImageFile) {
      return
    }

    try {
      const result = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('Unable to read the selected image.'))
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result)
            return
          }

          reject(new Error('Unable to read the selected image.'))
        }
        reader.readAsDataURL(file)
      })

      // Upload only updates preview and marks file as pending.
      // Persisting to public/graphics is an explicit Save to files action.
      updateGraphic(assetKey, result)
      setPendingGraphics((prev) => ({ ...prev, [assetKey]: result }))
      setGraphicsWriteError(null)
    } catch (error) {
      setGraphicsWriteError(resolveGraphicsWriteErrorMessage(error))
    } finally {
      setIsWritingFiles(false)
    }

    // Reset input value so re-uploading the same file still triggers change.
    event.target.value = ''
  }

  useEffect(() => {
    let isMounted = true

    loadStoredProjectRootDirectory()
      .then((storedHandle) => {
        if (isMounted && storedHandle) {
          setProjectRootHandle(storedHandle)
        }
      })
      .catch(() => {
        if (isMounted) {
          setProjectRootHandle(null)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleConnectProjectFolder = async () => {
    try {
      await connectProjectFolder()
    } catch {
      // User dismissed the folder picker or the browser does not support it.
    }
  }

  const handleWriteGraphic = async (assetKey: GraphicsAssetKey, imageDataUrl: string) => {
    let projectRoot = projectRootHandle
    if (!projectRoot) {
      projectRoot = await connectProjectFolder()
    }

    await saveGraphicAssetToProject(projectRoot, assetKey, imageDataUrl)
    updateGraphic(assetKey, imageDataUrl)
    removePendingGraphic(assetKey)
    setGraphicsWriteError(null)
  }

  const handleSaveAllPending = async () => {
    const pendingEntries = Object.entries(pendingGraphics) as Array<[GraphicsAssetKey, string]>
    if (pendingEntries.length === 0) {
      return
    }

    setIsWritingFiles(true)
    try {
      let projectRoot = projectRootHandle
      if (!projectRoot) {
        projectRoot = await connectProjectFolder()
      }

      await saveAllGraphicsToProject(projectRoot, pendingGraphics)

      for (const [assetKey, imageDataUrl] of pendingEntries) {
        updateGraphic(assetKey, imageDataUrl)
      }

      setPendingGraphics({})
      setGraphicsWriteError(null)
    } catch (error) {
      setGraphicsWriteError(resolveGraphicsWriteErrorMessage(error))
    } finally {
      setIsWritingFiles(false)
    }
  }

  const handleResetGraphic = async (assetKey: GraphicsAssetKey) => {
    setPendingGraphics((prev) => {
      const next = { ...prev }
      delete next[assetKey]
      return next
    })

    const defaultGraphic = defaultGraphicsAssets[assetKey]

    if (projectRootHandle) {
      setIsWritingFiles(true)
      try {
        await saveGraphicAssetToProject(projectRootHandle, assetKey, defaultGraphic)
      } finally {
        setIsWritingFiles(false)
      }
    }

    resetGraphic(assetKey)
  }

  const handleResetAllGraphics = async () => {
    setPendingGraphics({})

    if (projectRootHandle) {
      setIsWritingFiles(true)
      try {
        await saveAllGraphicsToProject(projectRootHandle, defaultGraphicsAssets)
      } finally {
        setIsWritingFiles(false)
      }
    }

    resetAllGraphics()
  }

  const handleClearConnectedProjectFolder = async () => {
    setProjectRootHandle(null)
    setGraphicsWriteError(null)
    await clearStoredProjectRootDirectory()
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <SiteNav />
      <main className="mx-auto w-full px-6 py-6">
        <h1 className="mb-6 text-3xl font-semibold text-[#111827]">Design System</h1>

        <Tabs defaultValue="app" className="space-y-6">
          <TabsList>
            <TabsTrigger value="app">App</TabsTrigger>
            <TabsTrigger value="pay-widget">Pay Widget</TabsTrigger>
          </TabsList>

          <TabsContent value="app" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {colors.map((color) => (
                    <div key={color.name} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: resolveColorValue(color.value) }} />
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{color.name}</p>
                        <p className="text-xs text-[#6b7280]">{color.value} · {color.usage}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fonts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fonts.map((font) => (
                    <div key={font.family} className="rounded-lg border p-4">
                      <p className="text-xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>{font.family}</p>
                      <p className="mt-1 text-sm text-[#6b7280]">Weights: {font.weights}</p>
                      <p className="text-sm text-[#6b7280]">Usage: {font.usage}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Component Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {componentGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="mb-2 text-sm font-semibold text-[#334155]">{group.title}</h3>
                    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {group.items.map((component) => (
                        <li key={component} className="rounded-lg border bg-white px-3 py-2 text-sm text-[#1f2430]">
                          {component}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Graphics</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#6b7280]">
                      {projectRootHandle ? `Project folder connected: ${projectRootHandle.name}` : 'Project folder not connected'}
                    </span>
                    <Button type="button" variant="outline" className="h-8 px-3 text-xs" onClick={handleConnectProjectFolder}>
                      {projectRootHandle ? 'Reconnect project folder' : 'Connect project folder'}
                    </Button>
                    {projectRootHandle ? (
                      <Button type="button" variant="ghost" className="h-8 px-3 text-xs" onClick={handleClearConnectedProjectFolder} disabled={isWritingFiles}>
                        Forget folder
                      </Button>
                    ) : null}
                    <Button type="button" variant="outline" className="h-8 px-3 text-xs" onClick={handleSaveAllPending} disabled={isWritingFiles || Object.keys(pendingGraphics).length === 0}>
                      Save pending
                    </Button>
                    <Button type="button" variant="outline" className="h-8 px-3 text-xs" onClick={handleResetAllGraphics} disabled={isWritingFiles}>
                      Restore defaults
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-[#475569]">
                  Upload updates preview immediately. Use
                  <span className="font-semibold"> Save to files</span> to write changes into
                  <span className="font-semibold"> public/graphics</span> in the project.
                </p>
                {graphicsWriteError ? <p className="text-sm text-[#b91c1c]">{graphicsWriteError}</p> : null}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {graphicsItems.map((item) => (
                    <div key={item.key} className="rounded-lg border bg-white p-4">
                      <p className="text-sm font-semibold text-[#111827]">{item.title}</p>
                      <p className="mt-1 text-xs text-[#6b7280]">{item.description}</p>

                      <div className="mt-3 flex h-24 items-center justify-center rounded-md border bg-[#f8fafc] p-2">
                        <img src={pendingGraphics[item.key] ?? graphics[item.key]} alt={item.title} className="max-h-full max-w-full object-contain" />
                      </div>

                      {pendingGraphics[item.key] ? <p className="mt-2 text-xs font-medium text-[#b45309]">Unsaved upload</p> : null}

                      <input
                        ref={(element) => {
                          fileInputRefs.current[item.key] = element
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          void handleGraphicUpload(item.key, event)
                        }}
                      />

                      <div className="mt-3 flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-8 px-3 text-xs"
                          onClick={async () => {
                            fileInputRefs.current[item.key]?.click()
                          }}
                        >
                          Upload
                        </Button>
                        <Button
                          type="button"
                          className="h-8 px-3 text-xs"
                          onClick={async () => {
                            const pendingGraphic = pendingGraphics[item.key]
                            if (!pendingGraphic) {
                              return
                            }

                            setIsWritingFiles(true)
                            try {
                              await handleWriteGraphic(item.key, pendingGraphic)
                            } catch (error) {
                              setGraphicsWriteError(resolveGraphicsWriteErrorMessage(error))
                            } finally {
                              setIsWritingFiles(false)
                            }
                          }}
                          disabled={!pendingGraphics[item.key] || isWritingFiles}
                        >
                          Save to files
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-8 px-3 text-xs"
                          onClick={async () => {
                            await handleResetGraphic(item.key)
                          }}
                          disabled={graphics[item.key] === defaultGraphicsAssets[item.key] && !pendingGraphics[item.key]}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interactive Playground</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-5 rounded-lg border bg-white p-4">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#111827]">Buttons</p>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setButtonClicks((prev) => prev + 1)}>Primary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                    </div>
                    <p className="mt-2 text-xs text-[#475569]">Primary clicked: {buttonClicks}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#111827]">Input</p>
                    <Input value={sampleInput} onChange={(event) => setSampleInput(event.target.value)} />
                    <p className="mt-2 text-xs text-[#475569]">Live value: {sampleInput || '(empty)'}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#111827]">Switch</p>
                    <div className="flex items-center gap-2">
                      <Switch checked={isWalletEnabled} onCheckedChange={setIsWalletEnabled} aria-label="Toggle wallet" />
                      <span className="text-sm text-[#334155]">Wallet enabled: {isWalletEnabled ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 rounded-lg border bg-white p-4">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#111827]">Tabs</p>
                    <Tabs value={selectedPlaygroundTab} onValueChange={setSelectedPlaygroundTab} className="w-full max-w-[320px]">
                      <TabsList>
                        <TabsTrigger value="filled">Filled</TabsTrigger>
                        <TabsTrigger value="outline">Outline</TabsTrigger>
                      </TabsList>
                      <TabsContent value="filled" className="text-xs text-[#475569]">
                        Filled style is selected.
                      </TabsContent>
                      <TabsContent value="outline" className="text-xs text-[#475569]">
                        Outline style is selected.
                      </TabsContent>
                    </Tabs>
                  </div>

                  <Separator />

                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#111827]">Breadcrumb</p>
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>Merchants</BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Leon</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>

                  <Separator />

                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#111827]">Sidebar Item</p>
                    <div className="w-full max-w-[260px] rounded-lg border border-[var(--sidebar-border-color)] bg-[var(--sidebar-bg)] p-2">
                      <SidebarNav className="p-0">
                        <SidebarNavButton active={activeSidebarItem === 'merchants'} onClick={() => setActiveSidebarItem('merchants')}>
                          <House className="h-4 w-4" />
                          Merchants
                        </SidebarNavButton>
                        <SidebarNavButton active={activeSidebarItem === 'providers'} onClick={() => setActiveSidebarItem('providers')}>
                          <WalletCards className="h-4 w-4" />
                          PSP Providers
                        </SidebarNavButton>
                      </SidebarNav>
                    </div>
                    <p className="mt-2 text-xs text-[#475569]">Click each item to test active, hover, focus and transition states.</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#111827]">Sidebar Profile Menu</p>
                    <div className="relative w-full max-w-[260px] rounded-lg border border-[var(--sidebar-border-color)] bg-[var(--sidebar-bg)] p-3">
                      <SidebarProfileMenu />
                    </div>
                    <p className="mt-2 text-xs text-[#475569]">Click the profile row to test menu interactions and route links.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pay-widget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Widget Color Tokens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-[#475569]">
                  Widget preview is scoped as an isolated instance via <span className="font-semibold">.widget-preview-instance</span>.
                  It uses a minimal color palette and inherits the current app colors by default through token fallbacks.
                  You can still override these tokens per embed instance.
                </p>
                <p className="text-sm text-[#475569]">
                  Legal caption links are part of widget design: they use <span className="font-semibold">var(--widget-color-primary)</span>,
                  underline, hover opacity and focus-visible ring.
                </p>
                {widgetColors.map((color) => (
                  <div key={color.name} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: resolveColorValue(color.value) }} />
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{color.name}</p>
                      <p className="text-xs text-[#6b7280]">{color.value} · {color.usage}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Widget Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-semibold text-[#111827]">Main Font</p>
                  <p className="mt-1 text-sm text-[#334155]">Token: {widgetTypography.fontFamily}</p>
                  <p className="text-sm text-[#334155]">Fallback: {widgetTypography.fallback}</p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="mb-2 text-sm font-semibold text-[#111827]">Heading Style</p>
                  <ul className="space-y-1">
                    <li className="text-sm text-[#334155]">Family: {widgetTypography.heading.family}</li>
                    <li className="text-sm text-[#334155]">Size: {widgetTypography.heading.size} (18px max)</li>
                    <li className="text-sm text-[#334155]">Weight: {widgetTypography.heading.weight}</li>
                    <li className="text-sm text-[#334155]">Line Height: {widgetTypography.heading.lineHeight}</li>
                  </ul>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="mb-2 text-sm font-semibold text-[#111827]">Font Weights</p>
                  <ul className="space-y-1">
                    {widgetTypography.weights.map((weight) => (
                      <li key={weight.name} className="text-sm text-[#334155]">
                        {weight.name}: {weight.token} ({weight.value})
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="mb-2 text-sm font-semibold text-[#111827]">Widget Size Scale</p>
                  <ul className="space-y-1">
                    {widgetTypography.sizes.map((size) => (
                      <li key={size.name} className="text-sm text-[#334155]">
                        {size.name}: {size.token} ({size.value}) · {size.usage}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Widget Layout Tokens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {widgetLayoutTokenGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="mb-3 text-sm font-semibold text-[#334155]">{group.title}</h3>
                    <div className="space-y-3">
                      {group.items.map((token) => (
                        <div key={token.name} className="rounded-lg border p-3">
                          <p className="text-sm font-semibold text-[#111827]">{token.name}</p>
                          <p className="text-xs text-[#6b7280]">{token.token} ({token.value})</p>
                          <p className="mt-1 text-xs text-[#475569]">{token.usage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
