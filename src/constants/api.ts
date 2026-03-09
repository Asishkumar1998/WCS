const DEFAULT_API_BASE_URL = "https://wcsstestserver.azurewebsites.net/api/v1";
// const DEFAULT_API_BASE_URL = "http://localhost:12982/api/v1/";
const DEFAULT_LEGACY_PORTAL_LOGIN_URL = "https://wcsstestclient.azurewebsites.net/security/login";

const normalizeApiBaseUrl = (url: string) => url.replace(/\/+$/, "");
const normalizeUrl = (url: string) => url.replace(/\/+$/, "");

const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const configuredLegacyPortalLoginUrl =
  process.env.NEXT_PUBLIC_LEGACY_PORTAL_LOGIN_URL?.trim();

export const API_BASE_URL = normalizeApiBaseUrl(
  configuredApiBaseUrl || DEFAULT_API_BASE_URL,
);
export const LEGACY_PORTAL_LOGIN_URL = normalizeUrl(
  configuredLegacyPortalLoginUrl || DEFAULT_LEGACY_PORTAL_LOGIN_URL,
);

export const buildApiUrl = (path: string) =>
  `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
