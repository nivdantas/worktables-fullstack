import { WeatherApiResponse } from "@repo/types";
export const fetchWeatherByCountry = async (country: string) => {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('WEATHER_API_KEY is not defined in environment variables');
  }

  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(country)}`;
  console.log(country)
  const response = await fetch(url);
  const json = await response.json();
  if (!response.ok) {
	  const errorData = json as WeatherApiResponse;
    throw new Error(errorData.error?.message || 'Failed to fetch weather data');
  }

  const data = json as WeatherApiResponse;

  return {
    location: data.location.name,
    country: data.location.country,
    temperatureCelsius: data.current.temp_c,
    condition: data.current.condition.text,
    conditionIcon: data.current.condition.icon,
    windKph: data.current.wind_kph,
    humidity: data.current.humidity
  };
};
