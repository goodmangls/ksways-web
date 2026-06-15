import type { Metadata } from 'next';
import type { Locale } from './i18n';

export const siteUrl = 'https://ksways.co';
export const companyName = 'KS WAYS CO., LTD.';
export const brandName = 'KSWAYS';
export const contactEmail = 'info@ksways.co';

export const homeSeo: Record<Locale, Metadata> = {
  en: {
    title: 'KSWAYS — Korea-Based Global Logistics Partner',
    description: 'KSWAYS is a Korea-based global logistics company supporting air freight, ocean freight, cross-border logistics, EXW pickup, and partner-network cooperation.',
    alternates: {
      canonical: '/',
      languages: {
        en: '/',
        kr: '/kr',
        'x-default': '/',
      },
    },
    openGraph: {
      title: 'KSWAYS — Korea-Based Global Logistics Partner',
      description: 'Move cargo between Korea and the world with air freight, ocean freight, cross-border logistics, local handling, and trusted agent cooperation.',
      url: siteUrl,
      siteName: brandName,
      type: 'website',
      locale: 'en_US',
    },
  },
  kr: {
    title: 'KSWAYS — 한국 기반 글로벌 물류 파트너',
    description: 'KSWAYS는 항공, 해상, 크로스보더, EXW 픽업, 파트너 네트워크 협력을 지원하는 한국 기반 글로벌 물류 회사입니다.',
    alternates: {
      canonical: '/kr',
      languages: {
        en: '/',
        kr: '/kr',
        'x-default': '/',
      },
    },
    openGraph: {
      title: 'KSWAYS — 한국 기반 글로벌 물류 파트너',
      description: '한국과 세계를 연결하는 항공, 해상, 크로스보더, EXW 픽업, 파트너 기반 글로벌 물류 회사입니다.',
      url: `${siteUrl}/kr`,
      siteName: brandName,
      type: 'website',
      locale: 'ko_KR',
    },
  },
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const homeFaqs: Record<Locale, FaqItem[]> = {
  en: [
    {
      question: 'What does KSWAYS do?',
      answer: 'KSWAYS is a Korea-based global logistics company that supports air freight, ocean freight, cross-border logistics, EXW pickup coordination, project cargo support, and partner-network cooperation for Korea-connected shipments.',
    },
    {
      question: 'Is KSWAYS a freight forwarder in Korea?',
      answer: 'Yes. KSWAYS operates as a Korea-based logistics partner and freight-forwarding coordinator for companies and overseas agents that need reliable shipment execution in the Korean market.',
    },
    {
      question: 'Can KSWAYS handle EXW pickup in Korea?',
      answer: 'KSWAYS can review EXW pickup requirements in Korea, including shipper location, cargo dimensions, loading conditions, vehicle access, stuffing requirements, and local handling needs. Final feasibility depends on the cargo and pickup site conditions.',
    },
    {
      question: 'What information is needed for a freight quote?',
      answer: 'A freight quote usually requires origin, destination, Incoterms, cargo description, dimensions, gross weight, package count, cargo ready date, service mode, pickup conditions, and any special handling requirements.',
    },
    {
      question: 'How can I contact KSWAYS?',
      answer: `For quotation or partnership enquiries, contact KSWAYS through the official group email: ${contactEmail}.`,
    },
  ],
  kr: [
    {
      question: 'KSWAYS는 어떤 회사인가요?',
      answer: 'KSWAYS는 한국 기반 글로벌 물류 회사입니다. 항공 운송, 해상 운송, 크로스보더 물류, EXW 픽업, 프로젝트 화물 지원, 파트너 네트워크 협력을 통해 한국과 세계를 연결합니다.',
    },
    {
      question: 'KSWAYS는 한국 포워더인가요?',
      answer: '네. KSWAYS는 한국 시장에서 신뢰할 수 있는 운송 실행이 필요한 기업과 해외 에이전트를 위해 화물 운송과 포워딩 조율을 지원하는 한국 기반 물류 파트너입니다.',
    },
    {
      question: 'KSWAYS는 한국 EXW 픽업을 지원하나요?',
      answer: 'KSWAYS는 한국 내 EXW 픽업 조건을 검토할 수 있습니다. 화주 위치, 화물 규격, 상차 조건, 차량 접근성, 적입 필요 여부, 현장 핸들링 조건에 따라 가능 여부와 방식이 달라집니다.',
    },
    {
      question: '운임 견적에는 어떤 정보가 필요한가요?',
      answer: '운임 견적에는 출발지, 도착지, Incoterms, 화물명, 규격, 총중량, 포장 수량, 화물 준비일, 운송 모드, 픽업 조건, 특수 취급 필요 여부가 필요합니다.',
    },
    {
      question: 'KSWAYS에 어떻게 문의할 수 있나요?',
      answer: `견적 또는 파트너십 문의는 공식 그룹 이메일 ${contactEmail}로 보내 주시면 됩니다.`,
    },
  ],
};

export function organizationJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyName,
    alternateName: brandName,
    url: siteUrl,
    email: contactEmail,
    description:
      locale === 'kr'
        ? 'KSWAYS는 항공, 해상, 크로스보더, EXW 픽업, 파트너 네트워크 협력을 지원하는 한국 기반 글로벌 물류 회사입니다.'
        : 'KSWAYS is a Korea-based global logistics company supporting air freight, ocean freight, cross-border logistics, EXW pickup, and partner-network cooperation.',
    areaServed: 'Worldwide',
    knowsAbout: [
      'Freight forwarding',
      'Air freight',
      'Ocean freight',
      'Cross-border logistics',
      'EXW pickup',
      'Korea logistics',
      'Partner network',
    ],
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function serviceJsonLd({ name, description, url }: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: companyName,
      alternateName: brandName,
      url: siteUrl,
      email: contactEmail,
    },
    areaServed: 'Worldwide',
    url,
    serviceType: name,
  };
}
