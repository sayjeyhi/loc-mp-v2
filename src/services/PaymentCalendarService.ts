import ApiService from "./ApiService";
import { HTTP_METHODS } from "@/utils/constants/global";

const { GET } = HTTP_METHODS;

export async function apiGetPaymentCalendar<T>() {
  return ApiService.fetchData<T>(
    {
      url: "/api/loc-merchant-portal/v1/payment/expected-payback-payment",
      method: GET,
    },
    true,
  );
}
