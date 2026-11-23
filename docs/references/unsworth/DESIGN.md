# Unsworth benchmark for KS WAYS Web

Reference only · 24 November 2026 (KST) · No change to the live site

[Unsworth homepage](https://www.unsworth.uk/) · [Air freight](https://www.unsworth.uk/services/air-freight) · [Freight management](https://www.unsworth.uk/solutions/freight-management) · [Knowledge Hub](https://www.unsworth.uk/resources/knowledge-hub) · [Case studies](https://www.unsworth.uk/resources/case-studies) · [Contact](https://www.unsworth.uk/contact)

Compared with the [current KS WAYS homepage](https://ksways.co/), [DESIGN.md](../../../DESIGN.md) and [COPY.md](../../../COPY.md). Observations are based on the public page text, a rendered 1920px desktop full-page capture and the opening sections of a rendered 390px mobile capture. Third-party captures, artwork, copy and assets are not bundled. Animation timing, hover behavior and mobile menu interaction were not evaluated.

## 1. Layout and navigation

| Reference pattern | What was seen at Unsworth | Apply to KS WAYS |
| --- | --- | --- |
| One objective per screen | Centered outcome-led hero; one button per state. Four icon-led topic controls appear in a row on desktop and as labelled stacked rows on mobile. | Keep one static, Korea-origin hero. Make **Get a Quote** the primary action and the existing **Partner Network** path secondary. Do not reproduce the hero carousel or put Careers on equal footing. |
| Easy service comparison | FCL, LCL and Air are three aligned cards on desktop, each with operational imagery, a short use case and a next step. | Keep Ocean first with FCL/LCL clearly distinguishable, then Air and Special Cargo. Point to existing destination pages; do not create thin pages only to mirror the reference. |
| One proof-led feature | A full-bleed Pathway feature separates core services from a six-item capabilities grid; the section has its own CTA. | Use this emphasis for **Korea-side shipment coordination**, not a software pitch: cargo and origin details → routing and quote → pickup/carrier handoff → updates and exceptions. Refine the existing enquiry section instead of duplicating it. |
| Editorial pacing | The desktop homepage alternates neutral content surfaces, wide imagery/CTA breaks, and photo-text split rows. The footer groups links by purpose. | Reuse the rhythm in one or two high-value sections. Maintain the current hierarchy: hero → proof → ocean/air/special services → operating or network proof → FAQ → enquiry. Keep footer destinations predictable. |

## 2. Visual system: reference vs. implementation

- **Observed at Unsworth:** light neutral hero with thin contour lines, large blue sans-serif typography, rounded solid/outline buttons, consistent card image crops, restrained body text, and darkened full-width photography where the text needs contrast. Split sections use diagonally framed logistics imagery with a thin accent outline. At 390px the header collapses to a menu button, the hero remains centered, and topic controls and early content read vertically.
- **Automated branding extraction, not target tokens:** Roboto; reference blues `#0056A3`, `#004D9A`, `#00A5E6`; neutral `#F3F3F3`; extracted CTA corner radius 32px. These are sample component roles from the capture, not a complete stylesheet audit. Exact spacing and mobile type values were not verified.
- **KS WAYS implementation:** keep the existing system-sans typography, dark control-tower base, bronze actions and warm-gold accents from root [DESIGN.md](../../../DESIGN.md). Transfer hierarchy, whitespace, visual grouping and contrast, not the reference palette, contour artwork, icons, typography, wording or exact proportions. Use owned or licensed photos of Korea-origin operations, with one job per image (port/containers, cargo handling, or real coordination). No borrowed dashboard screenshot and no unverified image implication.

## 3. Content and conversion

- **Hero:** say who the site is for and what KS WAYS does before claiming an outcome. Working examples: **Korea-origin freight for global forwarding partners** / **해외 포워더를 위한 한국발 해상·항공 물류**. These are working examples, not approved public copy. Ocean leads; Air remains a core companion.
- **Service template:** adapt the [Air Freight](https://www.unsworth.uk/services/air-freight) progression: audience/need → service scope → practical benefits → FAQ → relevant action. For every KS WAYS service, spell out when to choose it, what data to send, who owns which handoff, and what needs carrier or shipment-level confirmation. Quote intake can use existing cargo, route, Incoterms, weight and schedule fields.
- **Trust and resources:** borrow Knowledge Hub / Case Studies separation only when there is material. Start with existing Incoterms and pickup guidance; add anonymized lane stories only with verified facts and approved use. Label **challenge → action → verified result** rather than presenting earlier prices, transit times, or outcomes as promises. Distinguish individual industry experience from company age.
- **CTA paths:** shipment enquiries → [Quote](https://ksways.co/quote); agency cooperation → [Korea Agent Network](https://ksways.co/network/korea-agent-network) and current partner contact; general consultation remains secondary. The quote route prepares an email for the visitor to review and send; do not describe it as automatic booking or an immediate rate.
- **Claim guardrails:** do not borrow Pathway, real-time tracking, customs brokerage, global office counts, sustainability claims, or network statistics as KS WAYS capabilities. Keep Korea-origin positioning and audience per [COPY.md](../../../COPY.md), use confirmed WCA positioning only, and avoid unverified service or coverage claims.

## 4. Recommended implementation order (separate future work)

1. Update hero message and CTA prominence on `/` and `/kr`, keeping the two languages equivalent in intent.
2. Improve the existing Ocean/Air/Special service grouping with distinct use cases and clear links.
3. Strengthen the existing operating-flow section and route-specific FAQs; add verified proof only where it helps a decision.
4. Check both languages on phone and desktop: headline wrapping, keyboard/focus and touch targets, contrast, no horizontal overflow, CTA destinations and quote email handoff. Prefer a static first screen and check reduced-motion behavior if motion is ever added.

This document is a public-facing benchmark record for project contributors; neither the implementation nor a deployment is part of this change.
