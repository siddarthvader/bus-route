import { MapContainer, TileLayer } from "react-leaflet";
import {
  MapBoundsMax,
  MapboxConfig,
  defaultMapConfigOption,
} from "./constants";
import { useEffect, useRef, useState } from "react";
import { LMapState, MapRef } from "./types";

const isWindowContext = typeof window !== "undefined";

const { id, minZoom, maxZoom, initialCenter, width, height, initialScale } =
  defaultMapConfigOption;

export default function MapComponent() {
  const [map, setMap] = useState<LMapState | null>(null);
  const baseMapRef: MapRef = useRef(null);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
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
      whenReady={() => setMap}
      bounceAtZoomLimits={false}
    >
      <TileLayer
        ref={baseMapRef}
        attribution=""
        noWrap={true}
        bounds={MapBoundsMax}
        url={`https://api.mapbox.com/styles/v1/${MapboxConfig.username}/${MapboxConfig.baseMapID}/tiles/{z}/{x}/{y}?access_token=${MapboxConfig.accessToken}`}
      ></TileLayer>
    </MapContainer>
  );
}
