"use client";

import { useState, useEffect } from 'react';

interface TimeDisplayProps {
  userName?: string;
  is24HourFormat: boolean;
  size?: 'small' | 'medium' | 'large';
}



export const TimeDisplay = ({ userName, is24HourFormat, size = 'medium' }: TimeDisplayProps) => {
  const [time, setTime] = useState(new Date());

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
        {userName && (
        <p className={`${sizes.greeting} text-white/90 font-light tracking-wide drop-shadow-lg transition-all duration-300`}>
          {getGreeting()}, {userName}.
        </p>
        )}
        
        {/* Weather & Date Display */}

      </div>
    </div>
  );
};
