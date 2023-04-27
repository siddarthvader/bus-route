import { LatLngExpression, Point } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import {
  MapBoundsMax,
  MapboxConfig,
  defaultMapConfigOption,
} from "../helpers/constants";
import {
  DefaultMapConfig,
  LMapState,
  MapRef,
  RoutePathEntity,
  RouterQueryParams,
  StopsEntity,
} from "../helpers/types";
import { useRouteStore, useStopsStore } from "../store/store";

import { getBusLocations, getStopsForRouteId } from "@/helpers/api";

import "leaflet-routing-machine";
import { useRouter } from "next/router";
import MapBreadCrumb from "./MapBreadCrumb";
import MapControls from "./MapControls";

import RoutePath from "./RoutePath";

import BusRoute from "./BusRoute";

const {
  id,
  minZoom,
  maxZoom,
  initialCenter,
  width,
  height,
  initialScale,
}: DefaultMapConfig = defaultMapConfigOption;

export default function MapComponent() {
  const router = useRouter();
  const routeData = useRouteStore((state) => state.routeData);
  const rangeList = useRouteStore((state) => state.getRangeLabel());
  const stopsData = useStopsStore((state) => state.stopsData);
  const setRouteData = useRouteStore((state) => state.setRouteData);
  const setStops = useStopsStore((state) => state.setStops);

  const selectedRoute = router.query.route_id as string;

  const [map, setMap] = useState<LMapState | null>(null);
  const baseMapRef: MapRef = useRef(null);

  const [routePathData, setRoutePathDate] = useState<RoutePathEntity[]>(
    [] as RoutePathEntity[]
  );

  useRouteStore.subscribe(() => {});
  useEffect(() => {
    if (routeData.length) {
      const flyTo: LatLngExpression = {
        lat: Number(routeData[0].stop_lat),
        lng: Number(routeData[0].stop_lon),
      };

      map?.target?.flyTo(flyTo, 12);
    }
  }, [routeData, map?.target]);

  function onMapControlChange(val: number) {
    console.log(val);
  }

  useEffect(() => {
    const { route_id, agency_id } = router.query as RouterQueryParams;
    getStopsForRouteId(route_id as string, agency_id as string).then(
      ([routeStops, allStops]) => {
        setRouteData(routeStops);
        setStops(allStops);
        setRoutePathDate(
          routeStops.map((stop) => {
            return {
              lat: stop.stop_lat,
              lon: stop.stop_lon,
              getTooltip: () => {
                return `Stop Name: ${stop.stop_id} ${stop.stop_name}`;
              },
            };
          })
        );
      }
    );

    //
  }, [router.query]);

  return (
    <div className="relative flex h-full">
      <div className="h-full z-[999] flex w-full">
        <MapContainer
          id={id}
          style={{ minHeight: "600px", width: width, height: height }}
          minZoom={minZoom}
          maxZoom={maxZoom}
          center={initialCenter}
          zoom={initialScale}
          attributionControl={false}
          maxBounds={MapBoundsMax}
          maxBoundsViscosity={1}
          whenReady={setMap}
          bounceAtZoomLimits={false}
        >
          <TileLayer
            ref={baseMapRef}
            attribution=""
            noWrap={true}
            bounds={MapBoundsMax}
            url={`https://api.mapbox.com/styles/v1/${MapboxConfig.username}/${MapboxConfig.baseMapID}/tiles/{z}/{x}/{y}?access_token=${MapboxConfig.accessToken}`}
          ></TileLayer>
          {/* <StopsMarker stopsData={stopsData} /> */}
          <RoutePath routeData={routePathData} color={"blue"} />
          <BusRoute />
        </MapContainer>
      </div>
      {selectedRoute && (
        <>
          <MapControls
            rangeList={rangeList}
            onTimeChange={onMapControlChange}
          />
          <MapBreadCrumb />
        </>
      )}
    </div>
  );
}
