import { homeContent } from '@/lib/content';
import { HomePage } from '@/components/HomePage';
import { homeSeo } from '@/lib/seo';

export const metadata = homeSeo.kr;

export default function KoreanPage() {
  return <HomePage locale="kr" copy={homeContent.kr} />;
}
