"use client";

import { Category, Bookmark } from '@/types';
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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableCategoryCard } from '../components/SortableCategoryCard';

interface BookmarkGridProps {
  categories: Category[];
  onAddCategory: (title: string) => void;
  onUpdateCategory: (id: string, title: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddBookmark: (categoryId: string, title: string, url: string, icon?: string) => void;
  onUpdateBookmark: (categoryId: string, bookmarkId: string, updates: Partial<Bookmark>) => void;
  onDeleteBookmark: (categoryId: string, bookmarkId: string) => void;
  onReorderCategories: (startIndex: number, endIndex: number) => void;
  isCleanMode: boolean;
}

/* SortableCategoryCard moved to its own file */

export const BookmarkGrid = ({
  categories,
  onAddCategory,
  onUpdateCategory,
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
              onUpdateCategory={onUpdateCategory}
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
