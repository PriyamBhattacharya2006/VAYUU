export type Audience = "family" | "school" | "neighborhood";

export type Commute = "walk" | "cycle" | "transit" | "car" | "remote";
export type Cooking = "gas" | "induction" | "biomass" | "mixed";
export type Heating = "none" | "electric" | "gas" | "solid";

export type Place = {
  name: string;
  admin?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type Profile = {
  audience: Audience;
  adults: number;
  children: number;
  elders: number;
  sensitive: boolean;
  commute: Commute;
  cooking: Cooking;
  heating: Heating;
  streetFacing: boolean;
  purifier: boolean;
  outdoorExercise: boolean;
};

export type HourPoint = {
  time: string;
  aqi: number;
  pm25: number;
};

export type AirSnapshot = {
  place: Place;
  observedAt: string;
  timezone: string;
  aqi: number;
  pm25: number;
  pm10: number | null;
  no2: number | null;
  o3: number | null;
  co: number | null;
  so2: number | null;
  temperatureC: number | null;
  humidity: number | null;
  windKmh: number | null;
  hours: HourPoint[];
};

export type PlanCard = {
  title: string;
  action: string;
  impact: string;
};

export type RoutineCard = PlanCard & { time: string };

export type SwapCard = {
  insteadOf: string;
  tryThis: string;
  impact: string;
};

export type TailoredPlan = {
  headline: string;
  whyToday: string;
  routines: RoutineCard[];
  indoor: PlanCard[];
  swaps: SwapCard[];
  together: PlanCard[];
  doNotBother: string[];
};

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type AirResult = { ok: true; air: AirSnapshot } | { ok: false; error: string };

export const WHO = {
  pm25: 15,
  pm10: 45,
  no2: 25,
  o3: 100,
  so2: 40,
  co: 4000,
} as const;

export const DEFAULT_PLACE: Place = {
  name: "Delhi",
  admin: "Delhi",
  country: "India",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: "Asia/Kolkata",
};

export const DEFAULT_PROFILE: Profile = {
  audience: "family",
  adults: 2,
  children: 1,
  elders: 0,
  sensitive: false,
  commute: "car",
  cooking: "gas",
  heating: "none",
  streetFacing: true,
  purifier: false,
  outdoorExercise: true,
};

export const PRESETS: Place[] = [
  DEFAULT_PLACE,
  {
    name: "Lahore",
    admin: "Punjab",
    country: "Pakistan",
    latitude: 31.5204,
    longitude: 74.3587,
    timezone: "Asia/Karachi",
  },
  {
    name: "Beijing",
    admin: "Beijing",
    country: "China",
    latitude: 39.9042,
    longitude: 116.4074,
    timezone: "Asia/Shanghai",
  },
  {
    name: "Ulaanbaatar",
    admin: "Ulaanbaatar",
    country: "Mongolia",
    latitude: 47.8864,
    longitude: 106.9057,
    timezone: "Asia/Ulaanbaatar",
  },
  {
    name: "Kraków",
    admin: "Lesser Poland",
    country: "Poland",
    latitude: 50.0647,
    longitude: 19.945,
    timezone: "Europe/Warsaw",
  },
  {
    name: "Milan",
    admin: "Lombardy",
    country: "Italy",
    latitude: 45.4642,
    longitude: 9.19,
    timezone: "Europe/Rome",
  },
  {
    name: "Tehran",
    admin: "Tehran",
    country: "Iran",
    latitude: 35.6892,
    longitude: 51.389,
    timezone: "Asia/Tehran",
  },
  {
    name: "Los Angeles",
    admin: "California",
    country: "United States",
    latitude: 34.0522,
    longitude: -118.2437,
    timezone: "America/Los_Angeles",
  },
];

export type BandId = "good" | "moderate" | "sensitive" | "unhealthy" | "very" | "hazardous";

export function bandOf(aqi: number): { id: BandId; label: string; chip: string } {
  if (aqi <= 50) return { id: "good", label: "Good", chip: "bg-good-bg text-good" };
  if (aqi <= 100) return { id: "moderate", label: "Moderate", chip: "bg-warn-bg text-warn" };
  if (aqi <= 150) {
    return { id: "sensitive", label: "Unhealthy for sensitive groups", chip: "bg-warn-bg text-warn" };
  }
  if (aqi <= 200) return { id: "unhealthy", label: "Unhealthy", chip: "bg-bad-bg text-bad" };
  if (aqi <= 300) return { id: "very", label: "Very unhealthy", chip: "bg-bad-bg text-bad" };
  return { id: "hazardous", label: "Hazardous", chip: "bg-ink text-accent-fg" };
}

export function sameCoord(a: Place, b: Place): boolean {
  return Math.abs(a.latitude - b.latitude) < 0.02 && Math.abs(a.longitude - b.longitude) < 0.02;
}

export function timesGuideline(value: number, guide: number): string {
  const ratio = value / guide;
  if (ratio < 1) return "under the WHO daily guideline";
  if (ratio < 1.25) return "near the WHO daily guideline";
  const rounded = ratio >= 10 ? String(Math.round(ratio)) : String(Math.round(ratio * 10) / 10);
  return `${rounded}× the WHO daily guideline`;
}

export function inhaledUg(pm25: number, minutes = 45): number {
  return Math.round(pm25 * 1.2 * (minutes / 60));
}

export function planCacheKey(place: Place, profile: Profile, bandId: string, day: string): string {
  return [
    place.latitude.toFixed(2),
    place.longitude.toFixed(2),
    bandId,
    day,
    profile.audience,
    profile.adults,
    profile.children,
    profile.elders,
    profile.sensitive ? "1" : "0",
    profile.commute,
    profile.cooking,
    profile.heating,
    profile.streetFacing ? "1" : "0",
    profile.purifier ? "1" : "0",
    profile.outdoorExercise ? "1" : "0",
  ].join(":");
}

export function placeLabel(place: Place): string {
  const region = [place.admin, place.country].filter(Boolean).join(", ");
  return region ? `${place.name}, ${region}` : place.name;
}
