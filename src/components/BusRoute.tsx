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
import { movieConstants } from "@/helpers/constants";

function BusRoute() {
  const router = useRouter();

  const [busRoute, setBusRoute] = useState<BusRouteEntity[]>(
    [] as BusRouteEntity[]
  );

  const [routePathData, setRoutePathDate] = useState<RoutePathEntity[]>(
    [] as RoutePathEntity[]
  );

  useEffect(() => {
    const { bus_id } = router.query as RouterQueryParams;
    if (bus_id) {
      const now = new Date();
      const startTimeMili = convertToEpochMili(movieConstants.start_time, now);
      const endTimeMili = convertToEpochMili(movieConstants.end_time, now);

      console.log(startTimeMili, endTimeMili);
      getBusLocations([bus_id], startTimeMili, endTimeMili).then(
        (busLocations) => {
          console.log({ busLocations });
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
