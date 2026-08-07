import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { defaultUserRole, type UserRoleId } from '@/config/userRoles'

const USER_ROLE_STORAGE_KEY = 'rezolve-app-user-role'

interface AppUserRoleContextValue {
  userRole: UserRoleId
  setUserRole: (role: UserRoleId) => void
}

const AppUserRoleContext = createContext<AppUserRoleContextValue | null>(null)

interface AppUserRoleProviderProps {
  children: ReactNode
}

const resolveStoredUserRole = (): UserRoleId => {
  if (typeof window === 'undefined') {
    return defaultUserRole
  }

  const stored = window.localStorage.getItem(USER_ROLE_STORAGE_KEY)
  return stored === 'platform' || stored === 'merchant' ? stored : defaultUserRole
}

export function AppUserRoleProvider({ children }: AppUserRoleProviderProps) {
  const [userRole, setUserRole] = useState<UserRoleId>(resolveStoredUserRole)

  useEffect(() => {
    window.localStorage.setItem(USER_ROLE_STORAGE_KEY, userRole)
  }, [userRole])

  const value = useMemo(() => ({ userRole, setUserRole }), [userRole])

  return <AppUserRoleContext.Provider value={value}>{children}</AppUserRoleContext.Provider>
}

export function useAppUserRole() {
  const context = useContext(AppUserRoleContext)

  if (!context) {
    throw new Error('useAppUserRole must be used within AppUserRoleProvider')
  }

  return context
}
