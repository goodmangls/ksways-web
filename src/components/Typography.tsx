import type { ReactNode } from 'react';

// DESIGN.md "Readability" 를 지키는 텍스트 컴포넌트. 페이지마다 클래스 문자열을 복사하면
// 행간·폭·불투명도가 조금씩 어긋난다 — 실제로 1.1 / 1.08, 40em / 34em 처럼 어긋나 있었다.
//
// - 섹션 제목(display-section): extrabold, 52px 상한, 행간 1.08
// - 카드·열 제목: heading-pillar 22px·800·행간 1.2 / heading-card 24px·900·행간 1.12
// - 본문: body-lg 18px 행간 1.65 · body-md 16px 행간 1.6, 폭 34em — 크기를 부모에서 상속하지 않고 직접 지정
// - 보조 텍스트는 불투명도 토큰만: text-subtle ink 76% · text-dark-subtle white 76%
//
// 한국어 값(행간 1.8 / 1.75, 제목 1.22, 폭 36em, 완만한 자간)은 여기서 고르지 않는다.
// `ks-type-*` · `ks-measure` 훅 클래스를 붙여 두면 globals.css 의 `:lang(ko)` 규칙이 /kr 에서 덮는다.
// 그래서 같은 컴포넌트가 locale 을 몰라도 된다.
//
// 문자열은 Tailwind 가 스캔할 수 있도록 리터럴로 둔다. 규칙 검사: Typography.test.tsx

export const sectionHeadingSizes = {
  /** 홈 섹션 — 모바일 32–40px, 데스크톱 36–52px. */
  lg: 'text-[clamp(32px,8.5vw,40px)] sm:text-[clamp(36px,3.6vw,52px)]',
  /** 서비스 페이지·FAQ 등 보조 섹션 — 모바일 30–36px, 데스크톱 32–44px. */
  md: 'text-[clamp(30px,8vw,36px)] sm:text-[clamp(32px,3.2vw,44px)]',
} as const;

export const sectionHeadingBase = 'ks-type-section font-extrabold leading-[1.08] tracking-[-.025em] text-balance';

// 크기마다 토큰이 행간·굵기·자간까지 다르므로 크기별로 통째로 둔다. 행간을 빼면 Tailwind 크기
// 유틸리티의 기본 행간(22px→1.5, text-2xl→1.33)이 그대로 들어간다.
export const cardHeadingSizes = {
  /** heading-pillar 22px / 800 / 1.2 / -0.015em — 기둥·원칙 열. */
  sm: 'text-[22px] font-extrabold leading-[1.2] tracking-[-.015em]',
  /** heading-card 24px / 900 / 1.12 / -0.02em — 진행 단계 열. */
  md: 'text-2xl font-black leading-[1.12] tracking-[-.02em]',
} as const;

export const bodyTextVariants = {
  /** body-lg — 섹션 본문·리드. */
  lg: {
    onLight: 'ks-type-body-lg text-lg leading-[1.65] text-[#001112]/76',
    onDark: 'ks-type-body-lg text-lg leading-[1.65] text-white/76',
  },
  /** body-md — 카드·FAQ 답변·행 설명. */
  md: {
    onLight: 'ks-type-body text-base leading-[1.6] text-[#001112]/76',
    onDark: 'ks-type-body text-base leading-[1.6] text-white/76',
  },
} as const;

/** 본문 폭. `default` 는 34em(한국어 36em). 더 넓은 값은 일부러 없다. */
export const bodyMeasures = {
  default: 'ks-measure max-w-[34em]',
  narrow: 'max-w-[26em]',
} as const;

export type TextTone = 'onLight' | 'onDark';

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type SectionHeadingProps = {
  children: ReactNode;
  id?: string;
  size?: keyof typeof sectionHeadingSizes;
  /** 여백·제목 폭(`max-w-[15em]`) 같은 배치용 클래스만. 크기·행간·색은 넣지 말 것. */
  className?: string;
};

export function SectionHeading({ children, id, size = 'lg', className }: SectionHeadingProps) {
  return (
    <h2 id={id} className={cx(className, sectionHeadingSizes[size], sectionHeadingBase)}>
      {children}
    </h2>
  );
}

type CardHeadingProps = {
  children: ReactNode;
  size?: keyof typeof cardHeadingSizes;
  /** 배치용 클래스만. */
  className?: string;
};

export function CardHeading({ children, size = 'sm', className }: CardHeadingProps) {
  return <h3 className={cx(className, cardHeadingSizes[size])}>{children}</h3>;
}

type BodyTextProps = {
  children: ReactNode;
  size?: keyof typeof bodyTextVariants;
  tone?: TextTone;
  /** 생략하면 폭 제한 없음 — 이미 좁은 열·카드 안에서만. */
  measure?: keyof typeof bodyMeasures;
  /** 행 안의 설명처럼 블록 단락이 아닐 때 `span`. */
  as?: 'p' | 'span';
  /** 배치용 클래스만(margin, flex 등). */
  className?: string;
};

export function BodyText({ children, size = 'lg', tone = 'onLight', measure, as: Tag = 'p', className }: BodyTextProps) {
  return <Tag className={cx(className, measure && bodyMeasures[measure], bodyTextVariants[size][tone])}>{children}</Tag>;
}
