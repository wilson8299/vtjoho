import { StateCreator } from "zustand";

export interface ISession {
  userId?: string;
}

export const createSessionSlice: StateCreator<ISession> = (set) => ({
  userId: undefined,
  addSession: (userId: string) => {
    set((state) => ({ userId: userId }));
  },
  removeSession: () => {
    set((state) => ({
      userId: undefined,
    }));
  },
});
