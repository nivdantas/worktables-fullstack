import mondaySdk from "monday-sdk-js";
import type { WeatherResponse as WeatherData } from "@repo/types";
import type { Country, MondayApiResponse, MondayItem } from "./types";
import {
  cleanNullableText,
  findColumnByTitle,
  parseNumericValue,
} from "./utils";

const monday = mondaySdk();

export const COUNTRIES_QUERY = `
  query {
    boards(ids: 9343551951) {
      columns {
        id
        title
      }
      items_page(limit: 300) {
        items {
          id
          name
          column_values {
            id
            text
          }
        }
      }
    }
  }
`;

const getColumnText = (
  item: MondayItem,
  columnId: string | undefined
): string | null => {
  if (!columnId) return null;
  const raw = item.column_values.find((cv) => cv.id === columnId)?.text;
  return cleanNullableText(raw);
};

const mapItemToCountry = (
  item: MondayItem,
  columnIds: {
    region?: string;
    subregion?: string;
    capital?: string;
    population?: string;
    area?: string;
    currency?: string;
    currencyName?: string;
  }
): Country => {
  const name = cleanNullableText(item.name) ?? item.name;

  return {
    id: item.id,
    name,
    region: getColumnText(item, columnIds.region),
    subregion: getColumnText(item, columnIds.subregion),
    capital: getColumnText(item, columnIds.capital),
    population: parseNumericValue(getColumnText(item, columnIds.population)),
    area: parseNumericValue(getColumnText(item, columnIds.area)),
    currency: getColumnText(item, columnIds.currency),
    currencyName: getColumnText(item, columnIds.currencyName),
  };
};

export const fetchCountries = async (
  query: string = COUNTRIES_QUERY
): Promise<Country[]> => {
  const response = (await monday.api(query)) as MondayApiResponse;
  const board = response?.data?.boards?.[0];

  if (!board?.items_page?.items || !board?.columns) {
    throw new Error("Failed to fetch countries");
  }

  const columnIds = {
    region: findColumnByTitle(board.columns, "Region")?.id,
    subregion: findColumnByTitle(board.columns, "Subregion")?.id,
    capital: findColumnByTitle(board.columns, "Capital")?.id,
    population: findColumnByTitle(board.columns, "Population")?.id,
    area: findColumnByTitle(board.columns, "Area")?.id,
    currency: findColumnByTitle(board.columns, "Currency")?.id,
    currencyName: findColumnByTitle(board.columns, "Currency Name")?.id,
  };

  return board.items_page.items.map((item: MondayItem) =>
    mapItemToCountry(item, columnIds)
  );
};

export const fetchWeather = async (url: string): Promise<WeatherData> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return (await response.json()) as WeatherData;
};