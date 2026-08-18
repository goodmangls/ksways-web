import type { Metadata } from 'next';
import { RootDocument } from '@/components/RootDocument';
import { rootMetadata } from '@/lib/seo';

export const metadata: Metadata = rootMetadata;

export default function EnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
