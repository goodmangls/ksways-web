// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { homeContent } from '@/lib/content';
import { MobileNav } from './MobileNav';

const NAV = homeContent.en.nav;

const SECTION_LINKS: Array<{ name: string; href: string }> = [
  { name: NAV.company, href: '#company' },
  { name: NAV.services, href: '#services' },
  { name: NAV.network, href: '#network' },
  { name: NAV.solutions, href: '#solutions' },
  { name: NAV.contact, href: '#contact' },
];

describe('MobileNav', () => {
  afterEach(cleanup);

  it('starts collapsed with an accessible toggle button', () => {
    render(<MobileNav nav={NAV} />);

    const toggle = screen.getByRole('button', { name: NAV.menuLabel });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: /mobile/i })).not.toBeInTheDocument();
  });

  it('opens to reveal every section link plus contact, all as 44px touch targets', async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={NAV} />);

    await user.click(screen.getByRole('button', { name: NAV.menuLabel }));

    expect(screen.getByRole('button', { name: NAV.menuLabel })).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('navigation', { name: /mobile/i });
    for (const { name, href } of SECTION_LINKS) {
      const link = screen.getByRole('link', { name });
      expect(link, `${name} should point at ${href}`).toHaveAttribute('href', href);
      expect(link.className, `${name} needs a 44px touch target`).toContain('min-h-11');
    }
    expect(menu).toBeInTheDocument();
  });

  it('closes when a section link is chosen', async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={NAV} />);

    await user.click(screen.getByRole('button', { name: NAV.menuLabel }));
    await user.click(screen.getByRole('link', { name: NAV.services }));

    expect(screen.getByRole('button', { name: NAV.menuLabel })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: /mobile/i })).not.toBeInTheDocument();
  });

  it('closes on Escape and returns focus to the toggle', async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={NAV} />);

    const toggle = screen.getByRole('button', { name: NAV.menuLabel });
    await user.click(toggle);
    await user.keyboard('{Escape}');

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
    expect(screen.queryByRole('navigation', { name: /mobile/i })).not.toBeInTheDocument();
  });
});
