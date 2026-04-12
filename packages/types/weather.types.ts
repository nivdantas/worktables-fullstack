export interface WeatherApiResponse {
  location: { name: string; country: string; };
  current: { temp_c: number; condition: { text: string; icon: string; }; wind_kph: number; humidity: number; };
  error?: { message: string; };
}

export interface WeatherResponse {
  location: string;
  country: string;
  temperatureCelsius: number;
  condition: string;
  conditionIcon: string;
  windKph: number;
  humidity: number;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
}
