import { HTTP_METHODS } from "@/utils/constants/global";
import ApiService from "../ApiService";

const { POST, GET, DELETE, PUT } = HTTP_METHODS;

export async function apiPostAddNotificationRequest<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>({
    url: "/v1/admin-notification/create",
    method: POST,
    data,
  });
}

export async function apiGetAdminNotificationData<
  T,
  U extends Record<string, unknown>,
>(params: U) {
  return ApiService.fetchData<T>({
    url: "/v1/admin-notification",
    method: GET,
    params,
  });
}

export async function apiGetUserNotificationData<
  T,
  U extends Record<string, unknown>,
>(params: U) {
  return ApiService.fetchData<T>({
    url: "/v1/user-notification",
    method: GET,
    params,
  });
}

export async function apiGetLatestUserNotificationData<T>({
  userId,
  timezone,
}: {
  userId: string;
  timezone: string;
}) {
  return ApiService.fetchData<T>({
    url: "/v1/user-notification/get-latest-notifications",
    method: GET,
    params: { userId, timezone },
  });
}

export async function apiGetMaintenanceData<
  T,
  U extends Record<string, unknown>,
>(params: U) {
  return ApiService.fetchData<T>({
    url: "/v1/maintenance",
    method: GET,
    params,
  });
}

export async function apiDeleteNotification<
  T,
  U extends Record<string, unknown>,
>(params: U) {
  return ApiService.fetchData<T>({
    url: `/v1/admin-notification/${params.id}`,
    method: DELETE,
  });
}

export async function apiDismissNotification<
  T,
  U extends Record<string, unknown>,
>(id: string, data: U) {
  return ApiService.fetchData<T>({
    url: `/v1/user-notification/dismiss-notification/${id}`,
    method: PUT,
    data,
  });
}

export async function apiUnDismissNotification<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>({
    url: `/v1/user-notification/un-dismiss-notification`,
    method: POST,
    data,
  });
}
