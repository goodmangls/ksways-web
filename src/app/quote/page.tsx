import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { QuoteForm } from '@/components/QuoteForm';
import { SiteFooter } from '@/components/SiteFooter';
import { getQuoteInitialValues } from '@/lib/quote-form';
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

type QuotePageProps = {
  searchParams?: Promise<{ service?: string | string[] }>;
};

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const params = await searchParams;
  const initialValues = getQuoteInitialValues(params?.service);

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#001112] selection:bg-[#21d4c2] selection:text-[#001112]">
      <section className="relative overflow-hidden bg-[#001112] px-6 py-8 text-white sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(33,212,194,.26),transparent_30%),linear-gradient(120deg,rgba(0,17,18,.98),rgba(2,31,34,.88))]" />
        <div className="relative z-10">
          <header className="flex items-center justify-between gap-6">
            <Link href="/" className="group flex min-h-11 items-center" aria-label="KS WAYS home">
              <Image
                src="/assets/ksways-logo-reverse.png"
                alt="KS WAYS"
                width={935}
                height={337}
                priority
                className="h-8 w-auto object-contain drop-shadow-[0_0_18px_rgba(33,212,194,.18)] transition-transform group-hover:scale-[1.03] sm:h-9"
              />
            </Link>
            <Link href="/#services" className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-5 text-sm font-black text-white transition hover:border-white">
              Services
            </Link>
          </header>

          <div className="max-w-5xl py-10 lg:py-14">
            <p className="text-sm font-black uppercase tracking-[.16em] text-[#6fffe7]">Freight Quote Request</p>
            <h1 className="mt-5 text-[clamp(42px,6vw,82px)] font-black leading-[.92] tracking-[-.075em] text-balance">Get a quote for ocean, air, and special cargo.</h1>
            <p className="mt-6 max-w-3xl text-[clamp(16px,1.2vw,20px)] leading-relaxed text-white/70">
              Start with the transport mode, complete the key cargo facts, then review a prepared email to {contactEmail}. Nothing is sent automatically.
            </p>
          </div>
        </div>
      </section>

      <QuoteForm initialValues={initialValues} />
      <SiteFooter footer={homeContent.en.footer} />
    </main>
  );
}
