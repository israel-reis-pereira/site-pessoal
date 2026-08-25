import { describe, it, expect } from 'vitest';
import {
  t,
  tData,
  localizedPath,
  resolveLocale,
  isValidLocale,
  getLocaleName,
  getLocaleFromPath,
  getSecondaryLocales,
  stripLocaleFromPath,
  swapLocaleInPath,
} from '../i18n';

describe('i18n t() helper', () => {
  it('returns a translation for a valid dotted key', () => {
    expect(t('common.readMore', 'en')).toBe('Read more');
  });

  it('returns the Portuguese translation when locale is pt-br', () => {
    expect(t('common.readMore', 'pt-br')).toBe('Ler mais');
  });

  it('falls back to the default-locale string when the locale has no entry', () => {
    // 'de' has no dictionary loaded yet — should fall back to pt-br.
    expect(t('common.readMore', 'de')).toBe('Ler mais');
  });

  it('returns the key itself when no translation exists in any dictionary', () => {
    expect(t('some.missing.key', 'en')).toBe('some.missing.key');
  });

  it('interpolates {placeholder} variables', () => {
    expect(t('blog.readingTime', 'en', { minutes: 5 })).toBe('5 min read');
    expect(t('blog.readingTime', 'pt-br', { minutes: 5 })).toBe('5 min de leitura');
  });

  it('leaves unknown placeholders untouched', () => {
    expect(t('blog.readingTime', 'en', {})).toBe('{minutes} min read');
  });
});

describe('i18n tData() helper', () => {
  it('returns a structured (array) value by dotted key', () => {
    const items = tData<{ icon: string; title: string; description: string }[]>(
      'pages.about.principles.items',
      'en'
    );

    expect(Array.isArray(items)).toBe(true);
    expect(items?.length).toBeGreaterThan(0);
    expect(items?.[0]).toEqual(
      expect.objectContaining({
        icon: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
      })
    );
  });

  it('returns the Portuguese structured value when locale is pt-br', () => {
    const hero = tData<{ badge: string }>('pages.about.hero', 'pt-br');

    expect(hero?.badge).toBe('Sobre mim');
  });

  it('falls back to the default-locale value when the locale has no entry', () => {
    const cards = tData<unknown[]>('pages.about.faq.cards', 'de');

    expect(Array.isArray(cards)).toBe(true);
    expect(cards?.length).toBe(2);
  });

  it('returns undefined when the key is absent in every dictionary', () => {
    expect(tData('pages.does.not.exist', 'en')).toBeUndefined();
  });
});

describe('i18n getSecondaryLocales()', () => {
  it('returns pt-br as the only default locale when configured', () => {
    expect(getSecondaryLocales()).toEqual(['en']);
  });
});

describe('i18n localizedPath()', () => {
  it('keeps the default Portuguese locale at the site root', () => {
    expect(localizedPath('/about', 'pt-br')).toBe('/about');
    expect(localizedPath('/', 'pt-br')).toBe('/');
    expect(localizedPath('blog/hello', 'pt-br')).toBe('/blog/hello');
  });

  it('prefixes the secondary English locale', () => {
    expect(localizedPath('/about', 'en')).toBe('/en/about');
    expect(localizedPath('/', 'en')).toBe('/en');
    expect(localizedPath('blog/hello', 'en')).toBe('/en/blog/hello');
  });
});

describe('i18n locale helpers', () => {
  it('resolves an unknown locale to the default', () => {
    expect(resolveLocale('xx')).toBe('pt-br');
    expect(resolveLocale(undefined)).toBe('pt-br');
  });

  it('validates a configured locale', () => {
    expect(isValidLocale('pt-br')).toBe(true);
    expect(isValidLocale('en')).toBe(true);
    expect(isValidLocale('xx')).toBe(false);
    expect(isValidLocale(undefined)).toBe(false);
  });

  it('returns the display name when configured, otherwise the code', () => {
    expect(getLocaleName('pt-br')).toBe('Português (Brasil)');
    expect(getLocaleName('en')).toBe('English');
    expect(getLocaleName('xx')).toBe('xx');
  });
});

describe('i18n getLocaleFromPath()', () => {
  it('returns the default locale for the root path', () => {
    expect(getLocaleFromPath('/')).toBe('pt-br');
  });

  it('returns the default locale when no recognized prefix is present', () => {
    expect(getLocaleFromPath('/about')).toBe('pt-br');
    expect(getLocaleFromPath('/blog/hello-world')).toBe('pt-br');
  });

  it('recognizes the English locale prefix', () => {
    expect(getLocaleFromPath('/en/about')).toBe('en');
    expect(getLocaleFromPath('/en/blog')).toBe('en');
  });

  it('returns the default locale when the first segment is not a configured locale', () => {
    expect(getLocaleFromPath('/nl/about')).toBe('pt-br');
    expect(getLocaleFromPath('/zh-cn/blog')).toBe('pt-br');
  });

  it('normalizes paths without a leading slash', () => {
    expect(getLocaleFromPath('about')).toBe('pt-br');
  });
});

describe('i18n stripLocaleFromPath()', () => {
  it('leaves paths without a locale prefix unchanged', () => {
    expect(stripLocaleFromPath('/about')).toBe('/about');
  });

  it('removes the English locale prefix', () => {
    expect(stripLocaleFromPath('/en/about')).toBe('/about');
    expect(stripLocaleFromPath('/en/blog/hello')).toBe('/blog/hello');
  });

  it('does not remove an unconfigured locale prefix', () => {
    expect(stripLocaleFromPath('/nl/about')).toBe('/nl/about');
  });

  it('returns "/" for the root path', () => {
    expect(stripLocaleFromPath('/')).toBe('/');
  });
});

describe('i18n swapLocaleInPath()', () => {
  it('keeps the Portuguese default locale at the root', () => {
    expect(swapLocaleInPath('/about', 'pt-br')).toBe('/about');
  });

  it('adds the English prefix when switching from Portuguese', () => {
    expect(swapLocaleInPath('/about', 'en')).toBe('/en/about');
  });

  it('removes the English prefix when switching back to Portuguese', () => {
    expect(swapLocaleInPath('/en/about', 'pt-br')).toBe('/about');
  });

  it('keeps the English prefix when targeting English', () => {
    expect(swapLocaleInPath('/en/about', 'en')).toBe('/en/about');
  });
});

describe('i18n meta titles never embed the site name', () => {
  const SITE_NAME = 'Astro Rocket';

  const METATITLE_KEYS = [
    'blog.metaTitle',
    'blog.tagMetaTitle',
    'projects.metaTitle',
    'projects.pageMetaTitle',
    'projects.tagMetaTitle',
    'errors.metaTitle',
    'pages.home.meta.title',
    'pages.about.meta.title',
    'pages.services.meta.title',
    'pages.contact.meta.title',
  ];

  const cases = ['en', 'pt-br'].flatMap((locale) =>
    METATITLE_KEYS.map((key) => [locale, key] as [string, string])
  );

  it.each(cases)('%s "%s" does not include the site name', (locale, key) => {
    expect(t(key, locale)).not.toContain(SITE_NAME);
  });
});