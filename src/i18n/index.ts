import en from './en.json';
import i18nConfig from '../config/i18n.config';

export { i18nConfig };
export type { I18nConfig } from '../config/i18n.config';

export type Locale = string;

// `en.json` é o dicionário canônico que todos os outros idiomas seguem, então ele
// também serve como referência de tipo para todos os dicionários.
export type Dictionary = typeof en;

// Carrega automaticamente todos os dicionários de idiomas desta pasta. Adicionar um novo idioma
// significa apenas colocar um arquivo `src/i18n/<code>.json` — nenhuma importação ou registro
// é necessário aqui. (O idioma ainda precisa ser listado em `i18n.config.ts` para ser
// disponibilizado.) A chave é derivada do nome do arquivo: `./nl.json` → `nl`.
const modules = import.meta.glob<{ default: Dictionary }>('./*.json', { eager: true });

const dictionaries: Record<string, Dictionary> = Object.fromEntries(
  Object.entries(modules).map(([filePath, mod]) => {
    const locale = filePath.slice(filePath.lastIndexOf('/') + 1).replace(/\.json$/, '');
    return [locale, mod.default];
  }),
);

export const defaultLocale: Locale = i18nConfig.defaultLocale;

export function isEnabled(): boolean {
  return i18nConfig.enabled === true && i18nConfig.locales.length > 1;
}

export function getLocales(): Locale[] {
  return i18nConfig.locales;
}

/**
 * Os idiomas não padrão que devem ter suas próprias rotas com prefixo
 * (`/<locale>/about`, `/<locale>` …). Fica vazio quando o i18n está desativado ou quando apenas um
 * idioma está configurado, portanto os `getStaticPaths` com prefixo de idioma não geram nada e
 * os builds de um único idioma permanecem byte a byte inalterados. Segue o padrão dos
 * helpers por seção em `lib/blog` e `lib/projects`, para que cada tipo de conteúdo
 * obtenha os idiomas adicionais da mesma maneira.
 */
export function getSecondaryLocales(): Locale[] {
  if (!isEnabled()) return [];
  return getLocales().filter((locale) => locale !== defaultLocale);
}

export function getLocaleName(locale: Locale): string {
  return i18nConfig.localeNames?.[locale] ?? locale;
}

export function isValidLocale(locale: string | undefined): locale is Locale {
  if (!locale) return false;
  return i18nConfig.locales.includes(locale);
}

export function resolveLocale(locale: string | undefined): Locale {
  return isValidLocale(locale) ? locale : defaultLocale;
}

function getNestedValue(dict: Dictionary, key: string): unknown {
  const parts = key.split('.');
  let value: unknown = dict;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return value;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    const value = vars[name];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Procura uma tradução usando uma chave separada por pontos. Usa como fallback o valor do
 * idioma padrão e, depois, a própria chave, para que traduções ausentes sejam visíveis, mas
 * não interrompam a execução. Suporta placeholders como `{name}` por meio de `vars`.
 */
export function t(key: string, locale: Locale = defaultLocale, vars?: Record<string, string | number>): string {
  const dict = dictionaries[locale] ?? dictionaries[defaultLocale];
  const fallback = dictionaries[defaultLocale];
  const value = asString(getNestedValue(dict, key)) ?? asString(getNestedValue(fallback, key)) ?? key;
  return interpolate(value, vars);
}

/**
 * Procura um valor de tradução estruturado (array ou objeto) usando uma chave separada por pontos,
 * utilizando o mesmo fallback para o idioma padrão de `t()`. Use isso para listas e
 * seções de páginas localizadas — uma lista de itens de FAQ, uma lista de cards de recursos —
 * que `t()`, por retornar apenas strings, não consegue representar. Retorna o valor do
 * idioma padrão quando o idioma ativo ainda não possui a tradução da chave e `undefined`
 * somente quando nenhum dos dois idiomas a define (assim, uma tradução ausente recorre ao
 * idioma padrão em vez de quebrar a página).
 */
export function tData<T = unknown>(key: string, locale: Locale = defaultLocale): T | undefined {
  const dict = dictionaries[locale] ?? dictionaries[defaultLocale];
  const fallback = dictionaries[defaultLocale];
  const value = getNestedValue(dict, key) ?? getNestedValue(fallback, key);
  return value as T | undefined;
}

/**
 * Cria uma URL com prefixo de idioma. O idioma padrão permanece na raiz
 * (sem prefixo) quando `prefixDefaultLocale` é false, seguindo o
 * comportamento nativo de roteamento i18n do Astro.
 */
export function localizedPath(path: string, locale: Locale = defaultLocale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!isEnabled()) return normalized;
  if (locale === defaultLocale) return normalized;
  return `/${locale}${normalized === '/' ? '' : normalized}`;
}

/**
 * Remove um segmento inicial `/<locale>` de um caminho, caso esteja presente. Retorna o
 * caminho inalterado quando o primeiro segmento não é um idioma configurado. Sempre
 * retorna um caminho começando com `/`.
 *
 * `/nl/about` → `/about`, `/en` → `/`, `/about` → `/about`.
 */
export function stripLocaleFromPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const match = normalized.match(/^\/([^/]+)(\/.*)?$/);
  if (!match) return normalized;
  const [, first, rest] = match;
  if (i18nConfig.locales.includes(first)) {
    return rest && rest.length > 0 ? rest : '/';
  }
  return normalized;
}

/**
 * Substitui o segmento de idioma de um caminho por outro idioma.
 * Usado pelo LanguageSwitcher para criar links para a "mesma página, em outro idioma".
 * Quando o destino é o idioma padrão, nenhum prefixo é adicionado.
 */
export function swapLocaleInPath(path: string, targetLocale: Locale): string {
  const base = stripLocaleFromPath(path);
  return localizedPath(base, targetLocale);
}

/**
 * Detecta o idioma ativo a partir do primeiro segmento do caminho. Retorna o
 * idioma padrão quando nenhum prefixo de idioma reconhecido está presente.
 */
export function getLocaleFromPath(path: string): Locale {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const first = normalized.split('/').filter(Boolean)[0];
  return first && i18nConfig.locales.includes(first) ? first : defaultLocale;
}
