import { useCallback, useEffect, useState } from 'preact/hooks'
import { checkDigitalGoodsCapability, fetchItemDetails } from '../utils/digitalGoods'
import { entitlementsLoading, ownedItemIds, purchaseEntitlement, refreshEntitlements } from '../store/entitlements'

// Low-level hook for building a paywall/store UI: product details + prices for
// `itemIds`, which of them are owned, and a purchase() to buy one. Only ever
// functional inside the Android Play Store TWA — check `supported` first.
export function useDigitalGoods(itemIds: string[]) {
  const { supported, reason } = checkDigitalGoodsCapability()
  const [items, setItems] = useState<ItemDetails[]>([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const itemIdsKey = itemIds.join(',')

  const loadDetails = useCallback(async () => {
    if (!supported || !itemIdsKey) return
    setDetailsLoading(true)
    try {
      setItems(await fetchItemDetails(itemIdsKey.split(',')))
    } finally {
      setDetailsLoading(false)
    }
  }, [supported, itemIdsKey])

  useEffect(() => {
    loadDetails()
    if (supported) refreshEntitlements()
  }, [loadDetails, supported])

  return {
    supported,
    unsupportedReason: reason,
    items,
    loading: detailsLoading || entitlementsLoading.value,
    ownedItemIds: ownedItemIds.value,
    purchase: purchaseEntitlement,
    refresh: refreshEntitlements
  }
}
