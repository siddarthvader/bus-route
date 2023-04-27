import { useBusOnRouteStore, useRouteStore, useURLStore } from "@/store/store";
import { useRouter } from "next/router";
import React from "react";

function MapBreadCrumb() {
  const router = useRouter();
  const selectedRoute = router.query.route_id as string;
  const routeData = useRouteStore((state) => state.routeData);
  const agencyId = router.query.agency_id as string;
  const busList = useBusOnRouteStore((state) => state.busList);
  return (
    <div className="px-4 py-2 text-sm absolute top-0 right-0 z-[1000] bg-white rounded-lg shadow-lg text-zinc-600 font-semibold divide-y">
      <div>Agency Id: {agencyId}</div>
      <div>Route Name: {selectedRoute}</div>
      <div>Stopes in Route: {routeData.length}</div>
      <div>Total Buses On Route: {busList.length}</div>
      <div className="h-[200px] overflow-auto">
        {busList.map((item, key) => (
          <div key={"buslist_" + key}>{item}</div>
        ))}
      </div>
    </div>
  );
}

export default MapBreadCrumb;
