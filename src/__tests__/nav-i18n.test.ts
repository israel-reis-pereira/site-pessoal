import { describe, it, expect, vi } from 'vitest';

// Exercise the nav config with pt-br as the default locale
// and English as the secondary locale.
vi.mock('@/config/i18n.config', () => ({
  default: {
    enabled: true,
    defaultLocale: 'pt-br',
    locales: ['pt-br', 'en'],
    localeNames: {
      'pt-br': 'Português (Brasil)',
      en: 'English',
    },
    detectBrowserLocale: false,
  },
}));

import {
  getNavItems,
  getLogoHref,
  resolveNavItem,
  type NavItem,
} from '@/config/nav.config';

describe('nav config — pt-br default, en secondary', () => {
  it('keeps default-locale hrefs at the site root', () => {
    const items = getNavItems('pt-br');

    expect(items.map((i) => i.href)).toEqual([
      '/',
      '/services',
      '/projects',
      '/blog',
      '/about',
      '/contact',
    ]);
  });

  it('prefixes secondary English hrefs with the locale', () => {
    const items = getNavItems('en');

    expect(items.map((i) => i.href)).toEqual([
      '/en',
      '/en/services',
      '/en/projects',
      '/en/blog',
      '/en/about',
      '/en/contact',
    ]);
  });

  it('translates English labels via the dictionary', () => {
    const en = getNavItems('en');

    expect(en.find((i) => i.href === '/en/about')?.label).toBe('About');
    expect(en.find((i) => i.href === '/en/services')?.label).toBe('Services');
  });

  it('points the logo at the locale home', () => {
    expect(getLogoHref('pt-br')).toBe('/');
    expect(getLogoHref('en')).toBe('/en');
  });

  it('never locale-prefixes external, mailto/tel, or anchor hrefs', () => {
    expect(
      resolveNavItem(
        {
          label: 'GitHub',
          href: 'https://github.com/x',
          order: 1,
          external: true,
        },
        'en'
      ).href
    ).toBe('https://github.com/x');

    expect(
      resolveNavItem(
        { label: 'Top', href: '#top', order: 1 },
        'en'
      ).href
    ).toBe('#top');

    expect(
      resolveNavItem(
        { label: 'Mail', href: 'mailto:a@b.com', order: 1 },
        'en'
      ).href
    ).toBe('mailto:a@b.com');
  });

  it('applies a per-locale override (label + path), still locale-prefixed', () => {
    const item: NavItem = {
      label: 'Contact',
      href: '/contact',
      order: 1,
      locales: {
        en: {
          label: 'Contact us',
          href: '/contact-us',
        },
      },
    };

    expect(resolveNavItem(item, 'en')).toEqual({
      label: 'Contact us',
      href: '/en/contact-us',
      external: undefined,
    });

    // The default locale is unaffected by an en-only override.
    expect(resolveNavItem(item, 'pt-br')).toEqual({
      label: 'Contact',
      href: '/contact',
      external: undefined,
    });
  });

  it('falls back to the literal label when no labelKey is set', () => {
    expect(
      resolveNavItem(
        { label: 'Docs', href: '/docs', order: 1 },
        'en'
      ).label
    ).toBe('Docs');
  });
});