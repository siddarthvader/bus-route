import { LatLngExpression } from "leaflet";
import { BusLocationRequestQuery, StopsEntity } from "./types";

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

function getBusLocationRequestQuery(
  busIdList: string[],
  startTime: string,
  endTime: string,
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
  };
}

function convertToISO(time, currentDate: Date) {
  const inputTime = new Date(currentDate);
  inputTime.setHours(
    parseInt(time.slice(0, 2)),
    parseInt(time.slice(3, 5)),
    parseInt(time.slice(6, 8))
  );
  const offset = inputTime.getTimezoneOffset() * 60000;
  const outputTime =
    new Date(inputTime.getTime() - offset).toISOString().slice(0, -5) +
    formatTimezoneOffset(offset);

  return outputTime;
}
function formatTimezoneOffset(offset: number): string {
  const sign = offset < 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  return `${sign}${padZero(hours)}:${padZero(minutes)}`;
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : num.toString();
}

export {
  trimLatLang,
  getAxisLabelFromTime,
  generateTimeArray,
  getHoursMinutes,
  getBusLocationRequestQuery,
  convertToISO,
};
