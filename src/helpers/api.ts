import { useRouteStore, useURLStore } from "@/store/store";
import { RouteHandlerManager } from "next/dist/server/future/route-handler-managers/route-handler-manager";
import * as Papa from "papaparse";
import {
  MapGstfToRouteHeaders,
  MapGstfToStopTimeHeaders,
  MapGstfToStopsHeaders,
  MapGstfToTripHeaders,
} from "./constants";
import {
  RouteGsftTextHeaders,
  StopTimeGsftTextHeaders,
  StopsEntity,
  StopsGstfTextHeaders,
  TripGsftTextHeaders,
} from "./types";

const readGSTFile = async <MappingType, ResultType>(
  filepath: string,
  mapping: MappingType
): Promise<ResultType[]> => {
  const response = await fetch(filepath);
  const text = await response.text();
  const lines = text.split("\n");
  const headers: string[] = lines[0].split(",");
  const result: ResultType[] = [] as ResultType[];
  for (let i = 1; i < lines.length; i++) {
    const obj: ResultType = {} as ResultType;
    const currentline: string[] = lines[i].split(",");

    if (currentline.length > 1) {
      for (let j = 0; j < headers.length; j++) {
        obj[mapping[headers[j] as keyof MappingType] as keyof ResultType] =
          currentline[j] as ResultType[keyof ResultType];
      }
      result.push(obj as ResultType);
    }
  }

  return result;
};

async function getStopsForRouteId(
  routeName: string,
  agencyId: string
): Promise<StopsEntity[]> {
  // Load the necessary data from the GTFS static feed

  const [routesData, tripsData, stopTimesData, stopsData] = await Promise.all([
    readGSTFile<RouteGsftTextHeaders, RouteGsftTextHeaders>(
      "routes.txt",
      MapGstfToRouteHeaders
    ),
    readGSTFile<TripGsftTextHeaders, TripGsftTextHeaders>(
      "trips.txt",
      MapGstfToTripHeaders
    ),
    readGSTFile<StopTimeGsftTextHeaders, StopTimeGsftTextHeaders>(
      "stop_times.txt",
      MapGstfToStopTimeHeaders
    ),
    readGSTFile<StopsGstfTextHeaders, StopsGstfTextHeaders>(
      "stops.txt",
      MapGstfToStopsHeaders
    ),
  ]);

  const routeId =
    routesData.filter(
      (item) =>
        item.route_long_name === routeName && item.agency_id === agencyId
    )[0]?.route_id || "";

  // Find the trip IDs for the given route ID
  const tripIds = tripsData
    .filter((trip) => trip.route_id === routeId)
    .map((trip) => trip.trip_id);

  // Find the stop IDs for the trip IDs
  const stopIds = stopTimesData
    .filter((stopTime) => tripIds.includes(stopTime.trip_id))
    .map((stopTime) => stopTime.stop_id);
  // Find the stop data for the stop IDs
  const stopsForRoute = stopsData
    .filter((stop) => stopIds.includes(stop.stop_id))
    .map((stop) => ({
      stop_id: stop.stop_id,
      stop_code: stop.stop_code,
      stop_lat: stop.stop_lat,
      stop_lon: stop.stop_lon,
      stop_name: stop.stop_name,
    }));

  useRouteStore.setState({ [routeId]: stopsForRoute });
  // Return the stop data for the given route ID

  return stopsForRoute;
}

export { readGSTFile, getStopsForRouteId };
