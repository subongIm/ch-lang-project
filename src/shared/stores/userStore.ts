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
  login: (username: string, password: string) => boolean;
  addBookmark: (bookmark: Omit<Bookmark, 'id'>) => void;
  removeBookmark: (bookmarkId: string) => void;
  updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => void;
  setBookmarks: (bookmarks: Bookmark[]) => void;
  logout: () => void;
  
  // Computed properties
  user: User | null;
}

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  bookmarks: [],
};

// localStorage 헬퍼 함수들
const saveToStorage = (state: Partial<UserState>) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('user-storage', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
};

const loadFromStorage = (): Partial<UserState> => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user-storage');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }
  return {};
};

export const useUserStore = create<UserState>((set, get) => ({
  ...initialState,
  
  // Computed properties
  get user() {
    return get().currentUser;
  },
  
  setCurrentUser: (user: User | null) => {
    const newState = { 
      currentUser: user, 
      isAuthenticated: !!user 
    };
    set(newState);
    saveToStorage(newState);
  },
  
  login: (username: string, password: string) => {
    // 간단한 데모용 로그인 (실제로는 서버에서 인증)
    if (username === 'user' && password === 'user123') {
      const now = new Date();
      const user: User = {
        id: 'user_1',
        username: 'user',
        email: 'user@example.com',
        isAdmin: false,
        createdAt: now.toISOString(),
        joinDate: now.toISOString()
      };
      const newState = { 
        currentUser: user, 
        isAuthenticated: true 
      };
      set(newState);
      saveToStorage(newState);
      console.log('User logged in:', user);
      return true;
    }
    return false;
  },
  
  addBookmark: (bookmark: Omit<Bookmark, 'id'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `bm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => {
      const newState = {
        bookmarks: [...state.bookmarks, newBookmark]
      };
      saveToStorage({ ...state, ...newState });
      return newState;
    });
  },
  
  removeBookmark: (bookmarkId: string) => set((state) => {
    const newState = {
      bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== bookmarkId)
    };
    saveToStorage({ ...state, ...newState });
    return newState;
  }),
  
  updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => set((state) => {
    const newState = {
      bookmarks: state.bookmarks.map(bookmark => 
        bookmark.id === bookmarkId ? { ...bookmark, ...updates } : bookmark
      )
    };
    saveToStorage({ ...state, ...newState });
    return newState;
  }),
  
  setBookmarks: (bookmarks: Bookmark[]) => {
    set({ bookmarks });
    saveToStorage({ ...get(), bookmarks });
  },
  
  logout: () => {
    const newState = {
      currentUser: null,
      isAuthenticated: false,
      bookmarks: [],
    };
    set(newState);
    saveToStorage(newState);
    console.log('User logged out');
  },
}));

// 클라이언트에서만 localStorage에서 상태 복원
if (typeof window !== 'undefined') {
  // DOM이 로드된 후 실행
  const restoreState = () => {
    const storedState = loadFromStorage();
    if (storedState.currentUser) {
      useUserStore.setState({
        currentUser: storedState.currentUser,
        isAuthenticated: !!storedState.currentUser,
        bookmarks: storedState.bookmarks || [],
      });
      console.log('User state restored from localStorage:', storedState);
    }
  };

  // DOM이 로드된 후 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreState);
  } else {
    restoreState();
  }
}
