import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { createThemeSlice, ITheme } from "@/store/slices/themeSlice";
import { createFavoriteSlice, IFavorite } from "@/store/slices/favoriteSlice";
import { createSessionSlice, ISession } from "./slices/sessionSlice";
import { createAgencySlice, ISelectedAgency } from "./slices/agencySlice";
import { createMultiSlice, IMulti } from "./slices/multiSlice";

interface IHydrated {
  _hasHydrated: boolean;
}

export const useStore = create<
  ISession & ITheme & ISelectedAgency & IFavorite & IMulti & IHydrated
>()(
  persist(
    (...a) => ({
      ...createThemeSlice(...a),
      ...createAgencySlice(...a),
      ...createFavoriteSlice(...a),
      ...createSessionSlice(...a),
      ...createMultiSlice(...a),
      _hasHydrated: false,
    }),
    {
      name: "vtjoho-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mode: state.mode,
        viewsLayout: state.viewsLayout,
        views: state.views,
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
