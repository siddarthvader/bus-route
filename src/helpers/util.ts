import { LatLngExpression } from "leaflet";

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

function getAxisLabelFromTime(timestamps: number[]): Date[] {
  return timestamps.map((item) => {
    return new Date(item);
  });
}

function generateTimeArray(
  startTime: string,
  endTime: string,
  timeInterval: number = 1
): number[] {
  const timeArray: number[] = [];

  const [startHour, startMinute, startSecond]: string[] = startTime.split(":");
  const [endHour, endMinute, endSecond]: string[] = endTime.split(":");

  const startDate: Date = new Date();
  startDate.setHours(Number(startHour));
  startDate.setMinutes(Number(startMinute));
  startDate.setSeconds(Number(startSecond));
  startDate.setMilliseconds(0);

  const endDate: Date = new Date();
  endDate.setHours(Number(endHour));
  endDate.setMinutes(Number(endMinute));
  endDate.setSeconds(Number(endSecond));
  endDate.setMilliseconds(0);

  let currentDate: Date = startDate;
  while (currentDate <= endDate) {
    timeArray.push(
      // currentDate.toLocaleTimeString([], {
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   second: "2-digit",
      // })
      currentDate.getTime()
    );
    currentDate.setHours(currentDate.getHours() + timeInterval);
  }

  return timeArray;
}

function getHoursMinutes(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sortByDistance(coords: number[][], from: number[]): number[][] {
  function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in metres
  }

  const sorted = coords.sort(
    ([lat1, lon1], [lat2, lon2]) =>
      distance(from[0], from[1], lat1, lon1) -
      distance(from[0], from[1], lat2, lon2)
  );

  console.log({ sorted });
  return sorted;
}

export {
  trimLatLang,
  getAxisLabelFromTime,
  generateTimeArray,
  getHoursMinutes,
  sortByDistance,
};
