import { signal } from '@preact/signals'
import { checkDigitalGoodsCapability, fetchOwnedItemIds, purchaseItem } from '../utils/digitalGoods'

const STORAGE_KEY = 'owned-entitlements'

// Cached locally so a gated feature can render its unlocked state immediately
// on next launch, before the (async, TWA-only) Digital Goods query resolves.
const loadCachedItemIds = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Failed to load cached entitlements:', e)
  }
  return []
}

const persistItemIds = (itemIds: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itemIds))
  } catch (e) {
    console.error('Failed to persist entitlements:', e)
  }
}

export const ownedItemIds = signal<string[]>(loadCachedItemIds())
export const entitlementsLoading = signal(false)

export async function refreshEntitlements(): Promise<void> {
  if (!checkDigitalGoodsCapability().supported) return
  entitlementsLoading.value = true
  try {
    const itemIds = await fetchOwnedItemIds()
    ownedItemIds.value = itemIds
    persistItemIds(itemIds)
  } finally {
    entitlementsLoading.value = false
  }
}

export function hasEntitlement(itemId: string): boolean {
  return ownedItemIds.value.includes(itemId)
}

// Buys `itemId` via Play Billing, then re-syncs owned items so callers can
// trust hasEntitlement()/useEntitlement() immediately after this resolves.
export async function purchaseEntitlement(itemId: string): Promise<boolean> {
  const purchase = await purchaseItem(itemId)
  if (!purchase) return false
  await refreshEntitlements()
  return hasEntitlement(itemId)
}
