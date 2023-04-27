import { LatLngExpression } from "leaflet";
import { BusLocationRequestQuery, BusRouteEntity, StopsEntity } from "./types";

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
    timeArray.push(currentDate.getTime());
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

function getBusLocationRequestQuery(
  busIdList: string[],
  startTime: number,
  endTime: number,
  type = "pb"
): BusLocationRequestQuery {
  return {
    query: {
      bool: {
        must: [
          {
            terms: {
              "route_info.vid": busIdList,
            },
          },
          {
            term: {
              "route_info.type": type,
            },
          },
          {
            range: {
              "route_info.timestamp": {
                gte: startTime,
                lte: endTime,
              },
            },
          },
        ],
      },
    },
    _source: [
      "route_info.vid",
      "route_info.timestamp",
      "route_info.location",
      "route_info.route",
    ],
  };
}

function convertToEpochMili(time: string, currentDate: Date): number {
  const inputTime = new Date(currentDate);
  inputTime.setHours(
    parseInt(time.slice(0, 2)),
    parseInt(time.slice(3, 5)),
    parseInt(time.slice(6, 8))
  );
  const offset = inputTime.getTimezoneOffset() * 60000;
  const outputTime = new Date(inputTime.getTime() - offset).getTime();

  return outputTime;
}

function elasticResponse(data): BusRouteEntity[] {
  return data.hits.hits.map((item) => {
    const {
      route_info: { vid, timestamp, location, route },
    } = item._source;
    return {
      bus_id: vid,
      route_id: route,
      timestamp: timestamp,
      lat: location.lat,
      lon: location.lon,
    };
  });
}

export {
  trimLatLang,
  getAxisLabelFromTime,
  generateTimeArray,
  getHoursMinutes,
  getBusLocationRequestQuery,
  convertToEpochMili,
  elasticResponse,
};
