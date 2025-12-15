import { useState, useEffect } from 'react';
import { AppState } from '@/types';

const STORAGE_KEY = 'zentab_data';

const DEFAULT_COLLECTION_ID = 'default-collection';

const DEFAULT_STATE: AppState = {
  collections: [
    {
      id: DEFAULT_COLLECTION_ID,
      title: 'My Bookmarks',
      categories: [
        {
          id: 'default',
          title: 'General',
          bookmarks: [],
        },
      ],
    },
  ],
  activeCollectionId: DEFAULT_COLLECTION_ID,
  settings: {
    is24HourFormat: false,
    isEditMode: false,
    isSearchEnabled: true,
    backgroundOpacity: 0,
    timeDisplaySize: 'medium',
    dateFormat: 'short',
    extensionSettings: {},
  },
};

export const useZentabData = () => {
  const [data, setData] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // Simple schema check
        if (!parsed.collections || !Array.isArray(parsed.collections)) {
           console.warn('Old data format detected. Resetting to default state.');
           setData(DEFAULT_STATE);
        } else {
           setData(parsed);
        }
      } catch (e) {
        console.error('Failed to parse local storage', e);
        setData(DEFAULT_STATE);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zentab-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result) as AppState;
        if (parsed.collections && Array.isArray(parsed.collections)) {
          setData(parsed);
        } else {
          alert('Invalid file structure. Expected collections.');
        }
      } catch (err) {
        console.error('Import failed', err);
        alert('Failed to parse file');
      }
    };
    reader.readAsText(file);
  };

  return {
    data,
    setData,
    isLoaded,
    exportData,
    importData
  };
};
