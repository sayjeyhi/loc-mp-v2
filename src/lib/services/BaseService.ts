import axios from 'axios'
import { debugLog } from '@/lib/utils/debug'

// import deepParseJson from "@/lib/utils/deepParseJson";

export const BaseOrgService = axios.create({
  timeout: 60000,
  baseURL: import.meta.env.VITE_ORG_BASE_URL,
})
export const BaseLocAdminService = axios.create({
  timeout: 60000,
  baseURL: import.meta.env.VITE_APP_LOC_STAGE_ADMIN_API_URL,
})

const useRequestToken = async (config: any) => {
  // const rawPersistData = await localStorage.getItem("admin");
  // const persistData = deepParseJson(rawPersistData) as any;

  const accessToken = localStorage.getItem('token')
  // const expirationTime = persistData.auth.user.tokenExpireTime;
  //
  // if (expirationTime && new Date().getTime() > expirationTime * 1000) {
  //   delete persistData.auth;
  //   localStorage.setItem("admin", JSON.stringify(persistData));
  // }

  if (accessToken) {
    config.headers['authorization'] = accessToken
  }

  config.headers['Accept'] = 'application/json'
  return config
}

const useReqLogger = async (config: any) => {
  debugLog('[REQ] headers:', config.headers)
  if (config.method?.toUpperCase() !== 'GET') {
    debugLog(`[REQ][${config.method?.toUpperCase()}]:`, config.url)
    debugLog('[REQ] data:', config.data)
  }
  return config
}
const useResLogger = async (res: any) => {
  // debugLog("[RES] url:", res.config.url);
  return res
}
const useResErrorLogger = async (error: any) => {
  // eslint-disable-next-line import/no-named-as-default-member
  if (axios.isAxiosError(error)) {
    debugLog('[ERR]', error.config?.url)
    debugLog('resp data:', error.response?.data)
  } else {
    debugLog('[ERR] non-axios', error)
  }
  return Promise.reject(error)
}

BaseLocAdminService.interceptors.request.use(useReqLogger)
BaseLocAdminService.interceptors.request.use(useRequestToken)
BaseLocAdminService.interceptors.response.use(useResLogger, useResErrorLogger)

BaseOrgService.interceptors.request.use(useReqLogger)
BaseOrgService.interceptors.request.use(useRequestToken)
BaseOrgService.interceptors.response.use(useResLogger, useResErrorLogger)

export default BaseOrgService
