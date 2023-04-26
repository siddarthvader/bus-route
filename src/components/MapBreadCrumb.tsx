import { useRouteStore, useURLStore } from "@/store/store";
import React from "react";

function MapBreadCrumb() {
  const selectedRoute = useRouteStore((state) => state.selectedRoute);
  const routeData = useRouteStore((state) => state.routeData);
  const agencyId = useURLStore((state) => state.agency_id);
  return (
    <div className="px-4 py-2 text-sm absolute top-0 right-0 z-[1000] bg-white rounded-lg shadow-lg text-zinc-600 font-semibold">
      <div>Agency Id: {agencyId}</div>
      <div>Route Name: {selectedRoute}</div>
      <div>Stopes in Route: {routeData.length}</div>
    </div>
  );
}

export default MapBreadCrumb;
