import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { loadGraphicsOverridesFromPublic } from '@/lib/project-assets'

import defaultMerchantHeaderLogo from '@/assets/merchant-logo.png'
import defaultPlatformSidebarLogo from '@/assets/sidebar-app-logo.png'
import defaultProfileImage from '@/assets/sidebar-profile-placeholder.png'
import defaultWalletSetupIcon from '@/assets/wallet-setup-icon.svg'
import defaultVisaCardIcon from '@/assets/card-visa-icon.svg'
import defaultMastercardCardIcon from '@/assets/card-mastercard-icon.svg'
import defaultAmexCardIcon from '@/assets/card-amex-icon.svg'
import defaultApplePayIcon from '@/assets/pay-other-apple-icon.svg'
import defaultPayPalIcon from '@/assets/pay-other-paypal-icon.svg'
import defaultGooglePayIcon from '@/assets/pay-other-google-icon.svg'
import defaultBankPayIcon from '@/assets/pay-bank-icon.svg'

type GraphicsAssetKey =
  | 'platformSidebarLogo'
  | 'profileImage'
  | 'merchantHeaderLogo'
  | 'walletSetupIcon'
  | 'visaCardIcon'
  | 'mastercardCardIcon'
  | 'amexCardIcon'
  | 'applePayIcon'
  | 'payPalIcon'
  | 'googlePayIcon'
  | 'bankPayIcon'

type GraphicsState = Record<GraphicsAssetKey, string>

const defaultGraphicsAssets: GraphicsState = {
  platformSidebarLogo: defaultPlatformSidebarLogo,
  profileImage: defaultProfileImage,
  merchantHeaderLogo: defaultMerchantHeaderLogo,
  walletSetupIcon: defaultWalletSetupIcon,
  visaCardIcon: defaultVisaCardIcon,
  mastercardCardIcon: defaultMastercardCardIcon,
  amexCardIcon: defaultAmexCardIcon,
  applePayIcon: defaultApplePayIcon,
  payPalIcon: defaultPayPalIcon,
  googlePayIcon: defaultGooglePayIcon,
  bankPayIcon: defaultBankPayIcon,
}

interface AppGraphicsContextValue {
  graphics: GraphicsState
  updateGraphic: (assetKey: GraphicsAssetKey, imageDataUrl: string) => void
  resetGraphic: (assetKey: GraphicsAssetKey) => void
  resetAllGraphics: () => void
}

const AppGraphicsContext = createContext<AppGraphicsContextValue | null>(null)

interface AppGraphicsProviderProps {
  children: ReactNode
}

export function AppGraphicsProvider({ children }: AppGraphicsProviderProps) {
  const [graphics, setGraphics] = useState<GraphicsState>(defaultGraphicsAssets)

  useEffect(() => {
    let isMounted = true

    loadGraphicsOverridesFromPublic()
      .then((overrides) => {
        if (!isMounted) {
          return
        }

        setGraphics((prev) => ({ ...prev, ...overrides }))
      })
      .catch(() => {
        // Ignore optional overrides loading errors.
      })

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo<AppGraphicsContextValue>(
    () => ({
      graphics,
      updateGraphic: (assetKey, imageDataUrl) => {
        setGraphics((prev) => ({ ...prev, [assetKey]: imageDataUrl }))
      },
      resetGraphic: (assetKey) => {
        setGraphics((prev) => ({ ...prev, [assetKey]: defaultGraphicsAssets[assetKey] }))
      },
      resetAllGraphics: () => {
        setGraphics(defaultGraphicsAssets)
      },
    }),
    [graphics],
  )

  return <AppGraphicsContext.Provider value={value}>{children}</AppGraphicsContext.Provider>
}

export function useAppGraphics() {
  const context = useContext(AppGraphicsContext)

  if (!context) {
    throw new Error('useAppGraphics must be used within AppGraphicsProvider')
  }

  return context
}

export { defaultGraphicsAssets }
export type { GraphicsAssetKey }
