# Android TWA (Trusted Web Activity)

Wraps the deployed PWA in a minimal Android app for the Play Store, using
[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap). This lets the
app be listed on Play while still being 100% the same web app — no separate
native codebase to maintain.

`twa-manifest.json` in this directory is a hand-authored scaffold (Bubblewrap
wasn't run against a live deployment yet — see "Why hand-authored" below). It
has `features.playBilling.enabled: true`, which is what makes the
[Digital Goods API](https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing)
available to the web app when running inside this TWA — that's what
`useDigitalGoods()` / `useEntitlement()` in `src/hooks` talk to.

## Finishing setup once the app is deployed

1. **Deploy the app** and note its real domain (`npm run deploy`).

2. **Fill in the domain** in `twa-manifest.json`: replace every
   `REPLACE_WITH_YOUR_DOMAIN` with the real host (no protocol for `host`,
   full `https://` URLs elsewhere). Also double check `packageId`
   (`com.mikkvillem.babytracker`) is the application ID you want — it can't
   be changed after the app is published to Play.

3. **Generate the Android project and signing key.** With JDK 17+ and the
   Android SDK available (Bubblewrap can install both on first run):

   ```sh
   cd twa
   npx @bubblewrap/cli build
   ```

   The first `build` run will offer to generate `android.keystore` (the path
   configured in `signingKey`) — do that unless you already have a release
   keystore. **Back this file up somewhere safe and never commit it** — losing
   it means you can never update the Play Store listing again. `twa/` is
   already covered by an entry in the repo's `.gitignore` for the keystore
   and build output.

   Alternatively, regenerate `twa-manifest.json` itself from scratch against
   the live manifest instead of editing the placeholder by hand:

   ```sh
   npx @bubblewrap/cli init --manifest https://<your-domain>/manifest.webmanifest
   ```

4. **Get the SHA-256 certificate fingerprint** for `assetlinks.json`:

   ```sh
   keytool -list -v -keystore android.keystore -alias android
   ```

   (Or read it from Play Console → Setup → App integrity, once the app has
   been uploaded — Play re-signs the app with its own key, so the
   Play-side fingerprint is the one that must end up in `assetlinks.json`
   for a production release.)

5. **Update `public/.well-known/assetlinks.json`** (repo root, not this
   directory — it must be served from the PWA's own origin) with the real
   `package_name` and `sha256_cert_fingerprints`, then redeploy the web app.
   Verify it with Google's
   [Digital Asset Links tool](https://developers.google.com/digital-asset-links/tools/generator)
   before publishing — a mismatch here means the TWA opens as a browser tab
   with an address bar instead of a trusted fullscreen app, and Play Billing
   won't work at all.

6. **Build the release bundle**: `npx @bubblewrap/cli build` again produces
   `app-release-bundle.aab` for upload to Play Console.

## Why hand-authored instead of running `bubblewrap init` live

`bubblewrap init` fetches the manifest from a running deployment, downloads
the Android SDK/JDK on first use (can be 1GB+), and asks a battery of
interactive questions — none of which is reproducible in a scaffolding pass
before the app is deployed anywhere. `twa-manifest.json` here mirrors the
structure `init` would have produced so `bubblewrap build` (step 3 above)
can be run directly once the placeholders are filled in, or you can throw it
away and run `init` fresh against the real deployed manifest.

## Play Billing (Digital Goods) scope

- `features.playBilling.enabled: true` is Android/Play-only. There is no
  equivalent purchase API for the iOS or desktop web app — Apple requires
  StoreKit inside a native app for in-app purchases, which is a separate,
  much larger project (e.g. wrapping the PWA with Capacitor) than this TWA
  scaffold. `useEntitlement()` returns `owned: false` with a `supported:
  false` reason everywhere except the Android TWA; it does not attempt to
  gate anything on iOS.
- Create the actual in-app products/subscriptions in Play Console (Monetize
  → Products) before `useDigitalGoods()` can fetch their price/details — the
  SKUs referenced from the app must match the product IDs configured there.
- Entitlement checks here trust the on-device Digital Goods API result
  directly; there's no server-side purchase verification (matching the rest
  of the app's local-first, no-backend design). If a gated feature ever
  becomes valuable enough to be worth spoofing, add server-side verification
  against the Play Developer API at that point.
