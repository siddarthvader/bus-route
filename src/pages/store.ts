import { LatLngExpression, LatLngTuple } from "leaflet";
import { create } from "zustand";
import { trimLatLang } from "./helper";

type SpatialStore = {
  selectedRoute: string;
  spatialData: SpatialEntity[];
  setRoute: (route: string) => void;
  setSpatialData: (spatialData: SpatialEntity[]) => void;
  getRangeLabel: () => number[];
  activeSpatial: number;
  setActiveSpatial: (activeSpatial: number) => void;
  increaseActiveSpatial: () => void;
  getBusLocation: () => LatLngExpression | null;
  isLastSpatial: () => Boolean;
};

type SpatialEntity = {
  "@timestamp": string;
  "route_info.location": string;
  "route_info.timestamp": string;
  "route_info.vid": string;
};

const useSpatialStore = create<SpatialStore>((set, get) => ({
  selectedRoute: "",
  spatialData: [],
  setRoute: (route: string) => set(() => ({ selectedRoute: route })),
  setSpatialData: (spatialData: SpatialEntity[]) =>
    set(() => ({
      spatialData: spatialData
        .filter((item) => item["@timestamp"])
        .sort(
          (first, second) =>
            Date.parse(first["@timestamp"]) - Date.parse(second["@timestamp"])
        ),
    })),
  getRangeLabel: () => {
    const data = get().spatialData;
    let result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      result.push(Date.parse(item["@timestamp"]));
    }

    return result;
  },
  activeSpatial: 0,
  setActiveSpatial: (activeSpatial: number) => {
    if (!get().isLastSpatial() && activeSpatial > 0) {
      set(() => ({ activeSpatial }));
    }
  },
  increaseActiveSpatial: () => {
    if (!get().isLastSpatial()) {
      set((state) => ({ activeSpatial: state.activeSpatial + 1 }));
    }
  },
  getBusLocation: () => {
    const data = get().spatialData;

    if (data.length == 0) {
      return null;
    }

    return trimLatLang(data[get().activeSpatial]["route_info.location"]);
  },
  isLastSpatial: () => {
    return get().spatialData.length - 1 <= get().activeSpatial;
  },
}));

export { useSpatialStore };
