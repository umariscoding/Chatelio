export const parseSubdomain = (hostname: string): string | null => {
  if (!hostname.includes(".")) {
    return null;
  }

  const parts = hostname.split(".");

  if (parts.length < 2) {
    return null;
  }

  const domainPart = parts[parts.length - 1].split(":")[0];
  const secondLastPart = parts[parts.length - 2]?.split(":")[0];

  const isLocalhost =
    domainPart === "localhost" || secondLastPart === "localhost";

  let subdomain: string | null = null;

  if (isLocalhost) {
    if (parts.length === 2) {
      subdomain = parts[0].split(":")[0];
    } else if (parts.length === 3) {
      const first = parts[0].split(":")[0];
      const second = parts[1].split(":")[0];

      if (["dev", "staging", "local"].includes(first)) {
        subdomain = second;
      } else {
        subdomain = first;
      }
    }
  } else {
    if (parts.length === 3) {
      subdomain = parts[0].split(":")[0];
    } else if (parts.length === 4) {
      subdomain = parts[1].split(":")[0];
    }
  }

  const reservedSubdomains = [
    "www",
    "api",
    "admin",
    "dashboard",
    "app",
    "dev",
    "staging",
    "local",
    "test",
  ];

  const isValid =
    subdomain &&
    !reservedSubdomains.includes(subdomain) &&
    subdomain.length >= 3;

  return isValid ? subdomain : null;
};
