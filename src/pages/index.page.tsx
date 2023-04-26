import dynamic from "next/dynamic";

import RouteTable from "../components/RouteTable";
import Header from "../components/Header";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useScheduleStore, useURLStore } from "@/store/store";

const MapComponent = dynamic(() => import("src/components/MapComponent.tsx"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();

  const setAgencyId = useURLStore((state) => state.setAgencyId);

  useEffect(() => {
    setAgencyId(router.query.agency_id as string);
  }, [router.query]);

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className=" w-[90%] m-auto p-2 h-[calc(100vh- 40px)]">
        <MapComponent />
        <RouteTable />
      </div>
    </main>
  );
}
