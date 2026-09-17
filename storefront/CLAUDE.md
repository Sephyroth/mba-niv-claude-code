# CLAUDE.md — storefront

App web que renderiza um catálogo de produtos. **Repositório independente** —
depende da biblioteca externa `pricing-lib` (declarada como `file:../pricing-lib`
no package.json). TypeScript ESM, `strict`. Comentários em PT-BR.

## Papel

Dona dos **dados** (`src/catalog.ts`) e da **apresentação** (`src/render.ts`,
`src/server.ts`). Os **tipos** e a **formatação de preço** vêm de `pricing-lib`
via `import ... from "pricing-lib"` — não duplique essa lógica aqui.

## Estrutura

- `src/catalog.ts` — dados do catálogo (tipados com `Product` da pricing-lib).
- `src/render.ts` — HTML server-side; usa `formatPrice` da pricing-lib.
- `src/server.ts` — servidor `node:http`. Porta 4200 (`WEB_PORT`).

## Comandos

- `npm run dev` / `npm start` — sobe o servidor (via `tsx`).
- `npm run typecheck` — `tsc --noEmit`.

## Ao mexer em algo que envolve preço, moeda ou o tipo Product

Isso mora na `pricing-lib`, que é **outro repositório/pasta**, fora deste working
dir. Para editá-la na mesma sessão, adicione-a com `/add-dir ../pricing-lib` —
caso contrário ela está fora do alcance e a mudança fica incompleta.
