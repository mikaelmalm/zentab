"use client";

import { Category, Bookmark } from '@/types';
import { Plus, Trash2, Globe, Pencil, GripVertical } from 'lucide-react';
import { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BookmarkGridProps {
  categories: Category[];
  onAddCategory: (title: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddBookmark: (categoryId: string, title: string, url: string, icon?: string) => void;
  onUpdateBookmark: (categoryId: string, bookmarkId: string, updates: Partial<Bookmark>) => void;
  onDeleteBookmark: (categoryId: string, bookmarkId: string) => void;
  onReorderCategories: (startIndex: number, endIndex: number) => void;
  isCleanMode: boolean;
}

interface SortableCategoryCardProps {
  category: Category;
  onDeleteCategory: (id: string) => void;
  onAddBookmark: (categoryId: string, title: string, url: string, icon?: string) => void;
  onUpdateBookmark: (categoryId: string, bookmarkId: string, updates: Partial<Bookmark>) => void;
  onDeleteBookmark: (categoryId: string, bookmarkId: string) => void;
  isCleanMode: boolean;
}

const SortableCategoryCard = ({
  category,
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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editIcon, setEditIcon] = useState('');

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

  const startEditing = (b: Bookmark) => {
    setEditingId(b.id);
    setEditTitle(b.title);
    setEditUrl(b.url);
    setEditIcon(b.icon || '');
  };

  const handleUpdateSubmit = (e: React.FormEvent, bId: string) => {
    e.preventDefault();
    if (editTitle.trim() && editUrl.trim()) {
      let url = editUrl;
      if (!url.startsWith('http')) {
        url = `https://${url}`;
      }
      onUpdateBookmark(category.id, bId, {
        title: editTitle,
        url: url,
        icon: editIcon.trim() || undefined
      });
      setEditingId(null);
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-white shadow-xl transition-colors hover:bg-white/15 h-fit"
    >
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
           {!isCleanMode && (
             <div {...attributes} {...listeners} className="cursor-grab hover:text-white/80 text-white/50 touch-none">
                <GripVertical size={16} />
             </div>
           )}
           <h3 className="font-semibold text-lg">{category.title}</h3>
        </div>
        {!isCleanMode && (
          <button
            onClick={() => onDeleteCategory(category.id)}
            className="text-white/50 hover:text-red-300 transition-colors p-1"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {category.bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="group flex items-center justify-between bg-black/20 hover:bg-black/30 rounded p-2 transition-colors">
            {editingId === bookmark.id ? (
              <form onSubmit={(e) => handleUpdateSubmit(e, bookmark.id)} className="w-full flex flex-col gap-2">
                <input
                  autoFocus
                  placeholder="Title"
                  className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none text-sm px-1"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  placeholder="URL"
                  className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none text-sm px-1"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                />
                <input
                  placeholder="Icon URL (Optional)"
                  className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none text-sm px-1"
                  value={editIcon}
                  onChange={(e) => setEditIcon(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-1">
                  <button type="button" onClick={() => setEditingId(null)} className="text-xs opacity-70 hover:opacity-100">Cancel</button>
                  <button type="submit" className="text-xs bg-white text-black px-2 py-1 rounded font-medium">Save</button>
                </div>
              </form>
            ) : (
              <>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 truncate text-sm font-medium flex-1"
                >
                  <div className="p-1.5 bg-white/10 rounded-full shrink-0">
                    {bookmark.icon ? (
                       // eslint-disable-next-line @next/next/no-img-element
                       <img src={bookmark.icon} alt="" className="w-[14px] h-[14px] object-cover" />
                     ) : (
                       // eslint-disable-next-line @next/next/no-img-element
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
                {!isCleanMode && (
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => startEditing(bookmark)}
                      className="text-white/50 hover:text-white transition-all p-1 mr-1"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteBookmark(category.id, bookmark.id)}
                      className="text-white/50 hover:text-red-300 transition-all p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
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

export const BookmarkGrid = ({
  categories,
  onAddCategory,
  onDeleteCategory,
  onAddBookmark,
  onUpdateBookmark,
  onDeleteBookmark,
  onReorderCategories,
  isCleanMode,
}: BookmarkGridProps) => {
  const [newCatName, setNewCatName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      onReorderCategories(oldIndex, newIndex);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCategory(newCatName);
      setNewCatName('');
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragEnd={handleDragEnd}
    >
      <div className="w-full max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SortableContext 
          items={categories.map(c => c.id)} 
          strategy={rectSortingStrategy}
        >
          {categories.map((category) => (
            <SortableCategoryCard
              key={category.id}
              category={category}
              onDeleteCategory={onDeleteCategory}
              onAddBookmark={onAddBookmark}
              onUpdateBookmark={onUpdateBookmark}
              onDeleteBookmark={onDeleteBookmark}
              isCleanMode={isCleanMode}
            />
          ))}
        </SortableContext>

        {/* New Category Button - hidden in Clean Mode */}
        {!isCleanMode && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 border-dashed flex items-center justify-center min-h-[200px] hover:bg-white/10 transition-colors cursor-pointer group h-fit">
             <form onSubmit={handleAddCategory} className="w-full text-center">
                 <input 
                   placeholder="+ New Category"
                   className="w-full bg-transparent text-center text-white placeholder-white/30 outline-none text-xl font-medium focus:placeholder-transparent"
                   value={newCatName}
                   onChange={e => setNewCatName(e.target.value)}
                 />
             </form>
          </div>
        )}
      </div>
    </DndContext>
  );
};
