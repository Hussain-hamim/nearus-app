export const brand = {
  name: "NearTask",
  tagline: "Get help nearby. Pay in cash.",
  description:
    "NearTask is a local task marketplace for Afghanistan. Post a job, find a helper nearby, and pay in cash when the work is done.",
  currency: "AFN",
  currencySymbol: "؋",
  locale: "en-AF",
  country: "Afghanistan",
  distanceUnit: "km",
} as const;

export type Brand = typeof brand;
