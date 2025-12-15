"use client";

import { useState, useEffect } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun, CloudFog } from 'lucide-react';

interface TimeDisplayProps {
  userName?: string;
  is24HourFormat: boolean;
  city?: string;
  size?: 'small' | 'medium' | 'large';
  dateFormat?: 'long' | 'short' | 'none';
}

const getWeatherIcon = (code: number) => {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  if (code === 0 || code === 1) return <Sun className="text-yellow-400" size={24} />;
  if (code === 2 || code === 3) return <Cloud className="text-gray-300" size={24} />;
  if (code >= 45 && code <= 48) return <CloudFog className="text-gray-400" size={24} />;
  if (code >= 51 && code <= 67) return <CloudRain className="text-blue-300" size={24} />;
  if (code >= 71 && code <= 77) return <CloudSnow className="text-white" size={24} />;
  if (code >= 80 && code <= 82) return <CloudRain className="text-blue-400" size={24} />;
  if (code >= 85 && code <= 86) return <CloudSnow className="text-white" size={24} />;
  if (code >= 95 && code <= 99) return <CloudLightning className="text-purple-400" size={24} />;
  return <Sun className="text-yellow-400" size={24} />;
};

export const TimeDisplay = ({ userName, is24HourFormat, city, size = 'medium', dateFormat = 'short' }: TimeDisplayProps) => {
  const [time, setTime] = useState(new Date());
  const { weather, loading, error } = useWeather(city);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: !is24HourFormat,
    });
  };

  const formatDate = (date: Date) => {
    if (dateFormat === 'short') {
      // 15/12
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
      });
    } else {
      // 15th December
      // Basic implementation for "th", "st", "nd", "rd"
      const day = date.getDate();
      const month = date.toLocaleDateString('en-GB', { month: 'long' });
      
      let suffix = 'th';
      if (day > 3 && day < 21) suffix = 'th';
      else {
        switch (day % 10) {
          case 1:  suffix = "st"; break;
          case 2:  suffix = "nd"; break;
          case 3:  suffix = "rd"; break;
          default: suffix = "th"; break;
        }
      }
      return `${day}${suffix} ${month}`;
    }
  };

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          time: 'text-6xl md:text-7xl',
          greeting: 'text-xl md:text-2xl',
        };
      case 'large':
        return {
          time: 'text-9xl md:text-[10rem]',
          greeting: 'text-3xl md:text-4xl',
        };
      case 'medium':
      default:
        return {
          time: 'text-8xl md:text-9xl',
          greeting: 'text-2xl md:text-3xl',
        };
    }
  };

  const sizes = getSizeClasses();

  return (
    <div className="text-center space-y-4">
      <h1 className={`${sizes.time} font-bold tracking-tight text-white drop-shadow-2xl select-none transition-all duration-300`}>
        {formatTime(time)}
      </h1>
      <div className="space-y-2">
        <p className={`${sizes.greeting} text-white/90 font-light tracking-wide drop-shadow-lg transition-all duration-300`}>
          {getGreeting()}{userName ? `, ${userName}` : ''}.
        </p>
        
        {/* Weather & Date Display */}
        <div className={`flex items-center justify-center gap-4 text-white/80 transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
           {dateFormat !== 'none' && (
             <span className="text-xl font-medium drop-shadow-md">{formatDate(time)}</span>
           )}
           
           {city && !error && (
             <div className="flex items-center gap-2">
               {weather && (
                 <>
                   {dateFormat !== 'none' && <div className="w-[1px] h-6 bg-white/30 mx-2"></div>}
                   {getWeatherIcon(weather.weatherCode)}
                   <span className="text-xl font-medium">{Math.round(weather.temperature)}°C</span>
                 </>
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
