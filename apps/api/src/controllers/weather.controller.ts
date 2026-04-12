import { Request, Response, RequestHandler, NextFunction } from 'express';
import { fetchWeatherByCountry } from '../services/weather.service';
import { WeatherResponse, ApiErrorResponse } from '@repo/types';
export const getCountryWeather: RequestHandler<{country: string}, WeatherResponse | ApiErrorResponse> = async (
  req,
  res,
  next
) => {
  try {
    const { country } = req.params;

    if (!country) {
      res.status(400).json({ error: 'Country identifier is required' });
      return;
    }

    const weatherData = await fetchWeatherByCountry(country);
    res.status(200).json(weatherData);
  } catch (error) {
    next(error);
  }
};
