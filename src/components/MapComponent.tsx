import { LatLngExpression, Point } from "leaflet";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  CircleMarker,
  Polyline,
} from "react-leaflet";
import {
  MapBoundsMax,
  MapboxConfig,
  defaultMapConfigOption,
} from "../helpers/constants";
import { DefaultMapConfig, LMapState, MapRef } from "../helpers/types";
import { useRouteStore } from "../store/store";

import { getStopsForRouteId } from "@/helpers/api";
import L from "leaflet";
import "leaflet-routing-machine";
import { useRouter } from "next/router";
import MapBreadCrumb from "./MapBreadCrumb";
import MapControls from "./MapControls";
import RoutingMachine from "./RoutingMachine";
import { sortByDistance } from "@/helpers/util";
import RoutePath from "./RoutePath";

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

  const selectedRoute = router.query.route_id as string;

  const [map, setMap] = useState<LMapState | null>(null);
  const baseMapRef: MapRef = useRef(null);

  const rangeList = useRouteStore((state) => state.getRangeLabel());

  const setRouteData = useRouteStore((state) => state.setRouteData);

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

  const [sortedRoute, setSortedRoute] = useState<number[][]>([]);

  useEffect(() => {
    getStopsForRouteId(
      router.query.route_id as string,
      router.query.agency_id as string
    ).then((res) => {
      setRouteData(res);

      console.log({ res });

      setSortedRoute(
        sortByDistance(
          res.map((item) => [Number(item.stop_lat), Number(item.stop_lon)]),
          [Number(res[0].stop_lat), Number(res[0].stop_lon)]
        )
      );
    });
  }, [router.query]);

  return (
    <div className="relative flex h-[70%]">
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

          <RoutePath latlngList={sortedRoute} />
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
