/**
 * SSRF guard for user-supplied feed URLs. Mirrors the validation in
 * lib/integrations/canvas-ical.ts: only public HTTPS hosts are allowed;
 * localhost, link-local, and private IPv4/IPv6 ranges are rejected. Call it
 * again on the post-redirect response URL to defeat redirect-based SSRF.
 */
export function assertPublicHttpsUrl(value: string): URL {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("Enter a valid https:// URL");
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const privateIpv4 =
    /^(?:10\.|127\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(
      hostname,
    );

  if (
    url.protocol !== "https:" ||
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    hostname === "::1" ||
    hostname === "0.0.0.0" ||
    /^(?:fc|fd|fe8|fe9|fea|feb)/i.test(hostname) ||
    privateIpv4
  ) {
    throw new Error(
      "Enter a public https:// URL (private and local hosts are blocked)",
    );
  }
  return url;
}
