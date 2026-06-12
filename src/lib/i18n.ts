export const locales = ['en', 'kr'] as const;
export type Locale = (typeof locales)[number];

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === '/kr' || pathname.startsWith('/kr/') ? 'kr' : 'en';
}

function stripLocale(pathname: string): string {
  if (pathname === '/kr') return '/';
  if (pathname.startsWith('/kr/')) return pathname.slice(3) || '/';
  return pathname || '/';
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
  const cleanPath = stripLocale(pathname);
  if (locale === 'en') return cleanPath;
  return cleanPath === '/' ? '/kr' : `/kr${cleanPath}`;
}

export function getAlternateHref(pathname: string, locale: Locale): string {
  return getLocalizedPath(pathname, locale);
}
