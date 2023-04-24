import { mapGSTFType } from "./constants";
import { ScheduleObject, MapGstfToSchedule } from "./types";

const readGSTFile = async (filepath: string): Promise<ScheduleObject[]> => {
  console.log("filepath", filepath);

  const response = await fetch(filepath);
  const text = await response.text();
  const lines = text.split("\n");
  const headers: string[] = lines[0].split(",");
  const result: ScheduleObject[] = [];
  for (let i = 1; i < lines.length; i++) {
    const obj: ScheduleObject = {} as ScheduleObject;
    const currentline: string[] = lines[i].split(",");

    if (currentline.length > 1) {
      for (let j = 0; j < headers.length; j++) {
        obj[
          mapGSTFType[
            headers[j] as keyof MapGstfToSchedule
          ] as keyof ScheduleObject
        ] = currentline[j];
      }
      result.push(obj);
    }
  }
  return result;
};

export { readGSTFile };
