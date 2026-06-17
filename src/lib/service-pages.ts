import type { Metadata } from 'next';
import { shareImage } from './seo';

export type ServicePage = {
  slug: string;
  meta: Metadata;
  eyebrow: string;
  title: string;
  lead: string;
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
      description: 'KS WAYS supports Korea-connected air freight for urgent, high-value, and time-sensitive cargo with practical routing and clear shipment follow-up.',
      alternates: { canonical: '/services/air-freight-korea' },
      openGraph: {
        title: 'Air Freight Korea — KS WAYS Global Logistics',
        description: 'Korea-connected air freight for urgent, high-value, and time-sensitive cargo.',
        url: 'https://ksways.co/services/air-freight-korea',
        siteName: 'KS WAYS',
        type: 'website',
        images: [shareImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Air Freight Korea — KS WAYS Global Logistics',
        description: 'Korea-connected air freight for urgent, high-value, and time-sensitive cargo.',
        images: [shareImage],
      },
    },
    eyebrow: 'Air Freight Korea',
    title: 'Air freight solutions for Korea-connected cargo',
    lead: 'When timing matters, air freight needs fast review, accurate cargo information, and clear coordination between shipper, carrier, airport, and destination partner. KS WAYS helps exporters, importers, and overseas agents review Korea-connected air cargo and select practical routing options.',
    sections: [
      {
        title: 'When to use air freight',
        body: 'Air freight is best for urgent, high-value, small-volume, or time-sensitive cargo where schedule reliability matters more than container-level cost efficiency.',
        items: ['Urgent production parts', 'High-value commercial goods', 'Sample shipments', 'Time-sensitive buyer deadlines'],
      },
      {
        title: 'How KS WAYS coordinates air cargo',
        body: 'KS WAYS reviews cargo facts, confirms route feasibility, coordinates booking and document flow, and keeps partners informed through key shipment milestones.',
      },
    ],
    checklistTitle: 'Information needed for an air freight quote',
    checklist: ['Origin and destination', 'Cargo description', 'Package count', 'Dimensions and gross weight', 'Incoterms', 'Cargo ready date', 'Required delivery timing', 'Special handling requirements'],
    faqs: [
      {
        question: 'Can KS WAYS support air freight from Korea?',
        answer: 'Yes. KS WAYS can review Korea-connected air freight enquiries and coordinate practical routing for urgent, high-value, or time-sensitive cargo.',
      },
      {
        question: 'What determines the air freight cost?',
        answer: 'Air freight cost depends on chargeable weight, route, airline capacity, cargo ready date, service level, pickup needs, and destination requirements.',
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
      description: 'Partner with KS WAYS for Korea-connected cargo. We support overseas freight agents with practical routing, local coordination, and clear shipment handoffs.',
      alternates: { canonical: '/network/korea-agent-network' },
      openGraph: {
        title: 'Korea Logistics Agent Network — Partner with KS WAYS',
        description: 'A reliable Korea logistics partner for overseas freight agents.',
        url: 'https://ksways.co/network/korea-agent-network',
        siteName: 'KS WAYS',
        type: 'website',
        images: [shareImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Korea Logistics Agent Network — Partner with KS WAYS',
        description: 'A reliable Korea logistics partner for overseas freight agents.',
        images: [shareImage],
      },
    },
    eyebrow: 'Korea Agent Network',
    title: 'A reliable Korea logistics partner for overseas agents',
    lead: 'Overseas freight agents need a Korea partner who can respond quickly, understand local execution, and communicate clearly from enquiry to delivery. KS WAYS supports partner cooperation for Korea-connected air freight, ocean freight, cross-border shipments, and special handling cases.',
    sections: [
      {
        title: 'Who we work with',
        body: 'KS WAYS works with overseas freight forwarders, logistics networks, import agents, exporters, buyers, and companies that need reliable Korea-side execution.',
        items: ['Overseas freight agents', 'Import and export partners', 'Route-development partners', 'Brands with Korea-connected cargo'],
      },
      {
        title: 'What partners can expect',
        body: 'Partners can expect practical enquiry review, clear information requests, responsive communication, and accountable handoff through the shipment process.',
      },
    ],
    checklistTitle: 'Information to send for partner enquiries',
    checklist: ['Company profile', 'Country and main routes', 'Cargo type', 'Expected cooperation scope', 'Current enquiry details if available', 'Preferred communication channel'],
    faqs: [
      {
        question: 'Does KS WAYS work with overseas freight agents?',
        answer: 'Yes. KS WAYS supports overseas freight agents that need Korea-side logistics coordination and partner cooperation for Korea-connected cargo.',
      },
      {
        question: 'How can an overseas agent contact KS WAYS?',
        answer: 'Overseas agents can send shipment or partnership enquiries to info@ksways.co with cargo details, route, Incoterms, and required support scope.',
      },
    ],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}
