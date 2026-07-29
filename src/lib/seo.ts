import type { Metadata } from 'next';
import type { Locale } from './i18n';

export const siteUrl = 'https://ksways.co';
export const companyName = 'KS WAYS CO., LTD.';
export const brandName = 'KS WAYS';
export const contactEmail = 'info@ksways.co';
export const contactTelephone = '+82 2 6961 5778';
export const contactFax = '+82 2 6961 5765';
export const shareImage = {
  url: '/assets/ksways-logo-color.png',
  width: 1200,
  height: 630,
  alt: 'KS WAYS global ocean and air logistics',
};

export const homeSeo: Record<Locale, Metadata> = {
  en: {
    title: 'KS WAYS — Global Ocean & Air Logistics Company',
    description: 'KS WAYS is a trusted global forwarding company for global freight forwarders working across Northeast Asia, with Korea-to-China/Japan connectivity and 30+ years of industry experience across airline cargo, express logistics, shipping line operations, and global forwarding.',
    alternates: {
      canonical: '/',
      languages: {
        en: '/',
        'ko-KR': '/kr',
        'x-default': '/',
      },
    },
    openGraph: {
      title: 'KS WAYS — Global Ocean & Air Logistics Company',
      description: 'Northeast Asia logistics for global freight forwarders across Korea, China and Japan, plus wider global lanes.',
      url: siteUrl,
      siteName: brandName,
      type: 'website',
      locale: 'en_US',
      images: [shareImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'KS WAYS — Global Ocean & Air Logistics Company',
      description: 'Northeast Asia logistics for global freight forwarders across Korea, China and Japan, plus wider global lanes.',
      images: [shareImage],
    },
  },
  kr: {
    title: 'KS WAYS — 글로벌 해상·항공 물류회사',
    description: 'KS WAYS는 한국을 동북아 전략 거점으로 삼아 중국·일본과 연결되는 글로벌 해상·항공 물류회사로, 항공화물·특송 물류·해운사 운영·글로벌 포워딩 전반의 30년 이상 Industry Experience를 기반으로 합니다.',
    alternates: {
      canonical: '/kr',
      languages: {
        en: '/',
        'ko-KR': '/kr',
        'x-default': '/',
      },
    },
    openGraph: {
      title: 'KS WAYS — 글로벌 해상·항공 물류회사',
      description: '동북아 한국 거점에서 중국·일본과 글로벌 화물을 연결하는 해상·항공 물류회사, 30년 이상 항공사·해운사·글로벌 포워딩 경험.',
      url: `${siteUrl}/kr`,
      siteName: brandName,
      type: 'website',
      locale: 'ko_KR',
      images: [shareImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'KS WAYS — 글로벌 해상·항공 물류회사',
      description: '동북아 한국 거점에서 중국·일본과 글로벌 화물을 연결하는 해상·항공 물류회사, 30년 이상 항공사·해운사·글로벌 포워딩 경험.',
      images: [shareImage],
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
      question: 'What does KS WAYS do?',
      answer: 'KS WAYS is a trusted global forwarding company for global freight forwarders working across Northeast Asia, with Korea-to-China/Japan connectivity and 30+ years of industry experience across airline cargo, express logistics, shipping line operations, and global forwarding.',
    },
    {
      question: 'Is KS WAYS a WCA member logistics company?',
      answer: 'Yes. KS WAYS is a WCA member logistics company. Public references should use WCA Member ID 96376 and describe the relationship as member-network cooperation, not a guarantee or endorsement.',
    },
    {
      question: 'Can KS WAYS handle EXW pickup in Korea?',
      answer: 'KS WAYS can review EXW pickup requirements in Korea, including shipper location, cargo dimensions, loading conditions, vehicle access, stuffing requirements, and local handling needs. Final feasibility depends on the cargo and pickup site conditions.',
    },
    {
      question: 'Which Korea logistics services does KS WAYS support?',
      answer: 'KS WAYS supports Korea-connected ocean freight, air freight, EXW pickup review, special cargo feasibility checks, domestic trucking or warehousing handoff, and overseas partner coordination across Northeast Asia trade lanes.',
    },
    {
      question: 'What information is needed for a freight quote?',
      answer: 'A freight quote usually requires origin, destination, Incoterms, cargo description, dimensions, gross weight, package count, cargo ready date, service mode, pickup conditions, and any special handling requirements.',
    },
    {
      question: 'Why do overseas freight forwarders choose KS WAYS for Korea shipments?',
      answer: 'Overseas freight forwarders choose KS WAYS when they need a Korea-side execution partner with ocean and air freight capability, WCA member-network cooperation, Northeast Asia route awareness, and structured communication before quotation and shipment handoff.',
    },
    {
      question: 'How can I contact KS WAYS?',
      answer: `For quotation or partnership enquiries, contact KS WAYS through the official group email: ${contactEmail}, call Tel. ${contactTelephone}, or use Fax ${contactFax}.`,
    },
  ],
  kr: [
    {
      question: 'KS WAYS는 어떤 회사인가요?',
      answer: 'KS WAYS는 한국을 동북아 전략 거점으로 삼아 중국·일본과 연결되는 글로벌 해상·항공 물류회사입니다. 항공화물, 특송 물류, 해운사 운영, 글로벌 포워딩 전반에서 축적한 30년 이상 Industry Experience를 기반으로 합니다.',
    },
    {
      question: 'KS WAYS는 WCA 회원 물류회사인가요?',
      answer: '네. KS WAYS는 WCA 회원사입니다. 공개 문구에서는 WCA Member ID 96376과 회원 네트워크 협력으로 표현하며, 보증 또는 독점 인증처럼 과장하지 않습니다.',
    },
    {
      question: 'KS WAYS는 한국 EXW 픽업을 지원하나요?',
      answer: 'KS WAYS는 한국 내 EXW 픽업 조건을 검토할 수 있습니다. 화주 위치, 화물 규격, 상차 조건, 차량 접근성, 적입 필요 여부, 현장 핸들링 조건에 따라 가능 여부와 방식이 달라집니다.',
    },
    {
      question: 'KS WAYS는 어떤 한국 물류 서비스를 지원하나요?',
      answer: 'KS WAYS는 한국 연계 해상 운송, 항공 운송, EXW 픽업 검토, 특수화물 가능성 확인, 국내 트럭킹 또는 창고 핸드오프, 동북아 파트너 조율을 지원합니다.',
    },
    {
      question: '운임 견적에는 어떤 정보가 필요한가요?',
      answer: '운임 견적에는 출발지, 도착지, Incoterms, 화물명, 규격, 총중량, 포장 수량, 화물 준비일, 운송 모드, 픽업 조건, 특수 취급 필요 여부가 필요합니다.',
    },
    {
      question: '해외 포워더가 한국 화물에서 KS WAYS를 선택하는 이유는 무엇인가요?',
      answer: '해외 포워더는 한국 측 실행 파트너, 해상·항공 운송 역량, WCA 회원 네트워크 협력, 동북아 라우트 이해, 견적 전 정보 정리와 선적 핸드오프 커뮤니케이션이 필요할 때 KS WAYS를 선택할 수 있습니다.',
    },
    {
      question: 'KS WAYS에 어떻게 문의할 수 있나요?',
      answer: `견적 또는 파트너십 문의는 공식 그룹 이메일 ${contactEmail}, 대표 전화 Tel. ${contactTelephone}, Fax ${contactFax}로 연락해 주시면 됩니다.`,
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
    telephone: contactTelephone,
    faxNumber: contactFax,
    description:
      locale === 'kr'
        ? 'KS WAYS는 한국을 동북아 전략 거점으로 삼아 중국·일본과 연결되는 글로벌 해상·항공 물류회사로, 항공화물·특송 물류·해운사 운영·글로벌 포워딩 전반의 30년 이상 Industry Experience를 기반으로 합니다.'
        : 'KS WAYS is a trusted global forwarding company for global freight forwarders working across Northeast Asia, with Korea-to-China/Japan connectivity and 30+ years of industry experience across airline cargo, express logistics, shipping line operations, and global forwarding.',
    areaServed: ['Worldwide', 'Korea', 'China', 'Japan', 'Northeast Asia'],
    slogan: 'The smart way to global logistics',
    contactPoint: [contactPointJsonLd(locale)],
    memberOf: {
      '@type': 'Organization',
      name: 'WCAworld',
    },
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'WCA Member ID',
      value: '96376',
    },
    knowsAbout: [
      'Korea freight forwarding',
      'Ocean freight Korea',
      'Air freight Korea',
      'EXW pickup Korea',
      'Special cargo Korea',
      'Northeast Asia logistics',
      'WCA agent cooperation',
      'Digital logistics coordination',
      'Partner network',
    ],
  };
}

export function contactPointJsonLd(locale: Locale) {
  return {
    '@type': 'ContactPoint',
    contactType: locale === 'kr' ? '견적 및 파트너십 문의' : 'quotation and partnership enquiries',
    email: contactEmail,
    telephone: contactTelephone,
    faxNumber: contactFax,
    availableLanguage: ['English', 'Korean'],
    areaServed: ['Worldwide', 'Korea', 'Northeast Asia'],
    url: `${siteUrl}/quote`,
  };
}

export function websiteJsonLd(locale: Locale) {
  const inLanguage = locale === 'kr' ? 'ko-KR' : 'en';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brandName,
    url: locale === 'kr' ? `${siteUrl}/kr` : siteUrl,
    inLanguage,
    publisher: {
      '@type': 'Organization',
      name: companyName,
      alternateName: brandName,
      url: siteUrl,
    },
    about: [
      'Korea freight forwarder',
      'Ocean freight Korea',
      'Air freight Korea',
      'EXW pickup Korea',
      'WCA logistics partner network',
    ],
    potentialAction: {
      '@type': 'CommunicateAction',
      name: locale === 'kr' ? 'KS WAYS에 견적 문의하기' : 'Request a freight quote from KS WAYS',
      target: `${siteUrl}/quote`,
    },
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
      telephone: contactTelephone,
      faxNumber: contactFax,
    },
    areaServed: 'Worldwide',
    url,
    serviceType: name,
  };
}
