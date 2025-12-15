import { useCallback } from 'react';
import { AppState, Category, Collection } from '@/types';

export const useBookmarks = ( data: AppState, setData: React.Dispatch<React.SetStateAction<AppState>> ) => {

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
  }, [setData]);

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
  }, [setData]);

  const renameCollection = useCallback((id: string, newTitle: string) => {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map(c => 
        c.id === id ? { ...c, title: newTitle } : c
      ),
    }));
  }, [setData]);
  
  const setActiveCollection = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      activeCollectionId: id,
    }));
  }, [setData]);

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
  }, [setData]);

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
  }, [setData]);

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
  }, [setData]);

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
  }, [setData]);

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
  }, [setData]);

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
  }, [setData]);

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
  }, [setData]);

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
  }, [setData]);

  // Compute active categories for consumption by components
  const activeCollection = data.collections.find(c => c.id === data.activeCollectionId) || data.collections[0];
  const activeCategories = activeCollection ? activeCollection.categories : [];

  return {
    activeCategories, 
    activeCollectionId: data.activeCollectionId,
    collections: data.collections,
    addCategory,
    updateCategory,
    deleteCategory,
    addBookmark,
    deleteBookmark,
    updateBookmark,
    reorderCategories,
    addCollection,
    removeCollection,
    renameCollection,
    setActiveCollection,
    moveBookmark,
  };
};
