import { applyDiscount, formatPrice, type Product } from "pricing-lib";

/** Escapa texto para interpolação segura em HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Renderiza o preço de um produto. Com desconto, mostra o preço final em
 * destaque e o original riscado; sem desconto, apenas o preço. O cálculo e a
 * formatação vêm da pricing-lib — nada de lógica de preço duplicada aqui.
 */
function renderPrice(product: Product): string {
  const { priceCents, currency, discountPercent } = product;

  if (discountPercent) {
    const finalCents = applyDiscount(priceCents, discountPercent);
    return `<span class="price">${escapeHtml(formatPrice(finalCents, currency))}</span>
      <s class="price-original">${escapeHtml(formatPrice(priceCents, currency))}</s>`;
  }

  return `<span class="price">${escapeHtml(formatPrice(priceCents, currency))}</span>`;
}

/** Renderiza um produto como um card. Usa `formatPrice` da pricing-lib. */
function renderCard(product: Product): string {
  return `
    <li class="card">
      <span class="name">${escapeHtml(product.name)}</span>
      <span class="prices">${renderPrice(product)}</span>
    </li>`;
}

/** Monta a página HTML completa a partir da lista de produtos. */
export function renderPage(products: readonly Product[]): string {
  const cards = products.map(renderCard).join("");
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Storefront</title>
    <style>
      body { font-family: system-ui, sans-serif; max-width: 640px; margin: 3rem auto; padding: 0 1rem; }
      h1 { font-size: 1.4rem; }
      ul { list-style: none; padding: 0; display: grid; gap: 0.5rem; }
      .card { display: flex; justify-content: space-between; padding: 0.9rem 1.1rem; border: 1px solid #e2e2e2; border-radius: 8px; }
      .prices { display: flex; align-items: baseline; gap: 0.5rem; }
      .price { font-variant-numeric: tabular-nums; font-weight: 600; }
      .price-original { color: #999; font-size: 0.85em; font-variant-numeric: tabular-nums; }
    </style>
  </head>
  <body>
    <h1>Loja</h1>
    <p>Preços formatados pela <code>pricing-lib</code>.</p>
    <ul>${cards}</ul>
  </body>
</html>`;
}
