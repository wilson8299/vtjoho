import create from "zustand";
import { persist, devtools } from "zustand/middleware";
import { createThemeSlice, ITheme } from "@/store/slices/themeSlice";
import { createFavoriteSlice, IFavorite } from "@/store/slices/favoriteSlice";
import { createSessionSlice, ISession } from "./slices/sessionSlice";
import { createAgencySlice, ISelectedAgency } from "./slices/agencySlice";

interface IHydrated {
  _hasHydrated: boolean;
}

export const useStore = create<
  ISession & ITheme & ISelectedAgency & IFavorite & IHydrated
>()(
  persist(
    (...a) => ({
      ...createThemeSlice(...a),
      ...createAgencySlice(...a),
      ...createFavoriteSlice(...a),
      ...createSessionSlice(...a),
      _hasHydrated: false,
    }),
    {
      name: "vtjoho-store",
      getStorage: () => localStorage,
      partialize: (state) => ({
        mode: state.mode,
        list: state.list,
        liveAgency: state.liveAgency,
        memberAgency: state.memberAgency,
        _hasHydrated: state._hasHydrated,
      }),
      onRehydrateStorage: () => () => {
        useStore.setState({ _hasHydrated: true });
      },
    }
  )
);

export default useStore;
