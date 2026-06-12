import type { Locale } from './i18n';

type Service = {
  title: string;
  body: string;
};

type HomeCopy = {
  nav: {
    company: string;
    services: string;
    network: string;
    solutions: string;
    contact: string;
    quote: string;
    langToggle: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    proof: Array<{ label: string; value: string }>;
    controlTitle: string;
    controlCenter: string;
  };
  operating: {
    kicker: string;
    headline: string;
    body: string;
    services: Service[];
  };
  network: {
    kicker: string;
    headline: string;
    body: string;
    points: string[];
  };
  contact: {
    headline: string;
    body: string;
    quote: string;
    partner: string;
  };
};

export const homeContent: Record<Locale, HomeCopy> = {
  en: {
    nav: {
      company: 'Company',
      services: 'Services',
      network: 'Network',
      solutions: 'Solutions',
      contact: 'Contact sales',
      quote: 'Get a quote',
      langToggle: 'KR',
    },
    hero: {
      eyebrow: 'Korea-connected logistics. Partner-powered execution.',
      headline: 'The smart way to global logistics',
      lead: 'KSWAYS connects Korea and the world through reliable freight solutions, trusted partner networks, and smarter supply routes for exporters, buyers, and growing brands.',
      primaryCta: 'Get a Quote',
      secondaryCta: 'Explore Partner Network',
      proof: [
        { label: 'Global routes', value: 'Korea ↔ World' },
        { label: 'Service modes', value: 'Air · Ocean · Express' },
        { label: 'Growth model', value: 'Partner Network' },
      ],
      controlTitle: 'Smarter route flow',
      controlCenter: 'ONE NETWORK',
    },
    operating: {
      kicker: 'Operating model',
      headline: 'One connected network, from quote to delivery.',
      body: 'A modern logistics platform built from Goodman GLS family design principles: deep navy surfaces, precise route panels, and a clear control-tower story for global cargo movement.',
      services: [
        { title: 'Air Freight', body: 'Fast cargo planning for urgent and high-value shipments.' },
        { title: 'Ocean Freight', body: 'FCL/LCL routing with practical global coverage.' },
        { title: 'Cross-border', body: 'Express and commerce flows for growing brands.' },
        { title: 'Partner Network', body: 'Vetted logistics cooperation, not MLM language.' },
      ],
    },
    network: {
      kicker: 'Partner-powered growth',
      headline: 'Trusted partner access without network-marketing confusion.',
      body: 'KSWAYS uses public-facing language such as Partner Network, Agent Network, and referral-based logistics cooperation to preserve B2B credibility while supporting shared growth.',
      points: ['Vetted partner collaboration', 'Route and lead-sharing opportunities', 'Operational accountability', 'Korea-connected global coverage'],
    },
    contact: {
      headline: 'Ready to move smarter?',
      body: 'Tell us what you need to move. KSWAYS will help you find a practical way forward.',
      quote: 'Request a quote',
      partner: 'Become a partner',
    },
  },
  kr: {
    nav: {
      company: '회사',
      services: '서비스',
      network: '네트워크',
      solutions: '솔루션',
      contact: '상담 문의',
      quote: '견적 문의',
      langToggle: 'EN',
    },
    hero: {
      eyebrow: '한국 연결 물류. 파트너 기반 실행력.',
      headline: '글로벌 물류를 위한 스마트한 길',
      lead: 'KSWAYS는 신뢰할 수 있는 물류 솔루션, 검증된 파트너 네트워크, 더 스마트한 공급망 경로로 한국과 세계를 연결합니다.',
      primaryCta: '견적 문의',
      secondaryCta: '파트너 네트워크 보기',
      proof: [
        { label: '글로벌 경로', value: '한국 ↔ 세계' },
        { label: '서비스 모드', value: '항공 · 해상 · 특송' },
        { label: '성장 모델', value: '파트너 네트워크' },
      ],
      controlTitle: '스마트 라우트 플로우',
      controlCenter: 'ONE NETWORK',
    },
    operating: {
      kicker: '운영 모델',
      headline: '견적부터 배송까지, 하나로 연결된 물류 네트워크.',
      body: 'KSWAYS는 기존 Goodman GLS 패밀리룩을 유지하면서 Electric Teal/Cyan 포인트 컬러로 더 젊고 연결된 글로벌 물류 플랫폼 이미지를 구축합니다.',
      services: [
        { title: '항공 운송', body: '긴급·고가·시간 민감 화물을 위한 빠른 운송 기획.' },
        { title: '해상 운송', body: 'FCL/LCL 기반의 실용적인 글로벌 라우팅.' },
        { title: '크로스보더', body: '성장 브랜드를 위한 특송·이커머스 물류 흐름.' },
        { title: '파트너 네트워크', body: 'MLM 표현이 아닌 검증된 물류 협력 구조.' },
      ],
    },
    network: {
      kicker: '파트너 기반 성장',
      headline: '신뢰를 해치지 않는 파트너 네트워크 언어.',
      body: 'KSWAYS는 대외적으로 Partner Network, Agent Network, Referral-based Logistics Network 표현을 사용해 B2B 신뢰도를 유지합니다.',
      points: ['검증된 파트너 협업', '노선·리드 공유 기회', '운영 책임성과 투명한 커뮤니케이션', '한국 연결 글로벌 커버리지'],
    },
    contact: {
      headline: '더 스마트하게 이동할 준비가 되셨나요?',
      body: '필요한 운송 내용을 알려주시면 KSWAYS가 실용적인 다음 경로를 함께 찾겠습니다.',
      quote: '견적 문의하기',
      partner: '파트너 문의하기',
    },
  },
};
