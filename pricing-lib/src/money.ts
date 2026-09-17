import type { Currency } from "./types";

/**
 * Mapeia cada moeda para o locale usado na sua formatação convencional.
 * Novas moedas podem ser adicionadas aqui sem alterar a lógica de formatação.
 */
const CURRENCY_LOCALES: Record<Currency, string> = {
  BRL: "pt-BR",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

/**
 * Formata um valor monetário expresso em centavos para uma string localizada.
 *
 * @param cents    Valor em centavos (inteiro). Ex.: 1990 => 19,90.
 * @param currency Código ISO 4217 da moeda (ex.: "BRL", "USD").
 * @returns A representação formatada da moeda (ex.: "R$ 19,90", "-$5.00").
 */
export function formatPrice(cents: number, currency: Currency): string {
  if (!Number.isFinite(cents)) {
    throw new RangeError(`cents deve ser um número finito, recebido: ${cents}`);
  }

  const locale = CURRENCY_LOCALES[currency] ?? "en-US";
  const amount = cents / 100;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Aplica um desconto percentual sobre um valor em centavos.
 *
 * @param cents   Valor original em centavos (inteiro). Ex.: 1990 => 19,90.
 * @param percent Percentual de desconto (0–100). Ex.: 15 => aplica -15%.
 * @returns O valor em centavos já com o desconto, arredondado para inteiro.
 */
export function applyDiscount(cents: number, percent: number): number {
  if (!Number.isFinite(cents)) {
    throw new RangeError(`cents deve ser um número finito, recebido: ${cents}`);
  }
  if (!Number.isFinite(percent)) {
    throw new RangeError(
      `percent deve ser um número finito, recebido: ${percent}`,
    );
  }

  return Math.round(cents * (1 - percent / 100));
}
