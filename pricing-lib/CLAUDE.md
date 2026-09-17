# CLAUDE.md — pricing-lib

Biblioteca reutilizável de precificação, publicada como pacote `pricing-lib` e
consumida por apps externos (ex.: a storefront). **Repositório independente** —
não faz parte de um monorepo. TypeScript ESM, `strict`. Comentários em PT-BR.

## Papel

Fonte da verdade dos **tipos** (`Product`, `Currency`) e das **regras de
dinheiro** (`formatPrice`). Preços sempre em **centavos** (inteiro); nunca use
float para dinheiro. Sem dependências de runtime.

## Estrutura

- `src/types.ts` — contrato de dados público.
- `src/money.ts` — formatação/cálculo monetário.
- `src/index.ts` — API pública (o que os consumidores importam).

## Comandos

- `npm test` — vitest.
- `npm run typecheck` — `tsc --noEmit`.

## Cuidado ao mudar a API pública

Mudar `Product` ou o que `index.ts` exporta **quebra os apps consumidores**.
Eles vivem em outros repositórios, então o type-check local não os enxerga —
avise no resumo quando a API pública mudar.
