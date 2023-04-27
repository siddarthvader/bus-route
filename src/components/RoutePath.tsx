import { RoutePathEntity, StopsEntity } from "@/helpers/types";
import React from "react";
import { CircleMarker, Marker, Polyline, Tooltip } from "react-leaflet";

type RoutePathProps = {
  routeData: RoutePathEntity[];
  color: string;
};

function RoutePath(props: RoutePathProps) {
  const { routeData, color } = props;

  return (
    <>
      {routeData.map((stop, index) => (
        <div key={"wrapper_" + index}>
          {index === 0 ? (
            <Marker key={"start_" + index} position={[stop.lat, stop.lon]} />
          ) : null}
          <CircleMarker
            key={"circle_" + index}
            center={[stop.lat, stop.lon]}
            radius={2}
            color={color}
          >
            <Tooltip key={"tp1" + index}>{stop.getTooltip(stop)}</Tooltip>
          </CircleMarker>
          <Polyline
            key={"poly_" + index}
            positions={[
              [stop.lat, stop.lon],
              [
                routeData[index + 1]?.lat ?? stop.lat,
                routeData[index + 1]?.lon ?? stop.lon,
              ],
            ]}
            color={color}
          >
            <Tooltip key={"tp2_" + index}>{stop.getTooltip(stop)}</Tooltip>
          </Polyline>
          {index === routeData.length - 1 ? (
            <Marker key={"stop_" + index} position={[stop.lat, stop.lon]} />
          ) : null}
        </div>
      ))}
    </>
  );
}

export default RoutePath;
