import { notFound } from 'next/navigation';
import { ServiceLandingPage } from '@/components/ServiceLandingPage';
import { getServicePage } from '@/lib/service-pages';

const page = getServicePage('korea-agent-network');

export const metadata = page?.meta ?? {};

export default function KoreaAgentNetworkPage() {
  if (!page) notFound();

  return <ServiceLandingPage page={page} basePath="network" />;
}
