import Image from 'next/image';
import type { WcaMemberTool } from '@/lib/content';

// WCAworld 혜택 인장. 원본은 각 서비스 공식 사이트의 고해상도 PNG(WQS 1917px·PartnerPay 400px)를
// 트림 후 384px 로 줄인 것 — 최대 표시 크기(96px)의 2배 이상을 덮어 레티나에서도 선명하다.
// next/image 최적화를 거쳐 표시 크기의 WebP 로 내려간다. 인장은 변형·재색칠 금지.
const SEALS: Record<WcaMemberTool['key'], { src: string; alt: string }> = {
  wqs: { src: '/assets/wca-wqs-seal.png', alt: 'WCAworld Quotation System seal' },
  partnerpay: { src: '/assets/wca-partnerpay-seal.png', alt: 'WCAworld PartnerPay seal' },
};

type Props = {
  heading: string;
  items: WcaMemberTool[];
  /** `dark`: home network band (compact). `light`: network landing page (feature). */
  tone: 'dark' | 'light';
};

export function WcaMemberTools({ heading, items, tone }: Props) {
  const dark = tone === 'dark';
  const sealSize = dark ? 64 : 96;

  return (
    <div>
      <p className={`font-mono text-xs font-semibold uppercase tracking-[.12em] ${dark ? 'text-[#e7c99a]' : 'text-[#805d3b]'}`}>{heading}</p>
      {/* light 판은 설명이 길어 2열이면 본문 폭이 ~150px 로 눌린다 — 한 줄에 하나씩 쌓는다 */}
      <ul className={`mt-5 grid ${dark ? 'gap-6 sm:grid-cols-2' : 'gap-8'}`}>
        {items.map((item) => (
          <li key={item.key} className={`flex items-start ${dark ? 'gap-4' : 'gap-6'}`}>
            <Image
              src={SEALS[item.key].src}
              alt={SEALS[item.key].alt}
              width={sealSize}
              height={sealSize}
              sizes={`${sealSize}px`}
              className="shrink-0"
            />
            <p className="leading-snug">
              <span className={`block font-bold ${dark ? 'text-white' : 'text-lg text-[#001112]'}`}>{item.name}</span>
              <span className={`mt-1 block text-[15px] leading-[1.55] ${dark ? 'text-white/76' : 'text-[#001112]/76'}`}>{item.body}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
