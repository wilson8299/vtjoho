import { StateCreator } from "zustand";

export interface ITheme {
  mode: string;
  list: boolean;
  toggleTheme: () => void;
  toggleList: (isList: boolean) => void;
}

export const createThemeSlice: StateCreator<ITheme> = (set) => ({
  mode: "dark",
  list: true,
  toggleTheme: () => set((state) => ({ mode: state.mode === "dark" ? "light" : "dark" })),
  toggleList: (isList: boolean) => set((state) => ({ list: (state.list = isList) })),
});
