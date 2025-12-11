import { CollectionTabs } from "@/components/layout/CollectionTabs";
import { SettingsModal } from "@/components/SettingsModal";
import { TimeDisplay } from "@/components/TimeDisplay";
import { BookmarkGrid } from "@/components/bookmark/container/BookmarkGrid";
import { useBookmarks } from "@/hooks/useBookmarks";

import { useState } from "react";

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
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
      
      {/* Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all opacity-40 hover:opacity-100 focus:opacity-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>

      {/* Search Bar */}
      {(settings.isSearchEnabled ?? true) && (
        <div className="relative z-10 max-w-2xl mx-auto mb-12 pt-20">
          <input
            type="text"
            placeholder="Search Google..."
            className="w-full px-6 py-4 text-lg rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 shadow-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const query = e.currentTarget.value.trim();
                if (query) {
                   window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                }
              }
            }}
          />
        </div>
      )}


      {/* Time & Date */}
      <div className="relative z-10 mb-12 mt-12">
        <TimeDisplay 
          userName={settings.userName}
          is24HourFormat={settings.is24HourFormat ?? true}
          city={settings.weatherCity}
          size={settings.timeDisplaySize}
        />
      </div>

      {/* Bookmarks Grid */}
      <div className="relative z-10">
        <BookmarkGrid 
          categories={activeCategories}
          onAddCategory={addCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
          onAddBookmark={addBookmark}
          onUpdateBookmark={updateBookmark}
          onDeleteBookmark={deleteBookmark}
          onReorderCategories={reorderCategories}
          onMoveBookmark={moveBookmark}
          isCleanMode={settings.isCleanMode}
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
        isCleanMode={settings.isCleanMode}
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
