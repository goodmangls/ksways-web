import type { Metadata } from 'next';
import type { WcaMemberTool } from './content';
import { shareImage } from './seo';

export type IncotermTerm = {
  code: string;
  name: string;
  /** 'sea' = sea and inland waterway only (FAS, FOB, CFR, CIF). Everything else works with any mode. */
  mode: 'any' | 'sea';
  /** Where the seller delivers and where risk passes, per the WCAworld Incoterms® 2020 chart. */
  delivery: string;
  href?: string;
  linkLabel?: string;
};

export type IncotermGroup = {
  family: 'E' | 'F' | 'C' | 'D';
  title: string;
  /** Who books the main carriage, and what KS WAYS does from the Korea side. */
  body: string;
  terms: IncotermTerm[];
};

export type ServicePage = {
  slug: string;
  quoteServiceKey?: string;
  meta: Metadata;
  eyebrow: string;
  title: string;
  lead: string;
  trustCards?: Array<{
    label: string;
    value: string;
    body: string;
  }>;
  sections: Array<{
    title: string;
    body: string;
    items?: string[];
  }>;
  /** WCAworld member tools block — partner-facing pages only. Copy rules: COPY.md "WCAworld member tools". */
  memberTools?: {
    heading: string;
    title: string;
    body: string;
    items: WcaMemberTool[];
  };
  /** Partner cooperation principles — derived from the WCAworld Code of Ethics. Copy rules: COPY.md §7.4. */
  principles?: {
    heading: string;
    title: string;
    body: string;
    items: Array<{ title: string; body: string }>;
  };
  /** Incoterms® 2020 term grid — the Incoterms hub only. Copy rules and source: COPY.md §7.3a "Incoterms rules". */
  incoterms?: {
    heading: string;
    title: string;
    body: string;
    groups: IncotermGroup[];
  };
  /**
   * Compact Incoterms strip on a freight service page, linking to the hub (pattern from the
   * 2026-11-05 benchmark: SAR repeats an Incoterm block on every service page). 'air' shows the
   * all-mode rules only — FAS, FOB, CFR, and CIF are sea and inland waterway rules.
   */
  incotermsStrip?: 'air' | 'all';
  /** Cross-links shown under the sections, e.g. EXW detail ↔ Incoterms hub. */
  related?: Array<{ label: string; body: string; href: string }>;
  checklistTitle: string;
  checklist: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const servicePages: ServicePage[] = [
  {
    slug: 'air-freight-korea',
    meta: {
      title: 'Air Freight Korea — KS WAYS Global Logistics',
      description: 'KS WAYS supports Korea-connected air freight with global coverage review, time-sensitive delivery planning, specialized handling checks, customs-document coordination, and transparent shipment follow-up.',
      alternates: { canonical: '/services/air-freight-korea' },
      openGraph: {
        title: 'Air Freight Korea — KS WAYS Global Logistics',
        description: 'Korea-connected air freight with global coverage review, urgent cargo planning, specialized handling checks, and transparent updates.',
        url: 'https://ksways.co/services/air-freight-korea',
        siteName: 'KS WAYS',
        type: 'website',
        images: [shareImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Air Freight Korea — KS WAYS Global Logistics',
        description: 'Korea-connected air freight with global coverage review, urgent cargo planning, specialized handling checks, and transparent updates.',
        images: [shareImage],
      },
    },
    eyebrow: 'Air Freight Korea',
    title: 'Air freight solutions for Korea-connected cargo',
    lead: 'When timing matters, air freight needs fast review, accurate cargo information, and clear coordination between shipper, carrier, airport, customs, and destination partner. KS WAYS helps exporters, importers, and overseas agents review Korea-connected air cargo with global coverage, time-sensitive delivery planning, specialized handling checks, and transparent milestone updates before booking.',
    trustCards: [
      {
        label: 'Global coverage',
        value: 'Worldwide air cargo reach',
        body: 'Partner and carrier coordination helps review routes from Korea into Asia, Europe, Africa, the Americas, and wider global trade lanes.',
      },
      {
        label: 'Time-sensitive delivery',
        value: 'Urgent cargo review',
        body: 'Urgent production parts, express deliveries, and buyer-deadline cargo are screened for feasible schedules, cutoff risk, and practical alternatives.',
      },
      {
        label: 'Specialized handling',
        value: 'Special cargo checks',
        body: 'Cargo sensitivity, documentation, packing, temperature, DG status, and airport handling constraints are checked before route confirmation.',
      },
    ],
    sections: [
      {
        title: 'Global coverage and route options',
        body: 'Air freight is best when cargo needs global reach with shorter transit time than ocean freight. KS WAYS reviews origin, destination, carrier availability, airport handling, and partner handoff so shipments can move through practical international routes.',
        items: ['Asia, Europe, Africa, the Americas, and wider global destinations', 'Airport-to-airport or door-linked coordination', 'Carrier and partner feasibility review', 'Alternative routing when timing or capacity changes'],
      },
      {
        title: 'Time-sensitive delivery planning',
        body: 'For express deliveries, urgent production parts, and AOG-style enquiries, KS WAYS focuses on cargo ready time, cutoff feasibility, transit windows, destination requirements, and exception control to reduce avoidable delay.',
        items: ['Urgent production parts', 'AOG-style replacement parts', 'Time-sensitive buyer deadlines', 'High-value commercial goods', 'Sample shipments'],
      },
      {
        title: 'Special cargo review before quotation',
        body: 'For cargo that may need specialized handling, KS WAYS checks the operational details before presenting a route: commodity, packing, dimensions, temperature sensitivity, DG status, airport handling needs, customs documents, and the required delivery window.',
        items: ['Dangerous goods and regulated commodities', 'Perishables and temperature-controlled cargo', 'Live animal or exotic-vehicle enquiries for case-by-case feasibility review', 'Oversized, fragile, or high-value shipments'],
      },
      {
        title: 'Customs-document coordination',
        body: 'Smooth customs clearance starts before the cargo reaches the airport. KS WAYS reviews commercial invoice, packing list, HS code, shipper/consignee details, special documents, and partner requirements so documentation gaps can be addressed early.',
      },
      {
        title: 'Tracking transparency and customer service',
        body: 'KS WAYS keeps partners informed through key shipment milestones, routing notes, documentation requests, and exception updates. The goal is a clear, professional communication flow from quote request to final handoff.',
      },
      {
        title: 'Tailored solutions and Industry Experience',
        body: 'Every air shipment is different. KS WAYS uses practical Industry Experience to structure each enquiry around cargo facts, schedule targets, service mode, consolidation potential, temperature-control needs, destination handoff, and professional customer service so the proposed solution fits the shipment rather than forcing a generic route.',
      },
    ],
    incotermsStrip: 'air',
    checklistTitle: 'Information needed for an air freight quote',
    checklist: ['Origin and destination', 'Cargo description and HS code if available', 'Package count', 'Dimensions and gross weight', 'Incoterms', 'Cargo ready date', 'Required delivery timing', 'Commodity sensitivity or DG/perishable status', 'Pickup, customs, or airport handling requirements'],
    faqs: [
      {
        question: 'Can KS WAYS support air freight from Korea?',
        answer: 'Yes. KS WAYS can review Korea-connected air freight enquiries and coordinate practical routing for urgent, high-value, special handling, or time-sensitive cargo to global destinations.',
      },
      {
        question: 'What determines the air freight cost?',
        answer: 'Air freight cost depends on chargeable weight, route, airline capacity, cargo ready date, service level, pickup needs, customs requirements, cargo sensitivity, and destination requirements.',
      },
      {
        question: 'Can KS WAYS review special air cargo requirements?',
        answer: 'Yes. KS WAYS can review specialized handling needs such as DG, perishables, oversized cargo, high-value goods, fragile items, urgent replacement parts, live animal enquiries, and exotic-vehicle enquiries before confirming a practical route.',
      },
    ],
  },
  {
    slug: 'ocean-freight-korea',
    meta: {
      title: 'Ocean Freight Korea — FCL and LCL Logistics by KS WAYS',
      description: 'KS WAYS supports Korea-connected ocean freight, including FCL, LCL, container loading review, carrier coordination, and overseas partner handoff.',
      alternates: { canonical: '/services/ocean-freight-korea' },
      openGraph: {
        title: 'Ocean Freight Korea — FCL and LCL Logistics by KS WAYS',
        description: 'Global FCL and LCL ocean freight coordination with KS WAYS sea freight strength.',
        url: 'https://ksways.co/services/ocean-freight-korea',
        siteName: 'KS WAYS',
        type: 'website',
        images: [shareImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Ocean Freight Korea — FCL and LCL Logistics by KS WAYS',
        description: 'Global FCL and LCL ocean freight coordination with KS WAYS sea freight strength.',
        images: [shareImage],
      },
    },
    eyebrow: 'Ocean Freight Korea',
    title: 'Ocean freight forwarding for global FCL and LCL cargo',
    lead: 'Ocean freight is often the right choice for larger, heavier, or less time-sensitive cargo. KS WAYS supports global FCL and LCL shipment coordination with attention to cargo dimensions, container suitability, loading requirements, destination needs, and schedule constraints.',
    sections: [
      {
        title: 'FCL and LCL options',
        body: 'FCL can work well when cargo volume supports a full container. LCL can be practical when cargo does not require exclusive container use and timing allows consolidation.',
        items: ['FCL container shipments', 'LCL consolidated cargo', 'Korea export coordination', 'Destination partner handoff'],
      },
      {
        title: 'Container suitability and loading review',
        body: 'Cargo dimensions, gross weight, packaging, loading method, and site access can affect container choice and local handling requirements.',
      },
    ],
    incotermsStrip: 'all',
    checklistTitle: 'Information needed for an ocean freight quote',
    checklist: ['Origin and destination port or address', 'FCL or LCL preference', 'Cargo dimensions', 'Gross weight', 'Package count', 'Incoterms', 'Cargo ready date', 'Loading and stuffing conditions'],
    faqs: [
      {
        question: 'Does KS WAYS support FCL and LCL shipments?',
        answer: 'Yes. KS WAYS can review both FCL and LCL ocean freight enquiries for Korea-connected cargo.',
      },
      {
        question: 'When is ocean freight better than air freight?',
        answer: 'Ocean freight is usually better for larger, heavier, or less time-sensitive cargo where cost efficiency is more important than transit speed.',
      },
    ],
  },
  {
    slug: 'special-cargo-korea',
    quoteServiceKey: 'special-cargo',
    meta: {
      title: 'Special Cargo Korea — DG, Perishables, Oversized Cargo Review',
      description: 'KS WAYS reviews Korea-connected special cargo, including dangerous goods, perishables, oversized cargo, high-value goods, urgent parts, and project cargo constraints.',
      alternates: { canonical: '/services/special-cargo-korea' },
      openGraph: {
        title: 'Special Cargo Korea — KS WAYS Global Logistics',
        description: 'Special cargo review for DG, perishables, oversized, high-value, urgent parts, and project constraints.',
        url: 'https://ksways.co/services/special-cargo-korea',
        siteName: 'KS WAYS',
        type: 'website',
        images: [shareImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Special Cargo Korea — KS WAYS Global Logistics',
        description: 'Special cargo review for DG, perishables, oversized, high-value, urgent parts, and project constraints.',
        images: [shareImage],
      },
    },
    eyebrow: 'Special Cargo Korea',
    title: 'Special cargo review for Korea-connected shipments',
    lead: 'Special cargo needs more than a basic freight rate. KS WAYS reviews cargo sensitivity, packing, dimensions, compliance requirements, pickup conditions, carrier feasibility, and partner handoff before recommending a practical ocean or air route.',
    sections: [
      {
        title: 'Cargo we can review',
        body: 'KS WAYS supports case-by-case feasibility review for cargo that may require extra handling, documentation, or operational coordination before booking.',
        items: ['Dangerous goods and regulated commodities', 'Perishables and temperature-sensitive cargo', 'Oversized, heavy, or awkward cargo', 'High-value or fragile shipments', 'Urgent production parts and AOG-style enquiries', 'Project cargo with site or schedule constraints'],
      },
      {
        title: 'What we check before routing',
        body: 'A special cargo route must match the physical cargo, cargo documents, pickup environment, carrier acceptance, airport or port handling, customs requirements, and the delivery deadline.',
        items: ['Commodity and HS code', 'Packing, labeling, and handling marks', 'Dimensions, gross weight, and chargeable weight', 'MSDS, DG declaration, temperature range, or special documents if required'],
      },
      {
        title: 'Ocean or air — selected by feasibility',
        body: 'Some special cargo moves best by ocean freight because of size, cost, or handling constraints. Other cases require air freight because downtime, buyer deadlines, or production schedules matter more than cost. KS WAYS reviews the trade-off before execution.',
      },
      {
        title: 'Partner handoff and exception control',
        body: 'For cross-border special cargo, the handoff between shipper, pickup provider, carrier, customs broker, overseas agent, and consignee must be explicit. KS WAYS keeps the key facts visible so exceptions can be handled early.',
      },
    ],
    incotermsStrip: 'all',
    checklistTitle: 'Information needed for special cargo review',
    checklist: ['Origin and destination address or port/airport', 'Commodity description and HS code if available', 'Cargo photos, packing details, and handling marks', 'Dimensions, gross weight, and package count', 'MSDS, DG declaration, temperature range, or certificates if applicable', 'Cargo ready date and required delivery window', 'Incoterms and pickup conditions', 'Customs, insurance, or security requirements'],
    faqs: [
      {
        question: 'Does KS WAYS handle dangerous goods or perishables?',
        answer: 'KS WAYS can review DG, perishables, and other special cargo requirements case by case. Final feasibility depends on cargo documents, carrier acceptance, route, handling conditions, and regulatory requirements.',
      },
      {
        question: 'Can KS WAYS support oversized or project cargo?',
        answer: 'Yes. KS WAYS can review oversized, heavy, awkward, or project cargo constraints, including dimensions, loading method, site access, carrier suitability, and overseas partner handoff.',
      },
      {
        question: 'Why is special cargo not quoted like standard freight?',
        answer: 'Special cargo can require document checks, carrier approval, packaging review, temperature or DG handling, security controls, special pickup equipment, and route-specific restrictions before a reliable quotation can be confirmed.',
      },
    ],
  },
  {
    slug: 'exw-pickup-korea',
    meta: {
      title: 'EXW Pickup Korea — Local Handling and Export Coordination',
      description: 'KS WAYS reviews EXW pickup in Korea, including cargo readiness, vehicle access, loading conditions, container stuffing, local handling, and export coordination.',
      alternates: { canonical: '/services/exw-pickup-korea' },
      openGraph: {
        title: 'EXW Pickup Korea — Local Handling and Export Coordination',
        description: 'EXW pickup and local handling review for Korea export shipments.',
        url: 'https://ksways.co/services/exw-pickup-korea',
        siteName: 'KS WAYS',
        type: 'website',
        images: [shareImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'EXW Pickup Korea — Local Handling and Export Coordination',
        description: 'EXW pickup and local handling review for Korea export shipments.',
        images: [shareImage],
      },
    },
    eyebrow: 'EXW Pickup Korea',
    title: 'EXW pickup and local handling in Korea',
    lead: 'EXW shipments from Korea often require more than a basic freight rate. The pickup location, loading equipment, packaging, cargo dimensions, and stuffing plan can affect the vehicle choice, handling cost, and shipment feasibility. KS WAYS reviews these details before confirming the practical route.',
    sections: [
      {
        title: 'What EXW means in practice',
        body: 'Under Incoterms® 2020 EXW, the seller only makes the goods available at its own premises. From that point the buyer, or the buyer-appointed logistics partner, carries the cost and risk — including loading onto the collecting vehicle and export clearance — unless the sales contract says otherwise. That is why the physical pickup conditions matter as much as the freight route.',
      },
      {
        title: 'How to avoid pickup delays',
        body: 'Before arranging pickup, confirm cargo readiness, site access, loading equipment, business hours, packaging condition, and whether the shipper can support loading.',
        items: ['Confirm cargo is packed and ready', 'Check forklift or crane availability', 'Verify truck access', 'Prepare packing list and commercial documents'],
      },
    ],
    related: [
      {
        label: 'Incoterms from Korea',
        body: 'Shipping under FCA, FOB, CIF, DAP, DDP, or another Incoterms® 2020 rule? See where cost and risk change hands, and what KS WAYS handles from the Korea side.',
        href: '/services/incoterms-korea',
      },
    ],
    checklistTitle: 'Information needed for EXW pickup review',
    checklist: ['Shipper address', 'Contact person', 'Cargo ready date', 'Dimensions and gross weight', 'Packaging photos', 'Loading equipment availability', 'Vehicle access limits', 'Container stuffing requirements'],
    faqs: [
      {
        question: 'Can KS WAYS handle EXW pickup in Korea?',
        answer: 'KS WAYS can review EXW pickup requirements in Korea and coordinate feasible local handling options based on cargo and site conditions.',
      },
      {
        question: 'Why can EXW pickup cost change after review?',
        answer: 'EXW pickup cost can change when cargo dimensions, loading equipment, site access, or container stuffing requirements differ from the initial information.',
      },
    ],
  },
  {
    slug: 'incoterms-korea',
    meta: {
      title: 'Incoterms from Korea — EXW, FCA, FOB, CIF, DAP, DDP | KS WAYS',
      description: 'KS WAYS ships from Korea under every Incoterms® 2020 rule — EXW, FCA, FAS, FOB, CPT, CIP, CFR, CIF, DAP, DPU, and DDP — and plans pickup, export handling, and handoff around where cost and risk change hands.',
      alternates: { canonical: '/services/incoterms-korea' },
      openGraph: {
        title: 'Incoterms from Korea — EXW, FCA, FOB, CIF, DAP, DDP | KS WAYS',
        description: 'Korea-origin shipments under any Incoterms® 2020 rule, planned around where cost and risk change hands.',
        url: 'https://ksways.co/services/incoterms-korea',
        siteName: 'KS WAYS',
        type: 'website',
        images: [shareImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Incoterms from Korea — EXW, FCA, FOB, CIF, DAP, DDP | KS WAYS',
        description: 'Korea-origin shipments under any Incoterms® 2020 rule, planned around where cost and risk change hands.',
        images: [shareImage],
      },
    },
    eyebrow: 'Incoterms from Korea',
    title: 'Shipping from Korea under any Incoterms® 2020 rule',
    lead: 'The agreed Incoterms rule decides who books the main carriage, who clears export, and where risk passes from seller to buyer. Overseas buyers and their forwarders nominate KS WAYS under EXW, FCA, or FOB; Korean exporters book with us under CIF, CPT, DAP, or DDP. We read the term and the named place first, then quote and plan the Korea-side work to match.',
    sections: [
      {
        title: 'Why the term changes the job',
        body: 'Two shipments with the same cargo and route can need different work in Korea. Under EXW the buyer’s side loads at the seller’s premises and handles export clearance; under FCA or FOB the seller clears export and hands over at the named place or port; under C and D rules the seller pays the main carriage, and under D rules also carries the risk to destination. Checking the term before quoting keeps the quote to the scope the sales contract actually agreed.',
      },
      {
        title: 'Buyer-nominated and seller-arranged shipments',
        body: 'KS WAYS works on both sides of a Korea export. Who contacts us depends on the term.',
        items: [
          'EXW · FCA · FAS · FOB — the overseas buyer or its forwarder books, and nominates KS WAYS in Korea',
          'CPT · CIP · CFR · CIF — the Korean seller books the main carriage to destination',
          'DAP · DPU · DDP — the Korean seller delivers at destination, coordinated with WCA partners',
          'FAS, FOB, CFR, and CIF are sea and inland waterway rules in Incoterms® 2020; for air cargo, the any-mode rules FCA, CPT, and CIP describe the handover',
        ],
      },
      {
        title: 'What the term does not settle',
        body: 'Incoterms rules set delivery, cost, and risk points. They do not set price, payment terms, or transfer of ownership, and the named place matters as much as the three letters. KS WAYS explains what a term means for pickup and handoff; which term to agree is a commercial decision between buyer and seller.',
      },
    ],
    incoterms: {
      heading: 'Incoterms® 2020',
      title: 'Eleven rules, four families',
      body: 'Grouped the way the rules are named: E for ex works, F for free (main carriage unpaid), C for carriage paid, D for delivered. Delivery and risk points follow the WCAworld Incoterms® 2020 chart.',
      groups: [
        {
          family: 'E',
          title: 'Pickup at the seller’s door',
          body: 'The buyer’s side does everything from the seller’s premises. KS WAYS reviews pickup, loading, and Korean export clearance for the overseas buyer or its forwarder.',
          terms: [
            {
              code: 'EXW',
              name: 'Ex Works',
              mode: 'any',
              delivery: 'Goods made available at the seller’s premises, not loaded and not cleared for export. The buyer bears the risk from there.',
              href: '/services/exw-pickup-korea',
              linkLabel: 'EXW pickup in Korea',
            },
          ],
        },
        {
          family: 'F',
          title: 'Main carriage booked by the buyer',
          body: 'The seller clears export and hands over in Korea; the buyer books the main carriage. Overseas forwarders nominate KS WAYS as their Korea origin agent to receive the cargo and book on their instructions.',
          terms: [
            {
              code: 'FCA',
              name: 'Free Carrier',
              mode: 'any',
              delivery: 'Seller delivers, cleared for export, to the carrier the buyer names. At the seller’s premises, risk passes once the goods are loaded; at any other named place, once they arrive ready for unloading.',
            },
            {
              code: 'FAS',
              name: 'Free Alongside Ship',
              mode: 'sea',
              delivery: 'Seller places the goods alongside the ship at the port of departure. Risk passes there.',
            },
            {
              code: 'FOB',
              name: 'Free on Board',
              mode: 'sea',
              delivery: 'Seller loads the goods on board the ship at the port of departure. Risk passes once they are on board.',
            },
          ],
        },
        {
          family: 'C',
          title: 'Main carriage paid by the seller',
          body: 'The Korean seller pays for carriage to destination, but risk passes in Korea. KS WAYS books the main carriage for the exporter and, under CIP and CIF, cargo insurance as the contract requires.',
          terms: [
            {
              code: 'CPT',
              name: 'Carriage Paid To',
              mode: 'any',
              delivery: 'Seller hands the goods to the first carrier and pays transport to the named destination. Risk passes at handover.',
            },
            {
              code: 'CIP',
              name: 'Carriage and Insurance Paid To',
              mode: 'any',
              delivery: 'As CPT, and the seller also pays cargo insurance to the named destination. Risk passes at handover.',
            },
            {
              code: 'CFR',
              name: 'Cost and Freight',
              mode: 'sea',
              delivery: 'Seller pays freight to the named port of destination, duty unpaid. Risk passes once the goods are on board.',
            },
            {
              code: 'CIF',
              name: 'Cost, Insurance and Freight',
              mode: 'sea',
              delivery: 'As CFR, and the seller also pays cargo insurance to the port of destination. Risk passes once the goods are on board.',
            },
          ],
        },
        {
          family: 'D',
          title: 'Delivered at destination',
          body: 'The Korean seller carries cost and risk to the destination. KS WAYS coordinates the origin side and the final delivery with WCA partners at destination.',
          terms: [
            {
              code: 'DAP',
              name: 'Delivered at Place',
              mode: 'any',
              delivery: 'Seller delivers at the agreed place, ready for unloading from the arriving vehicle. Import clearance and duties stay with the buyer.',
            },
            {
              code: 'DPU',
              name: 'Delivered at Place Unloaded',
              mode: 'any',
              delivery: 'Seller delivers the goods unloaded at the agreed place. Risk passes once unloading is complete.',
            },
            {
              code: 'DDP',
              name: 'Delivered Duty Paid',
              mode: 'any',
              delivery: 'Seller delivers at destination and pays import duties and taxes. Feasibility depends on destination rules, so KS WAYS reviews it case by case.',
            },
          ],
        },
      ],
    },
    checklistTitle: 'Information to send with an Incoterms-based enquiry',
    checklist: ['Agreed Incoterms® rule and named place', 'Seller and buyer, and who is enquiring', 'Who handles export clearance', 'Pickup address or port of loading', 'Destination address or port', 'Cargo description and HS code', 'Dimensions and gross weight', 'Cargo ready date', 'Insurance requirement (CIP / CIF)', 'Import duty and tax arrangements (DDP)'],
    faqs: [
      {
        question: 'Which Incoterms can KS WAYS work with?',
        answer: 'KS WAYS can review Korea-origin shipments under all eleven Incoterms® 2020 rules: EXW, FCA, FAS, FOB, CPT, CIP, CFR, CIF, DAP, DPU, and DDP. The term and the named place decide which parts of the job sit with KS WAYS, the seller, and the buyer.',
      },
      {
        question: 'Can KS WAYS act as the nominated agent for an FCA or FOB shipment from Korea?',
        answer: 'Yes. Overseas buyers and forwarders can nominate KS WAYS to receive cargo at the named place or port in Korea and book the main carriage on their instructions. Send the sales term, named place, shipper contact, and cargo details.',
      },
      {
        question: 'Can KS WAYS ship DDP from Korea?',
        answer: 'Under DDP the seller pays import duties and taxes and handles import clearance at destination. KS WAYS reviews DDP enquiries case by case with WCA partners at destination; whether it works depends on the destination country’s rules and who can act for the seller there.',
      },
      {
        question: 'Should FOB be used for air freight?',
        answer: 'Incoterms® 2020 lists FOB as a sea and inland waterway rule. For air cargo, and often for containers handed over at an inland point, FCA describes the handover more closely. The choice of term remains a commercial decision between buyer and seller.',
      },
    ],
  },
  {
    slug: 'korea-agent-network',
    meta: {
      title: 'Korea Logistics Agent Network — Partner with KS WAYS',
      description: 'Partner with KS WAYS for Korea-origin ocean and air cargo support on global lanes through WCA cooperation and 30+ years of airline, shipping line, and forwarding experience.',
      alternates: { canonical: '/network/korea-agent-network' },
      openGraph: {
        title: 'Korea Logistics Agent Network — Partner with KS WAYS',
        description: 'Korea-based logistics partner for global freight forwarders, connecting Korea-origin cargo to global lanes.',
        url: 'https://ksways.co/network/korea-agent-network',
        siteName: 'KS WAYS',
        type: 'website',
        images: [shareImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Korea Logistics Agent Network — Partner with KS WAYS',
        description: 'Korea-based logistics partner for global freight forwarders, connecting Korea-origin cargo to global lanes.',
        images: [shareImage],
      },
    },
    eyebrow: 'Korea Agent Network',
    title: 'Korea logistics support for global partners',
    lead: 'KS WAYS gives global freight forwarders a trusted Korea-based forwarding company for Korea-origin ocean and air cargo, with WCA cooperation and 30+ years of industry experience across airline cargo, express logistics, shipping line operations, and global forwarding.',
    trustCards: [
      {
        label: 'Global access',
        value: 'Partner-ready coordination',
        body: 'Partners can review services, send enquiries, and understand KS WAYS capabilities through clear service information and responsive coordination from the first contact.',
      },
      {
        label: 'Origin access',
        value: 'Korea · Ocean & Air',
        body: 'A compact Korea base with hands-on port and airport familiarity helps partners coordinate Korea-origin ocean and air cargo onto global lanes.',
      },
      {
        label: 'Trust base',
        value: 'WCA + 30+ years',
        body: 'Carrier-side and global forwarding experience supports reliable, partner-safe handoff instead of anonymous local handling.',
      },
    ],
    sections: [
      {
        title: 'Who we work with',
        body: 'KS WAYS works with global freight forwarders, logistics networks, import agents, exporters, buyers, and companies that need reliable Korea-side execution.',
        items: ['Global freight forwarders', 'Overseas freight agents', 'Import and export partners', 'Route-development partners', 'Brands with Korea-connected cargo'],
      },
      {
        title: 'What partners can expect',
        body: 'Partners can expect practical enquiry review, clear information requests, responsive milestone updates, and accountable handoff through the shipment process.',
      },
    ],
    memberTools: {
      heading: 'For WCAworld members',
      title: 'Quote and settle through WCAworld',
      body: 'If your company is a WCAworld member, you can work with KS WAYS through the network’s own member tools: RFQs through the WCAworld Quotation System and shipment settlement through WCAworld PartnerPay. KS WAYS is also enrolled in WCAworld’s Gold Medallion Program, which protects transactions between enrolled members under the programme’s own terms.',
      items: [
        {
          key: 'wqs',
          name: 'WCAworld Quotation System',
          body: 'WCAworld’s member-only platform for sending and receiving RFQs. A detailed RFQ — route, cargo, dimensions, Incoterms, and ready date — lets KS WAYS return an accurate quote with less back-and-forth.',
        },
        {
          key: 'partnerpay',
          name: 'WCAworld PartnerPay',
          body: 'WCAworld’s company-to-company payment system for its members. Partners can pay and receive shipment settlements with KS WAYS through their PartnerPay account.',
        },
      ],
    },
    principles: {
      heading: 'Partner cooperation principles',
      title: 'How we work with partners',
      body: 'As a WCA Inter Global member, KS WAYS follows the WCAworld Code of Ethics. In day-to-day cooperation, that means:',
      items: [
        { title: 'Prompt, precise quotes', body: 'We reply within a reasonable time and quote with precise details, so rates can be compared and confirmed without guesswork.' },
        { title: 'Agreements in writing', body: 'Rates, scope, and shipping instructions are confirmed by contract or clear email — including anything first discussed on messengers or social media.' },
        { title: 'Clean settlement', body: 'We invoice and pay in the quoted currency within the agreed period, with local bank charges on each side unless agreed otherwise. Unforeseen storage, demurrage, or fines are passed on at actual cost with an official invoice.' },
        { title: 'Your customers stay yours', body: 'We respect partners’ customer bases and confidential business data, and we do not back-sell.' },
        { title: 'Lawful cargo only', body: 'We do not take part in shipments we know, or should have known, to be fraudulent or illegal under the laws of the origin, destination, or transit country.' },
        { title: 'Disputes on the record', body: 'If a disagreement cannot be settled between us, we take part in WCAworld’s dispute-resolution process with documented facts.' },
      ],
    },
    checklistTitle: 'Information to send for partner enquiries',
    checklist: ['Company profile', 'Country and main routes', 'Cargo type', 'Expected cooperation scope', 'Current enquiry details if available', 'Preferred communication channel', 'Reporting preference', 'Target lane notes if relevant'],
    faqs: [
      {
        question: 'Can WCAworld members send RFQs to KS WAYS through WQS?',
        answer: 'Yes. WCAworld members can send RFQs to KS WAYS through the WCAworld Quotation System (WQS), WCAworld’s member-only quotation platform. Enquiries can also be sent to info@ksways.co.',
      },
      {
        question: 'Does KS WAYS accept WCAworld PartnerPay?',
        answer: 'Yes. KS WAYS can settle shipments with WCAworld member partners through WCAworld PartnerPay, the network’s company-to-company payment system.',
      },
      {
        question: 'Is KS WAYS enrolled in the WCAworld Gold Medallion Program?',
        answer: 'Yes. KS WAYS is enrolled in the Gold Medallion Program, WCAworld’s financial protection programme for transactions between enrolled members. Claims are handled by WCAworld’s Gold Medallion team under the programme’s own terms.',
      },
      {
        question: 'Does KS WAYS follow the WCAworld Code of Ethics?',
        answer: 'Yes. As a WCA Inter Global member, KS WAYS follows the WCAworld Code of Ethics: prompt and precise quotes, written agreements, settlement in the quoted currency, extra charges at actual cost, no back-selling, lawful cargo only, and WCAworld dispute resolution when needed.',
      },
      {
        question: 'Does KS WAYS work with global freight forwarders?',
        answer: 'Yes. KS WAYS supports global freight forwarders that need a trusted global forwarding company for Korea-side logistics coordination.',
      },
      {
        question: 'How can an overseas agent contact KS WAYS?',
        answer: 'Overseas agents can send shipment or partnership enquiries to info@ksways.co with cargo details, route, Incoterms, required support scope, and any preferred reporting requirements.',
      },
    ],
  },
];

/** All eleven Incoterms® 2020 rules in hub order — the single source for the hub grid and the service-page strips. */
export function incotermTerms(): IncotermTerm[] {
  return getServicePage('incoterms-korea')?.incoterms?.groups.flatMap((group) => group.terms) ?? [];
}

export function getServicePage(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}
