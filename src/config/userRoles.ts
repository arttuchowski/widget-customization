export type UserRoleId = 'platform' | 'merchant'

export const userRoleOptions: Array<{ id: UserRoleId; label: string }> = [
  { id: 'platform', label: 'Platform User' },
  { id: 'merchant', label: 'Merchant' },
]

export const defaultUserRole: UserRoleId = 'platform'
