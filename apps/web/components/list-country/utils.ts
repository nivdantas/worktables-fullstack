import type { MondayColumn } from "./types";

const TEXT_REGEX = /[ÃÂ]/;
const DIACRITICS_REGEX = /[\u0300-\u036f]/g;
const NON_NUMERIC_REGEX = /[^0-9,.\-]/g;

export const fixText = (text: string): string => {
  if (!text || !TEXT_REGEX.test(text)) return text;

  try {
    const bytes = Uint8Array.from(text, (char) => char.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return text;
  }
};

export const normalizeText = (value: string): string =>
  fixText(value)
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .toLowerCase()
    .trim();

export const cleanNullableText = (
  value: string | null | undefined
): string | null => {
  if (!value) return null;
  const cleaned = fixText(value).trim();
  return cleaned.length > 0 ? cleaned : null;
};

export const parseNumericValue = (
  value: string | null | undefined
): number | null => {
  const cleaned = cleanNullableText(value);
  if (!cleaned) return null;

  const normalized = cleaned.replace(NON_NUMERIC_REGEX, "");
  if (!normalized) return null;

  const commaCount = (normalized.match(/,/g) || []).length;
  const dotCount = (normalized.match(/\./g) || []).length;

  let canonical = normalized;

  // "1.234,56"
  if (commaCount === 1 && dotCount >= 1) {
    canonical = normalized.replace(/\./g, "").replace(",", ".");
  }
  // "1,234.56"
  else if (dotCount === 1 && commaCount >= 1) {
    canonical = normalized.replace(/,/g, "");
  }
  // "123,45", "1,234"
  else if (commaCount >= 1 && dotCount === 0) {
    canonical =
      commaCount === 1
        ? normalized.replace(",", ".")
        : normalized.replace(/,/g, "");
  }

  const parsed = Number(canonical);
  return Number.isFinite(parsed) ? parsed : null;
};

export const findColumnByTitle = (
  columns: MondayColumn[],
  title: string
): MondayColumn | undefined => {
  const target = normalizeText(title);
  return columns.find((col) => normalizeText(col.title) === target);
};

export const findColumnByTitleIncludes = (
  columns: MondayColumn[],
  titlePart: string
): MondayColumn | undefined => {
  const target = normalizeText(titlePart);
  return columns.find((col) => normalizeText(col.title).includes(target));
};

export const formatRequestedPlace = (
  countryName: string,
  capital: string | null
): string => (capital && capital.length > 0 ? `${capital}, ${countryName}` : countryName);
