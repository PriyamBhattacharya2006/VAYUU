import type { Audience, Commute, Cooking, Heating, Place, Profile } from "@/lib/air";

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

const audiences = ["family", "school", "neighborhood"] as const;
const commutes = ["walk", "cycle", "transit", "car", "remote"] as const;
const cookings = ["gas", "induction", "biomass", "mixed"] as const;
const heatings = ["none", "electric", "gas", "solid"] as const;

export function parsePlace(input: unknown): Place {
  if (!isRecord(input)) throw new Error("Missing place");
  const latitude = Number(input.latitude);
  const longitude = Number(input.longitude);
  const name = typeof input.name === "string" ? input.name.trim().slice(0, 80) : "";
  const country = typeof input.country === "string" ? input.country.trim().slice(0, 80) : "";
  const timezone =
    typeof input.timezone === "string" && input.timezone.trim()
      ? input.timezone.trim().slice(0, 80)
      : "auto";
  if (!name || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Invalid place");
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Invalid place");
  }
  const admin =
    typeof input.admin === "string" && input.admin.trim()
      ? input.admin.trim().slice(0, 80)
      : undefined;
  return { name, admin, country, latitude, longitude, timezone };
}

export function parseProfile(input: unknown): Profile {
  const o = isRecord(input) ? input : {};
  return {
    audience: oneOf<Audience>(o.audience, audiences, "family"),
    adults: clampInt(o.adults, 0, 20, 2),
    children: clampInt(o.children, 0, 40, 0),
    elders: clampInt(o.elders, 0, 20, 0),
    sensitive: o.sensitive === true,
    commute: oneOf<Commute>(o.commute, commutes, "transit"),
    cooking: oneOf<Cooking>(o.cooking, cookings, "gas"),
    heating: oneOf<Heating>(o.heating, heatings, "none"),
    streetFacing: o.streetFacing === true,
    purifier: o.purifier === true,
    outdoorExercise: o.outdoorExercise === true,
  };
}
