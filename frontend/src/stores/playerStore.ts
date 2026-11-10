import { create } from 'zustand';
import type { Audio } from '../types';

interface PlayerState {
  currentAudio: Audio | null;
  queue: Audio[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  /** Lance un audio (ou met en pause / reprend si c'est déjà celui en cours). */
  playAudio: (audio: Audio, queue?: Audio[]) => void;
  setCurrentAudio: (audio: Audio) => void;
  togglePlay: () => void;
  setPlaying: (value: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  closePlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentAudio: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,
  playAudio: (audio, queue) => {
    const { currentAudio, isPlaying } = get();
    if (currentAudio?.id === audio.id) {
      set({ isPlaying: !isPlaying });
      return;
    }
    set({
      currentAudio: audio,
      isPlaying: true,
      currentTime: 0,
      duration: audio.duration_seconds || 0,
      queue: queue ?? get().queue,
    });
  },
  setCurrentAudio: (audio) => get().playAudio(audio),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setPlaying: (value) => set({ isPlaying: value }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  playNext: () => {
    const { queue, currentAudio } = get();
    const i = queue.findIndex((a) => a.id === currentAudio?.id);
    if (i >= 0 && i < queue.length - 1) get().playAudio(queue[i + 1]);
  },
  playPrevious: () => {
    const { queue, currentAudio } = get();
    const i = queue.findIndex((a) => a.id === currentAudio?.id);
    if (i > 0) get().playAudio(queue[i - 1]);
  },
  closePlayer: () => set({ currentAudio: null, isPlaying: false, currentTime: 0, duration: 0 }),
}));
