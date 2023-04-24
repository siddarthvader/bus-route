import { MapContainer, Marker, TileLayer } from "react-leaflet";
import {
  MapBoundsMax,
  MapboxConfig,
  defaultMapConfigOption,
} from "../helpers/constants";
import { useEffect, useRef, useState } from "react";
import { DefaultMapConfig, LMapState, MapRef } from "../helpers/types";
import { useSpatialStore } from "../store/store";
import { LatLngExpression } from "leaflet";
import { trimLatLang } from "../helpers/helper";
import MapControls from "./MapControls";
import L from "leaflet";

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
  const spatialData = useSpatialStore((state) => state.spatialData);
  const selectedRoute = useSpatialStore((state) => state.selectedRoute);
  const getBusLocation = useSpatialStore().getBusLocation;

  const [map, setMap] = useState<LMapState | null>(null);
  const baseMapRef: MapRef = useRef(null);

  useEffect(() => {
    if (spatialData.length) {
      const flyTo: LatLngExpression = trimLatLang(
        spatialData[0]["route_info.location"]
      ) || { lat: 0, lng: 0 };

      map?.target?.flyTo(flyTo, 12);
    }
  }, [spatialData, map?.target]);

  const myIcon = L.icon({
    iconUrl: "/bus.png",
    iconSize: [32, 32],
  });

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
          <Marker position={getBusLocation() || [0, 0]} icon={myIcon} />
        </MapContainer>
      </div>
      {selectedRoute && <MapControls />}
    </div>
  );
}
