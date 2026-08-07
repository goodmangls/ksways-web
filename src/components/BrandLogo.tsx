import Image from 'next/image';
import Link from 'next/link';

type Props = {
  /** Where the mark links to. The homepage passes a locale-aware path. */
  href?: string;
  /** Set on the first logo above the fold so Next preloads it. */
  priority?: boolean;
};

/**
 * The KS WAYS brand mark, wrapped in its home link.
 *
 * This used to be four near-identical copies (HomePage, SiteFooter,
 * ServiceLandingPage, quote page) that had already drifted apart in two ways
 * worth calling out, since both are fixed by consolidating:
 *
 *  - ServiceLandingPage's link had no `min-h-11`, leaving a 32–36px touch
 *    target where DESIGN.md requires 44px.
 *  - HomePage's copy lost `group-hover:scale-[1.03]` when the bronze pivot
 *    stripped the old teal glow from the same class list. The `group` class on
 *    its wrapper stayed behind and did nothing — a leftover, not a decision, so
 *    the hover affordance is restored here rather than removed from the other three.
 *
 * The asset is the reverse (light-on-dark) mark; every surface using this
 * component is dark. A light-background variant would need a new prop and the
 * `ksways-logo-color.png` asset.
 */
export function BrandLogo({ href = '/', priority = false }: Props) {
  return (
    <Link href={href} aria-label="KS WAYS home" className="group inline-flex min-h-11 items-center">
      <Image
        src="/assets/ksways-logo-reverse.png"
        alt="KS WAYS"
        width={935}
        height={337}
        priority={priority}
        className="h-8 w-auto object-contain transition-transform group-hover:scale-[1.03] sm:h-9"
      />
    </Link>
  );
}
