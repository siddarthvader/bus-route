import { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import {
  MapBoundsMax,
  MapboxConfig,
  defaultMapConfigOption,
} from "../helpers/constants";
import { DefaultMapConfig, LMapState, MapRef } from "../helpers/types";
import { useRouteStore, useURLStore } from "../store/store";

import L from "leaflet";
import "leaflet-routing-machine";
import MapBreadCrumb from "./MapBreadCrumb";
import MapControls from "./MapControls";
import RoutingMachine from "./RoutingMachine";
import { useRouter } from "next/router";
import { getStopsForRouteId } from "@/helpers/api";

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

  console.log(router.query);

  console.log({ selectedRoute });

  const [map, setMap] = useState<LMapState | null>(null);
  const baseMapRef: MapRef = useRef(null);

  const rangeList = useRouteStore((state) => state.getRangeLabel());

  useEffect(() => {
    if (routeData.length) {
      const flyTo: LatLngExpression = {
        lat: Number(routeData[0].stop_lat),
        lng: Number(routeData[0].stop_lon),
      };

      map?.target?.flyTo(flyTo, 12);
    }
  }, [routeData, map?.target]);

  const myIcon = L.icon({
    iconUrl: "/bus.png",
    iconSize: [32, 32],
  });

  function onMapControlChange(val: number) {
    console.log(val);
  }

  const setRouteData = useRouteStore((state) => state.setRouteData);

  useEffect(() => {
    getStopsForRouteId(
      router.query.route_id as string,
      router.query.agency_id as string
    ).then((res) => {
      setRouteData(res);
      console.log(res);
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
          {selectedRoute && routeData.length > 0 && <RoutingMachine />}
          {/* <Marker position={getBusLocation() || [0, 0]} icon={myIcon} /> */}
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
