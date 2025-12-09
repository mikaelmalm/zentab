"use client";

import { useState } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { TimeDisplay } from '@/components/TimeDisplay';
import { BookmarkGrid } from '@/components/bookmark/container/BookmarkGrid';
import { SettingsModal } from '@/components/SettingsModal';
import { CollectionTabs } from '@/components/CollectionTabs';
import { useWeather } from '@/hooks/useWeather';
import { Settings } from '@/types';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Home() {
  const { 
    data, 
    activeCategories,
    activeCollectionId,
    collections,
    isLoaded, 
    addCategory, 
    deleteCategory, 
    addBookmark, 
    deleteBookmark, 
    updateSettings,
    updateBookmark,
    updateCategory,
    reorderCategories,
    importData, 
    exportData,
    addCollection,
    removeCollection,
    renameCollection,
    setActiveCollection,
    moveBookmark,
  } = useBookmarks();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!isLoaded) return null; // Or a loading spinner

  const bgStyle = data.settings.backgroundImageUrl 
    ? { backgroundImage: `url(${data.settings.backgroundImageUrl})` }
    : {}; // Fallback handled by CSS classes

  // Dynamic max-height based on TimeDisplay size
  const getMaxHeight = () => {
     switch(data.settings.timeDisplaySize) {
        case 'small': return '60vh';
        case 'large': return '50vh';
        case 'medium': 
        default: return '55vh';
     }
  };

  return (
    <main 
      className={`min-h-screen w-full relative overflow-hidden transition-all duration-700 bg-cover bg-center ${!data.settings.backgroundImageUrl ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' : ''}`}
      style={bgStyle}
    >
      {/* Overlay for better text readability */}
      <div 
        className="absolute inset-0 bg-black backdrop-blur-[2px] transition-all duration-300"
        style={{ opacity: (data.settings.backgroundOpacity ?? 0) / 100 }} 
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Space / Time Area */}
        <div className="flex-1 flex items-center justify-center p-8 pb-16">
          <TimeDisplay 
            userName={data.settings.userName} 
            is24HourFormat={data.settings.is24HourFormat} 
            city={data.settings.weatherCity}
            size={data.settings.timeDisplaySize}
          />
        </div>

        {/* Bottom Area / Bookmarks */}
        <div 
          className="pb-24 px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent mask-gradient transition-all duration-500"
          style={{ 
             maxHeight: getMaxHeight(),
             maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' 
          }}
        >
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
             isCleanMode={data.settings.isCleanMode}
           />
        </div>

        {/* Settings Button */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="absolute bottom-6 left-6 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition-all backdrop-blur-md"
        >
          <SettingsIcon size={24} />
        </button>

        {/* Collection Tabs */}
        <CollectionTabs 
          collections={collections}
          activeCollectionId={activeCollectionId}
          onSetActive={setActiveCollection}
          onAdd={addCollection}
          onRename={renameCollection}
          onDelete={removeCollection}
          isCleanMode={data.settings.isCleanMode || false}
        />

      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={data.settings}
        onUpdateSettings={updateSettings}
        onImport={importData}
        onExport={exportData}
      />
    </main>
  );
}
