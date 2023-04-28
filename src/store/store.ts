import { create } from "zustand";

import { subscribeWithSelector } from "zustand/middleware";
import { generateTimeArray } from "../helpers/util";
import {
  BusOnRouteStore,
  BusRouteEntity,
  MovieStore,
  RouteStore,
  ScheduleObject,
  ScheduleStore,
  StopsEntity,
  TimeStampedBusRouteEntity,
  URLStore,
} from "../helpers/types";

const useRouteStore = create<RouteStore>((set, get) => ({
  selectedRoute: "",
  routeData: [],
  setRoute: (route: string) => set(() => ({ selectedRoute: route })),
  setRouteData: (routeData: StopsEntity[]) =>
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

type StopsStore = {
  stopsData: StopsEntity[];
  setStops: (stopsData: StopsEntity[]) => void;
};

const useStopsStore = create<StopsStore>((set, get) => ({
  stopsData: [],
  setStops: (stopsData: StopsEntity[]) => set(() => ({ stopsData })),
}));

const useBusOnRouteStore = create<BusOnRouteStore>((set, get) => ({
  busList: [],
  setBusList: (busList: string[]) => set(() => ({ busList })),
  timestampBusRoutes: {} as TimeStampedBusRouteEntity,
  setTimestampBusRoutes: (timestampBusRoutes: TimeStampedBusRouteEntity) =>
    set(() => ({ timestampBusRoutes })),
  getBusAtTime: (timestamp: number) => {
    const busList = get().timestampBusRoutes[timestamp];
    return busList;
  },
}));

const useMovieStore = create<MovieStore>((set, get) => ({
  currentTimestamp: 0,
  setCurrentTimestamp: (currentTimestamp: number) =>
    set(() => ({ currentTimestamp })),
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => set(() => ({ isPlaying })),
  forward: () => {
    set((state) => ({ currentTimestamp: state.currentTimestamp + 10 }));
  },
  backward: () => {
    set((state) => ({ currentTimestamp: state.currentTimestamp - 10 }));
  },
}));

export {
  useScheduleStore,
  useURLStore,
  useRouteStore,
  useStopsStore,
  useBusOnRouteStore,
  useMovieStore,
};
