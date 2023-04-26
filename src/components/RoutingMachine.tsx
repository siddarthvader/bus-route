import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

type RouteMachineLayerProps = {
  latlngList: number[][];
};
const createRoutineMachineLayer = (props: RouteMachineLayerProps) => {
  const { latlngList } = props;

  console.log({ latlngList });
  const instance = L.Routing.control({
    waypoints: [
      L.latLng([latlngList[0][0], latlngList[0][1]]),
      L.latLng([
        latlngList[latlngList.length - 1][0],
        latlngList[latlngList.length - 1][1],
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
