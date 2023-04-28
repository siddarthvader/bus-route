import { getBusLocations } from "@/helpers/api";
import { BusList, BusRouteEntity, RoutePathEntity } from "@/helpers/types";
import {
  convertToEpochMili,
  getTimeStampedBusRoutes,
  getToday,
} from "@/helpers/util";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { movieConstants } from "@/helpers/constants";
import { useBusOnRouteStore, useMovieStore } from "@/store/store";
import { CircleMarker } from "react-leaflet";

function BusRoute() {
  const router = useRouter();

  const busList: BusList = useBusOnRouteStore((state) => state.busList);

  const setTimestampBusRoutes = useBusOnRouteStore(
    (state) => state.setTimestampBusRoutes
  );

  const timestampBusRoutes = useBusOnRouteStore(
    (state) => state.timestampBusRoutes
  );

  const currentTimestamp = useMovieStore((state) => state.currentTimestamp);

  useEffect(() => {
    const now = getToday();
    const startTimeMili = convertToEpochMili(movieConstants.start_time, now);
    const endTimeMili = convertToEpochMili(movieConstants.end_time, now);

    getBusLocations(busList, startTimeMili, endTimeMili).then(
      (busLocations) => {
        const timeStampedBusRoutes = getTimeStampedBusRoutes(busLocations);

        setTimestampBusRoutes(timeStampedBusRoutes);
      }
    );
  }, [router.query, busList]);

  return (
    <>
      {timestampBusRoutes[currentTimestamp]?.map((bus, index) => (
        <CircleMarker
          key={`timestamped-bus_${index}`}
          center={[bus.lat, bus.lon]}
          stroke={false}
          color="green"
          fillColor="green"
          radius={10}
          fillOpacity={0.69}
          fill={true}
        ></CircleMarker>
      ))}
    </>
  );
}

export default BusRoute;
