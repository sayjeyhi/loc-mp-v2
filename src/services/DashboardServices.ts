// import { idempotencyManagers } from "@/utils/idempotency";
import ApiService from "./ApiService";

export async function apiPostWithdrawRequest<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>(
    {
      url: "/api/loc-merchant-portal/v1/draw/preview",
      method: "post",
      data,
    },
    true,
  );
}

export async function apiPostWithdrawAccept<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>(
    {
      url: "/api/loc-merchant-portal/v1/draw/create",
      method: "post",
      data,
      // headers: {
      //   "Idempotence-Key": idempotencyManagers.drawCreate.getKey(),
      // },
    },
    true,
  );
}
