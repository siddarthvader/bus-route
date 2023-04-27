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

export type RouteStore = {
  selectedRoute: string;
  routeData: StopsEntity[];
  setRoute: (route: string) => void;
  setRouteData: (routeData: StopsEntity[]) => void;
  getRangeLabel: () => number[];
  activeSpatial: number;
  setActiveSpatial: (activeSpatial: number) => void;
  increaseActiveSpatial: () => void;
  isLastSpatial: () => Boolean;
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

export type GTFSTextHeaders = {
  "Duty ID": string;
  "Plate No.": string;
  "Route No.": string;
  "Trip End Time": string;
  "Trip Start Time": string;
  "Trip Number": string;
};

export type StopsGTFSTextHeaders = {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
  zone_id: string;
};

export type StopsObject = {
  stop_id: number;
  stop_code: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
};

export interface StopsEntity extends StopsObject {}

export interface RoutePathEntity {
  lat: number;
  lon: number;
  getTooltip: () => string;
}

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

export type MapGTFSToSchedule = {
  [K in keyof GTFSTextHeaders]: string;
};

export type MapControlProps = {
  rangeList: number[];
  onTimeChange: (val: number) => void;
};

export type ForWardButtonProps = {
  onClick: () => void;
};
export type BackwardButtonProps = {
  onClick: () => void;
};

export type PlayPauseButtonProps = {
  onClick: () => void;
  isPlaying: boolean;
};

export type Label = {
  label: string;
  value: number;
};

export type BusLocationRequestQuery = {
  query: {
    bool: {
      must: [
        {
          terms: {
            "route_info.vid": string[];
          };
        },
        {
          term: {
            "route_info.type": string;
          };
        },
        {
          range: {
            "route_info.timestamp": {
              gte: number;
              lte: number;
            };
          };
        }
      ];
    };
  };
  _source: string[];
};

export type BusOnRouteRequestQuery = {
  query: {
    bool: {
      must: [
        {
          match: {
            [key: string]: string;
          };
        },
        {
          range: {
            "route_info.timestamp": {
              gte: number;
              lte: number;
            };
          };
        }
      ];
    };
  };
  aggs: {
    unique_vids: {
      terms: {
        field: string;
        size: number;
      };
    };
  };
};

export type RouterQueryParams = {
  agency_id: string;
  route_id: string;
  bus_id: string;
  start_time: string;
  end_time: string;
};

export type BusRouteEntity = {
  bus_id: string;
  route_id: string;
  timestamp: string;
  lat: number;
  lon: number;
};

export type MovieConstants = {
  start_time: string;
  end_time: string;
};

export type BusList = string[];
