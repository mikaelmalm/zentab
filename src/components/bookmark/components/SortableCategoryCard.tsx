import { Category, Bookmark } from '@/types';
import { Trash2, GripVertical, Plus } from 'lucide-react';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BookmarkItem } from './BookmarkItem';

interface SortableCategoryCardProps {
  category: Category;
  onUpdateCategory: (id: string, title: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddBookmark: (categoryId: string, title: string, url: string, icon?: string) => void;
  onUpdateBookmark: (categoryId: string, bookmarkId: string, updates: Partial<Bookmark>) => void;
  onDeleteBookmark: (categoryId: string, bookmarkId: string) => void;
  isCleanMode: boolean;
}

export const SortableCategoryCard = ({
  category,
  onUpdateCategory,
  onDeleteCategory,
  onAddBookmark,
  onUpdateBookmark,
  onDeleteBookmark,
  isCleanMode,
}: SortableCategoryCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIcon, setNewIcon] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newUrl.trim()) {
      let url = newUrl;
      if (!url.startsWith('http')) {
        url = `https://${url}`;
      }
      onAddBookmark(category.id, newTitle, url, newIcon.trim() || undefined);
      setIsAdding(false);
      setNewTitle('');
      setNewUrl('');
      setNewIcon('');
    }
  };

  // Determine if we should show the header
  // In Clean Mode: Hide if title is empty.
  // In Edit Mode: Always show (use placeholder if empty).
  const showHeader = !isCleanMode || category.title.trim().length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-white shadow-xl transition-colors hover:bg-white/15 h-fit ${!showHeader ? 'pt-2' : ''}`}
    >
      {showHeader && (
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 flex-1">
             {!isCleanMode && (
               <div {...attributes} {...listeners} className="cursor-grab hover:text-white/80 text-white/50 touch-none flex-shrink-0">
                  <GripVertical size={16} />
               </div>
             )}
             
             {isCleanMode ? (
                <h3 className="font-semibold text-lg truncate">{category.title}</h3>
             ) : (
               <input 
                 className="bg-transparent border-none focus:outline-none font-semibold text-lg w-full placeholder-white/30 text-white"
                 value={category.title}
                 onChange={(e) => onUpdateCategory(category.id, e.target.value)}
                 placeholder="Untitled"
               />
             )}
          </div>
          {!isCleanMode && (
            <button
              onClick={() => onDeleteCategory(category.id)}
              className="text-white/50 hover:text-red-300 transition-colors p-1 flex-shrink-0 ml-2"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}

      <div className="space-y-2 mb-4 mt-4 last:mb-0">
        {category.bookmarks.map((bookmark) => (
          <BookmarkItem
            key={bookmark.id}
            bookmark={bookmark}
            categoryId={category.id}
            onUpdateBookmark={onUpdateBookmark}
            onDeleteBookmark={onDeleteBookmark}
            isCleanMode={isCleanMode}
          />
        ))}
      </div>

      {!isCleanMode && (
        isAdding ? (
          <form onSubmit={handleAddSubmit} className="space-y-2 p-2 bg-black/20 rounded">
            <input
              autoFocus
              placeholder="Title"
              className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none text-sm px-1 py-1"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <input
              placeholder="URL"
              className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none text-sm px-1 py-1"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
            />
             <input 
               placeholder="Icon URL (Optional)"
               className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none text-sm px-1 py-1"
               value={newIcon}
               onChange={e => setNewIcon(e.target.value)}
             />
            <div className="flex gap-2 justify-end mt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="text-xs opacity-70 hover:opacity-100">Cancel</button>
              <button type="submit" className="text-xs bg-white text-black px-2 py-1 rounded font-medium hover:bg-white/90">Add</button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2 flex items-center justify-center gap-2 text-sm opacity-50 hover:opacity-100 border border-dashed border-white/30 rounded hover:border-white/60 transition-all"
          >
            <Plus size={16} /> Add Link
          </button>
        )
      )}
    </div>
  );
};
