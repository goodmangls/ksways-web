export const UNSPLASH_APP_NAME = 'ksways';
export const UNSPLASH_CACHE_REVALIDATE_SECONDS = 60 * 60 * 24;

export const ALLOWED_UNSPLASH_TOPICS = {
  ocean: 'ocean freight container ship port terminal',
  air: 'air cargo freight aircraft logistics',
  warehouse: 'warehouse logistics supply chain',
  global: 'global trade business logistics',
  specialCargo: 'cargo handling warehouse freight forwarding',
} as const;

export type UnsplashTopic = keyof typeof ALLOWED_UNSPLASH_TOPICS;

export type UnsplashApiPhoto = {
  id: string;
  alt_description: string | null;
  description: string | null;
  urls: {
    regular: string;
    small: string;
  };
  width: number;
  height: number;
  color: string | null;
  blur_hash: string | null;
  links: {
    html: string;
    download_location: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
};

export type UnsplashSearchResponse = {
  results: UnsplashApiPhoto[];
};

export type NormalizedUnsplashImage = {
  id: string;
  alt: string;
  src: string;
  smallSrc: string;
  width: number;
  height: number;
  color: string | null;
  blurHash: string | null;
  photographer: string;
  photographerUrl: string;
  unsplashUrl: string;
  downloadLocation: string;
};

export type ApprovedUnsplashImage = NormalizedUnsplashImage & {
  topic: UnsplashTopic;
  brandUse: 'blog-thumbnail' | 'service-support' | 'approved-hero-candidate';
  selectionNote: string;
};

type SearchUnsplashOptions = {
  topic: string;
  accessKey?: string;
  appName?: string;
  perPage?: number;
  fetcher?: typeof fetch;
};

export type SearchUnsplashResult =
  | { images: NormalizedUnsplashImage[]; fallback: false }
  | { images: []; fallback: true; reason: 'missing_access_key' | 'unsplash_error' };

function withReferralParams(url: string, appName: string) {
  const parsed = new URL(url);
  parsed.searchParams.set('utm_source', appName);
  parsed.searchParams.set('utm_medium', 'referral');
  return parsed.toString();
}

function resolveTopic(topic: string): UnsplashTopic {
  return topic in ALLOWED_UNSPLASH_TOPICS ? (topic as UnsplashTopic) : 'global';
}

export function normalizeUnsplashPhoto(photo: UnsplashApiPhoto, appName = UNSPLASH_APP_NAME): NormalizedUnsplashImage {
  return {
    id: photo.id,
    alt: photo.alt_description || photo.description || 'KS WAYS logistics image',
    src: photo.urls.regular,
    smallSrc: photo.urls.small,
    width: photo.width,
    height: photo.height,
    color: photo.color,
    blurHash: photo.blur_hash,
    photographer: photo.user.name,
    photographerUrl: withReferralParams(photo.user.links.html, appName),
    unsplashUrl: withReferralParams(photo.links.html, appName),
    downloadLocation: photo.links.download_location,
  };
}

export async function searchUnsplashImages({
  topic,
  accessKey,
  appName = UNSPLASH_APP_NAME,
  perPage = 6,
  fetcher = fetch,
}: SearchUnsplashOptions): Promise<SearchUnsplashResult> {
  if (!accessKey) {
    return { images: [], fallback: true, reason: 'missing_access_key' };
  }

  const safeTopic = resolveTopic(topic);
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', ALLOWED_UNSPLASH_TOPICS[safeTopic]);
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('per_page', String(perPage));

  try {
    const response = await fetcher(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
      next: { revalidate: UNSPLASH_CACHE_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return { images: [], fallback: true, reason: 'unsplash_error' };
    }

    const data = (await response.json()) as UnsplashSearchResponse;
    return {
      images: data.results.map((photo) => normalizeUnsplashPhoto(photo, appName)),
      fallback: false,
    };
  } catch {
    return { images: [], fallback: true, reason: 'unsplash_error' };
  }
}

const approvedUnsplashImages = [
  {
    id: 'E0AHdsENmDg',
    topic: 'ocean',
    brandUse: 'approved-hero-candidate',
    selectionNote: 'Clean container-vessel logistics mood suitable for ocean freight hero candidates.',
    alt: 'Container vessel and port terminal for global ocean freight logistics',
    src: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1600&q=80',
    smallSrc: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=640&q=80',
    width: 1600,
    height: 1067,
    color: '#496575',
    blurHash: null,
    photographer: 'Unsplash Contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=ksways&utm_medium=referral',
    unsplashUrl: 'https://unsplash.com/photos/E0AHdsENmDg?utm_source=ksways&utm_medium=referral',
    downloadLocation: 'https://api.unsplash.com/photos/E0AHdsENmDg/download',
  },
  {
    id: 'Y8TiLvKnLeg',
    topic: 'ocean',
    brandUse: 'service-support',
    selectionNote: 'Bright container pattern for ocean freight service support cards.',
    alt: 'Stacked shipping containers for ocean freight forwarding',
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    smallSrc: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=640&q=80',
    width: 1600,
    height: 1067,
    color: '#6e7f87',
    blurHash: null,
    photographer: 'Unsplash Contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=ksways&utm_medium=referral',
    unsplashUrl: 'https://unsplash.com/photos/Y8TiLvKnLeg?utm_source=ksways&utm_medium=referral',
    downloadLocation: 'https://api.unsplash.com/photos/Y8TiLvKnLeg/download',
  },
  {
    id: 'RCAhiGJsUUE',
    topic: 'air',
    brandUse: 'approved-hero-candidate',
    selectionNote: 'Air cargo runway mood for time-sensitive freight pages.',
    alt: 'Cargo aircraft on runway for international air freight logistics',
    src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80',
    smallSrc: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=640&q=80',
    width: 1600,
    height: 1067,
    color: '#5b6774',
    blurHash: null,
    photographer: 'Unsplash Contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=ksways&utm_medium=referral',
    unsplashUrl: 'https://unsplash.com/photos/RCAhiGJsUUE?utm_source=ksways&utm_medium=referral',
    downloadLocation: 'https://api.unsplash.com/photos/RCAhiGJsUUE/download',
  },
  {
    id: 'yQorCngxzwI',
    topic: 'air',
    brandUse: 'service-support',
    selectionNote: 'Clean aircraft wing/airport image for air freight editorial thumbnails.',
    alt: 'Aircraft and airport operations for air cargo route planning',
    src: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=1600&q=80',
    smallSrc: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=640&q=80',
    width: 1600,
    height: 1067,
    color: '#7a8790',
    blurHash: null,
    photographer: 'Unsplash Contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=ksways&utm_medium=referral',
    unsplashUrl: 'https://unsplash.com/photos/yQorCngxzwI?utm_source=ksways&utm_medium=referral',
    downloadLocation: 'https://api.unsplash.com/photos/yQorCngxzwI/download',
  },
  {
    id: 'VBLHICVh-lI',
    topic: 'warehouse',
    brandUse: 'service-support',
    selectionNote: 'Orderly warehouse/supply-chain visual for handling and tracking content.',
    alt: 'Modern warehouse logistics for freight handling and supply chain coordination',
    src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    smallSrc: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=640&q=80',
    width: 1600,
    height: 1067,
    color: '#7b7f7c',
    blurHash: null,
    photographer: 'Unsplash Contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=ksways&utm_medium=referral',
    unsplashUrl: 'https://unsplash.com/photos/VBLHICVh-lI?utm_source=ksways&utm_medium=referral',
    downloadLocation: 'https://api.unsplash.com/photos/VBLHICVh-lI/download',
  },
  {
    id: 'zGuBURGGmdY',
    topic: 'warehouse',
    brandUse: 'blog-thumbnail',
    selectionNote: 'Neutral logistics warehouse thumbnail for operational checklist content.',
    alt: 'Warehouse aisles for logistics operations and cargo handling',
    src: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1600&q=80',
    smallSrc: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=640&q=80',
    width: 1600,
    height: 1067,
    color: '#6c6d68',
    blurHash: null,
    photographer: 'Unsplash Contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=ksways&utm_medium=referral',
    unsplashUrl: 'https://unsplash.com/photos/zGuBURGGmdY?utm_source=ksways&utm_medium=referral',
    downloadLocation: 'https://api.unsplash.com/photos/zGuBURGGmdY/download',
  },
  {
    id: 'm_HRfLhgABo',
    topic: 'global',
    brandUse: 'approved-hero-candidate',
    selectionNote: 'Global city/business tone for partner-network sections.',
    alt: 'Modern global city skyline for international trade and logistics partners',
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    smallSrc: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=640&q=80',
    width: 1600,
    height: 1067,
    color: '#52606a',
    blurHash: null,
    photographer: 'Unsplash Contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=ksways&utm_medium=referral',
    unsplashUrl: 'https://unsplash.com/photos/m_HRfLhgABo?utm_source=ksways&utm_medium=referral',
    downloadLocation: 'https://api.unsplash.com/photos/m_HRfLhgABo/download',
  },
  {
    id: 'D8W1I5fsR3o',
    topic: 'global',
    brandUse: 'blog-thumbnail',
    selectionNote: 'Trade/business thumbnail for global partner coordination articles.',
    alt: 'Business district representing global trade and freight partner coordination',
    src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80',
    smallSrc: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=640&q=80',
    width: 1600,
    height: 1067,
    color: '#5d6670',
    blurHash: null,
    photographer: 'Unsplash Contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=ksways&utm_medium=referral',
    unsplashUrl: 'https://unsplash.com/photos/D8W1I5fsR3o?utm_source=ksways&utm_medium=referral',
    downloadLocation: 'https://api.unsplash.com/photos/D8W1I5fsR3o/download',
  },
  {
    id: 'p2TQ-3Bh3Oo',
    topic: 'specialCargo',
    brandUse: 'service-support',
    selectionNote: 'Cargo-handling support visual for special-cargo feasibility review.',
    alt: 'Freight handling operation for special cargo feasibility review',
    src: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1600&q=80',
    smallSrc: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=640&q=80',
    width: 1600,
    height: 1067,
    color: '#72756f',
    blurHash: null,
    photographer: 'Unsplash Contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=ksways&utm_medium=referral',
    unsplashUrl: 'https://unsplash.com/photos/p2TQ-3Bh3Oo?utm_source=ksways&utm_medium=referral',
    downloadLocation: 'https://api.unsplash.com/photos/p2TQ-3Bh3Oo/download',
  },
  {
    id: 'z1d-LP8sjuI',
    topic: 'specialCargo',
    brandUse: 'blog-thumbnail',
    selectionNote: 'Neutral packed-cargo visual for special-handling checklist articles.',
    alt: 'Packed freight ready for special handling and international shipment review',
    src: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437d2?auto=format&fit=crop&w=1600&q=80',
    smallSrc: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437d2?auto=format&fit=crop&w=640&q=80',
    width: 1600,
    height: 1067,
    color: '#817d73',
    blurHash: null,
    photographer: 'Unsplash Contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=ksways&utm_medium=referral',
    unsplashUrl: 'https://unsplash.com/photos/z1d-LP8sjuI?utm_source=ksways&utm_medium=referral',
    downloadLocation: 'https://api.unsplash.com/photos/z1d-LP8sjuI/download',
  },
] satisfies ApprovedUnsplashImage[];

export function getApprovedUnsplashImages(topic?: string) {
  if (!topic) {
    return approvedUnsplashImages;
  }

  const safeTopic = resolveTopic(topic);
  return approvedUnsplashImages.filter((image) => image.topic === safeTopic);
}

export function getHeroUnsplashImages() {
  return approvedUnsplashImages.filter((image) => image.brandUse === 'approved-hero-candidate');
}
