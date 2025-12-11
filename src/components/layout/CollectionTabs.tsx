import { Collection } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface CollectionTabsProps {
  collections: Collection[];
  activeCollectionId: string;
  onSelectCollection: (id: string) => void;
  onAddCollection: (title: string) => void;
  onRenameCollection: (id: string, title: string) => void;
  onDeleteCollection: (id: string) => void;
  isCleanMode: boolean;
}

export const CollectionTabs = ({
  collections,
  activeCollectionId,
  onSelectCollection,
  onAddCollection,
  onRenameCollection,
  onDeleteCollection,
  isCleanMode,
}: CollectionTabsProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAddCollection(newTitle);
      setNewTitle("");
      setIsAdding(false);
    }
  };

  const handleStartEdit = (col: Collection) => {
    if (isCleanMode) return;
    setEditingId(col.id);
    setEditTitle(col.title);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim() && editingId) {
      onRenameCollection(editingId, editTitle);
      setEditingId(null);
    }
  };
  
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (isCleanMode) return;
    if (confirm("Are you sure you want to delete this collection?")) {
       onDeleteCollection(id);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      {collections.length > 1 && (
        <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10">
          {collections.map((col) => {
             if (editingId === col.id) {
               return (
                 <form key={col.id} onSubmit={handleSaveEdit} className="mx-1">
                   <input
                     autoFocus
                     className="bg-transparent border-none outline-none text-white text-sm px-2 py-0.5 w-24 text-center border-b border-white/20"
                     value={editTitle}
                     onChange={(e) => setEditTitle(e.target.value)}
                     onBlur={() => setEditingId(null)}
                   />
                 </form>
               );
             }
             
             return (
              <div
                key={col.id}
                className={`group flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all select-none cursor-pointer ${
                  activeCollectionId === col.id
                    ? "bg-white text-black shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => onSelectCollection(col.id)}
              >
                <span>{col.title}</span>
                
                {!isCleanMode && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(col);
                      }}
                      className="p-1 hover:bg-black/10 rounded-full transition-colors"
                      title="Rename"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                         e.stopPropagation();
                         handleDelete(e, col.id);
                      }}
                       className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors"
                       title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isAdding ? (
        <form onSubmit={handleAdd} className="bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/10 flex items-center">
            <input
              autoFocus
              className="bg-transparent border-none outline-none text-white text-sm px-3 w-32 placeholder-white/50"
              placeholder="New Collection"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => !newTitle && setIsAdding(false)}
            />
            <button type="submit" className="p-1 bg-white rounded-full text-black mx-1 hover:bg-gray-200">
                <Plus size={14} />
            </button>
        </form>
      ) : isCleanMode ? null : (
        <button 
            onClick={() => setIsAdding(true)}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Create new collection"
        >
            <Plus size={18} />
        </button>
      )}
    </div>
  );
};
