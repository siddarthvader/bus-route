import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import { useRouteStore } from "@/store/store";

const createRoutineMachineLayer = () => {
  const routeData = useRouteStore.getState().routeData;
  const instance = L.Routing.control({
    waypoints: routeData.map((route) => {
      return [Number(route.stop_lat), Number(route.stop_lon)];
    }),
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
