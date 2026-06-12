import { homeContent } from '@/lib/content';
import { HomePage } from '@/components/HomePage';

export default function Page() {
  return <HomePage locale="en" copy={homeContent.en} />;
}
