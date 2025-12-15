import { useCallback } from 'react';
import { AppState, Settings } from '@/types';

export const useSettings = ( data: AppState, setData: React.Dispatch<React.SetStateAction<AppState>> ) => {
  
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, [setData]);

  return {
    settings: data.settings,
    updateSettings,
  };
};
