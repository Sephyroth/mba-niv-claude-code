import { describe, expect, it } from "vitest";
import { formatPrice } from "./format";

/**
 * O Intl.NumberFormat separa o simbolo da moeda do numero usando espacos
 * "especiais" (NBSP U+00A0 ou narrow NBSP U+202F). Normalizamos para um
 * espaco comum para que as assercoes fiquem legiveis e estaveis.
 */
function normalize(value: string): string {
  return value.replace(/[  ]/g, " ");
}

describe("formatPrice", () => {
  describe("BRL", () => {
    it("formata um valor positivo", () => {
      expect(normalize(formatPrice(1990, "BRL"))).toBe("R$ 19,90");
    });

    it("formata zero", () => {
      expect(normalize(formatPrice(0, "BRL"))).toBe("R$ 0,00");
    });

    it("formata um valor negativo", () => {
      expect(normalize(formatPrice(-1990, "BRL"))).toBe("-R$ 19,90");
    });

    it("formata milhares com separador", () => {
      expect(normalize(formatPrice(1234567, "BRL"))).toBe("R$ 12.345,67");
    });
  });

  describe("USD", () => {
    it("formata um valor positivo", () => {
      expect(normalize(formatPrice(1990, "USD"))).toBe("$19.90");
    });

    it("formata zero", () => {
      expect(normalize(formatPrice(0, "USD"))).toBe("$0.00");
    });

    it("formata um valor negativo", () => {
      expect(normalize(formatPrice(-1990, "USD"))).toBe("-$19.90");
    });

    it("formata milhares com separador", () => {
      expect(normalize(formatPrice(1234567, "USD"))).toBe("$12,345.67");
    });
  });

  it("arredonda a divisao por 100 conforme as regras da moeda", () => {
    expect(normalize(formatPrice(199, "USD"))).toBe("$1.99");
    expect(normalize(formatPrice(1, "USD"))).toBe("$0.01");
  });

  it("lanca erro para valores nao finitos", () => {
    expect(() => formatPrice(Number.NaN, "USD")).toThrow(RangeError);
    expect(() => formatPrice(Number.POSITIVE_INFINITY, "BRL")).toThrow(
      RangeError,
    );
  });
});
