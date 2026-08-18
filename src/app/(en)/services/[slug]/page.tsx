import { notFound } from 'next/navigation';
import { ServiceLandingPage } from '@/components/ServiceLandingPage';
import { getServicePage, servicePages } from '@/lib/service-pages';

export function generateStaticParams() {
  return servicePages
    .filter((page) => page.slug !== 'korea-agent-network')
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page || page.slug === 'korea-agent-network') return {};
  return page.meta;
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page || page.slug === 'korea-agent-network') notFound();

  return <ServiceLandingPage page={page} basePath="services" />;
}
