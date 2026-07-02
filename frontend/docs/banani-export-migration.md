# Banani Export Stabilization

The generated Banani page is preserved as reference material and should not be treated as the long-term application source.

## Preserved Reference Files

- `frontend/reference/banani-export.html`
- `frontend/reference/banani-export.css`

## New Source Of Truth

- `frontend/lib/wedding-content.ts` contains the extracted couple details, event data, section order, theme tokens, RSVP field contract, and reusable image references.
- Future Next.js components should import from this file instead of copying text and URLs from `frontend/main.html`.

## Asset Notes

- The original export included preload links to `/api/flow-image/...`. Those URLs depend on Banani's internal runtime and will break in a normal browser, Next.js app, or static deployment.
- The active export now uses stable `https://storage.googleapis.com/banani-generated-images/...` URLs for those generated preload hints.
- Firebase and Google Storage URLs are still remote dependencies. For production, download approved final images into `frontend/public/images/` and update `wedding-content.ts` to use local paths.

## Migration Guidance

1. Keep `frontend/main.html` only as a temporary visual fallback while React components are built.
2. Build new components from `frontend/lib/wedding-content.ts`.
3. Move visual tokens from `frontend/styles.css` into Tailwind theme values when the Next.js scaffold is introduced.
4. Replace decorative generated markup with React components and real form controls.
5. Wire RSVP fields to the FastAPI contract described in `ARCHITECTURE.md`.
