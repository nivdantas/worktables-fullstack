import { expect, test } from "bun:test";
import { fixText, parseNumericValue } from "../apps/web/components/list-country/utils";

test("repairs mojibake while preserving valid country and capital names", () => {
  expect(fixText("SÃ£o Paulo")).toBe("São Paulo");
  expect(fixText("SÃO TOMÉ")).toBe("SÃO TOMÉ");
  expect(fixText("SÃ£o 東京")).toBe("SÃ£o 東京");
});

test("parses mixed separators in both orders", () => {
  expect(parseNumericValue("1,234.56")).toBe(1234.56);
  expect(parseNumericValue("1.234,56")).toBe(1234.56);
  expect(parseNumericValue("1.234.567,89")).toBe(1234567.89);
  expect(parseNumericValue("1,234,567.89")).toBe(1234567.89);
});
