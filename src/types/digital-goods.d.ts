// Ambient types for the Digital Goods API (Chrome/Android, exposed inside a
// Trusted Web Activity backed by Google Play Billing). Not part of lib.dom.
// https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing

interface ItemPrice {
  currency: string
  value: string
}

interface ItemDetails {
  itemId: string
  title: string
  description: string
  price: ItemPrice
  type?: 'product' | 'subscription'
  subscriptionPeriod?: string
  freeTrialPeriod?: string
  introductoryPrice?: ItemPrice
  introductoryPricePeriod?: string
  introductoryPriceCycles?: number
}

interface PurchaseDetails {
  itemId: string
  purchaseToken: string
}

interface DigitalGoodsService {
  getDetails(itemIds: string[]): Promise<ItemDetails[]>
  listPurchases(): Promise<PurchaseDetails[]>
  listPurchaseHistory(): Promise<PurchaseDetails[]>
  consume(purchaseToken: string): Promise<void>
}

interface Window {
  getDigitalGoodsService?(paymentMethod: string): Promise<DigitalGoodsService>
}

interface PaymentCurrencyAmount {
  currency: string
  value: string
}

interface PaymentDetailsInit {
  total: {
    label: string
    amount: PaymentCurrencyAmount
  }
}

interface PaymentMethodData {
  supportedMethods: string
  data?: Record<string, unknown>
}

interface PaymentResponse {
  details: Record<string, unknown>
  complete(result: 'success' | 'fail' | 'unknown'): Promise<void>
}

declare class PaymentRequest {
  constructor(methodData: PaymentMethodData[], details: PaymentDetailsInit)
  show(): Promise<PaymentResponse>
}
