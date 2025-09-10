import { create } from 'zustand';

export interface FilterState {
  // Keyword/grammar filters
  selectedVocabIds: string[];
  selectedGrammarIds: string[];
  
  // Search filters
  searchQuery: string;
  levelFilter: 'all' | 'beginner' | 'intermediate' | 'advanced';
  
  // UI state
  expandedPhraseIds: string[];
  
  // Actions
  toggleVocabFilter: (vocabId: string) => void;
  toggleGrammarFilter: (grammarId: string) => void;
  setSearchQuery: (query: string) => void;
  setLevelFilter: (level: 'all' | 'beginner' | 'intermediate' | 'advanced') => void;
  togglePhraseExpansion: (phraseId: string) => void;
  clearAllFilters: () => void;
  reset: () => void;
}

const initialState = {
  selectedVocabIds: [],
  selectedGrammarIds: [],
  searchQuery: '',
  levelFilter: 'all' as const,
  expandedPhraseIds: [],
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...initialState,
  
  toggleVocabFilter: (vocabId: string) => set((state) => ({
    selectedVocabIds: state.selectedVocabIds.includes(vocabId)
      ? state.selectedVocabIds.filter(id => id !== vocabId)
      : [...state.selectedVocabIds, vocabId]
  })),
  
  toggleGrammarFilter: (grammarId: string) => set((state) => ({
    selectedGrammarIds: state.selectedGrammarIds.includes(grammarId)
      ? state.selectedGrammarIds.filter(id => id !== grammarId)
      : [...state.selectedGrammarIds, grammarId]
  })),
  
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setLevelFilter: (level: 'all' | 'beginner' | 'intermediate' | 'advanced') => set({ levelFilter: level }),
  
  togglePhraseExpansion: (phraseId: string) => set((state) => ({
    expandedPhraseIds: state.expandedPhraseIds.includes(phraseId)
      ? state.expandedPhraseIds.filter(id => id !== phraseId)
      : [...state.expandedPhraseIds, phraseId]
  })),
  
  clearAllFilters: () => set({
    selectedVocabIds: [],
    selectedGrammarIds: [],
    searchQuery: '',
    levelFilter: 'all',
  }),
  
  reset: () => set(initialState),
}));
