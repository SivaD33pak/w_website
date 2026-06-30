# Wedding Website Handoff

## Project State

This workspace contains a wedding invitation page under `frontend/`.

- `frontend/main.html` is the main page markup.
- `frontend/styles.css` contains the extracted shared CSS.
- The embedded `<style>` block was already removed from `main.html` and moved into `styles.css`.

## What Has Been Completed

- Extracted the inline embedded CSS into `frontend/styles.css`.
- Added shared utility classes for repeated page elements.
- Cleaned up the nav badge, nav links, hero shell, hero card, story copy, event cards, RSVP form, gallery overlays, and footer styling.
- Fixed a broken nav/logo markup issue that previously caused a syntax error.
- Removed a CSS warning related to a block-level `vertical-align` rule.
- Validated `frontend/main.html` and `frontend/styles.css` with no errors after the latest refactor pass.

## Shared Classes Already Added

The CSS file now includes reusable classes such as:

- `export-shell`
- `site-nav`
- `nav-link`, `nav-link-active`, `nav-button`, `nav-button-ring`
- `nav-badge`, `nav-badge-ring`, `nav-badge-dot-gold`, `nav-badge-dot-rose`
- `nav-brand-name`, `nav-brand-subtitle`, `nav-links`, `nav-link-underline`
- `hero-shell`, `hero-layer-0`, `hero-layer-1`, `hero-layer-2`, `hero-layer-3`, `hero-content`
- `hero-card`, `hero-card-segment`, `hero-card-day`, `hero-kicker`, `hero-kicker-line`, `hero-kicker-line-right`, `hero-kicker-line-left`
- `hero-quote`, `hero-verse`, `hero-heart-line`, `story-copy`
- `event-card`, `event-card-title`, `event-divider`, `event-date`, `event-venue`, `event-location`, `event-dot`, `event-dot-inner`
- `rsvp-label`, `rsvp-field`, `rsvp-field-muted`, `rsvp-option-text`, `rsvp-submit`
- `gallery-tile`, `gallery-overlay`, `gallery-zoom`, `gallery-aspect-3-4`, `gallery-aspect-4-3`, `gallery-aspect-1-1`, `gallery-aspect-1-3`, `gallery-aspect-16-9`
- `section-footer`, `footer-divider`, `footer-title`, `footer-ampersand`, `footer-subtitle`, `footer-social`, `footer-note`

## Current Status

The latest edits focused on reducing repeated inline styles in the nav, hero, gallery, and footer. The page still has some inline styles left in `frontend/main.html`, but the file is valid and the most repetitive patterns have already been centralized.

## Remaining Cleanup Ideas

If continuing the refactor, the next highest-value targets are:

1. Remaining one-off decorative inline styles in the verse section.
2. A few unique spacing/z-index/layout inline styles that are still scattered through the page.
3. Optional split into section partials, if a templating layer is introduced later.

## Validation

Recent validation showed no errors in:

- `frontend/main.html`
- `frontend/styles.css`

## Notes For The Next Agent

- Keep patches small and ordered; large multi-hunk edits against this file have been fragile.
- Re-run validation after each focused slice.
- If you want to continue removing inline styles, start from the remaining `style="..."` matches in `frontend/main.html` and extract only repeated clusters, not unique generated decoration values.