import { create } from 'zustand';
import { User, Bookmark } from '../api/mockData';

export interface UserState {
  // Current user
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // User data
  bookmarks: Bookmark[];
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id'>) => void;
  removeBookmark: (bookmarkId: string) => void;
  updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => void;
  setBookmarks: (bookmarks: Bookmark[]) => void;
  logout: () => void;
}

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  bookmarks: [],
};

export const useUserStore = create<UserState>((set, get) => ({
  ...initialState,
  
  setCurrentUser: (user: User | null) => set({ 
    currentUser: user, 
    isAuthenticated: !!user 
  }),
  
  addBookmark: (bookmark: Omit<Bookmark, 'id'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `bm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({
      bookmarks: [...state.bookmarks, newBookmark]
    }));
  },
  
  removeBookmark: (bookmarkId: string) => set((state) => ({
    bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== bookmarkId)
  })),
  
  updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => set((state) => ({
    bookmarks: state.bookmarks.map(bookmark => 
      bookmark.id === bookmarkId ? { ...bookmark, ...updates } : bookmark
    )
  })),
  
  setBookmarks: (bookmarks: Bookmark[]) => set({ bookmarks }),
  
  logout: () => set({
    currentUser: null,
    isAuthenticated: false,
    bookmarks: [],
  }),
}));
