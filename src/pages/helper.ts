import { LatLngExpression } from "leaflet";

import { scaleLinear } from "d3-scale";

function trimLatLang(point: string): LatLngExpression | null {
  const regex: RegExp = /POINT \((\d+\.\d+) (\d+\.\d+)\)/;
  const match: RegExpMatchArray | null = point.match(regex);

  if (match !== null) {
    const lng: number = parseFloat(match[1]);
    const lat: number = parseFloat(match[2]);
    return {
      lat,
      lng,
    };
  }

  return null;
}

function getAxisLabelFromTime(timestamps: number[], count = 12): Date[] {
  return scaleLinear()
    .domain([Math.min(...timestamps), Math.max(...timestamps)])
    .ticks(count)
    .map((item) => new Date(item));
}

export { trimLatLang, getAxisLabelFromTime };
