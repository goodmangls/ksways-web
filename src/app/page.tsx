import { homeContent } from '@/lib/content';
import { HomePage } from '@/components/HomePage';
import { homeSeo } from '@/lib/seo';

export const metadata = homeSeo.en;

export default function Page() {
  return <HomePage locale="en" copy={homeContent.en} />;
}
