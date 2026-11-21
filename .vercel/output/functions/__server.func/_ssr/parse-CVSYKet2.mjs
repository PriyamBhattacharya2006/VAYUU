//#region node_modules/.nitro/vite/services/ssr/assets/parse-CVSYKet2.js
var WHO = {
	pm25: 15,
	pm10: 45,
	no2: 25,
	o3: 100,
	so2: 40,
	co: 4e3
};
var DEFAULT_PLACE = {
	name: "Delhi",
	admin: "Delhi",
	country: "India",
	latitude: 28.6139,
	longitude: 77.209,
	timezone: "Asia/Kolkata"
};
var DEFAULT_PROFILE = {
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
	outdoorExercise: true
};
var PRESETS = [
	DEFAULT_PLACE,
	{
		name: "Lahore",
		admin: "Punjab",
		country: "Pakistan",
		latitude: 31.5204,
		longitude: 74.3587,
		timezone: "Asia/Karachi"
	},
	{
		name: "Beijing",
		admin: "Beijing",
		country: "China",
		latitude: 39.9042,
		longitude: 116.4074,
		timezone: "Asia/Shanghai"
	},
	{
		name: "Ulaanbaatar",
		admin: "Ulaanbaatar",
		country: "Mongolia",
		latitude: 47.8864,
		longitude: 106.9057,
		timezone: "Asia/Ulaanbaatar"
	},
	{
		name: "Kraków",
		admin: "Lesser Poland",
		country: "Poland",
		latitude: 50.0647,
		longitude: 19.945,
		timezone: "Europe/Warsaw"
	},
	{
		name: "Milan",
		admin: "Lombardy",
		country: "Italy",
		latitude: 45.4642,
		longitude: 9.19,
		timezone: "Europe/Rome"
	},
	{
		name: "Tehran",
		admin: "Tehran",
		country: "Iran",
		latitude: 35.6892,
		longitude: 51.389,
		timezone: "Asia/Tehran"
	},
	{
		name: "Los Angeles",
		admin: "California",
		country: "United States",
		latitude: 34.0522,
		longitude: -118.2437,
		timezone: "America/Los_Angeles"
	}
];
function bandOf(aqi) {
	if (aqi <= 50) return {
		id: "good",
		label: "Good",
		chip: "bg-good-bg text-good"
	};
	if (aqi <= 100) return {
		id: "moderate",
		label: "Moderate",
		chip: "bg-warn-bg text-warn"
	};
	if (aqi <= 150) return {
		id: "sensitive",
		label: "Unhealthy for sensitive groups",
		chip: "bg-warn-bg text-warn"
	};
	if (aqi <= 200) return {
		id: "unhealthy",
		label: "Unhealthy",
		chip: "bg-bad-bg text-bad"
	};
	if (aqi <= 300) return {
		id: "very",
		label: "Very unhealthy",
		chip: "bg-bad-bg text-bad"
	};
	return {
		id: "hazardous",
		label: "Hazardous",
		chip: "bg-ink text-accent-fg"
	};
}
function sameCoord(a, b) {
	return Math.abs(a.latitude - b.latitude) < .02 && Math.abs(a.longitude - b.longitude) < .02;
}
function timesGuideline(value, guide) {
	const ratio = value / guide;
	if (ratio < 1) return "under the WHO daily guideline";
	if (ratio < 1.25) return "near the WHO daily guideline";
	return `${ratio >= 10 ? String(Math.round(ratio)) : String(Math.round(ratio * 10) / 10)}× the WHO daily guideline`;
}
function inhaledUg(pm25, minutes = 45) {
	return Math.round(pm25 * 1.2 * (minutes / 60));
}
function planCacheKey(place, profile, bandId, day) {
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
		profile.outdoorExercise ? "1" : "0"
	].join(":");
}
function placeLabel(place) {
	const region = [place.admin, place.country].filter(Boolean).join(", ");
	return region ? `${place.name}, ${region}` : place.name;
}
function isRecord(v) {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}
function oneOf(value, allowed, fallback) {
	return typeof value === "string" && allowed.includes(value) ? value : fallback;
}
function clampInt(value, min, max, fallback) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) return fallback;
	return Math.max(min, Math.min(max, Math.round(n)));
}
var audiences = [
	"family",
	"school",
	"neighborhood"
];
var commutes = [
	"walk",
	"cycle",
	"transit",
	"car",
	"remote"
];
var cookings = [
	"gas",
	"induction",
	"biomass",
	"mixed"
];
var heatings = [
	"none",
	"electric",
	"gas",
	"solid"
];
function parsePlace(input) {
	if (!isRecord(input)) throw new Error("Missing place");
	const latitude = Number(input.latitude);
	const longitude = Number(input.longitude);
	const name = typeof input.name === "string" ? input.name.trim().slice(0, 80) : "";
	const country = typeof input.country === "string" ? input.country.trim().slice(0, 80) : "";
	const timezone = typeof input.timezone === "string" && input.timezone.trim() ? input.timezone.trim().slice(0, 80) : "auto";
	if (!name || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) throw new Error("Invalid place");
	if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) throw new Error("Invalid place");
	return {
		name,
		admin: typeof input.admin === "string" && input.admin.trim() ? input.admin.trim().slice(0, 80) : void 0,
		country,
		latitude,
		longitude,
		timezone
	};
}
function parseProfile(input) {
	const o = isRecord(input) ? input : {};
	return {
		audience: oneOf(o.audience, audiences, "family"),
		adults: clampInt(o.adults, 0, 20, 2),
		children: clampInt(o.children, 0, 40, 0),
		elders: clampInt(o.elders, 0, 20, 0),
		sensitive: o.sensitive === true,
		commute: oneOf(o.commute, commutes, "transit"),
		cooking: oneOf(o.cooking, cookings, "gas"),
		heating: oneOf(o.heating, heatings, "none"),
		streetFacing: o.streetFacing === true,
		purifier: o.purifier === true,
		outdoorExercise: o.outdoorExercise === true
	};
}
//#endregion
export { bandOf as a, parsePlace as c, planCacheKey as d, sameCoord as f, WHO as i, parseProfile as l, DEFAULT_PROFILE as n, inhaledUg as o, timesGuideline as p, PRESETS as r, isRecord as s, DEFAULT_PLACE as t, placeLabel as u };
