/**
 * geoIntelligence — IP Geolocation, Timezone & Security Intelligence
 *
 * Automatically resolves visitor location (city, region, country, lat/long),
 * network ASN / ISP organization, and proxy/security indicators using
 * lightweight client-side IP lookup.
 *
 * Performance:
 * - Caches result in sessionStorage for the duration of the browser tab/session
 * - Zero repeated API calls on navigation or form submission
 * - 4-second timeout with fallback to browser timezone/locale so it NEVER blocks UI
 */

export interface GeoIntelligenceData {
  latitude: number | string;
  longitude: number | string;
  geo_accuracy_meters: number | string;
  geo_city: string;
  geo_region: string;
  geo_country: string;
  geo_country_code: string;
  geo_timezone: string;
  location_method: string;
  consent_status: string;
  client_ip: string;
  ip_city: string;
  ip_region: string;
  ip_country: string;
  ip_country_code: string;
  ip_org: string;
  ip_asn: string;
  ip_source: string;
  security_event: string;
}

const CACHE_KEY = "pm_geo_intel";

/** Get currently cached intelligence synchronously, or fallback defaults */
export function getCachedGeoIntelligence(): Partial<GeoIntelligenceData> {
  if (typeof window === "undefined") return {};
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    // ignore
  }

  // Fallback to browser timezone
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return {
      geo_timezone: tz,
      location_method: "browser_timezone",
      consent_status: "implicit",
    };
  } catch {
    return {};
  }
}

let inFlightPromise: Promise<GeoIntelligenceData> | null = null;

/**
 * Fetch and cache full IP & Geo intelligence.
 * Safe to call multiple times; uses caching and dedupes in-flight requests.
 */
export async function getGeoIntelligence(): Promise<GeoIntelligenceData> {
  if (typeof window === "undefined") {
    return {
      latitude: "",
      longitude: "",
      geo_accuracy_meters: "",
      geo_city: "",
      geo_region: "",
      geo_country: "",
      geo_country_code: "",
      geo_timezone: "",
      location_method: "server",
      consent_status: "n/a",
      client_ip: "",
      ip_city: "",
      ip_region: "",
      ip_country: "",
      ip_country_code: "",
      ip_org: "",
      ip_asn: "",
      ip_source: "",
      security_event: "",
    };
  }

  // 1. Check cache
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    // ignore
  }

  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = (async () => {
    const fallbackTz = (() => {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
      } catch {
        return "Asia/Kolkata";
      }
    })();

    let result: GeoIntelligenceData = {
      latitude: "",
      longitude: "",
      geo_accuracy_meters: "",
      geo_city: "",
      geo_region: "",
      geo_country: "",
      geo_country_code: "",
      geo_timezone: fallbackTz,
      location_method: "browser_timezone",
      consent_status: "implicit",
      client_ip: "",
      ip_city: "",
      ip_region: "",
      ip_country: "",
      ip_country_code: "",
      ip_org: "",
      ip_asn: "",
      ip_source: "browser",
      security_event: "standard_traffic",
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const resp = await fetch("https://freeipapi.com/api/json", {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const data = await resp.json();
        const tz =
          (Array.isArray(data.timeZones) && data.timeZones[0]) ||
          fallbackTz;

        result = {
          latitude: data.latitude !== undefined && data.latitude !== null ? data.latitude : "",
          longitude: data.longitude !== undefined && data.longitude !== null ? data.longitude : "",
          geo_accuracy_meters: 5000,
          geo_city: data.cityName || "",
          geo_region: data.regionName || "",
          geo_country: data.countryName || "",
          geo_country_code: data.countryCode || "",
          geo_timezone: tz,
          location_method: "ip_lookup",
          consent_status: "implicit_ip",
          client_ip: data.ipAddress || "",
          ip_city: data.cityName || "",
          ip_region: data.regionName || "",
          ip_country: data.countryName || "",
          ip_country_code: data.countryCode || "",
          ip_org: data.asnOrganization || "",
          ip_asn: data.asn ? String(data.asn) : "",
          ip_source: "freeipapi",
          security_event: data.isProxy ? "proxy_or_vpn" : "standard_traffic",
        };
      }
    } catch (err) {
      // Freeipapi failed or aborted; try fallback IP service
      try {
        const ipResp = await fetch("https://api.ipify.org?format=json", {
          signal: AbortSignal.timeout(2500),
        });
        if (ipResp.ok) {
          const ipData = await ipResp.json();
          if (ipData.ip) {
            result.client_ip = ipData.ip;
            result.ip_source = "ipify";
          }
        }
      } catch {
        // silent fallback
      }
    }

    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(result));
    } catch {
      // storage unavailable
    }

    return result;
  })();

  return inFlightPromise;
}
