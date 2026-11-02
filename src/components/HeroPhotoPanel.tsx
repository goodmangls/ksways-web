'use client';

import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import type { HeroSlide } from '@/lib/hero-slides';
import type { Locale } from '@/lib/i18n';

const toggleLabels: Record<Locale, { pause: string; play: string }> = {
  en: { pause: 'Pause photo slideshow', play: 'Play photo slideshow' },
  kr: { pause: '사진 슬라이드 멈추기', play: '사진 슬라이드 재생' },
};

// The credit links are 14px tall at text-xs. Padding plus the matching negative
// margin grows each tap target to ~26px (WCAG 2.5.8's 24px) without moving a pixel
// of the caption layout.
const creditLinkClass = '-my-1.5 inline-block py-1.5 underline-offset-4 transition hover:text-white hover:underline';

type HeroPhotoPanelProps = {
  caption: string;
  slides: readonly HeroSlide[];
  locale: Locale;
};

/** 히어로 사진 패널. 전면 배경 대신 우측 패널로 옮겨 헤드라인이 사진 위에 얹히지 않게 했다. */
export function HeroPhotoPanel({ caption, slides, locale }: HeroPhotoPanelProps) {
  const [paused, setPaused] = useState(false);
  const labels = toggleLabels[locale];

  return (
    <figure
      data-paused={paused}
      className="relative isolate m-0 aspect-[4/3] overflow-hidden rounded-[28px] border border-border-dark bg-navy-2 lg:aspect-[4/4.4]"
    >
      <div className="absolute inset-0 -z-10" aria-label="Rotating hero images for ocean freight, air cargo, and express courier logistics">
        {slides.map((slide, index) => (
          <Image
            key={slide.id}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="ks-hero-bg-slide object-cover"
            style={{ '--ks-slide-index': index } as CSSProperties}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setPaused((current) => !current)}
        aria-label={paused ? labels.play : labels.pause}
        title={paused ? labels.play : labels.pause}
        className="ks-hero-motion-toggle absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-full border border-white/12 bg-navy/85 text-white transition hover:border-accent-soft/60 hover:text-accent-soft sm:right-5 sm:top-5"
      >
        {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
      </button>
      <figcaption className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[18px] border border-white/12 bg-navy/85 px-5 py-3.5 sm:inset-x-5 sm:bottom-5">
        <span className="text-sm font-bold text-white">{caption}</span>
        <span className="grid text-xs font-semibold text-white/72">
          {slides.map((slide, index) => (
            <span
              key={`${slide.id}-credit`}
              className="ks-hero-bg-attribution col-start-1 row-start-1"
              style={{ '--ks-slide-index': index } as CSSProperties}
            >
              Photo:{' '}
              {slide.creditUrl ? (
                <a href={slide.creditUrl} target="_blank" rel="noopener noreferrer" className={creditLinkClass}>
                  {slide.credit}
                </a>
              ) : (
                slide.credit
              )}{' '}
              /{' '}
              <a href={slide.sourceUrl} target="_blank" rel="noopener noreferrer" className={creditLinkClass}>
                {slide.sourceLabel}
              </a>
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
