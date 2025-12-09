import { useState, useEffect } from 'react';

export interface WeatherData {
  temperature: number;
  weatherCode: number;
}

export function useWeather(city?: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!city) {
      setWeather(null);
      return;
    }

    let isMounted = true;
    const fetchWeather = async () => {
      setLoading(true);
      setError(false);
      try {
        // 1. Geocoding
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city?.trim())}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('City not found');
        }

        const { latitude, longitude } = geoData.results[0];

        // 2. Weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();

        if (isMounted) {
          setWeather({
            temperature: weatherData.current_weather.temperature,
            weatherCode: weatherData.current_weather.weathercode,
          });
        }
      } catch {
        if (isMounted) {
          setError(true);
          setWeather(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Debounce to prevent API spam while typing
    const timeoutId = setTimeout(fetchWeather, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [city]);

  return { weather, loading, error };
}
