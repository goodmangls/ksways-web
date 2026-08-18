import type { Metadata } from 'next';
import { RootDocument } from '@/components/RootDocument';
import { rootMetadata } from '@/lib/seo';

export const metadata: Metadata = rootMetadata;

export default function KoreanRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument lang="ko-KR">{children}</RootDocument>;
}
