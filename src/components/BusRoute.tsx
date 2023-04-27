import { getBusLocations } from "@/helpers/api";
import {
  BusList,
  BusRouteEntity,
  RoutePathEntity,
  RouterQueryParams,
} from "@/helpers/types";
import { convertToEpochMili, getToday } from "@/helpers/util";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import RoutePath from "./RoutePath";
import { movieConstants } from "@/helpers/constants";
import { useBusOnRouteStore } from "@/store/store";

function BusRoute() {
  const router = useRouter();

  const [busRoute, setBusRoute] = useState<BusRouteEntity[]>(
    [] as BusRouteEntity[]
  );

  const [routePathData, setRoutePathDate] = useState<RoutePathEntity[]>(
    [] as RoutePathEntity[]
  );

  const busList: BusList = useBusOnRouteStore((state) => state.busList);
  useEffect(() => {
    const { bus_id } = router.query as RouterQueryParams;
    if (bus_id) {
      const now = getToday();
      const startTimeMili = convertToEpochMili(movieConstants.start_time, now);
      const endTimeMili = convertToEpochMili(movieConstants.end_time, now);

      console.log(startTimeMili, endTimeMili);
      getBusLocations(busList, startTimeMili, endTimeMili).then(
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
