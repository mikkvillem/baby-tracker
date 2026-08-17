export const PLAY_BILLING_PAYMENT_METHOD = 'https://play.google.com/billing'

export type DigitalGoodsCapability = {
  supported: boolean
  reason?: string
}

// Only ever true inside the Android TWA served from a Play Store install with
// Play Billing enabled — never in a browser tab or the iOS/desktop PWA.
export function checkDigitalGoodsCapability(): DigitalGoodsCapability {
  if (typeof window === 'undefined') {
    return { supported: false, reason: 'No browser environment' }
  }
  if (!('getDigitalGoodsService' in window)) {
    return { supported: false, reason: 'Digital Goods API unavailable (not running inside the Play Store app)' }
  }
  return { supported: true }
}

let servicePromise: Promise<DigitalGoodsService | null> | null = null

function getService(): Promise<DigitalGoodsService | null> {
  if (!checkDigitalGoodsCapability().supported) return Promise.resolve(null)
  if (!servicePromise) {
    servicePromise = window
      .getDigitalGoodsService!(PLAY_BILLING_PAYMENT_METHOD)
      .catch(error => {
        console.error('Failed to get Digital Goods service:', error)
        return null
      })
  }
  return servicePromise
}

export async function fetchOwnedItemIds(): Promise<string[]> {
  const service = await getService()
  if (!service) return []
  try {
    const purchases = await service.listPurchases()
    return purchases.map(purchase => purchase.itemId)
  } catch (error) {
    console.error('Failed to list purchases:', error)
    return []
  }
}

export async function fetchItemDetails(itemIds: string[]): Promise<ItemDetails[]> {
  if (itemIds.length === 0) return []
  const service = await getService()
  if (!service) return []
  try {
    return await service.getDetails(itemIds)
  } catch (error) {
    console.error('Failed to get item details:', error)
    return []
  }
}

// Triggers the native Play Billing purchase sheet via the PaymentRequest API,
// which is how Digital Goods purchases are actually made (getDigitalGoodsService
// only queries state). Resolves to the completed purchase, or null if the
// platform can't purchase or the user backed out.
export async function purchaseItem(itemId: string): Promise<PurchaseDetails | null> {
  if (!checkDigitalGoodsCapability().supported || typeof PaymentRequest === 'undefined') {
    return null
  }
  try {
    const request = new PaymentRequest(
      [{ supportedMethods: PLAY_BILLING_PAYMENT_METHOD, data: { sku: itemId } }],
      { total: { label: 'Total', amount: { currency: 'USD', value: '0' } } }
    )
    const response = await request.show()
    await response.complete('success')
    const details = response.details as { purchaseToken?: string }
    if (!details.purchaseToken) return null
    return { itemId, purchaseToken: details.purchaseToken }
  } catch (error) {
    console.error('Purchase failed:', error)
    return null
  }
}

export async function consumeItem(purchaseToken: string): Promise<void> {
  const service = await getService()
  if (!service) return
  try {
    await service.consume(purchaseToken)
  } catch (error) {
    console.error('Failed to consume purchase:', error)
  }
}
