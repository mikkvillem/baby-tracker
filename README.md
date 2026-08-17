# Baby Tracker

A local-first PWA for tracking feedings, sleep, and diaper changes. All data lives in IndexedDB on-device — nothing is sent to a server.

## Roadmap

### Feature pack: Cloud sync & real push notifications (opt-in, trades away full local privacy)

Feeding notifications today are scheduled client-side and only fire while the app/tab is open. Getting real push — delivered even when the app is fully closed — requires a backend, which means this would ship as an **opt-in** pack for users willing to move some data off-device:

- VAPID keypair for signing push messages
- Subscription storage (e.g. Cloudflare D1/KV) mapping devices to `PushSubscription` endpoints
- A cron trigger (e.g. Cloudflare Cron Triggers) that periodically evaluates each user's feeding data against their notification settings and decides when to send
- Server-side sending via the Web Push protocol
- A custom service worker `push` event handler (requires switching vite-plugin-pwa from `generateSW` to `injectManifest`)
- Subscription rotation/re-registration handling
- At least partial sync of feeding data (last feeding time + settings) to the backend, since the cron job can't read a client's local IndexedDB — this is the biggest structural change, as it moves the app from fully local-only to a hybrid model

This should stay clearly opt-in and separate from the default local-only experience.

### Feature pack: Play Store paid features (scaffolded, not wired to any feature yet)

`twa/` has a Bubblewrap scaffold for wrapping the app as an Android Trusted
Web Activity with Play Billing enabled, and `src/hooks/useDigitalGoods.ts` /
`src/hooks/useEntitlement.ts` give components a way to check/purchase
entitlements via the Digital Goods API. No feature is gated behind this yet —
that's a product decision for later. See `twa/README.md` for what's left to
finish (real domain, signing key, `assetlinks.json`) before this can ship.

Play Billing only exists on Android/Play — there's no equivalent on iOS, so
"Apple Store buyers" isn't covered by this pack. Gating a feature for iOS
purchasers would need a separate native wrapper (StoreKit), which is a much
bigger project than this scaffold.
