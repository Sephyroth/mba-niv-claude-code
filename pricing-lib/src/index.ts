/**
 * Ponto de entrada público da pricing-lib.
 * Tudo que os apps consumidores precisam é reexportado aqui.
 */
export type { Currency, Product } from "./types";
export { formatPrice, applyDiscount } from "./money";
