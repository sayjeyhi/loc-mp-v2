import ApiService from "./ApiService";
import { HTTP_METHODS } from "@/utils/constants/global";

const { GET } = HTTP_METHODS;

export async function apiGetTransactionHistory<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>(
    {
      url: "/api/loc-merchant-portal/v1/payment/",
      method: GET,
      params: data,
    },
    true,
  );
}
