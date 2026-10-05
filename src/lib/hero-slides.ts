import { getHeroUnsplashImages } from '@/lib/unsplash';

/** globals.css `animation-delay: calc(var(--ks-slide-index) * 7s)` 와 같은 값. */
export const HERO_SLIDE_SECONDS = 7;

export type HeroSlide = {
  id: string;
  src: string;
  alt: string;
  /** 크레딧 첫 줄 — 사진가 또는 에이전시 이름. */
  credit: string;
  creditUrl: string | null;
  /** 크레딧 둘째 줄 — 'Unsplash' 또는 'Unsplash+'. */
  sourceLabel: 'Unsplash' | 'Unsplash+';
  sourceUrl: string;
};

// Getty Images via Unsplash+ (KS WAYS Dropbox "WCA LOGO/Images"). Unsplash+ 라이선스 이미지라
// Unsplash API 다운로드 추적·hotlink 대상이 아니다 — approvedUnsplashImages 에 넣지 말 것.
const courierHandoffSlide: HeroSlide = {
  id: 'BcJ2daQRfxU',
  src: '/assets/hero/courier-handoff.jpg',
  alt: 'Courier handing a parcel to a recipient who signs for delivery on a tablet',
  credit: 'Getty Images',
  creditUrl: null,
  sourceLabel: 'Unsplash+',
  sourceUrl: 'https://unsplash.com/photos/BcJ2daQRfxU?utm_source=ksways&utm_medium=referral',
};

/** 히어로 회전 순서. 첫 장(ocean)은 reduced-motion·시각 회귀 기준이므로 맨 앞에 고정한다. */
export function getHeroSlides(): HeroSlide[] {
  const unsplashSlides = getHeroUnsplashImages().map(
    (image): HeroSlide => ({
      id: image.id,
      src: image.src,
      alt: image.alt,
      credit: image.photographer,
      creditUrl: image.photographerUrl,
      sourceLabel: 'Unsplash',
      sourceUrl: image.unsplashUrl,
    }),
  );

  return [...unsplashSlides, courierHandoffSlide];
}
