export const debugLog = (message: string, ...optionalParams: any[]) => {
  if (import.meta.env.DEV) {
    console.log(`[DEBUG]: ${message}`, ...optionalParams);
  }
};
