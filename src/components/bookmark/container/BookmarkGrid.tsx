
"use client";

import { Category, Bookmark } from '@/types';
import { useState, useMemo } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { SortableCategoryCard } from '../components/SortableCategoryCard';
import { BookmarkItem } from '../components/BookmarkItem';
import { createPortal } from 'react-dom';

interface BookmarkGridProps {
  categories: Category[];
  onAddCategory: (title: string) => void;
  onUpdateCategory: (id: string, title: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddBookmark: (categoryId: string, title: string, url: string, icon?: string) => void;
  onUpdateBookmark: (categoryId: string, bookmarkId: string, updates: Partial<Bookmark>) => void;
  onDeleteBookmark: (categoryId: string, bookmarkId: string) => void;
  onReorderCategories: (startIndex: number, endIndex: number) => void;
  onMoveBookmark: (bookmarkId: string, sourceCategoryId: string, targetCategoryId: string, newIndex: number) => void;
  isCleanMode: boolean;
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export const BookmarkGrid = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddBookmark,
  onUpdateBookmark,
  onDeleteBookmark,
  onReorderCategories,
  onMoveBookmark,
  isCleanMode,
}: BookmarkGridProps) => {
  const [newCatName, setNewCatName] = useState('');
  
  // DnD State
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'Category' | 'Bookmark' | null>(null);
  const [activeItem, setActiveItem] = useState<any>(null);

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

  // Distribute categories into 3 columns for Masonry layout
  const columns = useMemo(() => {
    const cols: Category[][] = [[], [], []];
    categories.forEach((cat, index) => {
      cols[index % 3].push(cat);
    });
    return cols;
  }, [categories]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveType(active.data.current?.type || 'Category');
    
    if (active.data.current?.type === 'Bookmark') {
       setActiveItem(active.data.current.bookmark);
    } else {
       setActiveItem(active.data.current?.category);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Only handle bookmark drag over logic here (moving between categories)
    // Detailed reordering is handled by SortableContext strategies in DragEnd usually, 
    // but for nested lists we often need dragOver updates.
    // However, since we are managing state in parent, simpler to just rely on dragEnd for state updates if possible.
    // But for visual feedback we might need it. 
    // For now, let's keep it simple: Real updates on DragEnd.
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);
    setActiveItem(null);

    if (!over) return;

    // Case 1: Category Reorder
    if (activeType === 'Category' && active.id !== over.id) {
       // Find true indices in the flat list
       const oldIndex = categories.findIndex((c) => c.id === active.id);
       const newIndex = categories.findIndex((c) => c.id === over.id);
       if (oldIndex !== -1 && newIndex !== -1) {
         onReorderCategories(oldIndex, newIndex);
       }
       return;
    }

    // Case 2: Bookmark Reorder / Move
    if (activeType === 'Bookmark') {
      const activeBookmarkId = active.id as string;
      const overId = over.id as string;
      
      // Find source category
      const sourceCategory = categories.find(c => c.bookmarks.some(b => b.id === activeBookmarkId));
      if (!sourceCategory) return;

      // Find target category
      // If over a Bookmark: target is that bookmark's category
      // If over a Category: target is that category
      let targetCategoryId = '';
      let targetIndex = 0;

      const overCategory = categories.find(c => c.id === overId);
      const overBookmarkCategory = categories.find(c => c.bookmarks.some(b => b.id === overId));

      if (overCategory) {
        // Dropped on a Category card directly (e.g. empty area)
        targetCategoryId = overCategory.id;
        targetIndex = overCategory.bookmarks.length; // Add to end
      } else if (overBookmarkCategory) {
        // Dropped on another bookmark
        targetCategoryId = overBookmarkCategory.id;
        const overBookmarkIndex = overBookmarkCategory.bookmarks.findIndex(b => b.id === overId);
        // Determine if above or below? defaults to replacing index, standard Sortable logic
        targetIndex = overBookmarkIndex >= 0 ? overBookmarkIndex : 0;
        
        // Adjust for same-list movement if moving down
        if (sourceCategory.id === targetCategoryId) {
           const oldIndex = sourceCategory.bookmarks.findIndex(b => b.id === activeBookmarkId);
           if (oldIndex < targetIndex && oldIndex !== -1) {
             // targetIndex is relative to list *with* item? No, indices are pre-move usually.
             // dnd-kit arrayMove logic
             // But here we use custom moveBookmark function.
             // If we use regular sortable logic, usually newIndex is correct from `over`.
           }
        }
      } else {
        return;
      }

       // Execute move
       if (sourceCategory.id !== targetCategoryId) {
         onMoveBookmark(activeBookmarkId, sourceCategory.id, targetCategoryId, targetIndex);
       } else {
         const oldIndex = sourceCategory.bookmarks.findIndex(b => b.id === activeBookmarkId);
         if (oldIndex !== targetIndex) {
            onMoveBookmark(activeBookmarkId, sourceCategory.id, targetCategoryId, targetIndex);
         }
       }
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
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full max-w-6xl mx-auto p-8">
        
        {/* Sortable Context for Categories - wraps everything essentially */}
        <SortableContext 
          items={categories.map(c => c.id)} 
          strategy={rectSortingStrategy}
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
             {/* Render Columns */}
             {[0, 1, 2].map((colIndex) => (
                <div key={colIndex} className="flex-1 space-y-6 w-full min-w-0">
                   {columns[colIndex].map(cat => (
                      <SortableCategoryCard
                        key={cat.id}
                        category={cat}
                        onUpdateCategory={onUpdateCategory}
                        onDeleteCategory={onDeleteCategory}
                        onAddBookmark={onAddBookmark}
                        onUpdateBookmark={onUpdateBookmark}
                        onDeleteBookmark={onDeleteBookmark}
                        isCleanMode={isCleanMode}
                      />
                   ))}
                   
                   {/* Add Button in the last column or conditionally? 
                       Current design had it at the end of grid. 
                       Let's put it in the first column or separate?
                       If we put it in the grid flow, it might be weird with masonry.
                   */}
                </div>
             ))}
          </div>
        </SortableContext>
        
        {/* New Category Input - placed outside grid for now, or maybe as a fixed item at bottom/top? 
            Original design had it as a grid item. 
            If I want it to be part of the flow, I should add it to the columns data structure as a dummy item or render it separately.
            Let's render it at the bottom for now.
        */}
        {!isCleanMode && (
          <div className="mt-8 max-w-md mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 border-dashed flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group h-fit">
                 <form onSubmit={handleAddCategory} className="w-full text-center">
                     <input 
                       placeholder="+ New Category"
                       className="w-full bg-transparent text-center text-white placeholder-white/30 outline-none text-xl font-medium focus:placeholder-transparent"
                       value={newCatName}
                       onChange={e => setNewCatName(e.target.value)}
                     />
                 </form>
              </div>
          </div>
        )}
      </div>

      {/* Drag Portal for rendering the item while dragging */}
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId && activeType === 'Category' && activeItem ? (
             <div className="opacity-90 scale-105 cursor-grabbing w-[300px]">
                <SortableCategoryCard
                  category={activeItem}
                  onUpdateCategory={() => {}}
                  onDeleteCategory={() => {}}
                  onAddBookmark={() => {}}
                  onUpdateBookmark={() => {}}
                  onDeleteBookmark={() => {}}
                  isCleanMode={isCleanMode}
                />
             </div>
          ) : activeId && activeType === 'Bookmark' && activeItem ? (
             <div className="opacity-90 cursor-grabbing bg-white/20 p-2 rounded w-full">
                <BookmarkItem
                   bookmark={activeItem}
                   categoryId="overlay"
                   onUpdateBookmark={() => {}}
                   onDeleteBookmark={() => {}}
                   isCleanMode={isCleanMode}
                />
             </div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
