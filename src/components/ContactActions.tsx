'use client';

type Props = {
  quoteLabel: string;
  partnerLabel: string;
  chatLabel: string;
  email: string;
  locale: 'en' | 'kr';
};

function buildMailto(email: string, locale: Props['locale'], intent: 'quote' | 'partner') {
  const subject =
    locale === 'kr'
      ? intent === 'quote'
        ? 'KSWAYS 견적 문의'
        : 'KSWAYS 파트너십 문의'
      : intent === 'quote'
        ? 'KSWAYS freight quote request'
        : 'KSWAYS partnership enquiry';

  const body =
    locale === 'kr'
      ? '안녕하세요 KSWAYS 팀,\n\n아래 화물/파트너십 문의 검토 부탁드립니다.\n\n- 회사명:\n- 담당자:\n- 출발지 / 도착지:\n- Incoterms:\n- 화물명:\n- 포장 수량 / 중량 / 사이즈:\n- 준비일:\n- 요청사항:\n'
      : 'Dear KSWAYS team,\n\nPlease review the cargo or partnership enquiry below.\n\n- Company:\n- Contact person:\n- Origin / destination:\n- Incoterms:\n- Commodity:\n- Package count / weight / dimensions:\n- Cargo ready date:\n- Request details:\n';

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactActions({ quoteLabel, partnerLabel, chatLabel, email, locale }: Props) {
  const quoteHref = buildMailto(email, locale, 'quote');
  const partnerHref = buildMailto(email, locale, 'partner');

  const openIntercom = () => {
    if (typeof window !== 'undefined' && typeof window.Intercom === 'function') {
      window.Intercom('show');
      return;
    }

    window.location.href = quoteHref;
  };

  return (
    <div className="mt-8 flex flex-wrap gap-3 lg:mt-0">
      <a href={quoteHref} className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-br from-[#21d4c2] to-[#6fffe7] px-7 font-black text-[#001112]">
        {quoteLabel}
      </a>
      <a href={partnerHref} className="inline-flex min-h-[52px] items-center rounded-full border border-white/45 px-7 font-black text-white">
        {partnerLabel}
      </a>
      <button
        type="button"
        onClick={openIntercom}
        className="inline-flex min-h-[52px] items-center rounded-full border border-[#6fffe7]/70 px-7 font-black text-[#6fffe7] transition hover:border-[#6fffe7] hover:bg-[#6fffe7]/10"
      >
        {chatLabel}
      </button>
    </div>
  );
}

declare global {
  interface Window {
    Intercom?: (...args: unknown[]) => void;
  }
}
