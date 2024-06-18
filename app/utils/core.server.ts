// Core Service APIs
import axios from "axios";

export const ax = axios.create({
  baseURL: ENV.CORE_URL,
  // timeout: 9000,
  headers: { "X-Request-From": "Website" },
  // transformRequest: axios.defaults.transformRequest,
  // transformResponse: axios.defaults.transformResponse,
});

// axios.defaults.baseURL = ENV.CORE_URL
// const ax = axios

export const h = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});
export const extractResponseData = (res: any) => res.data;

export const v1 = "/api/v1";

export const healthCheck = () => ax.get("/health/");

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-= AUTH =-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
const auth = `${v1}/auth`;
const checkAuth = (token: string) => ax.get(`${auth}/`, h(token));
const login = (data: object) => ax.post(`${auth}/`, data);
const signup = (data: object) => ax.post(`${auth}/signup/`, data);
const getUserProfile = (token: string) => ax.get(`${auth}/profile`, h(token));
const updateUserProfile = (token: string) =>
  ax.patch(`${auth}/profile`, h(token)); // TODO: duplicate
const sendPhoneVerification = (token: string) =>
  ax.post(`${auth}/send-phone-verification`, {}, h(token));
const sendEmailVerification = (token: string) =>
  ax.post(`${auth}/send-email-verification`, {}, h(token));
const sendPasswordReset = (data: object) =>
  ax.post(`${auth}/send-password-reset`, data); // TODO: could take token instead of passing data?
const verifyPhone = (token: string, data: object) =>
  ax.post(`${auth}/verify-phone`, data, h(token));
const verifyEmail = (token: string, data: object) =>
  ax.post(`${auth}/verify-email`, data, h(token));
const resetPassword = (data: object) => ax.post(`${auth}/reset-password`, data); // TODO: could take token instead of passing data?
const updateProfile = (token: string, data: object) =>
  ax.patch(`${auth}/profile`, data, h(token));

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=- GROUPS =-=-=-=-=-=-=-=-=-=-=-=-=-=- */
const groups = `${v1}/groups`;
const getUserGroups = (token: string) =>
  ax.get(`${groups}/`, h(token)).then(extractResponseData);
const createGroup = (token: string, data: object) =>
  ax.post(`${groups}/`, data, h(token)).then(extractResponseData);
const getGroupDetails = (id: string, token: string) =>
  ax.get(`${groups}/${id}/`, h(token)).then(extractResponseData);
const deleteGroup = (id: string, token: string) =>
  ax.delete(`${groups}/${id}`, h(token));

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=- DEVICES =-=-=-=-=-=-=-=-=-=-=-=-=-= */
const devices = `${v1}/devices`;
const getDeviceTypes = (token: string) =>
  ax.get(`${devices}/types/`, h(token)).then(extractResponseData);
const createDevice = (token: string, data: object) =>
  ax.post(`${devices}`, data, h(token)).then(extractResponseData);
const getDeviceDetails = (id: string, token: string) =>
  ax.get(`${devices}/${id}/`, h(token)).then(extractResponseData);
const deleteDevice = (id: string, token: string) =>
  ax.delete(`${devices}/${id}/`, h(token)).then(extractResponseData);
const updateDevice = (id: string, token: string, data: object) =>
  ax.patch(`${devices}/${id}/`, data, h(token)).then(extractResponseData);
const detachDevice = (id: string, token: string) =>
  ax.post(`${devices}/${id}/detach/`, {}, h(token)).then(extractResponseData);
const getOrphanDevices = (token: string) =>
  ax.get(`${devices}/`, h(token)).then(extractResponseData);
const transferDevice = (id: string, token: string, data: object) =>
  ax
    .post(`${devices}/${id}/transfer`, data, h(token))
    .then(extractResponseData);
const getDeviceLogs = (token: string, dId: string) =>
  ax.get(`${v1}/statistics/logs/${dId}`, h(token)).then(extractResponseData);

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=- UTILS =-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
const delay = (time: number) => ax.get(`${v1}/dev/delay?time=${time}`);
const dly = (t: number) =>
  fetch(`${process.env.CORE_ADDR}/api/v1/dev/delay?time=${t}`);

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=- ADMIN =-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
const admin = `${v1}/admin`;
const adminGetInitialData = (token: string) =>
  ax.get(`${admin}`, h(token)).then(extractResponseData);
const adminGetUsers = (token: string) =>
  ax.get(`${admin}/users`, h(token)).then(extractResponseData);
const adminGetFirmwareUpdates = (token: string) =>
  ax.get(`${admin}/firmware-updates`, h(token)).then(extractResponseData);
const adminPostFirmwareUpdate = (formData: FormData, token: string) =>
  ax
    .post(`${admin}/firmware-updates`, formData, h(token))
    .then(extractResponseData);
const adminGetFirmwareUpdateDetail = (id: string, token: string) =>
  ax.get(`${admin}/firmware-updates/${id}`, h(token)).then(extractResponseData);
const adminPatchFirmwareUpdate = (
  id: string,
  formData: FormData,
  token: string
) =>
  ax
    .patch(`${admin}/firmware-updates/${id}`, formData, h(token))
    .then(extractResponseData);
const adminDeleteFirmwareUpdate = (id: string, token: string) =>
  ax
    .delete(`${admin}/firmware-updates/${id}`, h(token))
    .then(extractResponseData);
const adminGetDevices = (token: string) =>
  ax.get(`${admin}/devices`, h(token)).then(extractResponseData);
const adminGetAreas = (token: string) =>
  ax.get(`${admin}/areas`, h(token)).then(extractResponseData);
const adminGetNetwork = (token: string) =>
  ax.get(`${admin}/network`, h(token)).then(extractResponseData);
const adminSendDeviceMessage = (token: string, dId: string, msg: object) =>
  ax
    .post(`${admin}/devices/${dId}/message`, msg, h(token))
    .then(extractResponseData);

const api = {
  v1,
  healthCheck,

  checkAuth,
  login,
  signup,
  getUserProfile,
  updateUserProfile,
  sendPhoneVerification,
  sendEmailVerification,
  sendPasswordReset,
  verifyPhone,
  verifyEmail,
  resetPassword,
  updateProfile,

  getUserGroups,
  createGroup,
  getGroupDetails,
  deleteGroup,

  getDeviceTypes,
  createDevice,
  getDeviceDetails,
  deleteDevice,
  updateDevice,
  detachDevice,
  getOrphanDevices,
  transferDevice,
  getDeviceLogs,

  delay,
  dly,

  adminGetInitialData,
  adminGetUsers,
  adminGetFirmwareUpdates,
  adminPostFirmwareUpdate,
  adminGetFirmwareUpdateDetail,
  adminPatchFirmwareUpdate,
  adminDeleteFirmwareUpdate,
  adminGetDevices,
  adminGetAreas,
  adminGetNetwork,
  adminSendDeviceMessage,
};

export default api;
