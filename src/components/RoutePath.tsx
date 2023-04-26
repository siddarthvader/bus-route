import { StopsEntity } from "@/helpers/types";
import React from "react";
import { CircleMarker, Marker, Polyline, Tooltip } from "react-leaflet";

type RoutePathProps = {
  routeData: StopsEntity[];
};

function RoutePath(props: RoutePathProps) {
  const { routeData } = props;

  return (
    <>
      {routeData.map((stop, index) => (
        <div key={"wrapper_" + index}>
          {index === 0 ? (
            <Marker
              key={"start_" + index}
              position={[stop.stop_lat, stop.stop_lon]}
            />
          ) : null}
          <CircleMarker
            key={"circle_" + index}
            center={[stop.stop_lat, stop.stop_lon]}
            radius={2}
          >
            <Tooltip key={"tp1" + index}>
              <div>Stop code: {stop.stop_code}</div>
              <div>Stop Name: {stop.stop_name}</div>
            </Tooltip>
          </CircleMarker>
          <Polyline
            key={"poly_" + index}
            positions={[
              [stop.stop_lat, stop.stop_lon],
              [
                routeData[index + 1]?.stop_lat ?? stop.stop_lat,
                routeData[index + 1]?.stop_lon ?? stop.stop_lon,
              ],
            ]}
          >
            <Tooltip key={"tp2_" + index}>
              <div>Stop code: {stop.stop_code}</div>
              <div>Stop Name: {stop.stop_name}</div>
            </Tooltip>
          </Polyline>
          {index === routeData.length - 1 ? (
            <Marker
              key={"stop_" + index}
              position={[stop.stop_lat, stop.stop_lon]}
            />
          ) : null}
        </div>
      ))}
    </>
  );
}

export default RoutePath;
