import {API_URL, BASE_DOMAIN_URL,FB_OAUTH_URL} from '@env';

// ─── Base Config ────────────────────────────────────────────────────────────

export const BASE_URL = API_URL;
export const BASE_DOMAIN = BASE_DOMAIN_URL;
export const  FIREBASE_OAUTH_URL = FB_OAUTH_URL

export const IS_DEV = __DEV__;

export const getApiBaseUrl = () => BASE_URL;

// ─── API Route Segments ──────────────────────────────────────────────────────

export const ROUTES = {
  PO_REGISTER: '/poRegister',
  COMMON_MAST: '/commonMast',
  SUPPLIER: '/supplier',
  PO_DATA: '/poData',
  MIS_DASHBOARD: '/misDashboard',
  ORD_MANAGEMENT: '/ordManagement',
  LOGIN: 'users/login',
  USERS: 'users',
  USER_DETAILS: 'userDetails',
  PERMISSION: 'Permission',
  NOTIFICATION: 'Notifi',
  LEAVE: 'leave',
  ADVANCE: 'advance',
  ROLE: 'role',
  ON_DUTY: 'onduty',
  ATT: 'attendance',
};

// ─── Flat route exports (legacy imports from service files) ──────────────────

export const PO_REGISTER = ROUTES.PO_REGISTER;
export const COMMON_MAST = ROUTES.COMMON_MAST;
export const SUPPLIER = ROUTES.SUPPLIER;
export const PO_DATA = ROUTES.PO_DATA;
export const MIS_DASHBOARD = ROUTES.MIS_DASHBOARD;
export const ORD_MANAGEMENT = ROUTES.ORD_MANAGEMENT;
export const Notifi = ROUTES.NOTIFICATION;
export const Permission = ROUTES.PERMISSION;
export const Role = ROUTES.ROLE;
export const Leave = ROUTES.LEAVE;
export const Advance = ROUTES.ADVANCE;
export const onduty = ROUTES.ON_DUTY;

export const attendance = ROUTES.ATT;

// ─── Full URL constants (used directly in service query builders) ─────────────

export const LOGIN_API = ROUTES.LOGIN;
export const USERS_API = ROUTES.USERS;
export const UserDetails = ROUTES.USER_DETAILS;

/**
 * RESOLVED_BASE_URL — legacy export kept for backward compatibility.
 * Prefer getApiBaseUrl() for dynamic IP resolution.
 * This is a snapshot of the initial value; use getApiBaseUrl() in query builders.
 */
export const RESOLVED_BASE_URL = BASE_URL;

/**
 * Returns the Onduty image URL using the current resolved base URL.
 * Call this as a function so it always uses the latest resolved IP.
 */
export const getOndutyImageUrl = () =>
  `${getApiBaseUrl()}/${ROUTES.ON_DUTY}/Onduty_uploaded_image`;

/**
 * Onduty_Image_url — used as a base URL string for onduty image requests.
 * Wrapped as a getter so DNS resolution is always respected at call time.
 */
export const Onduty_Image_url = `${BASE_URL}/${ROUTES.ON_DUTY}/Onduty_uploaded_image`;
