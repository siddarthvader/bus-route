import { mapGSTFType } from "./constants";
import { GstfObject, MapGstfToObject } from "./types";

const readGSTFile = async (filepath: string): Promise<GstfObject[]> => {
  const response = await fetch(filepath);
  const text = await response.text();
  const lines = text.split("\n");
  const headers: string[] = lines[0].split(",");
  const result: GstfObject[] = [];
  for (let i = 1; i < lines.length; i++) {
    const obj: GstfObject = {} as GstfObject;
    const currentline: string[] = lines[i].split(",");

    if (currentline.length) {
      for (let j = 0; j < headers.length; j++) {
        obj[
          mapGSTFType[headers[j] as keyof MapGstfToObject] as keyof GstfObject
        ] = currentline[j];
      }
    }
    result.push(obj);
  }
  return result;
};

export { readGSTFile };
