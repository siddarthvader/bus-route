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

  const [routePathData, setRoutePathData] = useState<RoutePathEntity[]>(
    [] as RoutePathEntity[]
  );

  const busList: BusList = useBusOnRouteStore((state) => state.busList);

  useEffect(() => {}, [router.query.bus_id]);

  useEffect(() => {
    setRoutePathData(
      busRoute
        .filter((bus) => bus.bus_id === router.query.bus_id)
        .map((stop) => {
          return {
            lat: stop.lat,
            lon: stop.lon,
            getTooltip: () => {
              return `Stop Name: ${stop.bus_id} ${stop.route_id} : ${stop.timestamp}`;
            },
          };
        })
    );

    const now = getToday();
    const startTimeMili = convertToEpochMili(movieConstants.start_time, now);
    const endTimeMili = convertToEpochMili(movieConstants.end_time, now);

    getBusLocations(busList, startTimeMili, endTimeMili).then(
      (busLocations) => {
        setBusRoute(busLocations);
        // setRoutePathData(
        //   busLocations
        //     .filter((bus) => bus.bus_id === bus_id)
        //     .map((stop) => {
        //       return {
        //         lat: stop.lat,
        //         lon: stop.lon,
        //         getTooltip: () => {
        //           return `Stop Name: ${stop.bus_id} ${stop.route_id} : ${stop.timestamp}`;
        //         },
        //       };
        //     })
        // );
      }
    );
  }, [router.query, busList]);
  return <RoutePath routeData={routePathData} color="green" />;
}

export default BusRoute;
