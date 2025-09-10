import { create } from 'zustand';

export interface PlayerState {
  // Current playback state
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isMuted: boolean;
  playbackRate: number;
  
  // Video source
  videoId: string | null;
  startTime: number;
  endTime: number;
  
  // UI state
  showSubtitles: boolean;
  activePhraseId: string | null;
  
  // Actions
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setVideoSource: (videoId: string, startTime: number, endTime: number) => void;
  setShowSubtitles: (show: boolean) => void;
  setActivePhraseId: (phraseId: string | null) => void;
  seekTo: (time: number) => void;
  togglePlay: () => void;
  toggleMute: () => void;
  reset: () => void;
}

const initialState = {
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isMuted: false,
  playbackRate: 1,
  videoId: null,
  startTime: 0,
  endTime: 0,
  showSubtitles: true,
  activePhraseId: null,
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...initialState,
  
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setDuration: (duration: number) => set({ duration }),
  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setIsMuted: (muted: boolean) => set({ isMuted: muted }),
  setPlaybackRate: (rate: number) => set({ playbackRate: rate }),
  setVideoSource: (videoId: string, startTime: number, endTime: number) => 
    set({ videoId, startTime, endTime }),
  setShowSubtitles: (show: boolean) => set({ showSubtitles: show }),
  setActivePhraseId: (phraseId: string | null) => set({ activePhraseId: phraseId }),
  
  seekTo: (time: number) => {
    // This will be handled by the YouTube player component
    set({ currentTime: time });
  },
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  
  reset: () => set(initialState),
}));
