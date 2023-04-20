import { create } from "zustand";

type SpatialStore = {
  spatialData: SpatialEntity[];
  setSpatialData: Function;
};

type SpatialEntity = {
  "@timestamp": string;
  "route_info.location": string;
  "route_info.timestamp": string;
  "route_info.vid": string;
};

const useSpatialStore = create<SpatialStore>((set) => ({
  spatialData: [],
  setSpatialData: (spatialData: SpatialEntity[]) =>
    set((state) => ({ spatialData: spatialData })),
}));

export { useSpatialStore };
