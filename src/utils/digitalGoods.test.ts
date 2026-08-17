import { afterEach, describe, expect, it, vi } from 'vitest'
import { checkDigitalGoodsCapability, fetchItemDetails, fetchOwnedItemIds } from './digitalGoods'

describe('checkDigitalGoodsCapability', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports unsupported outside the Play Store TWA', () => {
    const windowWithoutDigitalGoods = { ...window }
    delete (windowWithoutDigitalGoods as { getDigitalGoodsService?: unknown }).getDigitalGoodsService
    vi.stubGlobal('window', windowWithoutDigitalGoods)
    const result = checkDigitalGoodsCapability()
    expect(result.supported).toBe(false)
    expect(result.reason).toBeTruthy()
  })

  it('reports supported when the Digital Goods API is present', () => {
    vi.stubGlobal('window', { ...window, getDigitalGoodsService: vi.fn() })
    const result = checkDigitalGoodsCapability()
    expect(result.supported).toBe(true)
  })
})

describe('fetchOwnedItemIds', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns an empty list when the API is unsupported', async () => {
    const windowWithoutDigitalGoods = { ...window }
    delete (windowWithoutDigitalGoods as { getDigitalGoodsService?: unknown }).getDigitalGoodsService
    vi.stubGlobal('window', windowWithoutDigitalGoods)
    await expect(fetchOwnedItemIds()).resolves.toEqual([])
  })

  it('maps purchases from the Digital Goods service', async () => {
    const listPurchases = vi.fn().mockResolvedValue([{ itemId: 'premium', purchaseToken: 'tok' }])
    vi.stubGlobal('window', {
      ...window,
      getDigitalGoodsService: vi.fn().mockResolvedValue({ listPurchases })
    })
    await expect(fetchOwnedItemIds()).resolves.toEqual(['premium'])
  })
})

describe('fetchItemDetails', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns an empty list for an empty request', async () => {
    await expect(fetchItemDetails([])).resolves.toEqual([])
  })
})
