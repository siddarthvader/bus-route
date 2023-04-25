import { BoundsLiteral, PointTuple } from "leaflet";
import {
  DefaultMapConfig,
  MapGstfToSchedule,
  RouteGsftTextHeaders,
  StopTimeGsftTextHeaders,
  StopsGstfTextHeaders,
  TripGsftTextHeaders,
} from "./types";

export const MapboxConfig = {
  accessToken:
    "pk.eyJ1Ijoic2lkbWFwcGluZyIsImEiOiJjbDQ2dzFncnkwNGtrM2NuemNrcXJ3cGhrIn0.ErNhngTH5pvqgUcSlGl0fw",
  username: "sidmapping",
  baseMapID: "clgoqk7iw00h601mjajgl635j",
};

export const MapBoundsMax: BoundsLiteral = [
  [-90, -180],
  [90, 180],
];

export const defaultMapConfigOption: DefaultMapConfig = {
  id: "choropleth-svg",
  width: "100%",
  height: "100%",
  minZoom: 1,
  maxZoom: 24,
  initialScale: 4,
  initialCenter: [0, 0],
};

export const RouteList = [
  {
    name: "gps_DL1PC5335",
    filepath: "gps_DL1PC5335.csv",
  },
  {
    name: "gps_DL1PC9997",
    filepath: "gps_DL1PC9997.csv",
  },
];

export const GTFSConfig = {
  url: "depot_tool_duty_master.txt",
};

export const MapGstfHeaders: MapGstfToSchedule = {
  "Duty ID": "duty_id",
  "Plate No.": "plate_no",
  "Route No.": "route_no",
  "Trip End Time": "trip_end_time",
  "Trip Start Time": "trip_start_time",
  "Trip Number": "trip_number",
};

export const MapGstfToStopsHeaders: StopsGstfTextHeaders = {
  stop_id: "stop_id",
  stop_code: "stop_code",
  stop_name: "stop_name",
  stop_lat: "stop_lat",
  stop_lon: "stop_lon",
  zone_id: "zone_id",
};

export const MapGstfToRouteHeaders: RouteGsftTextHeaders = {
  agency_id: "agency_id",
  route_id: "route_id",
  route_long_name: "route_long_name",
  route_short_name: "route_short_name",
  route_type: "route_type",
};

export const MapGstfToTripHeaders: TripGsftTextHeaders = {
  route_id: "route_id",
  service_id: "service_id",
  trip_id: "trip_id",
  shape_id: "shape_id",
};

export const MapGstfToStopTimeHeaders: StopTimeGsftTextHeaders = {
  trip_id: "trip_id",
  arrival_time: "arrival_time",
  departure_time: "departure_time",
  stop_id: "stop_id",
  stop_sequence: "stop_sequence",
};

export const AgencyList = ["DIMTS", "DTC"];

export const EnableFilter: string[] = ["plate_no"];
