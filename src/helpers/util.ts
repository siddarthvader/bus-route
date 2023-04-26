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

export {
  trimLatLang,
  getAxisLabelFromTime,
  generateTimeArray,
  getHoursMinutes,
};
