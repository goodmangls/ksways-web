// 스모크 대상 페이지의 단일 진실. 로컬 hermetic 스모크(smoke.spec.ts)와
// 프로덕션 카나리(prod-smoke.spec.ts)가 같은 목록을 쓴다 — 라우트가 늘 때
// 한쪽만 갱신돼 조용히 커버리지가 벌어지는 것을 막는다.
export const SMOKE_PAGES: ReadonlyArray<{ path: string; lang: string }> = [
  { path: '/', lang: 'en' },
  { path: '/kr', lang: 'ko-KR' },
  { path: '/quote', lang: 'en' },
  { path: '/network/korea-agent-network', lang: 'en' },
  { path: '/services/air-freight-korea', lang: 'en' },
  { path: '/services/ocean-freight-korea', lang: 'en' },
  { path: '/services/special-cargo-korea', lang: 'en' },
  { path: '/services/exw-pickup-korea', lang: 'en' },
];
