# Trabalhando nesta base de código

Neste projeto, o Astro Rocket é tratado como uma base reutilizável para construção de sites, e não como algo que deve ser reescrito ou modernizado sem necessidade.. É quase certo que você esteja aqui para ajudar alguém a construir o site **dessa pessoa** com base nele, e não para desenvolver o próprio tema. Este arquivo indica onde tudo está localizado e quais convenções seguir, para que você possa fazer alterações que se integrem adequadamente ao projeto, em vez de apenas fazer algo que funcione.

## A estrutura do projeto

```
src/config/          Configurações do site — comece por aqui para quase qualquer solicitação
src/content/         Conteúdo do site (coleções em Markdown/MDX/JSON)
src/i18n/            Todo o texto da interface voltado ao usuário, por idioma
src/components/      Componentes reutilizáveis, agrupados por finalidade
src/pages/           Rotas; um arquivo aqui corresponde a uma URL
src/layouts/         Estruturas de página onde as rotas são renderizadas
src/lib/             Utilitários para blog, projetos, tags, SEO, temas
src/styles/          Tokens de design e os doze temas de cores
component-registry.json   Catálogo legível por máquina de todos os componentes
```

**Leia o `component-registry.json` primeiro.** Ele lista todos os componentes com suas respectivas categorias, finalidades e *props* (propriedades). É a maneira mais rápida de descobrir se o elemento que você pretende criar já existe — geralmente, ele já existe.

É também a única fonte para a contagem de componentes. Todos os números presentes no README e nos textos do site derivam dele, e o teste `src/__tests__/component-count.test.ts` falhará caso haja divergências. O número costumava ser 57, extraído da documentação de outro tema; como não havia verificação, esse valor permaneceu em seis locais diferentes, enquanto o selo na página de demonstração indicava "50+". Não escreva uma contagem de componentes que não tenha sido verificada a partir deste arquivo.

## Onde fazer alterações

| A solicitação | O arquivo |
|---|---|
| Nome do site, logotipo, links de redes sociais, dados de contato | `src/config/site.config.ts` |
| Menus de navegação | `src/config/nav.config.ts` |
| Idiomas | `src/config/i18n.config.ts` |
| Comportamento do consentimento de cookies | `src/config/consent.config.ts` |
| Qualquer texto da interface, incluindo `aria-label`, `alt`, `placeholder` e `title` | `src/i18n/*.json` |
| Um post de blog | um novo arquivo `.mdx` em `src/content/blog/<locale>/` |
| Um projeto | um novo arquivo `.mdx` em `src/content/projects/<locale>/` |
| Cores | `src/styles/themes/*.css` — doze temas, apenas tokens |

Ao adicionar ou alterar uma chave de tradução, preserve a mesma estrutura de chaves em todos os arquivos de idioma. Antes de remover ou renomear uma chave, verifique seus usos no código e os testes de i18n.

**O conteúdo textual da página não fica nos arquivos da página.** O texto reside em `src/i18n/en.json` e é
lido através de `t()`. Editar um título geralmente significa editar o JSON, não o arquivo `.astro`.
Se uma página parecer ter texto fixo no código (*hard-coded*), verifique primeiro o arquivo de idioma.

## Antes de incluir uma funcionalidade

**Duas perguntas, antes do merge e não depois.** Um usuário comum deste
tema precisa disso? O tema precisa disso? Uma contribuição funcional não responde a nenhuma dessas perguntas,
e uma funcionalidade integrada apenas por ter código funcional traz consigo uma
carga de manutenção que ninguém concordou em assumir.

**Antes de incluir uma funcionalidade**

Antes de adicionar uma funcionalidade, responda:

1. O requisito do site realmente precisa disso?
2. O Astro Rocket já oferece algo que atende ao requisito?
3. Essa funcionalidade deve fazer parte da base reutilizável ou pertence apenas
   ao site específico?

Responder "não" não é uma rejeição ao colaborador. É menos custoso para todos
do que uma funcionalidade que o tema carrega, mas que ninguém mantém.

## Convenções que vale a pena manter

- **Use componentes existentes.** Verifique o registro antes de criar um novo. 
Os componentes compartilham uma linguagem de design; um elemento personalizado a quebra.
- **Use os tokens de design.** As cores vêm de propriedades personalizadas CSS definidas em
`src/styles/`. Nunca insira um valor hexadecimal diretamente no código — ele não seguirá o tema
de cores e falhará nas verificações de contraste.
- **Todos os arquivos de idioma devem estar sincronizados.** Adicionar uma chave ao `en.json` significa adicioná-la
a todos os outros idiomas; caso contrário, o idioma fará um *fallback* (reversão para o padrão) no meio da página.
- **Movimentos respeitam `prefers-reduced-motion`.** Qualquer elemento animado deve parar para
visitantes que solicitarem essa preferência.
- **Imagens passam pelo `astro:assets`.** Use o componente `<Image>` para que tamanhos e
formatos sejam gerados no momento da build.
- **Zero JavaScript, a menos que ele justifique sua presença.** O Astro não envia JavaScript por padrão; Recorra a uma tag `<script>` apenas quando a interação realmente exigir uma.

## Mensagens de commit

Este repositório é público. Seu histórico é lido por pessoas que estão decidindo se
confiam no tema; portanto, a mensagem de commit faz parte do produto.

- **Descreva a alteração e a razão pela qual o design é como é.** Um mantenedor
que ler isso daqui a um ano precisa saber a lógica por trás de uma decisão, e não
o relato de como se chegou a ela.
- **Nunca narre o processo.** Nada de relatos em primeira pessoa sobre o que foi tentado,
o que foi esquecido ou o que foi aprendido. "Limita o escopo do conteúdo de demonstração
ao ambiente de deploy de demonstração" é adequado aqui; "Eu só testei dois estados", não.
- **Nada de informações de ferramentas ou sessões.** Não use `Co-Authored-By` para um assistente
nem links para sessões de IA. Algumas ferramentas adicionam isso por padrão — remova esses itens.
- **Use o tempo presente, descrevendo o código após a alteração.** "Limita o escopo do conteúdo
de demonstração ao ambiente de deploy de demonstração", em vez de "Corrigiu o vazamento da demonstração".
- **O assunto (título) nomeia a alteração; não a justifica.** "Reescreve a visão geral do README",
em vez de "Explica o que é o Astro Rocket antes de dizer o que há dentro dele". 
Nada de comparações, nada de "não X, mas Y", nada de argumentação no título —
isso é função do corpo da mensagem. Quem examina o histórico quer saber o que cada commit fez.
- **Mantenha a linha de assunto com até 72 caracteres, preferencialmente 50.**
O GitHub gera o título de um *pull request* a partir do assunto (*subject*) e o corta nesse limite, movendo o restante para a descrição — assim, um assunto muito longo inicia o *pull request* com um fragmento como "…arsing". O corpo (*body*) é o local adequado para detalhes; ele não tem limite de tamanho.

## Verificações

- **Uma verificação não está concluída até que tenha falhado propositalmente uma vez.** Escreva-a, execute-a contra o estado de erro que ela deve detectar, observe-a ficar vermelha (falha), depois corrija o código e observe-a ficar verde (sucesso). Uma verificação executada apenas em código funcional é apenas uma suposição com um sinal de "ok" verde.
- **Verifique o caminho que falha, não apenas o que funciona.** Um *job* de CI de contêiner cujo *loop* de prontidão (*readiness loop*) terminava em `sleep` passou no teste enquanto o contêiner estava inativo; além disso, um serviço de exportação sem o argumento `SITE_URL` gerou *tags* canônicas apontando para `localhost`, pois ambas as proteções em tempo de *build* falharam silenciosamente. Ambos os casos foram testados apenas no estado em que tudo funciona.

## Comandos

```bash
pnpm dev          # servidor de desenvolvimento
pnpm build        # build de produção — execute antes de declarar o trabalho concluído
pnpm check        # astro check, TypeScript, ESLint e Prettier
pnpm test         # testes unitários com Vitest
pnpm fix          # aplica correções do ESLint e Prettier
```

O comando `pnpm build` é o teste real. Ele executa o `astro check`, valida os esquemas de coleção de conteúdo (*content-collection schemas*) e a validação de *links*, falhando caso encontre problemas que o servidor de desenvolvimento oculta.

## Pontos de atenção comuns

- **Coleções de conteúdo passam por validação de esquema.** *Frontmatter* que não corresponde a `src/content.config.ts` causa falha no *build*. Leia o esquema antes de adicionar campos.
- **Rascunhos (*drafts*) são filtrados apenas em produção.** Itens com `draft: true` ainda são renderizados no `pnpm dev`; portanto, verifique realizando um *build*.
- **Um rascunho é inacessível.** Criar um *link* para um *post* ou projeto marcado como rascunho gera um erro 404 em produção. Verifique os *links* de entrada antes de transformar algo em rascunho.
- **O tema suporta múltiplos idiomas.** Rotas com prefixo de localidade (*locale*) são geradas automaticamente; não crie arquivos em `src/pages/<locale>/` manualmente.

## Antes de finalizar

Execute `pnpm build`. Em seguida, confirme se a alteração é realmente visível na página
onde foi feita — e não apenas que o comando foi executado sem erros.

Se a alteração tiver impacto visual, também verifique a página no navegador
e confirme o comportamento em pelo menos um viewport desktop e um viewport
mobile quando aplicável.

## Filosofia de desenvolvimento

Este repositório utiliza o Astro Rocket como base inicial.

A prioridade é reutilizar e adaptar a arquitetura existente antes
de introduzir novo código.

Siga esta ordem ao implementar uma solicitação:

1. Reutilize uma página, layout, componente, padrão ou utilitário existente.
2. Adapte uma implementação existente com a menor alteração razoável.
3. Combine múltiplos componentes existentes, se necessário.
4. Crie um novo componente apenas quando o sistema existente não puder
atender razoavelmente ao requisito.
5. Introduza novas dependências apenas quando houver uma necessidade técnica clara
que não possa ser razoavelmente resolvida com a stack existente.
6. Prefira configuração, conteúdo, variantes e composição antes de duplicar
   componentes existentes.
7. Introduza novas dependências apenas quando houver uma necessidade técnica
   clara que não possa ser razoavelmente resolvida com a stack existente.

Não crie componentes, utilitários, estilos ou abstrações duplicados
quando já existir um equivalente.

Dê preferência a alterações de configuração e conteúdo em vez de alterações estruturais,
sempre que o requisito puder ser atendido dessa forma.

Não refatore código não relacionado ao implementar uma funcionalidade.
Não "melhore" a arquitetura existente, a menos que a alteração solicitada
exija isso.

Evite modificar componentes ou estruturas centrais do Astro Rocket quando
a necessidade puder ser resolvida na camada de configuração, conteúdo,
composição ou variante.

Alterações no núcleo devem ser tratadas como decisões de maior impacto,
pois podem afetar outros sites construídos sobre a mesma base.

Antes de criar algo novo, examine:
- component-registry.json
- componentes existentes
- layouts
- padrões
- arquivos de configuração
- utilitários
- design tokens
- testes existentes

A menor alteração correta é preferível a uma alteração arquitetural maior.

## Investigação antes da implementação

Para solicitações não triviais, não modifique arquivos imediatamente.

Primeiro:
1. Examine a implementação existente relevante.
2. Identifique componentes e lógica reutilizáveis.
3. Identifique os arquivos mínimos que precisariam ser modificados.
4. Apresente a abordagem proposta e os arquivos que pretende alterar.
5. Verifique se a abordagem respeita as regras de reutilização deste arquivo.
6. Só então implemente a alteração.

Se a solicitação for ambígua ou houver múltiplas abordagens razoáveis,
peça esclarecimentos em vez de tomar uma grande decisão arquitetural.

## Controle de escopo

Faça somente as alterações necessárias para atender à solicitação.

Não altere arquivos, componentes, estilos, configurações ou dependências
não relacionados ao requisito.

Quando uma alteração puder ser feita em um único arquivo sem prejudicar
a arquitetura existente, prefira essa abordagem.

Se durante a implementação surgir uma melhoria não relacionada ao requisito,
não a implemente automaticamente. Registre-a separadamente para avaliação
posterior.

## Justificativa para código novo

Sempre que criar um novo componente, utilitário, abstração ou dependência,
explique brevemente:

- o que existente foi analisado;
- por que não era suficiente;
- por que a nova implementação é necessária;
- qual será o impacto dela na arquitetura existente.

Não crie código novo apenas porque ele é mais conveniente do que reutilizar
uma implementação existente.

## Uso da IA

A IA é uma ferramenta de apoio à análise e implementação, não uma substituta
da compreensão do código.

Ao trabalhar neste projeto:

- primeiro compreenda a estrutura existente antes de aceitar uma solução;
- prefira explicações que permitam entender por que uma alteração é necessária;
- não aceite código apenas porque ele compila;
- valide alterações com os comandos e testes disponíveis;
- não introduza abstrações que não possam ser explicadas;
- mantenha as decisões arquiteturais compreensíveis para uma pessoa que não
  utilizou IA para criá-las.

Quando houver dúvida entre uma solução simples e uma solução mais abstrata,
prefira a solução simples, desde que atenda corretamente ao requisito.