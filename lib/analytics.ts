export const GA_MEASUREMENT_ID = "G-RYLV9KXDCX";
export const CLARITY_PROJECT_ID = "wxrublg1ay";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function pageview(url: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}
