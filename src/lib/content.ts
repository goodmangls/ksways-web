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
    phone: string;
    fax: string;
    quote: string;
    partner: string;
    schedule: string;
  };
  footer: {
    tagline: string;
    companyName: string;
    email: string;
    phone: string;
    fax: string;
    credentials: Array<{ label: string; value: string }>;
    columns: Array<{ title: string; links: Array<{ label: string; href: string }> }>;
    legal: string;
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
      lead: 'KS WAYS gives global freight forwarders a trusted global forwarding company in Northeast Asia — an English website by default, WCA-backed cooperation, and Korea’s gateway position to China and Japan for ocean, air, and special cargo coordination.',
      primaryCta: 'Get a Quote',
      secondaryCta: 'Explore Partner Network',
      proof: [
        { label: 'Global network', value: 'WCA Member' },
        { label: 'Website', value: 'English default' },
        { label: 'Industry Experience', value: '30+ years' },
      ],
      controlTitle: 'Route control tower',
      controlCenter: 'KS WAYS',
    },
    company: {
      kicker: 'Company',
      headline: 'A global logistics company built for ocean and air freight execution.',
      body: 'KS WAYS CO., LTD. combines 30+ years of industry experience across airline cargo, express logistics, shipping line operations, and global forwarding with partner access across Korea, China, Japan, and wider trade lanes.',
      pillars: [
        { title: 'Ocean freight strength', body: 'FCL/LCL planning, carrier coordination, loading review, and partner handoff for sea freight movements.' },
        { title: 'Global partner communication', body: 'An English website by default, structured shipment questions, and clear milestone updates help partners review Korea-connected cargo with confidence.' },
        { title: 'Industry experience', body: '30+ years across airline cargo, express logistics, shipping line operations, and global forwarding informs practical routing decisions.' },
      ],
    },
    operating: {
      kicker: 'Services',
      headline: 'Ocean-led freight solutions with fast air cargo support.',
      body: 'KS WAYS supports ocean freight, air freight, special cargo review, and cross-border flows with a clean operating rhythm: understand the shipment, select the route, coordinate the handoff, and keep partners informed.',
      services: [
        { title: 'Ocean Freight', body: 'Primary FCL/LCL strength with carrier coordination, loading review, and partner handoff.', href: '/services/ocean-freight-korea' },
        { title: 'Air Freight', body: 'Urgent, high-value, and time-sensitive cargo routing with clear quote requirements and milestone follow-up.', href: '/services/air-freight-korea' },
        { title: 'Special Cargo', body: 'Case-by-case review for DG, perishables, oversized cargo, high-value goods, and project constraints.', href: '/services/special-cargo-korea' },
        { title: 'EXW & Handling', body: 'Pickup, site access, packing, labeling, stuffing, and local handoff checks before execution.', href: '/services/exw-pickup-korea' },
        { title: 'BridgeLogis', body: 'Digital logistics access for structured quote intake, faster coordination, and connected operations.', href: 'https://bridgelogis.com' },
      ],
    },
    network: {
      kicker: 'Partner network',
      headline: 'WCA-backed cooperation for global cargo movement.',
      body: 'As a WCA member, KS WAYS works from Korea’s Northeast Asia position with China and Japan in reach, giving global freight forwarders practical routing, responsive updates, and partner-safe handoff control.',
      points: ['WCA member network', 'Northeast Asia: Korea · China · Japan', 'English website by default', 'Partner-safe handoff control'],
    },
    solutions: {
      kicker: 'How we work',
      headline: 'A clearer path for every enquiry.',
      body: 'From the first request to final delivery, KS WAYS keeps the process focused on the facts that matter: cargo readiness, route feasibility, cost, risk, timing, and handoff responsibility.',
      steps: [
        { title: '01 · Review', body: 'Cargo details, Incoterms, pickup conditions, dimensions, weight, commodity sensitivity, and deadline.' },
        { title: '02 · Route', body: 'Mode selection, carrier options, partner coordination, customs needs, and practical alternatives.' },
        { title: '03 · Execute', body: 'Booking, documentation, milestone updates, exception handling, and delivery handoff.' },
      ],
    },
    contact: {
      headline: 'Ready to move smarter?',
      body: 'Start with the right path: global freight forwarders can send structured cargo details, introduce partner lanes, or request a Zoom / Calendly consultation through info@ksways.co for a clear first review.',
      email: 'info@ksways.co',
      phone: 'Tel. +82 2 6961 5778',
      fax: 'Fax +82 2 6961 5765',
      quote: 'Request a quote',
      partner: 'Become a partner',
      schedule: 'Schedule consultation',
    },
    footer: {
      tagline: 'A trusted global ocean and air logistics / global forwarding company for global freight forwarders working across Northeast Asia: Korea’s strategic gateway, China and Japan connectivity, an English website by default, WCA-backed partner cooperation, and 30+ years of airline, shipping line, and global forwarding experience.',
      companyName: 'KS WAYS CO., LTD.',
      email: 'info@ksways.co',
      phone: 'Tel. +82 2 6961 5778',
      fax: 'Fax +82 2 6961 5765',
      credentials: [
        { label: 'WCA Member', value: 'Global agent cooperation' },
        { label: 'Ocean strength', value: 'FCL · LCL execution' },
        { label: 'Industry Experience', value: 'Airline cargo · Express logistics · Shipping lines' },
      ],
      columns: [
        {
          title: 'Company',
          links: [
            { label: 'About KS WAYS', href: '#company' },
            { label: 'Partner network', href: '#network' },
            { label: 'How we work', href: '#solutions' },
          ],
        },
        {
          title: 'Services',
          links: [
            { label: 'Ocean Freight', href: '/services/ocean-freight-korea' },
            { label: 'Air Freight', href: '/services/air-freight-korea' },
            { label: 'Special Cargo Korea', href: '/services/special-cargo-korea' },
            { label: 'EXW Pickup Korea', href: '/services/exw-pickup-korea' },
            { label: 'BridgeLogis', href: 'https://bridgelogis.com' },
          ],
        },
        {
          title: 'Contact',
          links: [
            { label: 'Request a quote', href: '#contact' },
            { label: 'Email info@ksways.co', href: 'mailto:info@ksways.co' },
          ],
        },
      ],
      legal: 'Global ocean freight, air freight, and WCA partner cooperation.',
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
      lead: 'KS WAYS는 해상물류와 항공물류를 책임지는 글로벌 물류회사로, 작은 한국을 동북아 전략 거점으로 삼아 중국·일본과 연결되는 지역적 강점, 해운 중심 실행력, 긴급 항공화물 검토, WCA 글로벌 네트워크 기반의 파트너 조율을 제공합니다.',
      primaryCta: '견적 문의',
      secondaryCta: '파트너 네트워크 보기',
      proof: [
        { label: '글로벌 네트워크', value: 'WCA 회원사' },
        { label: '핵심 서비스', value: '해상 · 항공' },
        { label: '경력 기반', value: '30년 이상' },
      ],
      controlTitle: '라우트 컨트롤 타워',
      controlCenter: 'KS WAYS',
    },
    company: {
      kicker: '회사 소개',
      headline: '해상과 항공 운송 실행력을 갖춘 글로벌 물류회사.',
      body: 'KS WAYS CO., LTD.는 항공화물, 특송 물류, 해운사 운영, 글로벌 포워딩 전반에서 축적한 30년 이상 Industry Experience와 한국·중국·일본을 잇는 동북아 파트너 접근성을 결합합니다.',
      pillars: [
        { title: '해상물류 강점', body: 'FCL/LCL 라우팅, 운송사 조율, 적입 검토, 파트너 핸드오프까지 해운 중심 실행을 지원합니다.' },
        { title: 'WCA 네트워크 회원사', body: '세계 최대 글로벌 물류 네트워크 기반의 에이전트 협력으로 국제 커버리지를 확장합니다.' },
        { title: 'Industry Experience', body: '항공화물, 특송 물류, 해운사 운영, 글로벌 포워딩 경험을 바탕으로 현실적인 라우팅과 실행 리스크를 검토합니다.' },
      ],
    },
    operating: {
      kicker: '서비스',
      headline: '해상을 중심으로 긴급 항공까지 연결하는 운송 솔루션.',
      body: 'KS WAYS는 해상 운송, 항공 운송, 특수화물 검토, 크로스보더 화물 흐름을 지원하며, 화물 이해·라우트 선정·핸드오프 조율·파트너 커뮤니케이션을 일관된 리듬으로 관리합니다.',
      services: [
        { title: '해상 운송', body: 'KS WAYS의 핵심 강점인 FCL/LCL 기반 운송사 조율, 적입 검토, 파트너 핸드오프.', href: '/services/ocean-freight-korea' },
        { title: '항공 운송', body: '긴급·고가·시간 민감 화물을 위한 라우팅, 견적 필수정보 확인, 마일스톤 후속관리.', href: '/services/air-freight-korea' },
        { title: '특수 화물', body: 'DG, 신선화물, 오버사이즈, 고가화물, 프로젝트 제약조건을 케이스별로 검토합니다.', href: '/services/special-cargo-korea' },
        { title: 'EXW & 핸들링', body: '픽업, 현장 접근, 포장, 라벨링, 적입, 로컬 핸드오프 조건을 실행 전 확인합니다.', href: '/services/exw-pickup-korea' },
        { title: 'BridgeLogis', body: '정리된 견적 접수, 빠른 조율, 연결된 운영을 위한 디지털 물류 접근 채널.', href: 'https://bridgelogis.com' },
      ],
    },
    network: {
      kicker: '파트너 네트워크',
      headline: '글로벌 화물 이동을 위한 WCA 기반 에이전트 협력.',
      body: 'KS WAYS는 WCA 회원사로서 한국을 동북아 전략 거점으로 삼아 중국·일본과 연결되는 지역적 강점을 활용하고, 실질적인 라우팅, 빠른 커뮤니케이션, 책임 있는 핸드오프를 중심으로 글로벌 에이전트 협력을 운영합니다.',
      points: ['WCA 회원 네트워크', '동북아: 한국 · 중국·일본', '30년 이상 항공·해운·포워딩 경험', '글로벌 파트너 커버리지'],
    },
    solutions: {
      kicker: '업무 방식',
      headline: '모든 문의에 더 명확한 다음 경로를 제시합니다.',
      body: '첫 문의부터 최종 배송까지, KS WAYS는 화물 준비 상태, 라우트 가능성, 비용, 리스크, 일정, 핸드오프 책임이라는 핵심 사실에 집중합니다.',
      steps: [
        { title: '01 · 검토', body: '화물 정보, Incoterms, 픽업 조건, 치수, 중량, 품목 민감도, 마감 일정을 확인합니다.' },
        { title: '02 · 라우팅', body: '운송 모드, 운송사 옵션, 파트너 조율, 통관 필요사항, 현실적인 대안을 검토합니다.' },
        { title: '03 · 실행', body: '부킹, 서류, 진행 상황 업데이트, 예외 상황 대응, 배송 핸드오프까지 관리합니다.' },
      ],
    },
    contact: {
      headline: '더 스마트하게 이동할 준비가 되셨나요?',
      body: '견적, 파트너십, 상담 일정을 목적별로 남겨 주세요. info@ksways.co 그룹 이메일을 통해 화물 정보, 파트너사 프로필, Zoom / Calendly 미팅 요청을 명확하게 접수합니다.',
      email: 'info@ksways.co',
      phone: 'Tel. +82 2 6961 5778',
      fax: 'Fax +82 2 6961 5765',
      quote: '견적 문의하기',
      partner: '파트너 문의하기',
      schedule: '상담 일정 잡기',
    },
    footer: {
      tagline: 'KS WAYS는 작은 한국을 동북아 전략 거점으로 삼아 중국·일본과 연결되는 지역적 강점, WCA 기반 파트너 협력, 30년 이상 항공사·해운사·글로벌 포워딩 경험을 갖춘 글로벌 해상·항공 물류회사입니다.',
      companyName: 'KS WAYS CO., LTD.',
      email: 'info@ksways.co',
      phone: 'Tel. +82 2 6961 5778',
      fax: 'Fax +82 2 6961 5765',
      credentials: [
        { label: 'WCA 회원사', value: '글로벌 에이전트 협력' },
        { label: '해운 강점', value: 'FCL · LCL 실행' },
        { label: 'Industry Experience', value: '항공화물 · 특송 물류 · 해운사 운영' },
      ],
      columns: [
        {
          title: '회사',
          links: [
            { label: 'KS WAYS 소개', href: '#company' },
            { label: '파트너 네트워크', href: '#network' },
            { label: '업무 방식', href: '#solutions' },
          ],
        },
        {
          title: '서비스',
          links: [
            { label: '해상 운송', href: '/services/ocean-freight-korea' },
            { label: '항공 운송', href: '/services/air-freight-korea' },
            { label: '특수 화물', href: '/services/special-cargo-korea' },
            { label: '한국 EXW 픽업', href: '/services/exw-pickup-korea' },
            { label: 'BridgeLogis', href: 'https://bridgelogis.com' },
          ],
        },
        {
          title: '문의',
          links: [
            { label: '견적 문의', href: '#contact' },
            { label: 'info@ksways.co 이메일', href: 'mailto:info@ksways.co' },
          ],
        },
      ],
      legal: '글로벌 해상 운송, 항공 운송, WCA 파트너 협력을 지원합니다.',
    },
  },
};
