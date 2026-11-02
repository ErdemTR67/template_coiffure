export const publicBookingEnvironment = {
  apiUrl: process.env.NEXT_PUBLIC_BSRM_API_URL ?? "",
  siteKey: process.env.NEXT_PUBLIC_BSRM_SITE_KEY ?? "",
} as const;
