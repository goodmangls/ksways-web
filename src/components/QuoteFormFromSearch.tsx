'use client';

import { useSearchParams } from 'next/navigation';
import { QuoteForm } from './QuoteForm';
import { getQuoteInitialValues } from '@/lib/quote-form';

// /quote 를 정적 렌더링으로 유지하기 위해 ?service= 는 서버 페이지가 아니라
// 이 클라이언트 래퍼가 읽는다. 페이지 쪽 Suspense 경계가 프리렌더를 보장한다.
export function QuoteFormFromSearch() {
  const searchParams = useSearchParams();
  const initialValues = getQuoteInitialValues(searchParams.get('service'));

  return <QuoteForm initialValues={initialValues} />;
}
