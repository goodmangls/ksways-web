import nextVitals from 'eslint-config-next/core-web-vitals';

// 우리가 쓰지 않은 생성물은 린트 대상이 아니다 — flat config 는 .gitignore 를
// 자동으로 읽지 않으므로 여기에 다시 적어야 한다(.gitignore 만으로는 안 걸러진다).
//   .agents/            skills.sh 가 받아오는 외부 스킬 사본
//   playwright-report/  로컬 e2e 리포트. 트레이스 뷰어 번들이 미니파이 JS 라
//                       rules-of-hooks 186 건이 뜬다(CI 는 fresh checkout 이라 안 보임)
//   test-results/·blob-report/·playwright/.cache/  같은 부류의 Playwright 산출물
const eslintConfig = [
  {
    ignores: [
      'coverage/',
      '.agents/',
      'playwright-report/',
      'test-results/',
      'blob-report/',
      'playwright/.cache/',
    ],
  },
  ...nextVitals,
];

export default eslintConfig;
