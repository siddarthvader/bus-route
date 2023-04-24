import dynamic from "next/dynamic";

import { GTFSConfig, RouteList } from "../helpers/constants";

import readCSVFile from "../helpers/csvParser";
import { useSpatialStore } from "../store/store";

import RouteTable from "../components/RouteTable";
import Header from "../components/Header";

const MapComponent = dynamic(() => import("src/components/MapComponent.tsx"), {
  ssr: false,
});

const isWindowContext = typeof window !== "undefined";

export default function Home() {
  const setSpatialData = useSpatialStore((state) => state.setSpatialData);
  const selectedRoute = useSpatialStore((state) => state.selectedRoute);
  const setSelectedRoute = useSpatialStore((state) => state.setRoute);
  function loadCSV(filepath: string) {
    readCSVFile(filepath)
      .then((rows) => {
        setSelectedRoute(filepath);
        setSpatialData(rows.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* <div className="flex flex-col w-[20%] p-2  bg-white items-center  pt-6">
        <div className="text-xl font-semibold text-zinc-600">
          Select Bus Routes
        </div>
        {RouteList.map((item, index) => (
          <div
            key={index}
            onClick={() => loadCSV(item.filepath)}
            className="p-2 text-xl text-red-500 underline cursor-pointer semibold"
          >
            {item.name}
          </div>
        ))}
      </div> */}
      <Header />
      <div className=" w-[90%] m-auto p-2 h-[calc(100vh- 40px)]">
        <MapComponent />
        <RouteTable />
      </div>
    </main>
  );
}
