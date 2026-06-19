type Props = {
  quoteLabel: string;
  partnerLabel: string;
  scheduleLabel: string;
  email: string;
  locale: 'en' | 'kr';
  scheduleUrl?: string;
};

export type ContactIntent = 'quote' | 'partner' | 'schedule';

type MailtoOptions = {
  contextTitle?: string;
};

export function buildMailto(email: string, locale: Props['locale'], intent: ContactIntent, options: MailtoOptions = {}) {
  const subjectMap: Record<Props['locale'], Record<ContactIntent, string>> = {
    en: {
      quote: 'KS WAYS freight quote request',
      partner: 'KS WAYS partnership enquiry',
      schedule: 'KS WAYS consultation meeting request',
    },
    kr: {
      quote: 'KS WAYS 견적 문의',
      partner: 'KS WAYS 파트너십 문의',
      schedule: 'KS WAYS 상담 일정 문의',
    },
  };

  const serviceContext = options.contextTitle
    ? locale === 'kr'
      ? `[서비스 맥락]\n- ${options.contextTitle}\n- 온도 / DG / 대형 / 고가 화물 요구사항:\n\n`
      : `[Service context]\n- ${options.contextTitle}\n- Temperature / DG / oversized / high-value requirements:\n\n`
    : '';

  const bodyMap: Record<Props['locale'], Record<ContactIntent, string>> = {
    en: {
      quote:
        `Dear KS WAYS team,\n\nPlease review the freight quote request below.\n\n${serviceContext}[Company / Contact]\n- Company name:\n- Contact person / title:\n- Email / phone / preferred messenger:\n\n[Shipment]\n- Origin / destination:\n- Incoterms:\n- Commodity:\n- HS code, if available:\n- Package count / gross weight / dimensions:\n- Cargo ready date:\n- Preferred mode: Ocean / Air / Express / Multimodal\n- Target schedule or deadline:\n\n[Support needed]\n- Pickup / customs / insurance / warehousing / Special handling:\n- Budget or target rate, if any:\n- Additional notes:\n`,
      partner:
        'Dear KS WAYS team,\n\nWe would like to discuss a partnership opportunity.\n\n[Company profile]\n- Company name:\n- Website:\n- Country / city:\n- Contact person / title:\n- Email / phone / preferred messenger:\n- Network memberships, if any (WCA, JCtrans, GLA, etc.):\n\n[Partnership scope]\n- Core services and trade lanes:\n- Ocean / air strengths:\n- Countries or ports where support is needed:\n- Typical commodities or customer profile:\n- Expected cooperation model:\n\n[Next step]\n- Preferred Zoom / Calendly meeting windows:\n- Additional notes:\n',
      schedule:
        'Dear KS WAYS team,\n\nI would like to schedule a consultation with KS WAYS. Please share an available Zoom or Calendly slot.\n\n- Company name:\n- Contact person / title:\n- Email / phone:\n- Purpose: Freight quote / Partner discussion / General consultation\n- Preferred meeting dates and timezone:\n- Key agenda:\n',
    },
    kr: {
      quote:
        `안녕하세요 KS WAYS 팀,\n\n아래 화물 견적 문의 검토 부탁드립니다.\n\n${serviceContext}[회사 / 담당자]\n- 회사명:\n- 담당자 / 직함:\n- 이메일 / 전화 / 선호 메신저:\n\n[화물 정보]\n- 출발지 / 도착지:\n- Incoterms:\n- 화물명:\n- HS Code(가능 시):\n- 포장 수량 / 총중량 / 사이즈:\n- 화물 준비일:\n- 희망 운송 모드: 해상 / 항공 / 특송 / 복합운송\n- 목표 일정 또는 마감일:\n\n[필요 지원]\n- 픽업 / 통관 / 보험 / 창고 / 특수 핸들링:\n- 예산 또는 목표 운임(있을 경우):\n- 추가 요청사항:\n`,
      partner:
        '안녕하세요 KS WAYS 팀,\n\n파트너십 협의를 요청드립니다.\n\n[회사 프로필]\n- 회사명:\n- 웹사이트:\n- 국가 / 도시:\n- 담당자 / 직함:\n- 이메일 / 전화 / 선호 메신저:\n- 가입 네트워크(WCA, JCtrans, GLA 등, 있을 경우):\n\n[협력 범위]\n- 핵심 서비스 및 주요 노선:\n- 해상 / 항공 강점:\n- 지원이 필요한 국가 또는 포트:\n- 주요 화물 또는 고객군:\n- 희망 협력 방식:\n\n[다음 단계]\n- 선호 Zoom / Calendly 미팅 가능 시간:\n- 추가 요청사항:\n',
      schedule:
        '안녕하세요 KS WAYS 팀,\n\n상담 일정을 요청드립니다. 가능한 Zoom 또는 Calendly 일정을 공유 부탁드립니다.\n\n- 회사명:\n- 담당자 / 직함:\n- 이메일 / 전화:\n- 상담 목적: 화물 견적 / 파트너 협의 / 일반 상담\n- 희망 미팅 일시 및 시간대:\n- 주요 논의 안건:\n',
    },
  };

  const subjectSuffix = options.contextTitle ? ` — ${options.contextTitle}` : '';

  return `mailto:${email}?subject=${encodeURIComponent(`${subjectMap[locale][intent]}${subjectSuffix}`)}&body=${encodeURIComponent(bodyMap[locale][intent])}`;
}

export function ContactActions({ quoteLabel, partnerLabel, scheduleLabel, email, locale, scheduleUrl }: Props) {
  const quoteHref = buildMailto(email, locale, 'quote');
  const partnerHref = buildMailto(email, locale, 'partner');
  const scheduleHref = scheduleUrl?.trim() || buildMailto(email, locale, 'schedule');
  const scheduleIsExternal = Boolean(scheduleUrl?.trim());

  const helperText = {
    quote: locale === 'kr' ? '화물·출도착지·Incoterms·중량·일정 자동 양식' : 'Cargo, route, Incoterms, weight, and schedule template',
    partner: locale === 'kr' ? '회사 프로필·국가·강점 노선·네트워크 정보 수취' : 'Company profile, country, trade lanes, and network details',
    schedule: locale === 'kr' ? 'Zoom / Calendly 상담 일정 요청' : 'Request a Zoom / Calendly consultation slot',
  };

  const actions = [
    { href: quoteHref, label: quoteLabel, helper: helperText.quote, primary: true },
    { href: partnerHref, label: partnerLabel, helper: helperText.partner, primary: false },
    { href: scheduleHref, label: scheduleLabel, helper: helperText.schedule, primary: false, external: scheduleIsExternal },
  ];

  return (
    <div className="mt-8 grid gap-3 lg:mt-0 lg:min-w-[430px]">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          target={action.external ? '_blank' : undefined}
          rel={action.external ? 'noopener noreferrer' : undefined}
          className={
            action.primary
              ? 'group rounded-[24px] bg-gradient-to-br from-[#21d4c2] to-[#6fffe7] p-[1px] text-[#001112] shadow-[0_18px_46px_rgba(33,212,194,.22)] transition hover:scale-[1.015]'
              : 'group rounded-[24px] border border-white/16 bg-white/[.06] p-[1px] text-white transition hover:border-[#6fffe7]/60 hover:bg-white/[.09]'
          }
        >
          <span className={action.primary ? 'block rounded-[23px] px-6 py-4' : 'block rounded-[23px] px-6 py-4'}>
            <span className="flex items-center justify-between gap-4">
              <span className="text-base font-black tracking-[-.02em]">{action.label}</span>
              <span className="font-mono text-xs font-black opacity-70 transition group-hover:translate-x-1">→</span>
            </span>
            <span className={action.primary ? 'mt-1 block text-sm font-bold text-[#001112]/68' : 'mt-1 block text-sm font-semibold text-white/58'}>
              {action.helper}
            </span>
          </span>
        </a>
      ))}
      <p className="px-1 text-sm leading-relaxed text-white/52">
        {locale === 'kr'
          ? `모든 문의는 공식 그룹 이메일 ${email}로 접수되어 담당자가 후속 안내합니다.`
          : `All enquiries are routed to the official group email ${email} for follow-up.`}
      </p>
    </div>
  );
}
