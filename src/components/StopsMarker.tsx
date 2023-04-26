import { StopsEntity } from "@/helpers/types";
import React from "react";
import { Circle, Marker, Rectangle, Tooltip } from "react-leaflet";

type StopsMarkerProps = {
  stopsData: StopsEntity[];
};

function StopsMarker(props: StopsMarkerProps) {
  const { stopsData } = props;
  const divIcon = L.divIcon({
    className: "w-2 h-2 rounded-lg bg-blue-500",
  });
  return (
    <div>
      {stopsData.map((stop, key) => {
        return (
          <Circle
            key={key}
            center={[stop.stop_lat, stop.stop_lon]}
            radius={1}
            color="red"
          >
            <Tooltip>
              <div>Stop Id: {stop.stop_id}</div>
              <div>Stop Name: {stop.stop_name}</div>
            </Tooltip>
          </Circle>
        );
      })}
    </div>
  );
}

export default StopsMarker;
