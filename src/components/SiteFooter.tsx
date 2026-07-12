import Image from 'next/image';
import Link from 'next/link';
import type { FooterCopy } from '@/lib/content';

function FooterLink({ href, label }: { href: string; label: string }) {
  const isExternal = href.startsWith('http');
  const isInternalRoute = href.startsWith('/');
  const className = 'inline-flex min-h-11 items-center text-sm font-bold text-white/62 transition hover:text-[#6fffe7]';

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  if (isInternalRoute) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

function FooterAddress({ address }: { address: string }) {
  const countryLine = 'Seoul 07566, Republic of Korea';
  const streetLine = address.replace(`, ${countryLine}`, '');

  return (
    <p className="mt-2 max-w-xl leading-relaxed text-white/56">
      <span className="block">{streetLine}</span>
      <span className="block">{countryLine}</span>
    </p>
  );
}

function FooterBrandLogo() {
  return (
    <Link href="/" aria-label="KS WAYS home" className="group inline-flex min-h-11 items-center">
      <Image
        src="/assets/ksways-logo-reverse.png"
        alt="KS WAYS"
        width={935}
        height={337}
        className="h-8 w-auto object-contain drop-shadow-[0_0_18px_rgba(33,212,194,.18)] transition-transform group-hover:scale-[1.03] sm:h-9"
      />
    </Link>
  );
}

export function SiteFooter({ footer }: { footer: FooterCopy }) {
  const phoneHref = `tel:${footer.phone.replace(/[^+\d]/g, '')}`;

  return (
    <footer aria-label="KS WAYS global logistics footer" className="relative overflow-hidden bg-[#001112] px-6 pb-8 pt-16 text-white sm:px-10 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(33,212,194,.16),transparent_28%),linear-gradient(145deg,rgba(255,255,255,.05),transparent_38%)]" />
      <div className="relative z-10 mx-auto max-w-[1180px]">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.12fr_.88fr] lg:items-start">
          <div>
            <FooterBrandLogo />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/66">{footer.tagline}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {footer.credentials.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[.055] p-5">
                  <p className="text-[11px] font-black uppercase tracking-[.16em] text-white/40">{item.label}</p>
                  <p className="mt-3 text-sm font-black leading-snug text-white/78">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <nav aria-label="Footer navigation" className="grid gap-8 sm:grid-cols-3">
            {footer.columns.map((column) => (
              <div key={column.title}>
                <h2 className="font-mono text-[11px] font-black uppercase tracking-[.18em] text-white/42">{column.title}</h2>
                <ul className="mt-4 space-y-1">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <FooterLink href={link.href} label={link.label} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="grid gap-6 pb-32 pt-8 text-sm text-white/48 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:justify-between lg:pb-28">
          <div className="max-w-2xl">
            <p className="font-black text-white/72">{footer.companyName}</p>
            <p className="mt-1">{footer.legal}</p>
            <FooterAddress address={footer.address} />
          </div>
          <div className="flex max-w-xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1 lg:justify-end lg:text-right">
            <a href={`mailto:${footer.email}`} className="inline-flex min-h-11 items-center font-bold text-white/64 transition hover:text-[#6fffe7] lg:justify-end">{footer.email}</a>
            <a href={phoneHref} className="inline-flex min-h-11 items-center font-bold text-white/64 transition hover:text-[#6fffe7] lg:justify-end">{footer.phone}</a>
            <span className="inline-flex min-h-11 items-center font-bold text-white/64 lg:justify-end">{footer.fax}</span>
            <span className="basis-full text-white/42">© {new Date().getFullYear()} KS WAYS. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
