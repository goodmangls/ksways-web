import type { Metadata } from 'next';
import { shareImage } from './seo';

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
      description: 'KS WAYS supports Korea-connected air freight for urgent, high-value, DG, perishables, oversized, and time-sensitive cargo with practical routing and clear shipment follow-up.',
      alternates: { canonical: '/services/air-freight-korea' },
      openGraph: {
        title: 'Air Freight Korea — KS WAYS Global Logistics',
        description: 'Korea-connected air freight for urgent, high-value, special, and time-sensitive cargo.',
        url: 'https://ksways.co/services/air-freight-korea',
        siteName: 'KS WAYS',
        type: 'website',
        images: [shareImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Air Freight Korea — KS WAYS Global Logistics',
        description: 'Korea-connected air freight for urgent, high-value, special, and time-sensitive cargo.',
        images: [shareImage],
      },
    },
    eyebrow: 'Air Freight Korea',
    title: 'Air freight solutions for Korea-connected cargo',
    lead: 'When timing matters, air freight needs fast review, accurate cargo information, and clear coordination between shipper, carrier, airport, and destination partner. KS WAYS helps exporters, importers, and overseas agents review Korea-connected air cargo, special handling needs, and practical routing options before booking.',
    sections: [
      {
        title: 'When to use air freight',
        body: 'Air freight is best for urgent, high-value, small-volume, or time-sensitive cargo where schedule reliability matters more than container-level cost efficiency.',
        items: ['Urgent production parts', 'High-value commercial goods', 'Sample shipments', 'Time-sensitive buyer deadlines', 'DG, perishables, oversized, or fragile cargo requiring pre-check'],
      },
      {
        title: 'How KS WAYS coordinates air cargo',
        body: 'KS WAYS reviews cargo facts, confirms route feasibility, coordinates booking and document flow, and keeps partners informed through key shipment milestones.',
      },
      {
        title: 'Special cargo review before quotation',
        body: 'For cargo that may need special handling, KS WAYS checks the operational details before presenting a route: commodity, packing, dimensions, temperature sensitivity, DG status, airport handling needs, customs documents, and the required delivery window.',
        items: ['AOG or urgent replacement parts', 'Dangerous goods and regulated commodities', 'Perishables and temperature-sensitive cargo', 'Oversized or high-value shipments'],
      },
      {
        title: 'Quote-ready information flow',
        body: 'A faster quotation starts with complete cargo data. KS WAYS encourages structured enquiries so routing, chargeable weight, pickup needs, customs requirements, and partner handoff can be reviewed without avoidable back-and-forth.',
      },
    ],
    checklistTitle: 'Information needed for an air freight quote',
    checklist: ['Origin and destination', 'Cargo description and HS code if available', 'Package count', 'Dimensions and gross weight', 'Incoterms', 'Cargo ready date', 'Required delivery timing', 'Commodity sensitivity or DG/perishable status', 'Pickup, customs, or airport handling requirements'],
    faqs: [
      {
        question: 'Can KS WAYS support air freight from Korea?',
        answer: 'Yes. KS WAYS can review Korea-connected air freight enquiries and coordinate practical routing for urgent, high-value, or time-sensitive cargo.',
      },
      {
        question: 'What determines the air freight cost?',
        answer: 'Air freight cost depends on chargeable weight, route, airline capacity, cargo ready date, service level, pickup needs, customs requirements, cargo sensitivity, and destination requirements.',
      },
      {
        question: 'Can KS WAYS review special air cargo requirements?',
        answer: 'Yes. KS WAYS can review special handling needs such as DG, perishables, oversized cargo, high-value goods, fragile items, and urgent replacement parts before confirming a practical route.',
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
        body: 'Under EXW, the buyer or buyer-appointed logistics partner usually needs to arrange pickup and export movement from the shipper location. The physical pickup conditions matter as much as the freight route.',
      },
      {
        title: 'How to avoid pickup delays',
        body: 'Before arranging pickup, confirm cargo readiness, site access, loading equipment, business hours, packaging condition, and whether the shipper can support loading.',
        items: ['Confirm cargo is packed and ready', 'Check forklift or crane availability', 'Verify truck access', 'Prepare packing list and commercial documents'],
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
    slug: 'korea-agent-network',
    meta: {
      title: 'Korea Logistics Agent Network — Partner with KS WAYS',
      description: 'Partner with KS WAYS for English-first Northeast Asia cargo support. Western freight forwarders can reduce language barrier risk across Korea, China, Japan, and wider global lanes through WCA cooperation and 30+ years of airline, shipping line, and forwarding experience.',
      alternates: { canonical: '/network/korea-agent-network' },
      openGraph: {
        title: 'Korea Logistics Agent Network — Partner with KS WAYS',
        description: 'English-first Northeast Asia logistics partner for Western freight forwarders across Korea, China, Japan, and global lanes.',
        url: 'https://ksways.co/network/korea-agent-network',
        siteName: 'KS WAYS',
        type: 'website',
        images: [shareImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Korea Logistics Agent Network — Partner with KS WAYS',
        description: 'English-first Northeast Asia logistics partner for Western freight forwarders across Korea, China, Japan, and global lanes.',
        images: [shareImage],
      },
    },
    eyebrow: 'Korea Agent Network',
    title: 'English-first Northeast Asia logistics support for Western forwarders',
    lead: 'For Western freight forwarders, Northeast Asia can feel complex because of language, local handoff, airport/port practices, and different partner expectations. KS WAYS gives you a trusted global forwarding company in Korea with English-first communication, China and Japan reach, WCA cooperation, and 30+ years of industry experience across airline cargo, express logistics, shipping line operations, and global forwarding.',
    trustCards: [
      {
        label: 'Language barrier',
        value: 'English-first communication',
        body: 'Clear English enquiry review, routing notes, milestone updates, and exception escalation reduce translation friction for Western freight forwarders.',
      },
      {
        label: 'Regional access',
        value: 'Korea · China · Japan',
        body: 'A compact Korea base with practical Northeast Asia awareness helps partners coordinate Korea-connected cargo and nearby China/Japan trade lanes.',
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
        body: 'KS WAYS works with Western freight forwarders, logistics networks, import agents, exporters, buyers, and companies that need reliable Korea-side execution without the usual language barrier.',
        items: ['Western freight forwarders', 'Overseas freight agents', 'Import and export partners', 'Route-development partners', 'Brands with Korea-connected cargo'],
      },
      {
        title: 'What partners can expect',
        body: 'Partners can expect English-first communication, practical enquiry review, clear information requests, responsive milestone updates, and accountable handoff through the shipment process.',
      },
    ],
    checklistTitle: 'Information to send for partner enquiries',
    checklist: ['Company profile', 'Country and main routes', 'Cargo type', 'Expected cooperation scope', 'Current enquiry details if available', 'Preferred communication channel', 'Language or reporting preference', 'China/Japan lane notes if relevant'],
    faqs: [
      {
        question: 'Does KS WAYS work with Western freight forwarders?',
        answer: 'Yes. KS WAYS supports Western freight forwarders that need a trusted global forwarding company for English-first Korea-side and Northeast Asia logistics coordination.',
      },
      {
        question: 'How can an overseas agent contact KS WAYS?',
        answer: 'Overseas agents can send shipment or partnership enquiries to info@ksways.co with cargo details, route, Incoterms, required support scope, and any preferred English reporting or language handoff requirements.',
      },
    ],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}
