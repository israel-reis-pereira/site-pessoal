import { SITE_URL, GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION } from 'astro:env/server';
import i18nConfig, { type I18nConfig } from './i18n.config';
import { SITE_URL_FALLBACK } from './site-url';
import { SITE_NAME, THEME_COLOR } from './branding';

export { i18nConfig };
export type { I18nConfig };

export interface SiteConfig {
  name: string;
  description: string;
 /** Linha de identidade abaixo do logotipo no rodapé centralizado */
  tagline?: string;
  /** Linha de identidade abaixo do logotipo no rodapé centralizado */
  footerNote?: string;
  url: string;
  ogImage: string;
  author: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  socialLinks: string[];
  /**
   * Opções do cabeçalho.
   * Defina `showSocialLinks: true` para exibir um ícone no canto superior direito
   * para cada entrada de `socialLinks` (GitHub, X etc. — o ícone é identificado
   * a partir da URL).
   * Desativado por padrão; uma propriedade explícita
   * `<Header showSocialLinks>` ainda pode sobrescrever essa configuração em usos específicos.
  */
  header?: {
    showSocialLinks?: boolean;
  };
  twitter?: {
    site: string;
    creator: string;
  };
  verification?: {
    google?: string;
    bing?: string;
  };
  /** Caminho para a foto do autor (relativo à raiz do site, ex.: '/avatar.jpg'). Usado no schema Person. */
  authorImage?: string;
  /**
   * Defina como false se as imagens das publicações do blog já estiverem
   * adequadas à cor do tema e você não quiser aplicar a sobreposição
   * da cor da marca sobre elas.
  */
  blogImageOverlay?: boolean;
  /**
   * Efeitos visuais decorativos globais (puramente aditivos — o site funciona
   * perfeitamente sem eles).
   */
  effects?: {
    /**
     * Rastro do cursor em computadores desktop
     * (ponto do ponteiro + anel com atraso + partículas).
     *
     * Ativado por padrão; defina como `false` para desativá-lo
     * em todo o site como preferência de conforto visual/acessibilidade.
     *
     * O efeito já é automaticamente ignorado quando
     * `prefers-reduced-motion` está ativo ou quando o dispositivo
     * utiliza ponteiro de toque/coarse, independentemente desta configuração.
    */
    cursorTrail?: boolean;
  };
  /**
  * Recursos de artigo — módulos opcionais para posts do blog. 
  * Cada um vem desativado (OFF) por padrão para que o tema permaneça leve
  * para usuários que não os habilitarem. 
  */
  articleFeatures?: {
    /** Sumário exibido nos posts do blog (gerado automaticamente a partir dos títulos) */
    toc?: {
      /** Interruptor principal — defina como true para habilitar em todo o site */
      enabled: boolean;
      /** Onde renderizar o sumário (TOC).
       * - 'inline'  → card no topo de cada post (padrão; preserva
       *               a largura total de leitura no desktop)
       * - 'sidebar' → barra lateral fixa em viewports `xl+` (≥1280px),
       *               oculta em telas menores
       * - 'auto'    → barra lateral em `xl+`, card inline abaixo de `xl`,
       *               para que leitores em celulares e tablets ainda tenham navegação
       */
      layout?: 'inline' | 'sidebar' | 'auto';
      /**
       * Lado onde o sumário da barra lateral fica posicionado (aplica-se apenas quando
       * `layout` for 'sidebar' ou 'auto'). O padrão é 'right' (direita).
       */
      sidebarPosition?: 'left' | 'right';
      /** Número mínimo de títulos antes de renderizar o sumário (evita sumários em posts curtos) */
      minHeadings?: number;
     /** Nível mais profundo de título a incluir (2 = apenas H2, 3 = H2+H3, etc.) */
      maxDepth?: 2 | 3 | 4;
    };
    /** Comentários no final dos posts do blog (via Giscus, Cusdis ou Artalk) */
    comments?: {
      /** Interruptor principal — defina como true para habilitar em todo o site */
      enabled: boolean;
      /** Provedor de comentários — 'giscus' (GitHub Discussions), 'cusdis' ou 'artalk'. */
      provider?: 'giscus' | 'cusdis' | 'artalk';
      /** Configuração do Giscus. Obtenha os valores em https://giscus.app */
      giscus?: {
        repo: `${string}/${string}`;
        repoId: string;
        category: string;
        categoryId: string;
        mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
        strict?: boolean;
        reactionsEnabled?: boolean;
        emitMetadata?: boolean;
        inputPosition?: 'top' | 'bottom';
        /**
        * Tema do Giscus. Deixe vazio (o padrão) para seguir o modo claro/escuro
        * do próprio site — definido no cliente e mantido sincronizado conforme
        * o visitante alterna entre os modos. Defina um nome de tema específico
        * do Giscus (por exemplo, 'dark_dimmed', 'preferred_color_scheme')
        * para substituir o padrão. 
        */
        theme?: string;
        /**
        * Idioma do Giscus. Deixe vazio (o padrão) para seguir o idioma
        * atual do site. Defina um código de idioma específico do Giscus
        * (por exemplo, 'en', 'nl') para substituir o padrão. 
        */
        lang?: string;
      };
      /** Configuração do Cusdis. Obtenha seu App ID no painel do Cusdis. */
      cusdis?: {
        /** ID do aplicativo Cusdis (obtido no "Código de Incorporação" do painel do Cusdis). */
        appId: string;
        /**
         * Host da instância do Cusdis. O padrão é o serviço hospedado
         * 'https://cusdis.com'; defina sua própria URL ao hospedar por conta própria.
         */
        host?: string;
        /**
        * Tema. Deixe vazio (padrão) para seguir o modo claro/escuro
        * do próprio site — resolvido no cliente e renderizado novamente quando o visitante
        * alterna o modo (o Cusdis não possui API de tema em tempo real, então a discussão recarrega brevemente
        * ao alternar). Use 'auto' para seguir a preferência do SO, ou
        * 'light' / 'dark' para um tema fixo. 
        */
        theme?: '' | 'light' | 'dark' | 'auto';
        /**
        * Idioma. Deixe vazio (padrão) para seguir a localidade atual
        * do site. Defina um código de idioma do Cusdis para substituir o padrão. 
        * A disponibilidade depende dos pacotes de idioma do Cusdis; códigos desconhecidos
        * revertem para o inglês. 
        */
        lang?: string;
      };
      /** Configuração do Artalk. Requer seu próprio servidor Artalk. */
      artalk?: {
        /**
        * Endereço do servidor Artalk, por exemplo:
        * 'https://comments.example.com'
        */
        server: string;
        /**
        * Nome do site usado pelo Artalk para isolamento entre múltiplos sites. Deve corresponder
        * ao site criado no painel ou na configuração do servidor Artalk. 
        */
        site: string;
        /**
        * URL opcional do JS do cliente. O padrão é `${server}/dist/Artalk.js`. 
        * Útil ao servir o cliente a partir de uma CDN ou caminho de ativos personalizado. 
        */
        jsUrl?: string;
        /**
        * URL opcional do CSS do cliente. O padrão é `${server}/dist/Artalk.css`. 
        * Útil ao servir o cliente a partir de uma CDN ou caminho de ativos personalizado. 
        */
        cssUrl?: string;
        /**
        * Modo escuro. Deixe vazio (padrão) para seguir o modo claro/escuro
        * do próprio site e mantê-lo sincronizado em tempo real. Defina 'auto' para seguir a
        * preferência do SO, ou use true / false para um modo fixo. */
        darkMode?: boolean | 'auto';
        /**
        * Idioma. Deixe vazio (o padrão) para seguir a localidade atual
        * do site. Defina um código de localidade específico do Artalk, como 'zh-CN' ou 'en',
        * para substituir o padrão. 
        */
        locale?: string;
      };
    };
  };
  /**
  * Inscrição na newsletter, exibida na seção "acompanhe" da página inicial do blog
  * e no rodapé de cada postagem. 
  *
  * Desativado por padrão, e isso é intencional: o formulário envia dados para `/api/newsletter`,
  * que requer `RESEND_API_KEY` e `RESEND_AUDIENCE_ID`. Sem essas chaves,
  * o endpoint responde com "Newsletter service is not configured" (Serviço de newsletter não configurado);
  * assim, um site que exibisse o formulário antes de o proprietário ter uma lista de e-mails
  * estaria apenas acumulando falhas. Configure suas chaves e, então, ative esta opção. 
  */
  newsletter?: {
    /** Interruptor principal — defina como true para exibir a inscrição em todo o site */
    enabled: boolean;
  };
  /**
  * Configuração da listagem do blog. Contagens que anteriormente estavam fixas no código
  * em `lib/blog.ts` e nos arquivos de rota agora ficam aqui, permitindo ajustes
  * em um único local. (As chaves existentes `blogImageOverlay` / `articleFeatures`
  * permanecem onde estão para garantir compatibilidade com versões anteriores
  * e podem ser integradas em uma atualização de versão principal.)
  */
  blog?: {
    /** Postagens comuns (não destacadas) exibidas por página do índice do blog. Padrão: 12. */
    postsPerPage?: number;
    /** Quantidade de tags mais utilizadas a serem exibidas na nuvem de tags do blog. Padrão: 10. */
    tagCloudLimit?: number;
  };
  /** Configuração da listagem de projetos. */
  projects?: {
    /** Projetos exibidos por página na listagem de projetos. Padrão: 12. */
    perPage?: number;
    /** Quantidade de tags mais utilizadas a serem exibidas na nuvem de tags de projetos. Padrão: 10. */
    tagCloudLimit?: number;
  };
  /**
   * Internacionalização (i18n) — consulte `src/config/i18n.config.ts`.
   * Permanece em um arquivo separado para que o módulo de i18n possa ser
   * importado pelos testes unitários sem carregar `astro:env/server`.
   */
  i18n?: I18nConfig;
  /**
   * Configuração da identidade visual.
   * Arquivos do logotipo: substitua os SVGs em `src/assets/branding/`.
   * Favicon: substitua em `public/favicon.svg`.
   */
  branding: {
    /** Logo alt text for accessibility */
    logo: {
      alt: string;
      /**
       * Optional path to a custom logo image in public/ (e.g. '/logo.svg').
       * When set, it replaces the generated letter-monogram badge in the
       * header, footer, and anywhere <Logo> is rendered — no layout edits
       * needed. Leave unset to keep the monogram. Per-author byline avatars
       * (which pass an explicit letter) are unaffected.
       */
      image?: string;
      /** Path to logo image for structured data (e.g. '/logo.png'). Add a PNG to public/ and set this. */
      imageUrl?: string;
    };
    /** Favicon path (lives in public/) */
    favicon: {
      svg: string;
    };
    /** Theme colors for manifest and browser UI */
    colors: {
      /** Browser toolbar color (hex) */
      themeColor: string;
      /** PWA splash screen background (hex) */
      backgroundColor: string;
    };
  };
}

const siteConfig: SiteConfig = {
  // Read from ./branding so the build-time favicon generator, which cannot
  // import this file, uses the same values. Change them there.
  name: SITE_NAME,
  description:
    'Desenvolvedor Full Stack focado em desenvolvimento web, sistemas e soluções digitais.',
  tagline: 'Desenvolvedor Full Stack',
  footerNote: 'Desenvolvimento web e soluções digitais',
  url: SITE_URL || SITE_URL_FALLBACK,
  // Generated at build time from `name`, `tagline` and the brand colour below.
  // Point this at a file in `public/` to use your own — it has to be a raster
  // (PNG or JPEG): social platforms don't render SVG share images.
  ogImage: '/og/default.png',
  author: 'Israel Silva dos Reis Pereira',
  email: 'israelsilvapereirareis@gmail.com',
  address: {
    street: '',
    city: 'Barretos',
    state: 'SP',
    zip: '',
    country: 'Brasil',
  },
  socialLinks: [
    'https://github.com/israel-reis-pereira',
    'https://x.com/israelsilvareis',
    'https://www.linkedin.com/in/israel-silva-dos-reis-pereira',
    'https://bsky.app/profile/israel-reis.bsky.social',
    'https://www.instagram.com/israelsilvadosreispereira',
  ],
  header: {
    // Flip to `true` to show the social icons (incl. GitHub) in the header.
    showSocialLinks: false,
  },
  twitter: {
    site: 'https://x.com/israelsilvareis',
    creator: '@israelsilvareis',
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    bing: BING_SITE_VERIFICATION,
  },
  authorImage: '/avatar.svg',
  blogImageOverlay: true,
  effects: {
    cursorTrail: true,
  },
  articleFeatures: {
    toc: {
      enabled: true,
      layout: 'auto',
      sidebarPosition: 'right',
      minHeadings: 3,
      maxDepth: 3,
    },
    comments: {
      enabled: false,
      provider: 'giscus',
      giscus: {
        repo: 'owner/repo',
        repoId: '',
        category: 'General',
        categoryId: '',
        mapping: 'pathname',
        strict: false,
        reactionsEnabled: true,
        emitMetadata: false,
        inputPosition: 'bottom',
        // Empty → follow the site's light/dark mode and current locale.
        theme: '',
        lang: '',
      },
      // Used when provider is 'cusdis'. Get your App ID from the Cusdis
      // dashboard (Embed Code); `host` defaults to the hosted service.
      cusdis: {
        appId: '',
        host: 'https://cusdis.com',
        // Empty → follow the site's light/dark mode and current locale.
        theme: '',
        lang: '',
      },
      // Used when provider is 'artalk'. Point `server` at your own Artalk
      // service — use an https:// address in production (a plain http:// URL
      // is blocked as mixed content on an https site and is open to
      // tampering). Comments render only once both `server` and `site` are set.
      artalk: {
        server: '',
        // The Artalk "site" name you configured in the Artalk dashboard
        // (used for multi-site isolation).
        site: '',
        // Optional: override the client asset URLs when needed.
        // jsUrl: 'https://cdn.example.com/artalk/Artalk.js',
        // cssUrl: 'https://cdn.example.com/artalk/Artalk.css',
        // Leave undefined → follow the site's light/dark mode and locale.
        // darkMode: 'auto',
        // locale: 'en',
      },
    },
  },
  newsletter: {
    // On by default: the form knows whether it has keys and says so itself,
    // in dev only. Set RESEND_API_KEY and RESEND_AUDIENCE_ID to make it work.
    enabled: false,
  },
  blog: {
    postsPerPage: 12,
    tagCloudLimit: 10,
  },
  projects: {
    perPage: 12,
    tagCloudLimit: 10,
  },
  i18n: i18nConfig,
  branding: {
    logo: {
      alt: 'Israel Silva dos Reis Pereira - Desenvolvedor Full Stack',
      // image: '/logo.svg', // Optional: set to a file in public/ to use a custom logo image instead of the letter monogram.
      // imageUrl: '/favicon.svg',
    },
    favicon: {
      svg: '/favicon.svg',
    },
    colors: {
      themeColor: THEME_COLOR,
      backgroundColor: '#ffffff',
    },
  },
};

export default siteConfig;
