import { RouteList } from "@/helpers/constants";
import React from "react";
import readCSVFile from "../helpers/csvParser";
import { useRouteStore } from "@/store/store";

function LeftNav() {
  const setRouteData = useRouteStore((state) => state.setRouteData);
  const setSelectedRoute = useRouteStore((state) => state.setRoute);

  function loadCSV(filepath: string) {
    readCSVFile(filepath)
      .then((rows) => {
        setSelectedRoute(filepath);
        setRouteData(rows.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <div className="flex flex-col w-[20%] p-2  bg-white items-center  pt-6">
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
    </div>
  );
}

export default LeftNav;
