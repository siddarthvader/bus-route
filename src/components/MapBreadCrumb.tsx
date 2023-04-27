import { useBusOnRouteStore, useRouteStore, useURLStore } from "@/store/store";
import { useRouter } from "next/router";
import React from "react";

function MapBreadCrumb() {
  const router = useRouter();
  const selectedRoute = router.query.route_id as string;
  const routeData = useRouteStore((state) => state.routeData);
  const agencyId = router.query.agency_id as string;
  const busList = useBusOnRouteStore((state) => state.busList);

  function goToBus(bus: string) {
    router.push({
      query: {
        route_id: selectedRoute,
        agency_id: agencyId,
        bus_id: bus,
      },
    });
  }
  return (
    <div className="px-4 py-2 text-sm absolute top-0 right-[-20px] z-[1000] bg-white rounded-lg shadow-lg text-zinc-600 font-semibold divide-y">
      <div>Agency Id: {agencyId}</div>
      <div>Route Name: {selectedRoute}</div>
      <div>Stopes in Route: {routeData.length}</div>
      <div>Buses On Route: {busList.length}</div>
      <div className="h-[200px] overflow-auto flex flex-col">
        {busList.map((bus, key) => (
          <a
            key={"buslist_" + key}
            onClick={() => goToBus(bus)}
            className="font-medium text-blue-600 cursor-pointer dark:text-blue-500 hover:underline"
          >
            {bus}
          </a>
        ))}
      </div>
    </div>
  );
}

export default MapBreadCrumb;
