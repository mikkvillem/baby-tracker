import { useEffect } from 'preact/hooks'
import { checkDigitalGoodsCapability } from '../utils/digitalGoods'
import { entitlementsLoading, ownedItemIds, refreshEntitlements } from '../store/entitlements'

// Feature-gating hook: `owned` is reactive (backed by the entitlements
// signal) and starts from the last locally-cached result, so a previously
// unlocked feature doesn't flash locked while the Play Billing query runs.
// Outside the Android TWA (web, iOS, desktop) `owned` is always false and
// `supported` tells you why, so gated UI can fall back to "Android only".
export function useEntitlement(itemId: string) {
  const { supported, reason } = checkDigitalGoodsCapability()

  useEffect(() => {
    if (supported) refreshEntitlements()
  }, [supported])

  return {
    owned: ownedItemIds.value.includes(itemId),
    loading: entitlementsLoading.value,
    supported,
    unsupportedReason: reason
  }
}
