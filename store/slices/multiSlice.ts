import { StateCreator } from "zustand";
import RGL from "react-grid-layout";
import { ILiveInfo } from "@/pages/multi";

export interface IMulti {
  viewsLayout: RGL.Layout[];
  views: ILiveInfo[];
  setViewsLayout: (vl: RGL.Layout[]) => void;
  setViews: (v: ILiveInfo[]) => void;
}

export const createMultiSlice: StateCreator<IMulti> = (set) => ({
  viewsLayout: [],
  views: [],
  setViewsLayout: (vl: RGL.Layout[]) => set((state) => ({ ...state, viewsLayout: vl })),
  setViews: (v: ILiveInfo[]) => set((state) => ({ ...state, views: v })),
});
