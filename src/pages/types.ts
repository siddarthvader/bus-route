import { LatLngExpression, Map, TileLayer } from "leaflet";

export interface LMapState {
  target: LeafletMap | null;
}

export type LeafletMap = Map;

export interface MapRef {
  current: TileLayer | null;
}

export type DefaultMapConfig = {
  id: string;
  width: string;
  height: string;
  minZoom: number;
  maxZoom: number;
  initialScale: number;
  initialCenter: LatLngExpression;
};

export type SpatialStore = {
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

export type SpatialEntity = {
  "@timestamp": string;
  "route_info.location": string;
  "route_info.timestamp": string;
  "route_info.vid": string;
};
