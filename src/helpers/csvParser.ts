import * as Papa from "papaparse";

export default async function readCSV(filepath: string) {
  const response = await fetch(filepath);

  const text = await response.text();
  const result = Papa.parse(text, { header: true, dynamicTyping: true });

  return result;
}
