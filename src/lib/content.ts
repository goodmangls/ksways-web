import type { Locale } from './i18n';

type Service = {
  title: string;
  body: string;
  href?: string;
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
  company: {
    kicker: string;
    headline: string;
    body: string;
    pillars: Service[];
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
  solutions: {
    kicker: string;
    headline: string;
    body: string;
    steps: Service[];
  };
  contact: {
    headline: string;
    body: string;
    email: string;
    quote: string;
    partner: string;
    chat: string;
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
      eyebrow: 'Global ocean and air logistics. WCA network member.',
      headline: 'The smart way to global logistics',
      lead: 'KSWAYS is a global logistics company responsible for ocean and air freight, with particular strength in sea freight and trusted partner-network execution for exporters, buyers, and growing brands.',
      primaryCta: 'Get a Quote',
      secondaryCta: 'Explore Partner Network',
      proof: [
        { label: 'Global network', value: 'WCA Member' },
        { label: 'Core services', value: 'Ocean · Air' },
        { label: 'Ocean strength', value: 'FCL · LCL' },
      ],
      controlTitle: 'Route control tower',
      controlCenter: 'KSWAYS',
    },
    company: {
      kicker: 'Company',
      headline: 'A global logistics company built for ocean and air freight execution.',
      body: 'KS WAYS CO., LTD. combines hands-on freight operations with global partner access, helping customers and overseas agents coordinate ocean and air shipments with speed, clarity, and accountability.',
      pillars: [
        { title: 'Ocean freight strength', body: 'FCL/LCL planning, carrier coordination, loading review, and partner handoff for sea freight movements.' },
        { title: 'WCA network member', body: 'Global agent cooperation through the world’s largest logistics network, supporting responsive international coverage.' },
        { title: 'Clear ownership', body: 'Practical follow-up from enquiry to booking, document flow, and delivery milestones.' },
      ],
    },
    operating: {
      kicker: 'Services',
      headline: 'Ocean-led freight solutions with air logistics support.',
      body: 'KSWAYS supports ocean freight, air freight, and cross-border cargo flows with a clean operating rhythm: understand the shipment, select the route, coordinate the handoff, and keep partners informed.',
      services: [
        { title: 'Air Freight', body: 'Fast planning for urgent, high-value, and time-sensitive cargo when speed matters.', href: '/services/air-freight-korea' },
        { title: 'Ocean Freight', body: 'Primary FCL/LCL strength with practical carrier and partner coordination.', href: '/services/ocean-freight-korea' },
        { title: 'Cross-border', body: 'Express and commerce flows for growing brands and recurring shipments.' },
        { title: 'Project Support', body: 'Case-by-case handling for special pickup, stuffing, and schedule constraints.', href: '/services/exw-pickup-korea' },
        { title: 'BridgeLogis', body: 'Digital logistics service access for smarter shipment coordination and connected operations.', href: 'https://bridgelogis.com' },
      ],
    },
    network: {
      kicker: 'Partner network',
      headline: 'WCA-backed cooperation for global cargo movement.',
      body: 'As a WCA member, KSWAYS works through global agent cooperation with practical routing, responsive communication, and responsible handoffs — so each partner knows who owns the next step.',
      points: ['WCA member network', 'Ocean and air freight cooperation', 'Operational accountability', 'Global partner coverage'],
    },
    solutions: {
      kicker: 'How we work',
      headline: 'A clearer path for every enquiry.',
      body: 'From the first request to final delivery, KSWAYS keeps the process focused on the facts that matter: cargo readiness, route feasibility, cost, risk, and timing.',
      steps: [
        { title: '01 · Review', body: 'Cargo details, Incoterms, pickup conditions, destination requirements, and deadline.' },
        { title: '02 · Route', body: 'Mode selection, carrier options, partner coordination, and practical alternatives.' },
        { title: '03 · Execute', body: 'Booking, documentation, milestone updates, and exception handling.' },
      ],
    },
    contact: {
      headline: 'Ready to move smarter?',
      body: 'Share your cargo details or partnership enquiry through info@ksways.co or Intercom. We will help you find the most practical way forward.',
      email: 'info@ksways.co',
      quote: 'Request a quote',
      partner: 'Become a partner',
      chat: 'Contact on Intercom',
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
      eyebrow: '글로벌 해상·항공 물류. WCA 네트워크 회원사.',
      headline: '글로벌 물류를 위한 스마트한 길',
      lead: 'KSWAYS는 해상물류와 항공물류를 책임지는 글로벌 물류회사로, 특히 해운에 강점을 두고 WCA 글로벌 네트워크 기반의 파트너 실행력을 제공합니다.',
      primaryCta: '견적 문의',
      secondaryCta: '파트너 네트워크 보기',
      proof: [
        { label: '글로벌 네트워크', value: 'WCA 회원사' },
        { label: '핵심 서비스', value: '해상 · 항공' },
        { label: '해운 강점', value: 'FCL · LCL' },
      ],
      controlTitle: '라우트 컨트롤 타워',
      controlCenter: 'KSWAYS',
    },
    company: {
      kicker: '회사 소개',
      headline: '해상과 항공 운송 실행력을 갖춘 글로벌 물류회사.',
      body: 'KS WAYS CO., LTD.는 실무 중심의 포워딩 운영 역량과 글로벌 파트너 네트워크를 결합해 해상·항공 화물을 빠르고 명확하게 조율합니다.',
      pillars: [
        { title: '해상물류 강점', body: 'FCL/LCL 라우팅, 운송사 조율, 적입 검토, 파트너 핸드오프까지 해운 중심 실행을 지원합니다.' },
        { title: 'WCA 네트워크 회원사', body: '세계 최대 글로벌 물류 네트워크 기반의 에이전트 협력으로 국제 커버리지를 확장합니다.' },
        { title: '명확한 책임', body: '문의부터 부킹, 서류, 운송 마일스톤까지 필요한 다음 단계를 분명히 관리합니다.' },
      ],
    },
    operating: {
      kicker: '서비스',
      headline: '해상을 중심으로 항공까지 연결하는 운송 솔루션.',
      body: 'KSWAYS는 해상 운송, 항공 운송, 크로스보더 화물 흐름을 지원하며, 화물 이해·라우트 선정·핸드오프 조율·파트너 커뮤니케이션을 일관된 리듬으로 관리합니다.',
      services: [
        { title: '항공 운송', body: '긴급·고가·시간 민감 화물을 위한 빠른 운송 기획.', href: '/services/air-freight-korea' },
        { title: '해상 운송', body: 'KSWAYS의 핵심 강점인 FCL/LCL 기반 운송사 및 파트너 조율.', href: '/services/ocean-freight-korea' },
        { title: '크로스보더', body: '성장 브랜드와 반복 운송을 위한 특송·이커머스 물류 흐름.' },
        { title: '프로젝트 지원', body: '특수 픽업, 적입, 일정 제약이 있는 화물의 케이스별 지원.', href: '/services/exw-pickup-korea' },
        { title: 'BridgeLogis', body: '더 스마트한 운송 조율과 연결된 운영을 위한 디지털 물류 서비스 접근 채널.', href: 'https://bridgelogis.com' },
      ],
    },
    network: {
      kicker: '파트너 네트워크',
      headline: '글로벌 화물 이동을 위한 WCA 기반 에이전트 협력.',
      body: 'KSWAYS는 WCA 회원사로서 실질적인 라우팅, 빠른 커뮤니케이션, 책임 있는 핸드오프를 중심으로 글로벌 에이전트 협력을 운영합니다.',
      points: ['WCA 회원 네트워크', '해상·항공 운송 협력', '운영 책임성과 투명한 커뮤니케이션', '글로벌 파트너 커버리지'],
    },
    solutions: {
      kicker: '업무 방식',
      headline: '모든 문의에 더 명확한 다음 경로를 제시합니다.',
      body: '첫 문의부터 최종 배송까지, KSWAYS는 화물 준비 상태, 라우트 가능성, 비용, 리스크, 일정이라는 핵심 사실에 집중합니다.',
      steps: [
        { title: '01 · 검토', body: '화물 정보, Incoterms, 픽업 조건, 도착지 요구사항, 마감 일정을 확인합니다.' },
        { title: '02 · 라우팅', body: '운송 모드, 운송사 옵션, 파트너 조율, 현실적인 대안을 검토합니다.' },
        { title: '03 · 실행', body: '부킹, 서류, 진행 상황 업데이트, 예외 상황 대응까지 관리합니다.' },
      ],
    },
    contact: {
      headline: '더 스마트하게 이동할 준비가 되셨나요?',
      body: '화물 정보 또는 파트너십 문의는 info@ksways.co 또는 Intercom으로 보내 주세요. KSWAYS가 가장 실용적인 다음 경로를 함께 찾겠습니다.',
      email: 'info@ksways.co',
      quote: '견적 문의하기',
      partner: '파트너 문의하기',
      chat: 'Intercom으로 문의',
    },
  },
};
