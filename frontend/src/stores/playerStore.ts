import { create } from 'zustand';
import type { Audio } from '../types';

interface PlayerState {
  currentAudio: Audio | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  setCurrentAudio: (audio: Audio) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  closePlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentAudio: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,
  setCurrentAudio: (audio) => set({ currentAudio: audio, isPlaying: true, currentTime: 0 }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  closePlayer: () => set({ currentAudio: null, isPlaying: false, currentTime: 0 }),
}));
