import { create } from "zustand";
import { generateTimeArray, trimLatLang } from "../helpers/util";
import {
  RouteStore,
  ScheduleObject,
  ScheduleStore,
  SpatialEntity,
  URLStore,
} from "../helpers/types";

const useRouteStore = create<RouteStore>((set, get) => ({
  selectedRoute: "",
  routeData: [],
  setRoute: (route: string) => set(() => ({ selectedRoute: route })),
  setRouteData: (routeData: SpatialEntity[]) =>
    set(() => ({
      routeData: routeData,
    })),

  getRangeLabel: () => {
    const result = generateTimeArray("12:00:00", "24:00:00");
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
    const data = get().routeData;

    if (data.length == 0) {
      return null;
    }

    return trimLatLang(data[get().activeSpatial]["route_info.location"]);
  },
  isLastSpatial: () => {
    return get().routeData.length - 1 <= get().activeSpatial;
  },
}));

const useScheduleStore = create<ScheduleStore>((set, get) => ({
  routeList: [],
  setRouteList: (routeList: ScheduleObject[]) => set(() => ({ routeList })),
}));

const useURLStore = create<URLStore>((set, get) => ({
  agency_id: "",
  setAgencyId: (agency_id: string) => {
    set(() => ({ agency_id }));
  },
}));

export { useScheduleStore, useURLStore, useRouteStore };
