import { CollectionTabs } from "@/components/layout/CollectionTabs";
import { SettingsModal } from "@/components/SettingsModal";
import { TimeDisplay } from "@/components/TimeDisplay";
import { BookmarkGrid } from "@/components/bookmark/container/BookmarkGrid";
import { SearchBar } from "@/components/SearchBar";
import { useBookmarks } from "@/hooks/useBookmarks";
import Fuse from "fuse.js";
import { getExtensions } from "@/extensions/registry";

import { useState, useMemo } from "react";

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { 
    data, 
    activeCategories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addBookmark, 
    updateBookmark, 
    deleteBookmark, 
    moveBookmark,
    reorderCategories,
    updateSettings, 
    exportData, 
    importData,
    isLoaded,
    setActiveCollection,
    addCollection,
    renameCollection,
    removeCollection,
  } = useBookmarks();

  const settings = data.settings;

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return activeCategories;

    return activeCategories.map(cat => {
       // Search within bookmarks
       const fuse = new Fuse(cat.bookmarks, {
          keys: ['title', 'url'],
          threshold: 0.4,
       });
       
       const results = fuse.search(searchQuery);
       const filteredBookmarks = results.map(r => r.item);
       
       return {
         ...cat,
         bookmarks: filteredBookmarks
       };
    }).filter(cat => cat.bookmarks.length > 0);
  }, [activeCategories, searchQuery]);

const extensions = getExtensions();

  if (!isLoaded) return null; // or a loading spinner

  return (
    <main className={`min-h-screen p-8 relative transition-colors duration-700 ${!settings.backgroundImageUrl ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' : 'bg-black'}`}>
      {settings.backgroundImageUrl && (
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center transition-opacity duration-700"
          style={{ 
            backgroundImage: `url(${settings.backgroundImageUrl})`,
            opacity: (settings.backgroundOpacity ?? 50) / 100
          }} 
        />
      )}
      

      <div className="relative sm:top-6 sm:right-6 sm:fixed z-50 flex gap-2 flex-row justify-end">
        {/* Edit Mode Toggle */}
        <button
          onClick={() => updateSettings({ isEditMode: !settings.isEditMode })}
          className={`p-2 rounded-full backdrop-blur-md border transition-all ${
          settings.isEditMode 
            ? "bg-white text-black border-white opacity-100" 
            : "bg-white/10 border-white/20 text-white opacity-40 hover:opacity-100 hover:bg-white/20"
        }`}
        title={settings.isEditMode ? "Finish Editing" : "Edit Mode"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        </svg>
      </button>

      {/* Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="p-2 rounded-full backdrop-blur-md border transition-all bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all opacity-40 hover:opacity-100 focus:opacity-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0-.73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>

      </div>


      {/* Time & Date */}
      <div className="relative z-10 mb-12 mt-12 flex flex-col items-center">
        <TimeDisplay 
          userName={settings.userName}
          is24HourFormat={settings.is24HourFormat ?? true}
          city={settings.weatherCity}
          size={settings.timeDisplaySize}
          dateFormat={settings.dateFormat}
        />
        
        {/* Render Extensions */}
        {extensions.map(ext => {
           const extSettings = settings.extensionSettings?.[ext.id] ?? ext.defaultSettings;
           const Component = ext.component;
           return <Component key={ext.id} settings={extSettings} />;
        })}
      </div>

      {/* Search Bar */}
      {(settings.isSearchEnabled ?? true) && (
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
        />
      )}
      {/* Bookmarks Grid */}
      <div className="relative z-10">
        <BookmarkGrid 
          categories={filteredCategories}
          onAddCategory={addCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
          onAddBookmark={addBookmark}
          onUpdateBookmark={updateBookmark}
          onDeleteBookmark={deleteBookmark}
          onReorderCategories={reorderCategories}
          onMoveBookmark={moveBookmark}
          isEditMode={settings.isEditMode}
          isSearchActive={!!searchQuery.trim()}
        />
      </div>


      {/* Collection Tabs */}
      <CollectionTabs 
        collections={data.collections}
        activeCollectionId={data.activeCollectionId}
        onSelectCollection={setActiveCollection}
        onAddCollection={addCollection}
        onRenameCollection={renameCollection}
        onDeleteCollection={removeCollection}
        isEditMode={settings.isEditMode}
      />
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onImport={importData}
        onExport={exportData}
      />
    </main>
  );
}

export default App;
