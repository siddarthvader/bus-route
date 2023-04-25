import { LatLngExpression, Map, TileLayer } from "leaflet";
import internal from "stream";

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

export type ScheduleStore = {
  routeList: ScheduleObject[];
  setRouteList: (routeList: ScheduleObject[]) => void;
};

export type URLStore = {
  agency_id: string;
  setAgencyId: (agency_id: string) => void;
};

export type Agency = {
  agency_id: string;
  agency_name: string;
};

export type ScheduleObject = {
  duty_id: string;
  plate_no: string;
  route_no: string;
  trip_end_time: string;
  trip_start_time: string;
  trip_number: string;
};

export interface RouteTableRow extends ScheduleObject {}

export type GstfTextHeaders = {
  "Duty ID": string;
  "Plate No.": string;
  "Route No.": string;
  "Trip End Time": string;
  "Trip Start Time": string;
  "Trip Number": string;
};

export type StopsGstfTextHeaders = {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
  zone_id: string;
};

export type RouteGsftTextHeaders = {
  agency_id: string;
  route_id: string;
  route_long_name: string;
  route_short_name: string;
  route_type: string;
};

export type TripGsftTextHeaders = {
  route_id: string;
  service_id: string;
  trip_id: string;
  shape_id: string;
};

export type StopTimeGsftTextHeaders = {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: string;
};

export type MapGstfToSchedule = {
  [K in keyof GstfTextHeaders]: string;
};
