import ApiService from "./ApiService";

export async function apiGetAccountProfile<T>() {
  return ApiService.fetchData<T>(
    {
      url: "/api/loc-merchant-portal/v1/profile/",
      method: "GET",
    },
    true,
  );
}
