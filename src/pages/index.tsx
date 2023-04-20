import dynamic from "next/dynamic";
import { useState } from "react";
import { RouteList } from "./constants";
import csvParser from "csv-parser";
import readCSVFile from "./csvParser";
import { useSpatialStore } from "./store";
import MapControls from "./MapControls";

const MapComponent = dynamic(() => import("src/pages/MapComponent.tsx"), {
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
    <main className="flex flex-row min-h-screen p-4">
      <div className="flex flex-col w-[20%] p-2  bg-white">
        <div className="font-semibold">Select Bus Routes</div>
        {RouteList.map((item, index) => (
          <div
            key={index}
            onClick={() => loadCSV(item.filepath)}
            className="p-2 text-xl text-red-500 underline cursor-pointer semibold"
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className=" w-[80%] p-2">{isWindowContext && <MapComponent />}</div>)
    </main>
  );
}
