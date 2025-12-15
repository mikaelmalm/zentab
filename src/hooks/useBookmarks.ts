import { useState, useEffect, useCallback } from 'react';
import { AppState, Category, Settings, Collection } from '@/types';

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

export const useBookmarks = () => {
  const [data, setData] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // Simple schema check - if no collections, reset to default (Breaking Change as requested)
        if (!parsed.collections || !Array.isArray(parsed.collections)) {
           console.warn('Old data format detected. Resetting to default state.');
           setData(DEFAULT_STATE);
        } else {
           // Migration for Edit Mode
           if (parsed.settings && 'isCleanMode' in parsed.settings) {
              parsed.settings.isEditMode = !parsed.settings.isCleanMode;
              delete parsed.settings.isCleanMode;
           }
           
           setData(parsed);
        }
      } catch (e) {
        console.error('Failed to parse local storage', e);
        setData(DEFAULT_STATE);
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

  // --- Collection Management ---

  const addCollection = useCallback((title: string) => {
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      title,
      categories: [],
    };
    setData((prev) => ({
      ...prev,
      collections: [...prev.collections, newCollection],
      activeCollectionId: newCollection.id, // Auto-switch to new collection
    }));
  }, []);

  const removeCollection = useCallback((id: string) => {
    setData((prev) => {
      // Prevent deleting the last collection
      if (prev.collections.length <= 1) {
        return prev; 
      }
      
      const newCollections = prev.collections.filter(c => c.id !== id);
      // If we deleted the active collection, switch to the first one available
      let newActiveId = prev.activeCollectionId;
      if (id === prev.activeCollectionId) {
        newActiveId = newCollections[0].id;
      }
      
      return {
        ...prev,
        collections: newCollections,
        activeCollectionId: newActiveId,
      };
    });
  }, []);

  const renameCollection = useCallback((id: string, newTitle: string) => {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map(c => 
        c.id === id ? { ...c, title: newTitle } : c
      ),
    }));
  }, []);
  
  const setActiveCollection = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      activeCollectionId: id,
    }));
  }, []);

  // --- Category Management (Operates on Active Collection) ---

  const addCategory = useCallback((title: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      title,
      bookmarks: [],
    };
    
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map(col => {
        if (col.id === prev.activeCollectionId) {
          return {
            ...col,
            categories: [...col.categories, newCategory]
          };
        }
        return col;
      })
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map(col => {
        if (col.id === prev.activeCollectionId) {
          return {
            ...col,
            categories: col.categories.filter((c) => c.id !== id)
          };
        }
        return col;
      })
    }));
  }, []);

  const updateCategory = useCallback((id: string, title: string) => {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map(col => {
        if (col.id === prev.activeCollectionId) {
          return {
            ...col,
            categories: col.categories.map((cat) => 
              cat.id === id ? { ...cat, title } : cat
            )
          };
        }
        return col;
      })
    }));
  }, []);

  const reorderCategories = useCallback((startIndex: number, endIndex: number) => {
    setData((prev) => {
      // Find active collection
      const activeCol = prev.collections.find(c => c.id === prev.activeCollectionId);
      if (!activeCol) return prev; // Should not happen

      const newCategories = [...activeCol.categories];
      const [removed] = newCategories.splice(startIndex, 1);
      newCategories.splice(endIndex, 0, removed);

      return {
        ...prev,
        collections: prev.collections.map(col => 
          col.id === prev.activeCollectionId 
            ? { ...col, categories: newCategories } 
            : col
        )
      };
    });
  }, []);

  // --- Bookmark Management (Operates on Active Collection) ---

  const addBookmark = useCallback((categoryId: string, title: string, url: string, icon?: string) => {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map(col => {
        if (col.id === prev.activeCollectionId) {
          return {
            ...col,
            categories: col.categories.map(cat => {
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
            })
          };
        }
        return col;
      })
    }));
  }, []);

  const deleteBookmark = useCallback((categoryId: string, bookmarkId: string) => {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map(col => {
        if (col.id === prev.activeCollectionId) {
           return {
             ...col,
             categories: col.categories.map(cat => {
               if (cat.id === categoryId) {
                 return {
                   ...cat,
                   bookmarks: cat.bookmarks.filter(b => b.id !== bookmarkId)
                 };
               }
               return cat;
             })
           };
        }
        return col;
      })
    }));
  }, []);

  const updateBookmark = useCallback((categoryId: string, bookmarkId: string, updates: Partial<Category['bookmarks'][0]>) => {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map(col => {
        if (col.id === prev.activeCollectionId) {
          return {
            ...col,
            categories: col.categories.map(cat => {
              if (cat.id === categoryId) {
                return {
                  ...cat,
                  bookmarks: cat.bookmarks.map(b => 
                    b.id === bookmarkId ? { ...b, ...updates } : b
                  )
                };
              }
              return cat;
            })
          };
        }
        return col;
      })
    }));
  }, []);

  const moveBookmark = useCallback((bookmarkId: string, sourceCategoryId: string, targetCategoryId: string, newIndex: number) => {
    setData((prev) => {
      // Find active collection
      const activeColIndex = prev.collections.findIndex(c => c.id === prev.activeCollectionId);
      if (activeColIndex === -1) return prev; 
      
      const activeCol = prev.collections[activeColIndex];
      const sourceCatIndex = activeCol.categories.findIndex(c => c.id === sourceCategoryId);
      const targetCatIndex = activeCol.categories.findIndex(c => c.id === targetCategoryId);
      
      if (sourceCatIndex === -1 || targetCatIndex === -1) return prev;

      const sourceCat = activeCol.categories[sourceCatIndex];
      const targetCat = activeCol.categories[targetCatIndex];
      
      const bookmarkIndex = sourceCat.bookmarks.findIndex(b => b.id === bookmarkId);
      if (bookmarkIndex === -1) return prev;

      const bookmark = sourceCat.bookmarks[bookmarkIndex];
      
      // Create new copies
      const newSourceBookmarks = [...sourceCat.bookmarks];
      newSourceBookmarks.splice(bookmarkIndex, 1);
      
      const newTargetBookmarks = sourceCategoryId === targetCategoryId 
        ? newSourceBookmarks 
        : [...targetCat.bookmarks];
        
      // Insert at new index
      newTargetBookmarks.splice(newIndex, 0, bookmark);
      
      // Update categories
      const newCategories = [...activeCol.categories];
      newCategories[sourceCatIndex] = { ...sourceCat, bookmarks: newSourceBookmarks };
      newCategories[targetCatIndex] = { ...targetCat, bookmarks: newTargetBookmarks };
      
      // Update collection
      const newCollections = [...prev.collections];
      newCollections[activeColIndex] = { ...activeCol, categories: newCategories };
      
      return {
        ...prev,
        collections: newCollections
      };
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  // --- Import/Export ---

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zentab-backup-${new Date().toISOString().split('T')[0]}.json`;
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
  }, []);

  // Compute active categories for consumption by components
  const activeCollection = data.collections.find(c => c.id === data.activeCollectionId) || data.collections[0];
  const activeCategories = activeCollection ? activeCollection.categories : [];

  return {
    data,
    activeCategories, 
    activeCollectionId: data.activeCollectionId,
    collections: data.collections,
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
    addCollection,
    removeCollection,
    renameCollection,
    setActiveCollection,
    moveBookmark,
  };
};
