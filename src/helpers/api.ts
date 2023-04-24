const readGSTFile = async <MappingType, ResultType>(
  filepath: string,
  mapping: MappingType
): Promise<ResultType[]> => {
  console.log("filepath", filepath);

  const response = await fetch(filepath);
  const text = await response.text();
  const lines = text.split("\n");
  const headers: string[] = lines[0].split(",");
  const result: ResultType[] = [] as ResultType[];
  for (let i = 1; i < lines.length; i++) {
    const obj: ResultType = {} as ResultType;
    const currentline: string[] = lines[i].split(",");

    if (currentline.length > 1) {
      for (let j = 0; j < headers.length; j++) {
        obj[mapping[headers[j] as keyof MappingType] as keyof ResultType] =
          currentline[j] as ResultType[keyof ResultType];
      }
      result.push(obj as ResultType);
    }
  }
  return result;
};

export { readGSTFile };
