# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: overseas freight forwarders and WCA partners** who need a Korea origin agent. They usually arrive having already seen KS WAYS on WCAworld, or from search, and are checking whether this is a partner they can hand Korea-origin cargo to. Their job is to appoint a dependable Korea-side agent and then quote their own customers with confidence.
- **Secondary: Korean exporters, importers, manufacturers and brands** shipping from Korea to worldwide destinations. `/kr` is for them (confirmed 2026-10-31).

## Product Purpose

ksways.co is the public site of KSWAYS CO.,LTD. (brand: KS WAYS), a Korea-origin ocean and air logistics company. It exists to win **partner appointments**: an overseas forwarder decides to make KS WAYS its Korea origin agent and makes contact by email (`info@ksways.co`), WCAworld WQS or a consultation call. Quote requests through `/quote` matter, but they come after that relationship (confirmed 2026-10-31).

Success means a forwarder leaves understanding three things: what KS WAYS executes on the Korea side, that it is a real WCA member with industry depth, and how to start working together.

## Positioning

Locked in COPY.md, 2026-09-09:

1. **Offer:** ocean and air freight **from Korea to worldwide destinations**. Ocean-led, with air as the core companion mode. EXW pickup, special cargo and cross-border support round it out.
2. **Model:** global forwarding through **WCA partner networking**. KS WAYS is the Korea origin agent, not a marketplace or a rate shop.
3. **Never claim China, Japan or Northeast Asia regional coverage.** This is enforced by `content.test.ts`, `seo.test.ts` and `service-pages.test.ts`.

What a neighbouring forwarder can't copy: Korea-side execution (pickup, carrier coordination, documentation, handoff) by a team with 30+ years across airline cargo, express, shipping-line operations and forwarding, reachable through WCAworld's member tools.

## Operating Context

- Partners compare agents through the WCAworld directory, the WQS (member-only RFQ) and PartnerPay (member-to-member settlement). The site has to agree with how KS WAYS looks there.
- Contact paths:
  - `info@ksways.co`.
  - `/quote`, a structured form that builds a `mailto:`. There is no backend submission, and the sidebar summarises what has been entered.
  - Zoom or Calendly consultations.
  - An Intercom chat launcher.
- Routes: `/`, `/kr`, `/quote`, `/services/{air-freight,ocean-freight,special-cargo,exw-pickup}-korea`, `/network/korea-agent-network`. Planned in COPY.md: a cross-border service page, an insights guide, a contact page.
- Language: English is the primary and `x-default`. Korean lives at `/kr`. Korean service pages don't exist yet, but expanding `/kr` for Korean shippers is in scope.

## Capabilities and Constraints

- **Stack:** Next.js 16, React 19, Tailwind 4 and vitest, deployed on Vercel (scope `goodman-ksways`). Production is `ksways.co`. Local `next build` fails on macOS (known debt), so CI is the build gate.
- **Guard tests** cover palette, contrast, focus rings, browser target, typography, mobile touch targets, CSP and banned positioning. They are listed in AGENTS.md. Changes have to pass them; don't eyeball around them.
- **Terminology** (from COPY.md):
  - Prefer: Korea origin, worldwide destinations, WCA partner networking, Korea origin agent, shipment coordination, clear handoff.
  - Never use MLM, network marketing, passive income, guaranteed savings, cheapest rate, risk-free, or anything that reads as recruitment or a financial promise.
  - Don't promise outcomes that depend on carriers, customs or third parties.
- **Brand spelling:** "KS WAYS" (legal name KSWAYS CO.,LTD., 사업자등록번호 196-81-01177).
- **Open decision:** whether Korean service pages get built, and how the English subpages' language toggle should resolve until they do.

## Brand Commitments

- Voice: professional, direct, calm, and practical rather than exaggerated. KS WAYS is the Korea-side partner forwarders rely on.
- Assets in `public/assets/`:
  - KS WAYS logos: `ksways-logo-color.png` and `ksways-logo-reverse.png`.
  - WCA marks: `wcaworld-logo.svg`, `wca-inter-global-badge.svg`, `wca-wqs-seal.png` and `wca-partnerpay-seal.png`.
- DESIGN.md is the visual authority. PRODUCT.md records no visual decisions.

## Evidence on Hand

- **On the site now:**
  - WCA Inter Global membership.
  - WCAworld WQS and PartnerPay participation.
  - "30+ years" of combined industry experience across airline cargo, express, shipping lines and forwarding.
  - The hero photo is an Unsplash image whose attribution is still being fixed.
- **Confirmed to exist but not yet in the repo** (2026-10-31). Get each from the owner before using it, and never invent the specifics:
  - **Named trade lanes** with regular volume.
  - **Founder and team track record:** named people and their airline, shipping-line and express backgrounds.
  - **Real shipment examples:** special or project cargo, which may need anonymising.
- **Absent. Must not be fabricated:**
  - Client names and logos.
  - Testimonials.
  - Volumes, TEU counts and on-time percentages.
  - Pricing.
  - Certifications beyond the WCA marks above.

## Product Principles

1. **Partner-first.** Every page should answer a forwarder's question: can I hand my Korea-origin cargo to this agent?
2. **Show the Korea-side mechanism.** Pickup, documentation, carrier coordination and handoff should be concrete, not slogans. One specific fact beats a repeated badge.
3. **Say each proof once, where it does its job.** Membership and years of experience are credentials, not filler for every section.
4. **Never overclaim.** No regional coverage outside Korea-origin, no guaranteed outcomes, no invented evidence.
5. **Make contact easy everywhere.** The way to appoint or contact KS WAYS, and the switch to Korean, should be reachable from every page.

## Accessibility & Inclusion

- Body text must meet WCAG AA contrast, with floors fixed in DESIGN.md "Readability" and `text-contrast.test.ts`.
- Focus rings must be visible on every surface.
- Mobile touch targets are guarded by tests.
- Korean text keeps words whole (`break-keep`).
- Readers include non-native English speakers at overseas forwarders, so English copy stays plain.
