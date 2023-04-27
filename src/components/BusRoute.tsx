import { getBusLocations } from "@/helpers/api";
import {
  BusRouteEntity,
  RoutePathEntity,
  RouterQueryParams,
} from "@/helpers/types";
import { convertToEpochMili } from "@/helpers/util";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import RoutePath from "./RoutePath";

function BusRoute() {
  const router = useRouter();

  const [busRoute, setBusRoute] = useState<BusRouteEntity[]>(
    [] as BusRouteEntity[]
  );

  const [routePathData, setRoutePathDate] = useState<RoutePathEntity[]>(
    [] as RoutePathEntity[]
  );

  console.log("busRoute", busRoute);

  useEffect(() => {
    const { bus_id, start_time, end_time } = router.query as RouterQueryParams;
    if (bus_id && start_time && end_time) {
      console.log(start_time, end_time);
      const now = new Date();
      const startTimeISO = convertToEpochMili(start_time, now);
      const endTimeISO = convertToEpochMili(end_time, now);

      console.log(startTimeISO, endTimeISO);
      getBusLocations([bus_id], startTimeISO, endTimeISO).then(
        (busLocations) => {
          setBusRoute(busLocations);
          setRoutePathDate(
            busLocations.map((stop) => {
              return {
                lat: stop.lat,
                lon: stop.lon,
                getTooltip: () => {
                  return `Stop Name: ${stop.bus_id} ${stop.route_id} : ${stop.timestamp}`;
                },
              };
            })
          );
        }
      );
    }
  }, [router.query]);
  return <RoutePath routeData={routePathData} color="red" />;
}

export default BusRoute;
