import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ksways.co'),
  title: 'KS WAYS — The Smart Way to Global Logistics',
  description: 'KS WAYS is a global ocean and air logistics company with sea freight strength and WCA member network cooperation.',
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      'ko-KR': '/kr',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'KS WAYS — The Smart Way to Global Logistics',
    description: 'Global ocean and air logistics with sea freight strength and WCA member network cooperation.',
    url: 'https://ksways.co',
    siteName: 'KS WAYS',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
