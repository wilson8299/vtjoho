import { StateCreator } from "zustand";

export interface ISelectedAgency {
  liveAgency?: string;
  memberAgency?: string;
  setLiveAgency: (id: string) => void;
  setMemberAgency: (id: string) => void;
}

export const createAgencySlice: StateCreator<ISelectedAgency> = (set) => ({
  liveAgency: undefined,
  memberAgency: undefined,
  setLiveAgency: (id: string) => {
    set((state) => ({ ...state, liveAgency: id }));
  },
  setMemberAgency: (id: string) => {
    set((state) => ({ ...state, memberAgency: id }));
  },
});
