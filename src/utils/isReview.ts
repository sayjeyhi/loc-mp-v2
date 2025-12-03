import * as Application from "expo-application";

export async function isProductionMode() {
  const bundleId = Application.applicationId || ""; // e.g. com.example.app
  const buildNumber = Application.nativeApplicationVersion || ""; // CFBundleVersion
  const currentLine = `${bundleId}=${buildNumber}`;

  const response = await fetch(
    "https://gist.githubusercontent.com/sayjeyhi/fffa60c7b7db0a23205befe6ef90256f/raw/gistfile1.txt?v=" +
      new Date().getTime(),
  );
  const text = await response.text();
  const lines = text.split("\n");
  console.log("LINES", lines, currentLine);
  return lines.find((line) => line === currentLine) !== undefined;
}
