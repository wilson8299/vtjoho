import { StateCreator } from "zustand";

export interface IFavorite {
  favorite: Array<string>;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
}

export const createFavoriteSlice: StateCreator<IFavorite> = (set) => ({
  favorite: [],
  addFavorite: (id: string) => {
    set((state) => ({ ...state, favorite: [...state.favorite, id] }));
  },
  removeFavorite: (id: string) => {
    set((state) => ({
      ...state,
      favorite: state.favorite.filter((fid) => fid !== id),
    }));
  },
});
