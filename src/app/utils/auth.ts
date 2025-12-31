const LOGIN_TTL = 30 * 60 * 1000; // 30 mins

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
