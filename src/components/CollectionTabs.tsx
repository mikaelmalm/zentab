
import { Collection } from '@/types';
import { Plus, X, Edit2, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface CollectionTabsProps {
  collections: Collection[];
  activeCollectionId: string;
  onSetActive: (id: string) => void;
  onAdd: (title: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  isCleanMode: boolean;
}

export const CollectionTabs = ({
  collections,
  activeCollectionId,
  onSetActive,
  onAdd,
  onRename,
  onDelete,
  isCleanMode,
}: CollectionTabsProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when starting edit/add
  useEffect(() => {
    if (isEditing || isAdding) {
      inputRef.current?.focus();
    }
  }, [isEditing, isAdding]);

  if (collections.length <= 1 && !isAdding) {
     // If only 1 collection and we are not adding a new one, show Add button only 
     // wait, requirement says "if only one collection, the tab switch is hidden".
     // But we need a way to ADD a second collection.
     // So we should probably show a small "Plus" button or similar, OR show the single tab but perhaps discreetly?
     // User said: "if there is only one collection, the tab switch is hidden".
     // This implies there must be another way to CREATE a collection, or the "tab switch" refers to the *switching* UI, 
     // but we still need an entry point. 
     // I'll assume we show a minimal "+" button or gear icon for collections?
     // Let's implement it such that we show a subtle "+" button in the corner if hidden.
  }

  const handleStartEdit = (col: Collection) => {
    setIsEditing(col.id);
    setEditValue(col.title);
  };

  const handleSaveEdit = () => {
    if (isEditing && editValue.trim()) {
      onRename(isEditing, editValue.trim());
    }
    setIsEditing(null);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setNewValue('');
  };

  const handleSaveAdd = () => {
    if (newValue.trim()) {
      onAdd(newValue.trim());
    }
    setIsAdding(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, save: () => void, cancel: () => void) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  };

  return (
    <div className="fixed bottom-6 right-20 z-50 flex items-center gap-2">
      <div className={`flex items-center gap-2 p-1 rounded-full backdrop-blur-md transition-all duration-300 ${collections.length > 1 ? 'bg-black/30 border border-white/10' : ''}`}>
        
        {/* Collection List */}
        {collections.map((col) => {
           // Hide single collection if not editing
           if (collections.length === 1 && !isAdding) return null;

           const isActive = col.id === activeCollectionId;
           const isEdit = isEditing === col.id;

           return (
             <div 
               key={col.id}
               className={`relative group flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all ${
                 isActive ? 'bg-white/20 text-white shadow-lg' : 'text-white/60 hover:bg-white/10 hover:text-white/90'
               }`}
               onClick={() => !isEdit && onSetActive(col.id)}
             >
               {isEdit ? (
                 <div className="flex items-center gap-1">
                   <input
                     ref={inputRef}
                     value={editValue}
                     onChange={(e) => setEditValue(e.target.value)}
                     onBlur={handleSaveEdit}
                     onKeyDown={(e) => handleKeyDown(e, handleSaveEdit, () => setIsEditing(null))}
                     className="bg-transparent border-b border-white text-white outline-none w-24 text-sm"
                   />
                 </div>
               ) : (
                 <span className="text-sm font-medium">{col.title}</span>
               )}

               {/* Controls (only show on active or hover) */}
               {!isCleanMode && (
                 <div className={`flex items-center gap-1 ${isActive || isEdit ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                     {!isEdit && (
                       <button
                         onClick={(e) => { e.stopPropagation(); handleStartEdit(col); }}
                         className="p-1 hover:text-blue-300 transition-colors"
                       >
                         <Edit2 size={12} />
                       </button>
                     )}
                     {collections.length > 1 && !isEdit && (
                       <button
                         onClick={(e) => { e.stopPropagation(); onDelete(col.id); }}
                         className="p-1 hover:text-red-400 transition-colors"
                       >
                         <X size={12} />
                       </button>
                     )}
                 </div>
               )}
             </div>
           );
        })}

        {/* Add Button */}
        {!isCleanMode && (
          isAdding ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-full animate-in fade-in slide-in-from-left-4">
               <input
                 ref={inputRef}
                 value={newValue}
                 placeholder="Collection Name"
                 onChange={(e) => setNewValue(e.target.value)}
                 onBlur={handleSaveAdd}
                 onKeyDown={(e) => handleKeyDown(e, handleSaveAdd, () => setIsAdding(false))}
                 className="bg-transparent border-b border-white text-white outline-none w-24 text-sm"
               />
               <button onClick={handleSaveAdd} className="text-green-400"><Check size={14} /></button>
               <button onClick={() => setIsAdding(false)} className="text-red-400"><X size={14} /></button>
            </div>
          ) : (
            <button 
              onClick={handleStartAdd}
              className={`p-2 rounded-full hover:bg-white/20 text-white/70 hover:text-white transition-all ${collections.length === 1 ? 'bg-black/30 backdrop-blur-md' : ''}`}
              title="New Collection"
            >
              <Plus size={18} />
            </button>
          )
        )}
      </div>
    </div>
  );
};
