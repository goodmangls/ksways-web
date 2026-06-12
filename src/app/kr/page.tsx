import type { Metadata } from 'next';
import { homeContent } from '@/lib/content';
import { HomePage } from '@/components/HomePage';

export const metadata: Metadata = {
  title: 'KSWAYS — 글로벌 물류를 위한 스마트한 길',
  description: 'KSWAYS는 신뢰할 수 있는 물류 솔루션, 검증된 파트너 네트워크, 더 스마트한 공급망 경로로 한국과 세계를 연결합니다.',
  alternates: {
    canonical: '/kr',
    languages: {
      en: '/',
      kr: '/kr',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'KSWAYS — 글로벌 물류를 위한 스마트한 길',
    description: '한국과 세계를 연결하는 파트너 기반 글로벌 물류 플랫폼.',
    url: 'https://ksways.co/kr',
    siteName: 'KSWAYS',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function KoreanPage() {
  return <HomePage locale="kr" copy={homeContent.kr} />;
}
