import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import { useRouteStore } from "@/store/store";

const createRoutineMachineLayer = () => {
  const routeData = useRouteStore.getState().routeData;
  const instance = L.Routing.control({
    waypoints: [
      L.latLng([Number(routeData[0].stop_lat), Number(routeData[0].stop_lon)]),
      L.latLng([
        Number(routeData[routeData.length - 1].stop_lat),
        Number(routeData[routeData.length - 1].stop_lon),
      ]),
    ],
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }],
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    showAlternatives: false,
    containerClassName: "display-none",
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
