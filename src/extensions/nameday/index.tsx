import { useEffect, useState } from 'react';
import { ExtensionProps } from '../types';



export default function NamedayExtension({ settings }: ExtensionProps) {
  const [namedays, setNamedays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!settings.enabled) return;

    const fetchNameday = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        
        const response = await fetch(`https://sholiday.faboul.se/dagar/v2.1/${year}/${month}/${day}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        // Structure: { dagar: [ { namnsdag: ["Name1", "Name2"] } ] }
        const names = data.dagar?.[0]?.namnsdag;
        
        if (Array.isArray(names)) {
            setNamedays(names);
        }
        setLoading(false);
      } catch (err) {
        console.error('Nameday extension error:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchNameday();
  }, [settings.enabled]);

  if (!settings.enabled) return null;
  if (loading) return null;
  if (error) return null;

  return (
    <div className="mt-4 flex flex-col items-center justify-center text-white/60 animate-in fade-in duration-700">
      <div className="text-sm font-medium tracking-wide uppercase opacity-70 mb-1">Today's Nameday</div>
      <div className="text-lg font-light flex gap-2">
        {namedays.map((name, index) => (
          <span key={name}>
            {name}{index < namedays.length - 1 ? ',' : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
