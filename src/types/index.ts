export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string; // Optional custom icon URL or lucide icon name
}

export interface Category {
  id: string;
  title: string;
  bookmarks: Bookmark[];
}

export interface Collection {
  id: string;
  title: string;
  categories: Category[];
}

export interface Settings {
  backgroundImageUrl?: string; // If empty, use Unsplash fallback
  userName?: string; // For greeting
  is24HourFormat: boolean;
  isCleanMode: boolean;
  weatherCity?: string;
  backgroundOpacity: number; // 0-100
  timeDisplaySize?: 'small' | 'medium' | 'large'; // Default: medium
  isSearchEnabled?: boolean;
}

export interface AppState {
  collections: Collection[];
  activeCollectionId: string;
  settings: Settings;
}
