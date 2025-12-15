
import { Bookmark } from '@/types';
import { Trash2, Globe, Pencil, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { getFaviconUrl } from '@/utils/favicon';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BookmarkItemProps {
  bookmark: Bookmark;
  categoryId: string;
  onUpdateBookmark: (categoryId: string, bookmarkId: string, updates: Partial<Bookmark>) => void;
  onDeleteBookmark: (categoryId: string, bookmarkId: string) => void;
  isEditMode: boolean;
  isSearchActive?: boolean;
}

export const BookmarkItem = ({
  bookmark,
  categoryId,
  onUpdateBookmark,
  onDeleteBookmark,
  isEditMode,
  isSearchActive = false,
}: BookmarkItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: bookmark.id,
    data: {
      type: 'Bookmark',
      bookmark
    },
    disabled: isSearchActive
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(bookmark.title);
  const [url, setUrl] = useState(bookmark.url);
  const [icon, setIcon] = useState(bookmark.icon || '');

  const startEditing = () => {
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setIcon(bookmark.icon || '');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && url.trim()) {
      let formattedUrl = url;
      if (!formattedUrl.startsWith('http')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      onUpdateBookmark(categoryId, bookmark.id, {
        title,
        url: formattedUrl,
        icon: icon.trim() || undefined
      });
      setIsEditing(false);
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group flex items-center justify-between bg-black/20 hover:bg-black/30 rounded p-2 transition-colors ${isDragging ? 'z-50 ring-2 ring-white/50' : ''}`}
    >
      {isEditing ? (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          <input
            autoFocus
            placeholder="Title"
            className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none text-sm px-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()} 
            onPointerDown={(e) => e.stopPropagation()}
          />
          <input
            placeholder="URL"
            className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none text-sm px-1"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()} 
            onPointerDown={(e) => e.stopPropagation()}
          />
          <input
            placeholder="Icon URL (Optional)"
            className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none text-sm px-1"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()} 
            onPointerDown={(e) => e.stopPropagation()}
          />
          <div className="flex justify-end gap-2 mt-1">
            <button type="button" onClick={cancelEditing} className="text-xs opacity-70 hover:opacity-100">Cancel</button>
            <button type="submit" className="text-xs bg-white text-black px-2 py-1 rounded font-medium">Save</button>
          </div>
        </form>
      ) : (
        <>
          {/* Drag Handle */}
          {isEditMode && !isSearchActive && (
             <div {...attributes} {...listeners} className="cursor-grab text-white/30 hover:text-white/80 mr-2 flex-shrink-0 touch-none">
                <GripVertical size={14} />
             </div>
          )}

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 truncate text-sm font-medium flex-1 text-white/90 group-hover:text-white"
          >
            <div className="p-1.5 bg-white/10 rounded-full shrink-0">
              {bookmark.icon ? (
                 <img src={bookmark.icon} alt="" className="w-[14px] h-[14px] object-cover" />
               ) : (
                 <img 
                   src={getFaviconUrl(bookmark.url) || ''} 
                   alt=""
                   className="w-[14px] h-[14px] object-cover"
                   onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                   }}
                 />
               )}
               <Globe size={14} className={`${bookmark.icon || getFaviconUrl(bookmark.url) ? 'hidden' : ''}`} />
            </div>
            <span className="truncate">{bookmark.title}</span>
          </a>
          {isEditMode && (
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={startEditing}
                className="text-white/50 hover:text-white transition-all p-1 mr-1"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onDeleteBookmark(categoryId, bookmark.id)}
                className="text-white/50 hover:text-red-300 transition-all p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
