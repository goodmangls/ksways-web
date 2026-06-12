import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ksways.co'),
  title: 'KSWAYS — The Smart Way to Global Logistics',
  description: 'KSWAYS connects Korea and the world through reliable freight solutions, trusted partner networks, and smarter supply routes.',
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      kr: '/kr',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'KSWAYS — The Smart Way to Global Logistics',
    description: 'Partner-driven global logistics from Korea to the world.',
    url: 'https://ksways.co',
    siteName: 'KSWAYS',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
