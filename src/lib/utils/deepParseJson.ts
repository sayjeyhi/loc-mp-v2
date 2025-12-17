const isNumString = (str: string): boolean => !isNaN(Number(str));

type JsonObject = { [key: string]: unknown };
type JsonArray = unknown[];
type Json = JsonObject | JsonArray | string | number | boolean | null;

function deepParseJson(jsonString: Json): Json {
  if (typeof jsonString === "string") {
    if (isNumString(jsonString)) {
      return jsonString;
    }
    try {
      return deepParseJson(JSON.parse(jsonString));
    } catch {
      return jsonString;
    }
  } else if (Array.isArray(jsonString)) {
    return jsonString.map((val) => deepParseJson(val as Json));
  } else if (typeof jsonString === "object" && jsonString !== null) {
    return Object.keys(jsonString).reduce<JsonObject>((obj, key) => {
      const val = jsonString[key];
      obj[key] =
        typeof val === "string" && isNumString(val)
          ? val
          : deepParseJson(val as Json);
      return obj;
    }, {});
  } else {
    return jsonString;
  }
}

export default deepParseJson;
