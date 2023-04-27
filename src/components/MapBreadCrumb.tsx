import { useRouteStore, useURLStore } from "@/store/store";
import { useRouter } from "next/router";
import React from "react";

function MapBreadCrumb() {
  const router = useRouter();
  const selectedRoute = router.query.route_id as string;
  const routeData = useRouteStore((state) => state.routeData);
  const agencyId = router.query.agency_id as string;
  return (
    <div className="px-4 py-2 text-sm absolute top-0 right-0 z-[1000] bg-white rounded-lg shadow-lg text-zinc-600 font-semibold">
      <div>Agency Id: {agencyId}</div>
      <div>Route Name: {selectedRoute}</div>
      <div>Stopes in Route: {routeData.length}</div>
    </div>
  );
}

export default MapBreadCrumb;
