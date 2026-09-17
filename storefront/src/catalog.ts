import type { Product } from "pricing-lib";

/**
 * Catálogo da loja. A storefront é dona dos seus próprios dados; o *tipo*
 * Product, porém, vem da pricing-lib — é assim que app e biblioteca ficam
 * acoplados apenas pelo contrato, não pela implementação.
 */
export const CATALOG: readonly Product[] = [
  { id: "cafe", name: "Café torrado 500g", priceCents: 3290, currency: "BRL", discountPercent: 15 },
  { id: "caneca", name: "Caneca cerâmica", priceCents: 4990, currency: "BRL" },
  { id: "notebook", name: "Notebook Pro 14\"", priceCents: 899900, currency: "USD", discountPercent: 10 },
  { id: "fone", name: "Fone bluetooth", priceCents: 12900, currency: "EUR" },
];
