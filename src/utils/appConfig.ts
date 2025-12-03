export type AppConfig = {
  apiPrefix: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  locale: string;
  enableMock: boolean;
};

const appConfig: AppConfig = {
  apiPrefix: process.env.EXPO_PUBLIC_APP_API_BASE_URL,
  authenticatedEntryPath: "/app/dashboard",
  unAuthenticatedEntryPath: "/sign-in",
  locale: "en",
  enableMock: false,
};

export default appConfig;
