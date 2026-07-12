import type { ComponentProps } from 'react';

type NextImageLikeProps = ComponentProps<'img'> & {
  fill?: boolean;
  priority?: boolean;
  quality?: number | string;
  unoptimized?: boolean;
  placeholder?: string;
  blurDataURL?: string;
  loader?: unknown;
};

// next/image는 vitest 단독 렌더에서 next.config(remotePatterns)를 읽지 못해 throw한다.
// Next 전용 prop을 걸러낸 순수 <img>로 대체 — src/alt/width/height 검증에는 충분하다.
export default function NextImageMock({ fill, priority, quality, unoptimized, placeholder, blurDataURL, loader, ...imgProps }: NextImageLikeProps) {
  void fill;
  void priority;
  void quality;
  void unoptimized;
  void placeholder;
  void blurDataURL;
  void loader;
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...imgProps} />;
}
