import { Collection } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CollectionTabsProps {
  collections: Collection[];
  activeCollectionId: string;
  onSelectCollection: (id: string) => void;
  onAddCollection: (title: string) => void;

  // onRenameCollection: (id: string, title: string) => void;
  // onDeleteCollection: (id: string) => void;
}

export const CollectionTabs = ({
  collections,
  activeCollectionId,
  onSelectCollection,
  onAddCollection,
  // onRenameCollection,
  // onDeleteCollection,
}: CollectionTabsProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAddCollection(newTitle);
      setNewTitle("");
      setIsAdding(false);
    }
  };

  // Only show if there is more than 1 collection or we are in adding mode?
  // User req: "Ensure the tab switch is hidden if only one collection exists."
  // But we need a way to add a second collection if only 1 exists!
  // So we should probably show a small "+" button always, or have a setting?
  // Previous design had a "+" button.
  // Let's implement a small unified widget.

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      {collections.length > 1 && (
        <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => onSelectCollection(col.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCollectionId === col.id
                  ? "bg-white text-black shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {col.title}
            </button>
          ))}
        </div>
      )}

      {/* Add Collection Button */}
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
      ) : (
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
