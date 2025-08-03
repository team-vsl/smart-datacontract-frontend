const TOKEN_NAME = "_vaaitk";

const CookiesCoefficient = {
  SESSION: 1000 * 60 * 60, // 1 giờ
  PERSISTENT: null,
};

const _isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

function _getCookieOptions({
  expires,
  secure = !_isLocalhost,
  sameSite = "Strict",
  path = "/",
}: {
  expires?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  path?: string;
}) {
  let cookie = `${path ? `path=${path};` : ""}`;
  cookie += sameSite ? `SameSite=${sameSite};` : "";
  if (secure) cookie += "Secure;";
  if (expires) cookie += `expires=${expires};`;
  return cookie;
}

/**
 * Write a persistent cookie (no expiry set = browser will store indefinitely)
 * @param name
 * @param value
 */
function writePersistentCookie(name: string, value: string) {
  const options = _getCookieOptions({});
  document.cookie = `${name}=${value}; ${options}`;
}

/**
 * Write a session cookie that expires after `expireTime` hours
 * @param name
 * @param value
 * @param expireTime
 */
function writeSessionCookie(
  name: string,
  value: string,
  expireTime: string | number
) {
  let expireDate;

  if (typeof expireTime === "number") {
    let safeExpireTime = Math.max(1, expireTime);
    expireDate = new Date(
      CookiesCoefficient.SESSION * safeExpireTime + Date.now()
    );
    expireTime = expireDate.toUTCString();
  }
  const options = _getCookieOptions({ expires: expireTime });
  document.cookie = `${name}=${value}; ${options}`;
}

/**
 * Read a cookie with the specified name
 * @param name
 * @returns
 */
function readCookie(name: string) {
  const reg = new RegExp(`(?:(?:^|.*;\\s*)${name}\\s*=\\s*([^;]*).*$)|^.*$`);
  return document.cookie.replace(reg, "$1");
}

/**
 * Remove cookie by name
 * @param name
 */
function removeCookie(name: string) {
  const options = _getCookieOptions({
    expires: "Thu, 01 Jan 1970 00:00:00 UTC",
  });
  document.cookie = `${name}=; ${options}`;
}

export {
  TOKEN_NAME,
  CookiesCoefficient,
  writePersistentCookie,
  writeSessionCookie,
  readCookie,
  removeCookie,
};
