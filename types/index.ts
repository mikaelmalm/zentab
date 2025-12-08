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

export interface Settings {
  backgroundImageUrl?: string; // If empty, use Unsplash fallback
  userName?: string; // For greeting
  is24HourFormat: boolean;
  isCleanMode: boolean;
  weatherCity?: string;
}

export interface AppState {
  categories: Category[];
  settings: Settings;
}
