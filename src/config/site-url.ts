/**
 * URL usada quando a variável de ambiente `SITE_URL` não está definida.
 *
 * Dois lugares precisam conhecer o endereço do próprio site e devem estar
 * de acordo: `astro.config.mjs` define `site`, que produz todas as tags
 * canonical, `og:url`, `og:image`, link do RSS e entrada do sitemap —
 * enquanto `site.config.ts` define `url`, que é utilizada pelo JSON-LD,
 * pelos cartões de compartilhamento e pelo rodapé.
 *
 * O `astro.config.mjs` é executado antes que `astro:env` esteja disponível,
 * portanto não pode importar `site.config.ts`. Sem uma constante
 * compartilhada, os dois valores podem ficar diferentes e o site pode
 * fornecer URLs canonical de um domínio enquanto informa aos mecanismos
 * de busca que pertence a outro.
 *
 * Defina `SITE_URL` nas variáveis de ambiente do seu serviço de hospedagem
 * e este valor nunca será utilizado. Ele permanece como um placeholder
 * propositalmente: um site publicado sem `SITE_URL` deve ficar claramente
 * identificado como não configurado, em vez de assumir silenciosamente
 * o domínio de outra pessoa.
 */
export const SITE_URL_FALLBACK = 'https://example.com';