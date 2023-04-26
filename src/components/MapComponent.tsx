import { MapContainer, Marker, TileLayer } from "react-leaflet";
import {
  MapBoundsMax,
  MapboxConfig,
  defaultMapConfigOption,
} from "../helpers/constants";
import { useEffect, useRef, useState } from "react";
import { DefaultMapConfig, LMapState, MapRef } from "../helpers/types";
import { useRouteStore } from "../store/store";
import { LatLngExpression } from "leaflet";
import { trimLatLang } from "../helpers/helper";
import MapControls from "./MapControls";
import L from "leaflet";
import MapBreadCrumb from "./MapBreadCrumb";

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
  const routeData = useRouteStore((state) => state.routeData);
  const selectedRoute = useRouteStore((state) => state.selectedRoute);
  const getBusLocation = useRouteStore().getBusLocation;

  const [map, setMap] = useState<LMapState | null>(null);
  const baseMapRef: MapRef = useRef(null);

  useEffect(() => {
    console.log(routeData);
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
          {/* <Marker position={getBusLocation() || [0, 0]} icon={myIcon} /> */}
        </MapContainer>
      </div>
      {selectedRoute && (
        <>
          <MapControls
            start_time=""
            end_time=""
            rangeList={[]}
            onTimeChange={onMapControlChange}
          />
          <MapBreadCrumb />
        </>
      )}
    </div>
  );
}
