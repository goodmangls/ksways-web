# KS WAYS Website Copy, SEO, and AEO Strategy

This document defines the professional public copy direction for `ksways.co` and provides a scalable content system for search engine optimization (SEO) and answer engine optimization (AEO).

It should be used as the source of truth for homepage copy, service-page expansion, FAQ snippets, structured data, blog topics, and future landing pages.

> **Positioning lock (2026-09-09)**
>
> 1. **Main offer**: Ocean and air logistics **from Korea to worldwide destinations** (ocean-led, air as core companion).
> 2. **Business model**: Global forwarding through **WCA partner networking** — primary audience is overseas freight forwarders / WCA partners who appoint KS WAYS as Korea origin agent.
> 3. **Do not claim China/Japan or NE Asia regional coverage — anywhere.** The business is Korea-origin ocean and air; regional-coverage language misstates it. Removed from the live site on 2026-09-17, and `content.test.ts` / `seo.test.ts` / `service-pages.test.ts` now fail the build if it returns. Keep Korea geography. Exporters/importers/brands remain secondary audiences.

---

## 1. Brand Positioning

### Core positioning

KS WAYS is a Korea-origin ocean and air logistics company that moves cargo from Korea to worldwide destinations, with ocean freight as its core strength. Through WCA partner networking, KS WAYS serves as the Korea origin agent for overseas freight forwarders and WCA partners who need reliable local execution, routing, and shipment coordination out of Korea.

### One-line positioning

**KS WAYS delivers ocean and air freight from Korea to worldwide destinations through WCA partner networking, serving overseas forwarders as their trusted Korea origin agent.**

### Short positioning paragraph

KS WAYS is a Korea-origin global logistics company providing ocean freight and air freight from Korea to worldwide destinations. Our primary role is Korea origin agent for overseas freight forwarders and WCA partners: we handle local pickup, carrier coordination, documentation, and shipment execution so partners can offer Korea-origin lanes with confidence. Ocean freight is our core strength, air freight is a core companion mode, and EXW pickup, special cargo handling, and cross-border support round out our service capability. WCA partner networking drives our global reach.

### What KS WAYS should sound like

- Professional, direct, and calm.
- Korea-origin, ocean-strong, and partner-network driven global forwarding.
- Practical rather than exaggerated.
- The Korea-side partner overseas forwarders rely on — not a marketplace or generic rate shop.
- Clear about capabilities without promising outcomes that depend on carriers, customs, or third parties.

### Words to prefer

- Korea origin
- Worldwide destinations
- WCA partner networking
- Korea origin agent
- Ocean freight strength
- WCA member network
- Global logistics partner
- Freight forwarding
- Ocean freight
- Air freight
- Cross-border logistics
- Partner network
- Agent cooperation
- Route planning
- Shipment coordination
- Practical execution
- Clear handoff
- Time-sensitive cargo
- Project cargo support

### Words to avoid on the public site

- MLM
- Network marketing
- Passive income
- Guaranteed savings
- Cheapest rate
- Risk-free shipping
- Unlimited protection
- Any phrase that sounds like investment solicitation, recruitment, or guaranteed financial return

---

## 2. SEO and AEO Strategy

### SEO goal

Build topical authority around Korea-origin ocean and air freight to worldwide destinations so KS WAYS can rank for commercial and informational searches from overseas freight forwarders, WCA partners, and secondarily from exporters, importers, and logistics partners looking for a Korea origin agent.

### AEO goal

Make KS WAYS easy for answer engines, AI search, and featured snippets to cite when users ask practical logistics questions such as:

- Who can handle freight forwarding from Korea?
- How do I ship cargo from Korea to Europe?
- What is the difference between air freight and ocean freight from Korea?
- How does EXW pickup work in Korea?
- What should an overseas freight agent confirm before requesting a Korea quotation?
- How do I appoint a Korea origin agent through WCA partner networking?

### Primary entity signals

- Company: KS WAYS (brand) / KSWAYS CO.,LTD. (registered legal name, 사업자등록번호 196-81-01177).
- Category: Global logistics company, freight forwarder, Korea origin agent.
- Geography: Korea origin, worldwide destinations. (Do not name China / Japan / NE Asia as covered regions — see the positioning lock.)
- Services: Ocean freight, air freight, cross-border logistics, project cargo support, WCA partner networking.
- Audience: Overseas freight forwarders, WCA partners (primary); exporters, importers, e-commerce brands, manufacturers, buyers (secondary).

### Recommended site architecture

Current homepage should become the trust and conversion hub. Future SEO pages should expand from it.

- `/` — Global homepage.
- `/kr` — Korean homepage.
- `/services/air-freight-korea` — Air freight from/to Korea.
- `/services/ocean-freight-korea` — Ocean freight from/to Korea.
- `/services/exw-pickup-korea` — EXW pickup and local handling in Korea.
- `/services/cross-border-logistics-korea` — Cross-border and e-commerce logistics.
- `/network/korea-agent-network` — Partner and agent cooperation.
- `/insights/korea-freight-forwarding-guide` — Educational pillar content.
- `/contact` or homepage contact section — Quote and partner enquiries.

### Priority keyword clusters

#### Cluster A: Korea freight forwarding

Primary keywords:

- Korea freight forwarder
- freight forwarder in Korea
- freight forwarding Korea
- global logistics company Korea
- Korea logistics partner

Long-tail keywords:

- freight forwarding from Korea to Europe
- freight forwarder for Korea export shipments
- Korea import export logistics partner
- overseas agent for Korea shipments
- logistics coordination in Korea

#### Cluster B: Air freight Korea

Primary keywords:

- air freight Korea
- Korea air freight forwarder
- air cargo from Korea
- urgent cargo Korea

Long-tail keywords:

- air freight from Korea to Europe
- air freight from Korea to Turkey
- time-sensitive cargo from Korea
- Korea airport cargo forwarding

#### Cluster C: Ocean freight Korea

Primary keywords:

- ocean freight Korea
- sea freight Korea
- FCL Korea
- LCL Korea
- Korea ocean freight forwarder

Long-tail keywords:

- FCL shipment from Korea
- LCL shipment from Korea
- ocean freight from Korea to Europe
- Korea to Turkey sea freight
- container loading support Korea

#### Cluster D: EXW pickup and local handling Korea

Primary keywords:

- EXW Korea logistics
- EXW pickup Korea
- cargo pickup Korea
- container stuffing Korea
- local trucking Korea

Long-tail keywords:

- EXW pickup from Korean shipper
- container loading support in Korea
- shipper cannot load container Korea
- Korea local handling for export cargo

#### Cluster E: Korea origin agent and WCA partner cooperation

Primary keywords:

- Korea origin agent
- WCA member Korea agent
- Korea logistics agent for overseas forwarders
- freight forwarding partner Korea
- Korea agent network

Long-tail keywords:

- appoint Korea origin agent for freight forwarding
- WCA partner networking Korea
- Korea-side partner for overseas freight forwarders
- agent cooperation for Korea origin shipments
- origin agent for Korea ocean and air freight
- global logistics partner network Korea

#### Optional architecture note

Future pillar page for Korea-origin ocean & air worldwide / WCA partners could live at `/services/korea-origin-forwarding` or `/network/wca-partner-korea` — URL TBD, not yet implemented.

---

## 3. Homepage Copy System

> **Live status (checked 2026-11-01).** Sections 3 to 7 mix live text with target copy written to the positioning lock. Sections 3 and 4 are mostly target: only these strings match `src/lib/content.ts` / `src/lib/seo.ts` word for word: meta title 1, the brand H1 `The smart way to global logistics`, the CTAs `Get a Quote` and `Explore Partner Network`, the headline `A clearer path for every enquiry.`, the headline `Ready to move smarter?` and the contact CTA labels. The live hero lead, section bodies, service cards and steps are older wording. Section 5 (Korean) is mostly target as well. Sections 6 (FAQ bank) and 7 (service drafts) are roughly a third and a half live. Moving the site onto this copy is a separate code change. Until it lands, check `content.ts`, `seo.ts` and `service-pages.ts` before treating any string here as live.

### Meta title options

1. `KS WAYS — Global Ocean & Air Logistics Company`
2. `KS WAYS — Ocean-Led Freight Forwarding and Air Logistics`
3. `KS WAYS — The Smart Way to Global Logistics`

Recommended default:

`KS WAYS — Global Ocean & Air Logistics Company`

### Meta description options

1. `KS WAYS is a Korea-origin ocean and air logistics company moving cargo to worldwide destinations through WCA partner networking.`
2. `Move global cargo with KS WAYS through ocean freight, air freight, cross-border logistics, local handling, and WCA-backed partner cooperation from Korea.`
3. `KS WAYS helps overseas forwarders, WCA partners, exporters, and importers coordinate Korea-origin shipments with practical routing, clear communication, and reliable execution.`

Recommended default:

`KS WAYS is a Korea-origin ocean and air logistics company moving cargo to worldwide destinations through WCA partner networking.`

### H1 options

1. `The smart way to global logistics` *(brand-first, current live H1)*
2. `Korea ocean and air freight to worldwide destinations` *(SEO-clear, recommended for conversion)*
3. `Your Korea origin partner for global freight forwarding`

Recommended current H1:

`The smart way to global logistics`

SEO-recommended alternative: `Korea ocean and air freight to worldwide destinations` — clearer positioning for search and partner audiences. Option 1 is stronger for brand recognition; option 2 is stronger for organic discovery and conversion clarity. Consider A/B testing.

### Hero lead

Recommended:

`KS WAYS moves ocean and air cargo from Korea to worldwide destinations through WCA partner networking. Overseas forwarders and WCA partners appoint us as their Korea origin agent for reliable local execution, routing, and shipment coordination.`

SEO-expanded alternative:

`KS WAYS is a Korea-origin logistics company helping overseas freight forwarders, WCA partners, exporters, and importers coordinate ocean freight, air freight, and cross-border logistics from Korea to worldwide destinations with ocean freight as a core strength.`

### Primary CTA

- `Get a Quote`
- `Request a Freight Quote`
- `Send Your Shipment Details`

Recommended:

`Get a Quote`

### Secondary CTA

- `Explore Partner Network`
- `Partner with KS WAYS`
- `Work with Our Korea Team`

Recommended:

`Explore Partner Network`

---

## 4. Homepage Section Copy

### Company section

#### Kicker

`Company`

#### Headline

`Korea-origin ocean and air logistics built for practical freight execution worldwide.`

#### Body

`We combine hands-on freight operations with WCA partner networking, serving overseas forwarders and Korean customers with reliable origin execution, routing, and shipment coordination from Korea to worldwide destinations.`

#### Pillars

**Ocean & air from Korea**

`Korea-origin ocean and air freight coordination — carrier selection, routing, and shipment execution to worldwide destinations.`

**Partner-first**

`WCA-backed cooperation for overseas forwarders who need reliable Korea origin execution and responsive communication.`

**Clear ownership**

`Practical follow-up from enquiry to booking, document flow, and delivery milestones.`

### Services section

#### Kicker

`Services`

#### Headline

`Flexible freight solutions from quote to delivery.`

#### Body

`KS WAYS supports core freight modes and cross-border cargo flows with a clean operating rhythm: understand the shipment, select the route, coordinate the handoff, and keep partners informed.`

#### Service cards

**Ocean Freight**

`Korea-origin FCL/LCL routing with practical carrier and partner coordination to worldwide destinations.`

**Air Freight**

`Fast planning for urgent, high-value, and time-sensitive cargo from Korea.`

**Cross-border**

`Express and commerce flows for growing brands and recurring shipments.`

**Project Support**

`Case-by-case handling for special pickup, stuffing, and schedule constraints.`

### Network section

#### Kicker

`Partner network`

#### Headline

`WCA-backed partner networking for global forwarding from Korea.`

#### Body

`Overseas freight forwarders and WCA partners appoint KS WAYS as their Korea-side origin agent. We handle local execution — pickup, carrier coordination, documentation, and shipment follow-up — so partners can confidently serve Korea-origin lanes worldwide.`

#### Proof points

- `WCA member partner networking`
- `Korea origin execution for partners' worldwide lanes`
- `Responsive communication and operational accountability`
- `Route and lead-sharing opportunities`

#### WCAworld member tools (WQS · PartnerPay)

KS WAYS works with WCAworld member partners through two WCAworld member benefits. Shown in the home network section (compact) and on `/network/korea-agent-network` (full section + FAQ).

**Source review** — wcaworld.com/Benefits, wcaworldquotationsystem.com, wcaworldpartnerpay.com (reviewed 2026-10-05):

| | WCAworld Quotation System (WQS) | WCAworld PartnerPay |
|---|---|---|
| What it is | A member-only platform for sending and receiving RFQs between WCAworld members worldwide | A company-to-company online payment system for WCAworld members to pay and receive money from partners |
| Who can use it | WCAworld members (free member benefit) | Every WCAworld registered company, including affiliated networks (free member benefit) |
| WCAworld's stated value | Specific RFQs → accurate quotes, fewer back-and-forth emails, member verification skipped, fewer payment-term problems; partners compared on value, not only price. iOS/Android "WQS" app | Manage payables and receivables in one place; WCAworld says it is fee-free and the members' payment method of choice |

**How KS WAYS talks about them** — by what they *do* for the partner, never with WCAworld's own marketing claims:

- ✅ "Send RFQs to KS WAYS through WCAworld's member-only quotation platform."
- ✅ "Settle shipments with KS WAYS through WCAworld's member-to-member payment system."
- ❌ "Save thousands of dollars", "without any fees", "free transfers", "cheapest" — these are WCAworld's claims about its own service, KS WAYS cannot guarantee them, and they fall under **Words to avoid** (guaranteed savings). Enforced in `ServiceLandingPage.render.test.tsx` and `HomePage.render.test.tsx`.
- ❌ Don't imply WQS replaces direct contact — `info@ksways.co` stays the default enquiry path.
- Always write the full product names on first use: `WCAworld Quotation System`, `WCAworld PartnerPay`. `WQS` only after the full name.

**Home — network section (compact)**

| | EN | KR |
|---|---|---|
| Heading | `Work with us through WCAworld` | `WCAworld 회원 도구로 협업하기` |
| WQS | `Send RFQs to KS WAYS through WCAworld’s member-only quotation platform.` | `WCAworld 회원 전용 견적 플랫폼으로 KS WAYS에 RFQ를 보내실 수 있습니다.` |
| PartnerPay | `Settle shipments with KS WAYS through WCAworld’s member-to-member payment system.` | `WCAworld 회원 간 결제 시스템으로 KS WAYS와 운송 정산을 처리합니다.` |

**Partner network page — full section**

- Kicker: `For WCAworld members`
- Headline: `Quote and settle through WCAworld`
- Body: `If your company is a WCAworld member, you can work with KS WAYS through the network’s own member tools: RFQs through the WCAworld Quotation System and shipment settlement through WCAworld PartnerPay.`
- WQS: `WCAworld’s member-only platform for sending and receiving RFQs. A detailed RFQ — route, cargo, dimensions, Incoterms, and ready date — lets KS WAYS return an accurate quote with less back-and-forth.`
- PartnerPay: `WCAworld’s company-to-company payment system for its members. Partners can pay and receive shipment settlements with KS WAYS through their PartnerPay account.`

**Seal assets** — official high-resolution sources (WQS 1917px from wcaworldquotationsystem.com, PartnerPay 400px from wcaworldpartnerpay.com), trimmed to 384px: `public/assets/wca-wqs-seal.png`, `public/assets/wca-partnerpay-seal.png`. The 150px / 200px files on the wcaworld.com benefit pages are too soft for retina. Never recolor or crop a seal.

### How we work section

#### Kicker

`How we work`

#### Headline

`A clearer path for every enquiry.`

#### Body

`From the first request to final delivery, KS WAYS keeps the process focused on the facts that matter: cargo readiness, route feasibility, cost, risk, and timing.`

#### Steps

**01 · Review**

`Cargo details, Incoterms, pickup conditions, destination requirements, and deadline.`

**02 · Route**

`Mode selection, carrier options, partner coordination, and practical alternatives.`

**03 · Execute**

`Booking, documentation, milestone updates, and exception handling.`

### Contact section

#### Headline

`Ready to move smarter?`

#### Body

`Start with the right path: send structured cargo details, introduce your company for partner cooperation, or request a Zoom / Calendly consultation through info@ksways.co.`

#### CTA labels

- `Get a Quote`
- `Become a partner`
- `Schedule consultation`

#### Contact email

`info@ksways.co`

#### CTA behavior

- Quote CTA: open a pre-filled email to `info@ksways.co`.
- Partner CTA: open a pre-filled partnership email to `info@ksways.co`.
- Schedule CTA: use `NEXT_PUBLIC_KSWAYS_CALENDLY_URL` when an official booking link is configured; otherwise open a pre-filled Zoom / Calendly meeting-request email to `info@ksways.co`.
- Do not load a public live-chat widget by default; keep the conversion path focused on email, partner details, and scheduled consultation requests.

---

## 5. Korean Homepage Copy

### Meta title options

1. `KS WAYS — 글로벌 해상·항공 물류회사`
2. `KS WAYS — 해상과 항공을 책임지는 글로벌 물류회사`
3. `KS WAYS — 글로벌 물류를 위한 스마트한 길`

Recommended default:

`KS WAYS — 글로벌 해상·항공 물류회사`

### Meta description options

1. `KS WAYS는 한국발 전세계 해상·항공 물류회사로, WCA 파트너 네트워킹을 통해 해외 포워더의 한국 오리진 에이전트 역할을 수행합니다.`
2. `KS WAYS는 수출입 기업, 해외 포워더, WCA 파트너의 한국발 해상·항공 화물을 실무 중심으로 조율하는 글로벌 물류회사입니다.`

Recommended default:

`KS WAYS는 한국발 전세계 해상·항공 물류회사로, WCA 파트너 네트워킹을 통해 해외 포워더의 한국 오리진 에이전트 역할을 수행합니다.`

### Korean positioning paragraph

`KS WAYS는 한국발 전세계 해상·항공 물류를 책임지는 글로벌 물류회사입니다. WCA 파트너 네트워킹을 기반으로 해외 포워더 및 WCA 파트너의 한국 오리진 에이전트로서, 현지 픽업·선사 조율·서류·선적 실행을 담당합니다. 해상물류가 핵심 강점이며, 항공물류·크로스보더·EXW 픽업·프로젝트 화물 지원까지 실무 중심의 라우팅과 명확한 커뮤니케이션으로 운송 과정을 조율합니다.`

### Korean FAQ style answer

**Q. KS WAYS는 어떤 회사인가요?**

`KS WAYS는 한국발 전세계 해상·항공 물류를 책임지는 글로벌 물류회사입니다. WCA 파트너 네트워킹을 통해 해외 포워더의 한국 오리진 에이전트로서, 해운 강점을 기반으로 실무 중심의 파트너 협력을 제공합니다.`

---

## 6. AEO-Ready FAQ Bank

These questions should be used for future FAQ sections, structured data, and answer-engine snippets. Answers should stay factual, concise, and operational.

### Q1. What does KS WAYS do?

KS WAYS is a Korea-origin ocean and air logistics company that moves cargo from Korea to worldwide destinations. Through WCA partner networking, KS WAYS serves as the Korea origin agent for overseas freight forwarders and WCA partners, with ocean freight as a core strength.

### Q2. Is KS WAYS a freight forwarder in Korea?

Yes. KS WAYS is a WCA member logistics company providing Korea-origin ocean freight, air freight, and practical shipment coordination to worldwide destinations. Overseas forwarders and WCA partners appoint KS WAYS as their Korea origin agent.

### Q3. Can KS WAYS support shipments from Korea to Europe?

KS WAYS can support Korea-connected shipments to Europe through air freight, ocean freight, and partner-coordinated routing. The best option depends on cargo details, Incoterms, ready date, destination, and schedule requirements.

### Q4. Can KS WAYS handle EXW pickup in Korea?

KS WAYS can review EXW pickup requirements in Korea, including shipper location, cargo dimensions, loading conditions, vehicle access, stuffing requirements, and local handling needs. Final feasibility depends on the cargo and pickup site conditions.

### Q5. What information is needed for a freight quote?

A freight quote usually requires origin, destination, Incoterms, cargo description, dimensions, gross weight, package count, cargo ready date, service mode, pickup conditions, and any special handling requirements.

### Q6. Does KS WAYS handle both air freight and ocean freight?

Yes. KS WAYS supports air freight for urgent or high-value cargo and ocean freight for FCL or LCL shipments where container routing and cost efficiency are important.

### Q7. Does KS WAYS work with overseas logistics agents?

Yes. KS WAYS serves as a Korea origin agent for overseas freight forwarders and WCA partners through WCA partner networking. We handle Korea-side origin execution — pickup, carrier coordination, documentation, and shipment follow-up — with responsive communication and clear operational handoffs.

### Q8. Can KS WAYS support special loading or container stuffing?

KS WAYS can review special loading, pickup, and container stuffing requirements case by case. Required details include cargo size, weight, packaging, loading equipment availability, site access, and whether the shipper can assist with loading.

### Q9. What makes KS WAYS different?

KS WAYS focuses on Korea-origin ocean and air freight to worldwide destinations, clear partner communication, and accountable shipment coordination rather than generic rate forwarding. Through WCA partner networking, overseas forwarders appoint KS WAYS as their trusted Korea origin agent for reliable local execution and responsive cooperation.

### Q10. How can I contact KS WAYS?

For quotation, partnership, or consultation enquiries, contact KS WAYS through the official group email `info@ksways.co`. The website CTA can also request a Zoom / Calendly consultation slot.

### Q11. Can WCAworld members send RFQs to KS WAYS through WQS?

Yes. WCAworld members can send RFQs to KS WAYS through the WCAworld Quotation System (WQS), WCAworld’s member-only quotation platform. Enquiries can also be sent to `info@ksways.co`.

### Q12. Does KS WAYS accept WCAworld PartnerPay?

Yes. KS WAYS can settle shipments with WCAworld member partners through WCAworld PartnerPay, the network’s company-to-company payment system.

### Q13. Does KS WAYS follow the WCAworld Code of Ethics?

Yes. As a WCA Inter Global member, KS WAYS follows the WCAworld Code of Ethics: prompt and precise quotes, written agreements, settlement in the quoted currency, extra charges at actual cost, no back-selling, lawful cargo only, and WCAworld dispute resolution when needed.

Q11–Q13 are live on `/network/korea-agent-network` and in its FAQ JSON-LD.

---

## 7. Service Page Copy Drafts

### 7.1 Air Freight Korea

#### URL

`/services/air-freight-korea`

#### Meta title

`Air Freight Korea — KS WAYS Global Logistics`

#### Meta description

`KS WAYS supports Korea-origin air freight to worldwide destinations for urgent, high-value, and time-sensitive cargo with practical routing, partner coordination, and clear shipment follow-up.`

#### H1

`Air freight from Korea to worldwide destinations`

#### Intro

`When timing matters, air freight needs fast review, accurate cargo information, and clear coordination between shipper, carrier, airport, and destination partner. KS WAYS helps overseas forwarders, WCA partners, exporters, and importers move Korea-origin air cargo to worldwide destinations with practical routing and responsive coordination.`

#### Key sections

- `When to use air freight`
- `Information needed for an air freight quote`
- `How KS WAYS coordinates air cargo`
- `Common air freight questions`

### 7.2 Ocean Freight Korea

#### URL

`/services/ocean-freight-korea`

#### Meta title

`Ocean Freight Korea — FCL and LCL Logistics by KS WAYS`

#### Meta description

`KS WAYS supports Korea-origin ocean freight to worldwide destinations, including FCL, LCL, container loading review, carrier coordination, and overseas partner handoff.`

#### H1

`Korea-origin ocean freight forwarding for worldwide FCL and LCL cargo`

#### Intro

`Ocean freight is often the right choice for larger, heavier, or less time-sensitive cargo from Korea. KS WAYS supports FCL and LCL shipment coordination from Korea to worldwide destinations, with attention to cargo dimensions, container suitability, loading requirements, destination needs, and schedule constraints. Overseas forwarders and WCA partners rely on us for Korea-side origin execution.`

#### Key sections

- `FCL and LCL options`
- `Container suitability and cargo dimensions`
- `EXW pickup and loading review`
- `Ocean freight quote checklist`

### 7.3 EXW Pickup Korea

#### URL

`/services/exw-pickup-korea`

#### Meta title

`EXW Pickup Korea — Local Handling and Export Coordination`

#### Meta description

`KS WAYS reviews EXW pickup in Korea, including cargo readiness, vehicle access, loading conditions, container stuffing, local handling, and export coordination.`

#### H1

`EXW pickup and local handling in Korea`

#### Intro

`EXW shipments from Korea often require more than a basic freight rate. The pickup location, loading equipment, packaging, cargo dimensions, and stuffing plan can affect the vehicle choice, handling cost, and shipment feasibility. KS WAYS reviews these details before confirming the practical route.`

#### Key sections

- `What EXW means in practice`
- `Pickup information required`
- `When container loading needs a separate location`
- `How to avoid delays in EXW shipments`

#### Incoterms rules (source: WCAworld Incoterms® 2020 chart, Dropbox `KS WAYS/WCA_Incoterms2020.pdf`)

- Cite **Incoterms® 2020** when the site explains a term. The 2010 chart (`WCA_Incoterms.pdf`) is superseded — do not copy from it. In particular, **DAT no longer exists**; 2020 replaced it with **DPU** (Delivered at Place Unloaded). Asserted in `ServiceLandingPage.render.test.tsx`.
- 2020 has 11 terms. All modes: EXW, FCA, CPT, CIP, DAP, DPU, DDP. Sea and inland waterway only: FAS, FOB, CFR, CIF. Don't offer FOB/CFR/CIF as air-freight terms in examples. Use FCA instead.
- EXW, as the page states it: the seller only makes the goods available at its premises. The buyer then carries cost and risk from there, including loading onto the collecting vehicle and export clearance, unless the sales contract says otherwise. That is the business reason the EXW page exists: who loads, and whether the site can support it, is open until checked.
- Explain what a term means for pickup and handoff. Do not give trade or legal advice on which term a customer should choose.

### 7.4 Partner Network Korea

#### URL

`/network/korea-agent-network`

#### Meta title

`Korea Logistics Agent Network — Partner with KS WAYS`

#### Meta description

`Appoint KS WAYS as your Korea origin agent through WCA partner networking. We support overseas freight forwarders with Korea-origin ocean and air freight execution to worldwide destinations.`

#### H1

`WCA partner networking — your Korea origin agent for worldwide freight`

#### Intro

`Overseas freight forwarders and WCA partners need a Korea-side origin agent who can respond quickly, handle local execution, and communicate clearly from enquiry to delivery. KS WAYS serves as your Korea origin agent through WCA partner networking, supporting ocean freight, air freight, cross-border shipments, and special handling from Korea to worldwide destinations.`

#### Key sections

- `Who we work with`
- `What partners can expect`
- `How to send an enquiry`
- `For WCAworld members` — WQS RFQs and PartnerPay settlement (copy: **WCAworld member tools** above)
- `Partner cooperation principles` — live (copy below)

#### Partner cooperation principles

Source: **WCAworld Code of Ethics** (effective 1 February 2024, 17 articles, binding on all WCA / Lognet Global / GAA / EGLN / IFC8 members). The page translates the articles a partner actually feels into KS WAYS's own voice. Articles about KS WAYS's obligations *to WCAworld* (keeping company details current, anti-spam compliance, branch-office liability, no refund on leaving) are not partner-facing and stay off the page.

- Kicker: `Partner cooperation principles`
- Headline: `How we work with partners`
- Intro: `As a WCA Inter Global member, KS WAYS follows the WCAworld Code of Ethics. In day-to-day cooperation, that means:`

| # | Title | Body | Code of Ethics |
|---|---|---|---|
| 01 | `Prompt, precise quotes` | `We reply within a reasonable time and quote with precise details, so rates can be compared and confirmed without guesswork.` | Art. 10 (also 01, 07) |
| 02 | `Agreements in writing` | `Rates, scope, and shipping instructions are confirmed by contract or clear email — including anything first discussed on messengers or social media.` | Art. 02, 09 |
| 03 | `Clean settlement` | `We invoice and pay in the quoted currency within the agreed period, with local bank charges on each side unless agreed otherwise. Unforeseen storage, demurrage, or fines are passed on at actual cost with an official invoice.` | Art. 03, 11, 12 |
| 04 | `Your customers stay yours` | `We respect partners’ customer bases and confidential business data, and we do not back-sell.` | Art. 06 |
| 05 | `Lawful cargo only` | `We do not take part in shipments we know, or should have known, to be fraudulent or illegal under the laws of the origin, destination, or transit country.` | Art. 08 |
| 06 | `Disputes on the record` | `If a disagreement cannot be settled between us, we take part in WCAworld’s dispute-resolution process with documented facts.` | Art. 14, 15 |

Rules:

- Name the source ("follows the WCAworld Code of Ethics") — the principles are network obligations KS WAYS signed up to, not self-awarded virtues. Asserted in `ServiceLandingPage.render.test.tsx`.
- Do not promise outcomes the Code does not give: no "guaranteed payment", no Gold Medallion claims beyond the approved enrolment wording below (Gold Medallion is a WCAworld programme with its own terms, Art. 13), no fixed response-time SLA ("reasonable time" is the Code's wording).
- When the Code is amended (WCAworld announces changes one month ahead in its daily broadcast), re-check this table against the new text.

#### Certificate of Membership — what the site may and may not use

The WCA certificate confirms KS WAYS has complied with the conditions of membership for **WCA Inter Global** (certificate on file in Dropbox `KS WAYS/Certificate of Membership_WCA.pdf`).

- ✅ Use: `WCA Inter Global member` — the certificate is the evidence behind this claim.
- ❌ Do not publish the member ID, the validity date (`valid until …`), the signatories, or the certificate image. Same rule as the email-signature logo: an expiry date in public copy silently goes stale, and the ID is for partner verification on request. Asserted in `ServiceLandingPage.render.test.tsx` and `HomePage.render.test.tsx`.
- ⚠️ The certificate registers the company as **"KSWays Co., Ltd."**. The registered legal name is `KSWAYS CO.,LTD.` (사업자등록번호 196-81-01177, supplied 2026-11-01), and the site uses that exact string (see DESIGN.md naming rules). Under Code of Ethics Art. 16 the member is responsible for keeping WCAworld's company details current, so ask WCAworld to correct the directory entry and the next certificate to `KSWAYS CO.,LTD.` The site does not copy the certificate's spelling.
- 🗓 Renewal: the current certificate is valid until 2027-07-19. Nothing on the site depends on that date, but the membership claim does — renew before it lapses.

#### WCAworld Benefits 2026 brochure — what the site may use

Source: `KS WAYS/WCABenefits2026.pdf` (16 pages, WCAworld's own marketing). Most of it sells WCAworld membership *to forwarders*. KS WAYS's site talks to shippers and overseas agents, so the brochure is reference only.

- ✅ Already used: the WQS and PartnerPay descriptions match the **WCAworld member tools** copy above. The brochure repeats "save thousands" and "eliminates all cross-border banking fees". That wording stays banned for the reasons given there.
- ✅ Usable fact if a network description is needed: WCA Inter Global is WCAworld's **general cargo network**, focused on connecting developed and developing economies. If a number is quoted, date it: "5,200+ member offices in 169 countries (WCAworld, 2026)". The same rule applies to WCAworld totals ("13,150+ offices in 197 countries"). These figures change every year, so do not put an undated number on the site.
- ✅ Gold Medallion: KS WAYS **is enrolled**, confirmed by the owner on 2026-10-05. The network page states this once in the member-tools intro and once as a FAQ. Approved wording:
  - Intro: `KS WAYS is also enrolled in WCAworld’s Gold Medallion Program, which protects transactions between enrolled members under the programme’s own terms.`
  - FAQ: `Yes. KS WAYS is enrolled in the Gold Medallion Program, WCAworld’s financial protection programme for transactions between enrolled members. Claims are handled by WCAworld’s Gold Medallion team under the programme’s own terms.`
  - Rules: always tie it to "the programme's own terms". No amounts (the brochure's US$3M pool and US$100k / US$50k caps change by year and are WCAworld's to state). No "guaranteed payment" and no "fully protected". Network page only, because shippers are not party to member-to-member transactions. All asserted in `ServiceLandingPage.render.test.tsx`.
  - If enrolment lapses, remove both lines in the same change.
- ❌ Not relevant to KS WAYS's public site: WCA Pharma, Dangerous Goods, Projects and other specialty networks (KS WAYS is not a member of these), the UPS courier discount (USA/Thailand members only), All World Shipping, World Insurance Services, the Academy, FREIGHTOSCOPE, VOTI, and the networking events. Claiming any of these would imply a membership or service KS WAYS does not hold.

---

## 8. Blog and Insight Content Roadmap

### Pillar article 1

`Complete Guide to Freight Forwarding from Korea`

Purpose: Build authority for broad Korea freight-forwarding searches.

Outline:

1. What freight forwarding from Korea involves
2. Main shipment modes: air, ocean, express, cross-border
3. Information required for quotation
4. EXW, FOB, FCA, DAP, DDP basics
5. Common risks and delays
6. How overseas agents should prepare Korea enquiries
7. Why partner communication matters

### Pillar article 2

`EXW Korea Shipping Checklist for Overseas Buyers and Freight Agents`

Purpose: Capture high-intent practical searches around EXW pickup and local handling.

Outline:

1. What EXW means in Korea
2. Why pickup and loading conditions matter
3. Required cargo information
4. Vehicle, forklift, crane, and stuffing questions
5. Photos and packing list requirements
6. Common mistakes to avoid
7. How KS WAYS reviews EXW enquiries

### Pillar article 3

`Air Freight vs Ocean Freight from Korea: How to Choose`

Purpose: Answer comparison queries and support AEO snippets.

Outline:

1. When air freight is better
2. When ocean freight is better
3. Cost, speed, reliability, and cargo profile
4. Time-sensitive shipments
5. Heavy or oversized shipments
6. Checklist for deciding the mode

### Pillar article 4

`How Overseas Freight Agents Can Work with a Korea Logistics Partner`

Purpose: Attract overseas agents and network partners.

Outline:

1. Why local execution matters in Korea
2. What information to send first
3. Response expectations
4. Quote-to-booking handoff
5. Documentation and milestone updates
6. Building long-term agent cooperation

---

## 9. Structured Data Recommendations

### Organization schema

Use `Organization` or `LocalBusiness` with logistics-specific description.

Recommended fields:

- `@type`: `Organization`
- `name`: `KSWAYS CO.,LTD.`
- `legalName`: `KSWAYS CO.,LTD.`
- `taxID`: `196-81-01177`
- `alternateName`: `KS WAYS`
- `url`: `https://ksways.co`
- `email`: `info@ksways.co`
- `description`: `KS WAYS is a Korea-origin ocean and air logistics company moving cargo to worldwide destinations through WCA partner networking.`
- `areaServed`: `Worldwide`
- `knowsAbout`: `Freight forwarding, air freight, ocean freight, cross-border logistics, EXW pickup, Korea logistics, partner network`

### FAQ schema

Use FAQ schema only for questions visibly shown on the page. Recommended initial questions:

1. What does KS WAYS do?
2. Is KS WAYS a freight forwarder in Korea?
3. Can KS WAYS handle EXW pickup in Korea?
4. What information is needed for a freight quote?
5. How can I contact KS WAYS?

### Service schema

Use service-specific structured data on future service pages.

Recommended services:

- Air freight forwarding
- Ocean freight forwarding
- EXW pickup coordination
- Cross-border logistics
- Project cargo support
- Logistics agent cooperation

---

## 10. Content Quality Rules

### Every page should answer these questions

1. Who is this page for?
2. What shipment or logistics problem does it solve?
3. What information does KS WAYS need from the visitor?
4. What can KS WAYS realistically do?
5. What should the visitor do next?

### Every service page should include

- One keyword-focused H1.
- A concise operational definition of the service.
- A practical checklist.
- A short FAQ section.
- A quote CTA using `info@ksways.co`.
- No exaggerated claims.

### AEO writing rules

- Answer the question directly in the first sentence.
- Use short paragraphs.
- Use clear headings that match user questions.
- Avoid vague marketing language.
- Include operational details such as Incoterms, dimensions, gross weight, cargo ready date, pickup condition, and destination requirements when relevant.

### Company name rules

- The brand is **KS WAYS** in all visible copy, alt text, metadata and navigation.
- The registered legal name **KSWAYS CO.,LTD.** appears only where a legal entity is named: the footer entity line, the company-section sentence that names the company, and Organization JSON-LD (`name`, `legalName`). Write it exactly. Never use `KS WAYS CO., LTD.`, `KSWays` or `KS Ways`.
- The business registration number appears once per locale in the footer, under the entity line: `Business Registration No. 196-81-01177` / `사업자등록번호 196-81-01177`, and as `taxID` in JSON-LD.
- `src/site-quality.test.ts` checks the spelling across the exported copy.

### Quote form copy rules

- The label names the field. The placeholder only shows an example and never stands in for the label.
- A placeholder that shows a sample value starts with `e.g.` (`e.g. Busan, Korea / KRPUS / ICN`), so it never reads as data already entered. A placeholder that names a format or prompts for input has no `e.g.`: `YYYY-MM-DD`, `EXW / FOB / CIF / DAP / DDP`, `PIC name / mobile or email`, `Optional target rate or budget`, the select prompts and the two free-text notes.
- A single-line placeholder must fit a 320px-wide field: 36 characters at most. Anything longer goes in the helper line under the field, written as one short instruction (`Include the country code for phone numbers.`, `For OOG cargo, give the overall L x W x H.`).
- Enforced by `src/lib/quote-form.test.ts` and `e2e/placeholder-fit.spec.ts`.

### Interface labels

- Skip link, the first tab stop on every page: `Skip to content` / `본문으로 건너뛰기`.
- Header: the same navigation, language toggle (`KR` / `EN`) and quote pill (`Get a Quote` / `견적 문의`) on every page, subpages included (DESIGN.md "The One Desk Rule"). Rule: the English quote CTA is `Get a Quote` everywhere (header, hero, contact section, footer). `src/lib/content.test.ts` checks this (PR #68).

### SEO writing rules

- Use one primary keyword per page.
- Use related terms naturally in headings and body copy.
- Do not repeat the same phrase unnaturally.
- Keep meta descriptions under roughly 155 to 165 characters where possible.
- Use descriptive internal links between homepage, service pages, partner page, and insight articles.

---

## 11. Recommended Implementation Next Steps

### Phase 1: Homepage metadata and FAQ — done

1. Update homepage metadata to position KS WAYS as a global ocean and air logistics company.
2. Add an FAQ section with 5 AEO-ready questions.
3. Add JSON-LD Organization schema.
4. Add FAQ schema only if FAQ is visible on the page.
5. Configure `NEXT_PUBLIC_KSWAYS_CALENDLY_URL` only when an official booking link is available; otherwise keep consultation requests routed through `info@ksways.co`.

### Phase 2: Service landing pages — done

Live, plus `/services/special-cargo-korea`:

1. `/services/air-freight-korea`
2. `/services/ocean-freight-korea`
3. `/services/exw-pickup-korea`
4. `/network/korea-agent-network`

### Phase 3: Insight content

Publish one pillar article per month, starting with:

1. `Complete Guide to Freight Forwarding from Korea`
2. `EXW Korea Shipping Checklist for Overseas Buyers and Freight Agents`
3. `Air Freight vs Ocean Freight from Korea: How to Choose`
4. `How Overseas Freight Agents Can Work with a Korea Logistics Partner`

### Phase 4: Conversion optimization

1. Add quote enquiry checklist near CTA.
2. Add downloadable shipment enquiry template.
3. Add partner enquiry CTA for overseas agents.
4. Add proof points such as network memberships only when verified and legally safe to display.

---

## 12. Final Copy Principle

KS WAYS should not compete by sounding like every freight forwarder.

The site should consistently communicate this message:

**KS WAYS is the Korea origin partner for worldwide ocean and air cargo, combining freight execution from Korea, WCA partner networking, clear communication, and trusted cooperation for overseas forwarders.**
