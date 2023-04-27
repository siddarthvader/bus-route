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
          <CircleMarker
            key={"circle_" + index}
            center={[stop.lat, stop.lon]}
            radius={index === 0 || index === routeData.length - 1 ? 6 : 2}
            color={
              index === 0
                ? "green"
                : index === routeData.length - 1
                ? "red"
                : color
            }
          >
            <Tooltip key={"tp1" + index}>{stop.getTooltip()}</Tooltip>
          </CircleMarker>
          {routeData[index + 1] && (
            <Polyline
              key={"poly_" + index}
              positions={[
                [stop.lat, stop.lon],
                [
                  routeData[index + 1]?.lat ?? stop.lat,
                  routeData[index + 1]?.lon ?? stop.lon,
                ],
              ]}
            >
              <Tooltip key={"tp2_" + index}>{stop.getTooltip()}</Tooltip>
            </Polyline>
          )}
        </div>
      ))}
    </>
  );
}

export default RoutePath;
