import { useState, useEffect, useCallback } from 'react';
import { AppState, Category, Settings } from '@/types';

const STORAGE_KEY = 'malmentum_data';

const DEFAULT_STATE: AppState = {
  categories: [
    {
      id: 'default',
      title: 'General',
      bookmarks: [],
    },
  ],
  settings: {
    is24HourFormat: false,
    isCleanMode: false,
    backgroundOpacity: 0
  },
};

export const useBookmarks = () => {
  const [data, setData] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Simple validation or merging could go here
        setData(parsed);
      } catch (e) {
        console.error('Failed to parse local storage', e);
      }
    }
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const addCategory = useCallback((title: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      title,
      bookmarks: [],
    };
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
  }, []);

  const addBookmark = useCallback((categoryId: string, title: string, url: string, icon?: string) => {
    setData((prev) => {
      const newCategories = prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            bookmarks: [
              ...cat.bookmarks,
              { id: crypto.randomUUID(), title, url, icon },
            ],
          };
        }
        return cat;
      });
      return { ...prev, categories: newCategories };
    });
  }, []);

  const deleteBookmark = useCallback((categoryId: string, bookmarkId: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            bookmarks: cat.bookmarks.filter((b) => b.id !== bookmarkId),
          };
        }
        return cat;
      }),
    }));
  }, []);

  const updateCategory = useCallback((id: string, title: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => 
        cat.id === id ? { ...cat, title } : cat
      ),
    }));
  }, []);

  const reorderCategories = useCallback((startIndex: number, endIndex: number) => {
    setData((prev) => {
      const result = [...prev.categories];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...prev, categories: result };
    });
  }, []);

  const updateBookmark = useCallback((categoryId: string, bookmarkId: string, updates: Partial<Category['bookmarks'][0]>) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            bookmarks: cat.bookmarks.map((b) => {
              if (b.id === bookmarkId) {
                return { ...b, ...updates };
              }
              return b;
            }),
          };
        }
        return cat;
      }),
    }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `malmentum-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result) as AppState;
        // Basic validation
        if (parsed.categories && Array.isArray(parsed.categories)) {
          setData(parsed);
        } else {
          alert('Invalid file structure');
        }
      } catch (err) {
        console.error('Import failed', err);
        alert('Failed to parse file');
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    data,
    isLoaded,
    addCategory,
    updateCategory,
    deleteCategory,
    addBookmark,
    deleteBookmark,
    updateBookmark,
    reorderCategories,
    updateSettings,
    exportData,
    importData,
  };
};
