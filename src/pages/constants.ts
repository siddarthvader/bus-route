import { BoundsLiteral, PointTuple } from "leaflet";
import { DefaultMapConfig } from "./types";

export const MapboxConfig = {
  accessToken:
    "pk.eyJ1Ijoic2lkbWFwcGluZyIsImEiOiJjbDQ2dzFncnkwNGtrM2NuemNrcXJ3cGhrIn0.ErNhngTH5pvqgUcSlGl0fw",
  username: "sidmapping",
  baseMapID: "clgoqk7iw00h601mjajgl635j",
};

export const MapBoundsMax: BoundsLiteral = [
  [-90, -180],
  [90, 180],
];

export const defaultMapConfigOption: DefaultMapConfig = {
  id: "choropleth-svg",
  width: "100%",
  height: "100%",
  minZoom: 1,
  maxZoom: 24,
  initialScale: 4,
  initialCenter: [0, 0],
};
