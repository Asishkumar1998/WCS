const DEFAULT_API_BASE_URL = "https://wcsstestserver.azurewebsites.net/api/v1";

const normalizeApiBaseUrl = (url: string) => url.replace(/\/+$/, "");

const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

export const API_BASE_URL = normalizeApiBaseUrl(
  configuredApiBaseUrl || DEFAULT_API_BASE_URL,
);

export const buildApiUrl = (path: string) =>
  `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
