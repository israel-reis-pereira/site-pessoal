# Pendências verificadas — Astro Rocket

**Data da análise:** 24/08/2026

**Escopo:** diagnóstico do estado atual; nenhum código foi corrigido nesta análise.

## Resumo da validação

- `pnpm.cmd check`: concluído com **0 errors, 0 warnings e 9 hints**.
- `pnpm.cmd lint`: concluído com **0 errors e 2 warnings**.
- `pnpm.cmd build`: falha no hook final do adapter `@astrojs/vercel`.
- `pnpm.cmd test:run`: não inicia a suíte no Windows; o esbuild não consegue resolver `vitest.config.ts` e informa acesso negado ao diretório `../../..`.
- A coleção `pages` está declarada, mas `src/content/pages` não contém arquivos `.md` ou `.mdx`.
- `SITE_URL` não está definido; o build usa `https://example.com` como fallback.

## Pendências técnicas

### 1. Falha `EPERM` ao empacotar o adapter Vercel no Windows

- **Causa:** durante o hook `astro:build:done`, `@astrojs/vercel@11.0.0` tenta criar um symlink para a dependência pnpm `clsx` em `.vercel/output/functions/_render.func/node_modules/`. O Windows retorna `EPERM: operation not permitted, symlink`.
- **Evidência:** o build compila os entrypoints, prerenderiza as rotas, processa imagens e falha somente no empacotamento do adapter; a stack aponta para `copyDependenciesToFunction` em `@astrojs/vercel`.
- **Impacto:** `pnpm build` termina com código 1 e o artefato Vercel não pode ser considerado válido. A ocorrência foi observada no ambiente Windows local; ainda não há evidência de falha no deploy.
- **Prioridade:** alta.
- **Próximo passo:** reproduzir fora da limitação de symlinks do Windows e comparar com Linux/CI; depois verificar a compatibilidade entre pnpm, `@astrojs/vercel@11.0.0` e permissões de criação de links. Não trocar o adapter antes dessa comparação.

### 2. `SITE_URL` ausente

- **Causa:** não existe `SITE_URL` no ambiente usado para a análise; `astro.config.mjs` e `src/config/site-url.ts` então usam `https://example.com`.
- **Impacto:** canonical URLs, `og:url`, `og:image`, RSS e sitemap são gerados apontando para o domínio de exemplo. O build avisa, mas não interrompe a geração.
- **Prioridade:** alta antes de publicar.
- **Próximo passo:** definir o domínio real como `SITE_URL` no ambiente de build/deploy e repetir a verificação de canonical, JSON-LD, RSS, sitemap e cards OG.

### 3. Coleção `pages` vazia

- **Causa:** `src/content.config.ts` declara a coleção `pages` com glob em `src/content/pages`, mas o diretório não possui arquivos correspondentes.
- **Impacto:** o Astro emite o warning `[glob-loader] No files found` e, durante o prerender, repete `The collection "pages" does not exist or is empty`. O build continua, mas a validação de conteúdo que espera páginas não tem entradas para analisar.
- **Prioridade:** média.
- **Próximo passo:** confirmar se páginas customizadas devem ser mantidas nessa coleção. Se sim, adicionar conteúdo conforme o schema; se não, mapear todos os usos da coleção e decidir, conscientemente, se a declaração e a validação associada continuam necessárias.

## Hints do `astro check`

O comando chama todos estes diagnósticos de `hint`; eles não são erros de compilação, mas precisam de decisão antes de considerar a checagem limpa.

### 4. APIs `.url()` do Zod depreciadas

- **Causa:** `z.string().url()` em `src/content.config.ts:117`, `:118` e `:172` usa uma API marcada como deprecated pela versão instalada do Zod.
- **Impacto:** não quebra o build atual, mas pode exigir migração quando o Zod ou o TypeScript removerem a assinatura.
- **Prioridade:** baixa.
- **Próximo passo:** verificar a API de validação de URL recomendada pela versão do Zod adotada e atualizar os três campos em conjunto, preservando o schema das coleções.

### 5. Fallback `MediaQueryList.addListener`

- **Causa:** `src/layouts/BaseLayout.astro:200` e `src/components/layout/ThemeModeDropdown.astro:370` mantêm `addListener` como fallback para navegadores antigos.
- **Impacto:** a API é depreciada, embora mantenha compatibilidade pretendida com Safari antigo; o comportamento atual não foi demonstrado como quebrado.
- **Prioridade:** baixa.
- **Próximo passo:** confirmar a matriz de navegadores suportada e testar a troca de tema em navegadores modernos e no fallback antes de remover ou alterar o caminho legado.

### 6. `define:vars` no script da galeria

- **Causa:** `src/components/projects/ProjectGallery.astro:164` usa `<script define:vars=...>`; o Astro informa que o script será tratado como `is:inline` e não terá processamento de TypeScript ou pacotes.
- **Impacto:** atualmente é um hint de semântica do Astro, mas alterações futuras no script podem pressupor processamento que não ocorrerá.
- **Prioridade:** baixa.
- **Próximo passo:** confirmar que o script precisa apenas dos valores serializados e documentar/explicitar a intenção ou remodelar a passagem de dados se houver necessidade de processamento.

### 7. Variável `words` não reconhecida no `TypingEffect`

- **Causa:** `src/components/ui/TypingEffect.astro:67` usa `words` dentro de um script inline com `define:vars`; o analisador não reconhece a variável injetada nesse contexto.
- **Impacto:** é um diagnóstico real do analisador, mas não prova sozinho uma falha em runtime. O efeito de digitação precisa ser testado no navegador, inclusive após navegação e com mais de uma palavra.
- **Prioridade:** média.
- **Próximo passo:** confirmar o JavaScript emitido e o comportamento do componente em desktop/mobile; depois decidir entre ajustar a forma de injeção ou aceitar o hint como limitação do analisador.

## Outros avisos e bloqueios encontrados

### 8. Aviso de `punycode` depreciado no Node

- **Causa:** o Node emite `[DEP0040] DeprecationWarning: The punycode module is deprecated` durante `check` e `build`; a origem transitiva ainda não foi identificada.
- **Impacto:** não interrompeu nenhuma dessas duas tarefas, mas pode vir de dependência desatualizada e desaparecer ou virar erro após atualização do Node.
- **Prioridade:** baixa.
- **Próximo passo:** executar com rastreamento de deprecações e localizar a dependência responsável antes de atualizar ou substituir qualquer pacote.

### 9. Warnings do ESLint em `scripts/verify-build.mjs`

- **Causa:** `scripts/verify-build.mjs:60` e `:123` usam `console.log`, restringido pela regra `no-console`.
- **Impacto:** `pnpm.cmd lint` ainda retorna sucesso, mas a saída não está sem warnings e o script de verificação fica fora do padrão de lint adotado.
- **Prioridade:** baixa.
- **Próximo passo:** decidir se a saída do verificador deve ser permitida explicitamente ou migrada para os métodos aceitos pela configuração do ESLint, sem alterar seu comportamento.

### 10. Suíte Vitest não inicia neste ambiente Windows

- **Causa observada:** `pnpm.cmd test:run` falha antes de carregar os testes; o esbuild relata `Could not resolve ... vitest.config.ts` e `Cannot read directory "../../..": Acesso negado`. O arquivo de configuração existe no repositório.
- **Impacto:** os testes unitários não foram executados; portanto, não há evidência atual de aprovação ou falha dos testes do projeto.
- **Prioridade:** média.
- **Próximo passo:** reproduzir o comando fora da restrição de acesso do ambiente e confirmar se o problema é a resolução do config no Windows, a versão do Vitest/esbuild ou a política de permissões. Só então classificar como defeito do projeto.

## Itens não confirmados como pendência atual

- O aviso antigo sobre `baseUrl` não se reproduziu: o `tsconfig.json` atual não declara `baseUrl`.
- Não há base, nesta execução, para considerar favicon, identidade, traduções ou links do template como pendências técnicas: são decisões de personalização e não foram incluídas neste inventário de falhas verificadas.
- O build não foi considerado concluído; a etapa de `verify` não foi usada como aprovação porque o build falhou antes de produzir um artefato Vercel completo.
