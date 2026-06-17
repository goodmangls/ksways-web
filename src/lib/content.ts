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
      eyebrow: 'Korea-connected logistics. Partner-powered execution.',
      headline: 'The smart way to global logistics',
      lead: 'KSWAYS connects Korea and the world through reliable freight solutions, trusted partner networks, and smarter supply routes for exporters, buyers, and growing brands.',
      primaryCta: 'Get a Quote',
      secondaryCta: 'Explore Partner Network',
      proof: [
        { label: 'Global routes', value: 'Korea ↔ World' },
        { label: 'Service modes', value: 'Air · Ocean · Express' },
        { label: 'Partner model', value: 'Agent Network' },
      ],
      controlTitle: 'Route control tower',
      controlCenter: 'KSWAYS',
    },
    company: {
      kicker: 'Company',
      headline: 'A Korea-based logistics partner built for practical global execution.',
      body: 'We combine hands-on freight operations with a trusted agent network, helping overseas partners and Korean customers coordinate shipments with speed, clarity, and accountability.',
      pillars: [
        { title: 'Korea gateway', body: 'Local coordination for export, import, pickup, customs, and carrier communication.' },
        { title: 'Partner-first', body: 'Responsive cooperation for agents who need reliable execution in the Korean market.' },
        { title: 'Clear ownership', body: 'Practical follow-up from enquiry to booking, document flow, and delivery milestones.' },
      ],
    },
    operating: {
      kicker: 'Services',
      headline: 'Flexible freight solutions from quote to delivery.',
      body: 'KSWAYS supports core freight modes and cross-border cargo flows with a clean operating rhythm: understand the shipment, select the route, coordinate the handoff, and keep partners informed.',
      services: [
        { title: 'Air Freight', body: 'Fast planning for urgent, high-value, and time-sensitive cargo.', href: '/services/air-freight-korea' },
        { title: 'Ocean Freight', body: 'FCL/LCL routing with practical carrier and partner coordination.', href: '/services/ocean-freight-korea' },
        { title: 'Cross-border', body: 'Express and commerce flows for growing brands and recurring shipments.' },
        { title: 'Project Support', body: 'Case-by-case handling for special pickup, stuffing, and schedule constraints.', href: '/services/exw-pickup-korea' },
        { title: 'BridgeLogis', body: 'Digital logistics service access for smarter shipment coordination and connected operations.', href: 'https://bridgelogis.com' },
      ],
    },
    network: {
      kicker: 'Partner network',
      headline: 'Trusted agent cooperation for Korea-connected cargo.',
      body: 'Our network approach is built around practical routing, responsive communication, and responsible handoffs — so each partner knows who owns the next step.',
      points: ['Vetted partner collaboration', 'Route and lead-sharing opportunities', 'Operational accountability', 'Korea-connected global coverage'],
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
      eyebrow: '한국 연결 물류. 파트너 기반 실행력.',
      headline: '글로벌 물류를 위한 스마트한 길',
      lead: 'KSWAYS는 신뢰할 수 있는 물류 솔루션, 검증된 파트너 네트워크, 더 스마트한 공급망 경로로 한국과 세계를 연결합니다.',
      primaryCta: '견적 문의',
      secondaryCta: '파트너 네트워크 보기',
      proof: [
        { label: '글로벌 경로', value: '한국 ↔ 세계' },
        { label: '서비스 모드', value: '항공 · 해상 · 특송' },
        { label: '파트너 모델', value: '에이전트 네트워크' },
      ],
      controlTitle: '라우트 컨트롤 타워',
      controlCenter: 'KSWAYS',
    },
    company: {
      kicker: '회사 소개',
      headline: '한국 시장 실행력을 기반으로 움직이는 글로벌 물류 파트너.',
      body: 'KSWAYS는 실무 중심의 포워딩 운영 역량과 신뢰할 수 있는 파트너 네트워크를 결합해 해외 파트너와 국내 고객의 운송을 빠르고 명확하게 조율합니다.',
      pillars: [
        { title: '한국 게이트웨이', body: '수출입, 픽업, 통관, 운송사 커뮤니케이션까지 한국 내 실행을 조율합니다.' },
        { title: '파트너 우선', body: '한국 시장에서 신뢰할 수 있는 실행 파트너가 필요한 해외 에이전트를 지원합니다.' },
        { title: '명확한 책임', body: '문의부터 부킹, 서류, 운송 마일스톤까지 필요한 다음 단계를 분명히 관리합니다.' },
      ],
    },
    operating: {
      kicker: '서비스',
      headline: '견적부터 배송까지 이어지는 유연한 운송 솔루션.',
      body: 'KSWAYS는 핵심 운송 모드와 크로스보더 화물 흐름을 지원하며, 화물 이해·라우트 선정·핸드오프 조율·파트너 커뮤니케이션을 일관된 리듬으로 관리합니다.',
      services: [
        { title: '항공 운송', body: '긴급·고가·시간 민감 화물을 위한 빠른 운송 기획.', href: '/services/air-freight-korea' },
        { title: '해상 운송', body: 'FCL/LCL 기반의 실용적인 운송사 및 파트너 조율.', href: '/services/ocean-freight-korea' },
        { title: '크로스보더', body: '성장 브랜드와 반복 운송을 위한 특송·이커머스 물류 흐름.' },
        { title: '프로젝트 지원', body: '특수 픽업, 적입, 일정 제약이 있는 화물의 케이스별 지원.', href: '/services/exw-pickup-korea' },
        { title: 'BridgeLogis', body: '더 스마트한 운송 조율과 연결된 운영을 위한 디지털 물류 서비스 접근 채널.', href: 'https://bridgelogis.com' },
      ],
    },
    network: {
      kicker: '파트너 네트워크',
      headline: '한국 연결 화물을 위한 신뢰 기반 에이전트 협력.',
      body: 'KSWAYS의 네트워크는 실질적인 라우팅, 빠른 커뮤니케이션, 책임 있는 핸드오프를 중심으로 운영되어 각 파트너가 다음 단계를 명확히 이해할 수 있도록 돕습니다.',
      points: ['검증된 파트너 협업', '노선·리드 공유 기회', '운영 책임성과 투명한 커뮤니케이션', '한국 연결 글로벌 커버리지'],
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
