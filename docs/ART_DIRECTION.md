# Art direction

Single source of truth for how illustration and visual identity should look.
Anything drawn for the app (logo, mascot, empty states, backdrops, rewards)
should be checkable against this page.

## Master prompt

> Sophisticated playful bear illustration, contemporary editorial graphic
> style, Nordic nature + modern children's book, bold geometric shapes mixed
> with organic forms, flat vector construction, warm cream/forest/moss/slate
> palette with honey/coral accents, strong silhouette, minimal facial detail,
> layered poster-like landscape, subtle tactile print texture, asymmetrical
> composition, premium digital product aesthetic. Avoid photorealism, glossy
> 3D, generic kawaii, excessive gradients and tiny details.

Use verbatim as the base for any AI-generated reference; append only the
subject (e.g. "bear cub asleep in a den").

## Do / Don't

| Do | Don't |
| --- | --- |
| Editorial, warm, graphic, quirky, natural | Generic kawaii |
| Bold silhouettes | Glossy 3D, photoreal bears |
| Layered scenes | Excessive gradients |
| Selective texture | Thin, fussy linework |
| | Visual noise |

## Colour rule

One dominant colour + one supporting colour + one accent per piece. Keep it
warm, earthy and intentional.

- Base: cream (surface-50/100)
- Dominant / supporting: forest, moss, slate, bear-brown
- Accent: honey (primary-300/400) or coral — one per illustration

## Three illustration modes

All three must clearly belong to the same visual universe: same shape
language (circles, ellipses, rounded rects), same palette, same minimal face.

### A — Icon
Extremely simplified. Bear face in 3–5 shapes. No scene, no texture.
Used for: navigation, rewards, buttons, notifications, tiny UI, favicon.
Must read at 16–24 px.

### B — Character
Medium complexity. Full bear + pose + one object.
Used for: onboarding, empty states, interaction, achievements, cards.

### C — Scene
Rich composition. Bear + landscape + environmental storytelling, layered like
a poster (sky / far hills / near hills / trees / bear), asymmetrical, with
selective print texture.
Used for: home, landing screens, major sections, loading, achievements,
seasonal experiences.

## Current assets vs. the direction

| Asset | Mode | Status |
| --- | --- | --- |
| `public/logo.svg` | A Icon | Close: 5 flat shapes. Uses a ring + honey-on-honey, so it lacks a strong silhouette; needs a forest/slate dominant. |
| `src/components/BearScene.tsx` | B/C hybrid | Flat and mood-driven, but sky/hills are simple blobs with opacity; no layered poster depth, no texture, cub is centred (not asymmetrical). |
| `public/backdrop.svg` | C Scene | Uses linear gradients and many opacity washes — the opposite of the "flat, no excessive gradients" rule. Bears are plain silhouettes. |
| `app.css` backdrop | — | Stacks 4 radial gradients + dot grid + stripes: visual noise. |
| Palette (`@theme`) | — | Dominant is honey/caramel; direction asks for cream/forest/moss/slate dominant with honey/coral as accent. Biggest open decision. |
