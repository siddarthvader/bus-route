import dynamic from "next/dynamic";

import RouteTable from "../components/RouteTable";
import Header from "../components/Header";

const MapComponent = dynamic(() => import("src/components/MapComponent.tsx"), {
  ssr: false,
});

export default function Home() {
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
