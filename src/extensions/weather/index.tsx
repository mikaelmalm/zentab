import { useState, useEffect } from "react";
import { useWeather } from "@/hooks/useWeather";
import { ExtensionProps } from "../types";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  CloudFog,
} from "lucide-react";

const getWeatherIcon = (code: number) => {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  if (code === 0 || code === 1)
    return <Sun className="text-yellow-400" size={24} />;
  if (code === 2 || code === 3)
    return <Cloud className="text-gray-300" size={24} />;
  if (code >= 45 && code <= 48)
    return <CloudFog className="text-gray-400" size={24} />;
  if (code >= 51 && code <= 67)
    return <CloudRain className="text-blue-300" size={24} />;
  if (code >= 71 && code <= 77)
    return <CloudSnow className="text-white" size={24} />;
  if (code >= 80 && code <= 82)
    return <CloudRain className="text-blue-400" size={24} />;
  if (code >= 85 && code <= 86)
    return <CloudSnow className="text-white" size={24} />;
  if (code >= 95 && code <= 99)
    return <CloudLightning className="text-purple-400" size={24} />;
  return <Sun className="text-yellow-400" size={24} />;
};

export default function WeatherExtension({ settings }: ExtensionProps) {
  const { city, dateFormat } = settings;
  const { weather, loading, error } = useWeather(city);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    if (dateFormat === "short") {
      // 15/12
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      });
    } else if (dateFormat === "long") {
      // 15th December
      const day = date.getDate();
      const month = date.toLocaleDateString("en-GB", { month: "long" });

      let suffix = "th";
      if (day > 3 && day < 21) suffix = "th";
      else {
        switch (day % 10) {
          case 1:
            suffix = "st";
            break;
          case 2:
            suffix = "nd";
            break;
          case 3:
            suffix = "rd";
            break;
          default:
            suffix = "th";
            break;
        }
      }
      return `${day}${suffix} ${month}`;
    }
    return "";
  };

  if (!settings.enabled) return null;

  return (
    <div
      className={`mt-4 flex items-center justify-center gap-4 text-white/80 transition-opacity duration-500 ${
        loading ? "opacity-50" : "opacity-100"
      }`}
    >
      <span className="text-xl font-medium drop-shadow-md">
        {formatDate(date)}
      </span>

      {city && !error && (
        <div className="flex items-center gap-2">
          {weather && (
            <>
              <div className="w-[1px] h-6 bg-white/30 mx-2"></div>
              {getWeatherIcon(weather.weatherCode)}
              <span className="text-xl font-medium">
                {Math.round(weather.temperature)}°C
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
