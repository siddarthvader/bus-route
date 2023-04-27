import { LatLngExpression } from "leaflet";
import {
  BusList,
  BusLocationRequestQuery,
  BusOnRouteRequestQuery,
  BusRouteEntity,
  StopsEntity,
} from "./types";

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
  type = "pb",
  size = 10000
): BusLocationRequestQuery {
  return {
    size: size,
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

function getBusOnRouteRequestQuery(
  routeName: string,
  start_time: number,
  end_time: number,
  size = 100
): BusOnRouteRequestQuery {
  return {
    query: {
      bool: {
        must: [
          {
            match: {
              "route_info.route": routeName,
            },
          },
          {
            range: {
              "route_info.timestamp": {
                gte: start_time,
                lte: end_time,
              },
            },
          },
        ],
      },
    },
    aggs: {
      unique_vids: {
        terms: {
          field: "route_info.vid",
          size: size,
        },
      },
    },
  };
}

function convertToEpochMili(timeStr: string, dateObj: Date): number {
  // Parse the time string into hours, minutes, and seconds
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);

  // Set the time to the specified hours, minutes, and seconds
  dateObj.setHours(hours);
  dateObj.setMinutes(minutes);
  dateObj.setSeconds(seconds);
  dateObj.setMilliseconds(0);

  // Convert the date to milliseconds and return the result
  return dateObj.getTime();
}

function elasticResponseBusLocations(data): BusRouteEntity[] {
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

function elasticResponseBusonRoute(data): BusList {
  return data.aggregations.unique_vids.buckets.map((item) => {
    return item.key;
  });
}

function getToday(): Date {
  let today = new Date();
  return new Date(today.setDate(today.getDate() - 1));
}

export {
  trimLatLang,
  getAxisLabelFromTime,
  generateTimeArray,
  getHoursMinutes,
  getBusLocationRequestQuery,
  convertToEpochMili,
  elasticResponseBusLocations,
  getBusOnRouteRequestQuery,
  elasticResponseBusonRoute,
  getToday,
};
