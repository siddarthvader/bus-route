import { create } from "zustand";

type SpatialStore = {
  selectedRoute: string;
  spatialData: SpatialEntity[];
  setRoute: (route: string) => void;
  setSpatialData: (spatialData: SpatialEntity[]) => void;
};

type SpatialEntity = {
  "@timestamp": string;
  "route_info.location": string;
  "route_info.timestamp": string;
  "route_info.vid": string;
};

const useSpatialStore = create<SpatialStore>((set) => ({
  selectedRoute: "",
  spatialData: [],
  setRoute: (route: string) => set(() => ({ selectedRoute: route })),
  setSpatialData: (spatialData: SpatialEntity[]) =>
    set(() => ({ spatialData: spatialData })),
}));

export { useSpatialStore };
