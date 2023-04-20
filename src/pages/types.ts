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
