---
version: alpha
name: KS WAYS Global Logistics
description: Premium ocean-led global logistics identity for KS WAYS CO., LTD.; dark control-tower confidence, teal route intelligence, and crisp B2B execution.
colors:
  primary: "#001112"
  secondary: "#031D20"
  tertiary: "#21D4C2"
  neutral: "#F4F7F6"
  ink: "#001112"
  paper: "#F4F7F6"
  white: "#FFFFFF"
  cyan: "#6FFFE7"
  blue: "#2D8CFF"
  muted: "#7D888A"
  success: "#007F74"
  border-dark: "#1F3436"
  border-light: "#D9E2E0"
typography:
  display-hero-mobile:
    fontFamily: Arial, Helvetica, sans-serif
    fontSize: 3.5rem
    fontWeight: 900
    lineHeight: 1.04
    letterSpacing: "-0.062em"
  display-hero-desktop:
    fontFamily: Arial, Helvetica, sans-serif
    fontSize: 7.25rem
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.075em"
  display-section:
    fontFamily: Arial, Helvetica, sans-serif
    fontSize: 4.75rem
    fontWeight: 900
    lineHeight: 0.96
    letterSpacing: "-0.07em"
  heading-card:
    fontFamily: Arial, Helvetica, sans-serif
    fontSize: 1.5rem
    fontWeight: 900
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  body-lg:
    fontFamily: Arial, Helvetica, sans-serif
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "-0.018em"
  body-md:
    fontFamily: Arial, Helvetica, sans-serif
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.01em"
  label-caps:
    fontFamily: Arial, Helvetica, sans-serif
    fontSize: 0.6875rem
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "0.16em"
rounded:
  sm: 12px
  md: 20px
  lg: 28px
  xl: 36px
  pill: 999px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  section-mobile: 80px
  section-desktop-x: 56px
  touch-min: 44px
  cta-height: 52px
components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
  hero-surface:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "0px"
  card-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 28px
  card-dark-glass:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.white}"
    rounded: "{rounded.xl}"
    padding: 20px
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: 14px
    height: "{spacing.cta-height}"
  button-primary-hover:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  button-secondary-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: 14px
    height: "{spacing.cta-height}"
  link-footer:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "{typography.body-md}"
    height: "{spacing.touch-min}"
  badge-network:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.ink}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.pill}"
    padding: 8px
  section-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "{spacing.section-mobile}"
  kicker-muted:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label-caps}"
  service-link-label:
    backgroundColor: "{colors.white}"
    textColor: "{colors.success}"
    typography: "{typography.label-caps}"
  route-accent-line:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.ink}"
    height: 4px
  dark-muted-label:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.muted}"
    typography: "{typography.label-caps}"
  dark-divider:
    backgroundColor: "{colors.border-dark}"
    textColor: "{colors.white}"
    height: 1px
  light-divider:
    backgroundColor: "{colors.border-light}"
    textColor: "{colors.ink}"
    height: 1px
---

## Overview

KS WAYS is presented as a premium global logistics company: ocean-led, air-capable, WCA-networked, and operationally accountable. The visual system should feel like a route control tower for international freight rather than a generic local forwarder.

The core impression is **dark control-tower confidence + luminous teal route intelligence + high-whitespace B2B clarity**. Use the identity to communicate global coverage, sea-freight strength, practical execution, and responsive partner cooperation. Avoid visual clichés that make the brand look small, domestic-only, or commodity freight.

Public naming must stay exact:

- Use **KS WAYS** for the brand.
- Use **KS WAYS CO., LTD.** for the legal company name.
- Preserve `ksways.co` and `info@ksways.co` as machine/domain identifiers.
- Do not collapse the brand into `KSWAYS` in visible copy, alt text, metadata, or navigation.

## Colors

The palette is intentionally narrow. It should create a premium logistics control-room feel while keeping CTAs and network proof points highly visible.

- **Primary / Navy Black (`#001112`)**: The core brand surface. Use for hero, network sections, footer, primary text on bright teal buttons, and high-authority panels.
- **Secondary / Deep Route Navy (`#031D20`)**: Secondary dark surface for gradients, route-map panels, and glass cards.
- **Tertiary / Route Teal (`#21D4C2`)**: Primary interaction and brand energy. Use for main CTA gradients, active accents, selection highlights, proof dividers, and route lines.
- **Cyan (`#6FFFE7`)**: Luminous highlight. Use sparingly for the word “global,” network labels, footer credential headings, and hover emphasis.
- **Blue (`#2D8CFF`)**: Supporting technology/network blue. Use as a secondary gradient stop, never as the main brand color.
- **Paper (`#F4F7F6`)**: Main light-page background. It should feel cooler and more operational than pure white.
- **White (`#FFFFFF`)**: Cards, text on dark surfaces, and contrast anchor.
- **Muted (`#7D888A`)**: Section kickers and low-emphasis labels on light backgrounds.
- **Success / Link Green (`#007F74`)**: Low-volume service-card link label color on white cards.

Use opacity overlays rather than adding new colors: white at 4–18% on dark surfaces, navy at 10–12% for light borders, and teal/cyan glows at low opacity for depth.

## Typography

The current site uses a system sans-serif stack: `Arial, Helvetica, sans-serif`. The tone is intentionally direct, compressed, and executive. The type should feel like modern logistics software and a premium freight partner—not decorative editorial branding.

- **Hero display**: Very heavy (`900`), tight letter spacing, and aggressive scale. Desktop line-height may be tight (`0.9`) for impact, but mobile must relax to `1.04` or higher to prevent CJK/Latin overlap.
- **Section display**: Heavy and condensed in rhythm, with negative tracking. Keep section headlines short and decisive.
- **Card headings**: Heavy (`900`) and compact, usually 20–24px.
- **Body copy**: 16–18px with relaxed line-height (`1.6–1.65`). Body tone should be practical, specific, and operational.
- **Kickers and badges**: All-caps, very small, bold labels with wide tracking (`0.14em–0.18em`). They should signal systems, routes, network, and proof.

For Korean copy, keep line-height more forgiving than English. Avoid long unbroken English labels on mobile unless the element can wrap without harming touch targets.

## Layout

The layout system is built around large, confident sections and strong responsive behavior.

- **Page frame**: `24px` side padding on mobile, `40px` on small/tablet, `56px` on desktop.
- **Section rhythm**: `80px` vertical rhythm for major sections. Keep generous whitespace so logistics content feels premium and trustworthy.
- **Hero**: Full-screen dark surface with a two-column desktop grid: narrative left, route-control visual right. On mobile, stack content and ensure CTAs are full-width.
- **Cards**: Use rounded white cards on paper backgrounds; use dark glass cards only inside dark hero/network/footer zones.
- **Grid behavior**: Prefer 1-column mobile, 2–3 columns tablet, and 5-column only when content is short and scan-friendly.
- **Touch targets**: Any clickable item must be at least `44px` high. Primary CTAs should be at least `52px` high and full-width on mobile.
- **Max width**: Footer and broad content containers can extend to `1500px`; text blocks should usually stay within `640–900px`.

No horizontal overflow is acceptable on `390px` mobile width. Any visual proof card, footer link, or CTA must be verified at mobile width before release.

## Elevation & Depth

Depth should feel like premium SaaS/logistics instrumentation, not decorative glassmorphism for its own sake.

- Use soft, large shadows for cards: examples include `0 18px 70px rgba(0,17,18,.06)` and `0 24px 90px rgba(0,17,18,.06)`.
- Use stronger dark-surface shadows for hero visual panels: examples include `0 34px 110px rgba(0,0,0,.44)`.
- Use inset white highlights at 4–8% opacity on dark glass panels to create depth.
- Teal/cyan glow may be used behind highlighted words, logo, badges, or route lines, but keep it restrained and operational.
- Avoid harsh drop shadows, neon-heavy effects, or consumer-gaming glow.

## Shapes

Shapes are rounded and confident, with pills reserved for actions and badges.

- **Pills**: CTAs, language toggles, badges, and compact control labels.
- **Large cards**: 28–38px radii for premium B2B surfaces.
- **Hero visual**: 32–38px radii for control-tower panels.
- **Footer credential cards**: 24px or 28px radius, with subtle borders and no excessive depth.
- **Route/stripe motifs**: Thin diagonal and horizontal route lines are allowed when they reinforce logistics/network movement.

Do not introduce sharp industrial corners unless the entire system is intentionally redesigned. Current KS WAYS should stay rounded, modern, and high-trust.

## Components

### Header

- Use the official reverse KS WAYS logo on dark surfaces.
- Navigation should be concise: Company, Services, Network, Solutions, Contact/Quote.
- Maintain `44px` minimum height for logo link, language toggle, contact link, and quote CTA.
- Desktop navigation may be hidden on smaller screens; preserve the quote CTA and language toggle.

### Hero

- Hero headline should center the global logistics promise and highlight “global” / “글로벌” in cyan.
- Primary CTA: quote/contact action with teal-to-cyan gradient, navy text, bold weight.
- Secondary CTA: partner/network exploration, outlined on dark surfaces.
- Proof strip: WCA, Ocean/Air, FCL/LCL. Keep proof labels compact and values bold.
- Route-control visual should suggest global network, technology, ocean/air/data coordination.

### Service Cards

- Use white cards on paper backgrounds with subtle borders.
- Service cards should communicate operational ownership: air freight, ocean freight, cross-border, project support, and BridgeLogis.
- For external services, open in a new tab and include accessible labeling.
- Avoid internal-margin, profit, or operationally sensitive language in public service cards.

### Network Section

- Use a dark section to create authority and contrast with the service area.
- WCA/member/partner coverage proof should be explicit and visible.
- Copy must position KS WAYS as globally connected, ocean-strong, and accountable—not merely Korea-based.

### Contact CTA

- Use a dark, rounded CTA block near the end of the page.
- Contact copy should encourage structured cargo details, partner introductions, or Zoom/Calendly consultation through `info@ksways.co`.
- Buttons must stack full-width on mobile and remain at least `52px` high.

### Footer

- Footer is a trust-closing surface, not a decorative afterthought.
- Include the official logo, global logistics tagline, WCA/ocean/air credential cards, company/service/contact navigation, legal company name, email, and copyright.
- Footer links must be at least `44px` high on mobile.
- Footer text must preserve `KS WAYS CO., LTD.` and `info@ksways.co`.

## Do's and Don'ts

### Do

- Do lead with global ocean and air logistics, WCA network, and ocean freight strength.
- Do use the official KS WAYS logo assets instead of text placeholders.
- Do keep CTAs clear: quote, partner enquiry, schedule consultation.
- Do verify mobile typography, CTA stacking, footer links, and proof cards at `390px` width.
- Do preserve high contrast between dark surfaces and white/cyan text.
- Do use `KS WAYS` with a space in public-facing brand copy.
- Do keep the public tone polished, concise, and partner-ready.

### Don't

- Do not describe KS WAYS primarily as a Korea-based local company.
- Do not spell the visible brand as `KSWAYS` or `KSWays`.
- Do not add arbitrary colors outside the navy/teal/cyan/blue/paper palette.
- Do not distort, recolor, or replace official logo assets with text-only placeholders.
- Do not create mobile CTAs that are narrow, cramped, or under `44px` high.
- Do not leak internal pricing, margin, or private operational assumptions into public copy.
- Do not rely on build success alone for design changes; use screenshot/DOM QA for production-facing UI.
