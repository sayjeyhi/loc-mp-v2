import Constants from "expo-constants";

const APP_VARIANT = Constants.expoConfig?.extra?.APP_VARIANT || "";

export const IS_BIZCAP = APP_VARIANT.startsWith("bizcap");
export const IS_NEWCO = APP_VARIANT.startsWith("newco");
