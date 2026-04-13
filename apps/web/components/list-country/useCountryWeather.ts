"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import type { WeatherResponse as WeatherData } from "@repo/types";
import { COUNTRIES_QUERY, fetchCountries, fetchWeather } from "./api";
import type { Country } from "./types";
import { formatRequestedPlace } from "./utils";

interface UseCountryWeatherResult {
  searchValue: string;
  setSearchValue: (value: string) => void;
  isModalOpen: boolean;
  closeModal: () => void;
  countries: Country[];
  filteredCountries: Country[];
  countriesError: Error | undefined;
  isCountriesLoading: boolean;
  weatherData: WeatherData | undefined;
  weatherError: Error | undefined;
  weatherErrorMessage: string | null;
  isWeatherLoading: boolean;
  selectedCountry: Country | null;
  selectedLocationQuery: string | null;
  requestedPlace: string;
  handleCountryClick: (country: Country) => void;
}

const WEATHER_API_BASE_URL = "http://localhost:3001";

export default function useCountryWeather(): UseCountryWeatherResult {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedLocationQuery, setSelectedLocationQuery] = useState<string | null>(null);

  const {
    data: countries = [],
    error: countriesError,
    isLoading: isCountriesLoading,
  } = useSWR<Country[]>(COUNTRIES_QUERY, fetchCountries);
  const isAntarcticaQuery = useMemo(
    () => selectedLocationQuery?.trim().toLowerCase() === "antarctica",
    [selectedLocationQuery]
  );

  const weatherUrl =
    isModalOpen && selectedLocationQuery && !isAntarcticaQuery
      ? `${WEATHER_API_BASE_URL}/api/weather/${encodeURIComponent(selectedLocationQuery)}`
      : null;

  const {
    data: weatherData,
    error: weatherError,
    isLoading: isWeatherLoading,
  } = useSWR<WeatherData>(weatherUrl, fetchWeather);

  const weatherErrorMessage =
    isModalOpen && isAntarcticaQuery
      ? "Antarctica doesn't have weather data on WeatherAPI."
      : (weatherError as Error | undefined)?.message ?? null;

  const filteredCountries = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) return countries;

    return countries.filter((country) => {
      const countryName = country.name.toLowerCase();
      const capitalName = country.capital?.toLowerCase() ?? "";
      const regionName = country.region?.toLowerCase() ?? "";
      const subregionName = country.subregion?.toLowerCase() ?? "";
      return (
        countryName.includes(normalizedSearch) ||
        capitalName.includes(normalizedSearch) ||
        regionName.includes(normalizedSearch) ||
        subregionName.includes(normalizedSearch)
      );
    });
  }, [countries, searchValue]);

  const handleCountryClick = (country: Country) => {
    const locationQuery = formatRequestedPlace(country.name, country.capital ?? null);
    setSelectedCountry(country);
    setSelectedLocationQuery(locationQuery);
    setIsModalOpen(true);
  };

  const requestedPlace = useMemo(() => {
    if (selectedLocationQuery) return selectedLocationQuery;
    if (weatherData) return `${weatherData.location}, ${weatherData.country}`;
    return "";
  }, [selectedLocationQuery, weatherData]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCountry(null);
    setSelectedLocationQuery(null);
  };

  return {
    searchValue,
    setSearchValue,
    isModalOpen,
    closeModal,
    countries,
    filteredCountries,
    countriesError: countriesError as Error | undefined,
    isCountriesLoading,
    weatherData,
    weatherError: weatherError as Error | undefined,
    weatherErrorMessage,
    isWeatherLoading,
    selectedCountry,
    selectedLocationQuery,
    requestedPlace,
    handleCountryClick,
  };
}
