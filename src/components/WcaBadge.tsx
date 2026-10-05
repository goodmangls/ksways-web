import Image from 'next/image';

// WCA 공식 배포 PDF 를 SVG 로 변환한 벡터 마크. 두 마크 모두 "for black & color background"
// 판(연회색 라운드 판 포함)이라 navy 면 위에서 재색칠 없이 그대로 쓴다 — 공식 마크는 변형 금지.
//
// 용도 분리 (DESIGN.md "Network Section"):
//  - world        WCAworld 상위 브랜드. 인지도가 가장 높아 전 페이지 푸터에 쓴다.
//  - inter-global KS WAYS 가 속한 WCA Inter Global 네트워크. 홈 네트워크 섹션 한 곳에서만 쓴다.
// 회원 ID·만료일이 박힌 JPEG 는 이메일 서명 전용이라 사이트에 쓰지 않는다.
const MARKS = {
  world: { src: '/assets/wcaworld-logo.svg', ratio: 359 / 206 },
  'inter-global': { src: '/assets/wca-inter-global-badge.svg', ratio: 199 / 125 },
} as const;

export type WcaMarkVariant = keyof typeof MARKS;

type Props = {
  variant: WcaMarkVariant;
  /** Accessible name — the mark's meaning, e.g. "WCAworld member". */
  label: string;
  /** Visible caption beside the mark. Omit when the context already says it. */
  caption?: string;
  /** Rendered height in px; width follows the official aspect ratio. */
  height?: number;
};

export function WcaBadge({ variant, label, caption, height = 56 }: Props) {
  const mark = MARKS[variant];
  const width = Math.round(height * mark.ratio);

  return (
    <div className="flex items-center gap-4">
      <Image src={mark.src} alt={label} width={width} height={height} unoptimized className="block shrink-0" />
      {caption ? <p className="text-sm font-bold leading-snug text-white">{caption}</p> : null}
    </div>
  );
}
