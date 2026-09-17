import { describe, expect, it } from "vitest";
import { applyDiscount, formatPrice } from "./money";

/**
 * O Intl.NumberFormat separa o simbolo da moeda do numero usando espacos
 * "especiais" (NBSP U+00A0 ou narrow NBSP U+202F). Normalizamos para um
 * espaco comum para que as assercoes fiquem legiveis e estaveis.
 */
function normalize(value: string): string {
  return value.replace(/[\u00A0\u202F]/g, " ");
}

describe("formatPrice", () => {
  it("formata BRL positivo", () => {
    expect(normalize(formatPrice(1990, "BRL"))).toBe("R$ 19,90");
  });

  it("formata USD negativo", () => {
    expect(normalize(formatPrice(-1990, "USD"))).toBe("-$19.90");
  });

  it("lanca erro para valores nao finitos", () => {
    expect(() => formatPrice(Number.NaN, "USD")).toThrow(RangeError);
  });
});

describe("applyDiscount", () => {
  it("aplica o desconto no caso base", () => {
    expect(applyDiscount(1000, 20)).toBe(800);
  });

  it("retorna o valor original com 0%", () => {
    expect(applyDiscount(3290, 0)).toBe(3290);
  });

  it("zera o valor com 100%", () => {
    expect(applyDiscount(3290, 100)).toBe(0);
  });

  it("arredonda para o inteiro mais proximo", () => {
    // 1990 * 0,85 = 1691,5 => arredonda para 1692
    expect(applyDiscount(1990, 15)).toBe(1692);
  });

  it("lanca erro para cents nao finito", () => {
    expect(() => applyDiscount(Number.NaN, 10)).toThrow(RangeError);
  });

  it("lanca erro para percent nao finito", () => {
    expect(() => applyDiscount(1000, Number.POSITIVE_INFINITY)).toThrow(
      RangeError,
    );
  });
});
