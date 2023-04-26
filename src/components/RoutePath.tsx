import React from "react";
import { CircleMarker, Marker, Polyline, Tooltip } from "react-leaflet";

type RoutePathProps = {
  latlngList: number[][];
};

function RoutePath(props: RoutePathProps) {
  const { latlngList } = props;

  return latlngList.map((item, index) => (
    <>
      {index === 0 ? <Marker position={[item[0], item[1]]} /> : null}
      <CircleMarker center={[item[0], item[1]]} radius={2}>
        <Tooltip>Point Tooltip</Tooltip>
      </CircleMarker>
      <Polyline
        key={index}
        positions={[
          [item[0], item[1]],
          [
            latlngList[index + 1]?.[0] ?? item[0],
            latlngList[index + 1]?.[1] ?? item[1],
          ],
        ]}
      ></Polyline>
      {index === latlngList.length - 1 ? (
        <Marker position={[item[0], item[1]]} />
      ) : null}
    </>
  ));
}

export default RoutePath;
