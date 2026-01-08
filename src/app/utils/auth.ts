const LOGIN_TTL = 90 * 60 * 1000;

export const getAuth = () => {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem("auth");
  if (!raw) return null;

  const auth = JSON.parse(raw);

  const isExpired = Date.now() - auth.issuedAt > LOGIN_TTL;

  if (isExpired) {
    sessionStorage.removeItem("auth");
    return null;
  }

  return auth;
};
