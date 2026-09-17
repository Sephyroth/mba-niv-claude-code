/**
 * Contrato de dados público da pricing-lib. Qualquer app consumidor (ex.: a
 * storefront) importa estes tipos daqui — é a fonte da verdade do formato de um
 * produto e das moedas suportadas.
 */

/** Código ISO 4217 das moedas suportadas. */
export type Currency = "BRL" | "USD" | "EUR" | "GBP";

/** Um produto. Preços sempre em centavos (inteiro) para evitar float. */
export interface Product {
  id: string;
  name: string;
  /** Preço em centavos. Ex.: 1990 => 19,90. */
  priceCents: number;
  currency: Currency;
  /** Percentual de desconto opcional, inteiro de 0 a 100. Ex.: 15 => -15%. */
  discountPercent?: number;
}
