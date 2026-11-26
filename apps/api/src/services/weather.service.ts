import type { WeatherApiResponse } from "@repo/types";
export const fetchWeatherByCountry = async (country: string) => {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("WEATHER_API_KEY is not defined in environment variables");
  }

  const url = new URL("https://api.weatherapi.com/v1/current.json");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", country);

  const response = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) {
    throw new Error(`WeatherAPI returned HTTP ${response.status}`);
  }

  const data = (await response.json()) as WeatherApiResponse;

  return {
    location: data.location.name,
    country: data.location.country,
    temperatureCelsius: data.current.temp_c,
    condition: data.current.condition.text,
    conditionIcon: data.current.condition.icon,
    windKph: data.current.wind_kph,
    humidity: data.current.humidity,
  };
};
