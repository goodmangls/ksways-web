import nextVitals from 'eslint-config-next/core-web-vitals';

// .agents/ 는 skills.sh 가 받아오는 외부 스킬 사본이다 — 우리 코드가 아니므로
// 린트 대상에서 제외한다(flat config 는 .gitignore 를 자동으로 읽지 않는다).
const eslintConfig = [{ ignores: ['coverage/', '.agents/'] }, ...nextVitals];

export default eslintConfig;
