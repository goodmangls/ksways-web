import { Suspense } from 'react';
import type { Metadata } from 'next';
import { QuoteFormFromSearch } from '@/components/QuoteFormFromSearch';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { BodyText } from '@/components/Typography';
import { homeContent } from '@/lib/content';
import { brandName, contactEmail, shareImage, siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Freight Quote Request — KS WAYS',
  description: 'Submit structured cargo details for a KS WAYS ocean, air, express, multimodal, or special cargo quote review.',
  alternates: {
    canonical: '/quote',
  },
  openGraph: {
    title: 'Freight Quote Request — KS WAYS',
    description: 'Structured quote request form for ocean freight, air freight, and special cargo review.',
    url: `${siteUrl}/quote`,
    siteName: brandName,
    type: 'website',
    images: [shareImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freight Quote Request — KS WAYS',
    description: 'Structured quote request form for ocean freight, air freight, and special cargo review.',
    images: [shareImage],
  },
};

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#001112]">
      <section className="relative overflow-hidden bg-[#001112] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(184,138,90,.26),transparent_30%),linear-gradient(120deg,rgba(0,17,18,.98),rgba(2,31,34,.88))]" />
        <SiteHeader nav={homeContent.en.nav} homeHref="/" toggleHref="/kr" quoteHref="/quote" />
        <div id="content" className="relative z-10 mx-auto max-w-[1280px] px-6 pb-8 sm:px-10 lg:px-14">
          <div className="max-w-5xl py-10 lg:py-14">
            <p className="text-sm font-black uppercase tracking-[.16em] text-[#e7c99a]">Freight Quote Request</p>
            <h1 className="ks-type-hero mt-5 text-[clamp(40px,6vw,82px)] font-black leading-[1.04] tracking-[-.028em] text-balance sm:leading-[1] sm:tracking-[-.03em]">Get a quote for ocean, air, and special cargo.</h1>
            <BodyText tone="onDark" measure="default" className="mt-6">
              Start with the transport mode, complete the key cargo facts, then review a prepared email to {contactEmail}. Nothing is sent automatically.
            </BodyText>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <QuoteFormFromSearch />
      </Suspense>
      <SiteFooter footer={homeContent.en.footer} />
    </main>
  );
}
