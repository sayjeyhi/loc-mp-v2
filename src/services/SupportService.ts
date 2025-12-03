import ApiService from "./ApiService";

export async function apiPostSupportRequest<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>(
    {
      url: "/api/loc-merchant-portal/v1/task/new",
      method: "POST",
      data,
    },
    true,
  );
}
