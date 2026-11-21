import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as bandOf, c as parsePlace, d as planCacheKey, f as sameCoord, i as WHO, l as parseProfile, n as DEFAULT_PROFILE, r as PRESETS, t as DEFAULT_PLACE, u as placeLabel } from "./parse-CVSYKet2.mjs";
import { t as buildGuide } from "./guide-Bx2fWpQl.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as LocateFixed, i as Minus, n as Search, r as Plus } from "../_libs/lucide-react.mjs";
import { a as locatePlace, i as fetchAir, n as Route, o as searchCities, r as askAir, s as writePlan } from "./router-D5J_FoGJ.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Tb7EnPJT.js
var routes_Tb7EnPJT_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "hearthline.v1";
function readSaved() {
	if (typeof localStorage === "undefined") return null;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return null;
		const row = parsed;
		return {
			place: parsePlace(row.place),
			profile: parseProfile(row.profile),
			plan: row.plan && typeof row.plan === "object" ? row.plan : null,
			planKey: typeof row.planKey === "string" ? row.planKey : null,
			messages: Array.isArray(row.messages) ? row.messages.filter((turn) => !!turn && typeof turn === "object" && (turn.role === "user" || turn.role === "assistant") && typeof turn.content === "string").slice(-8) : []
		};
	} catch {
		return null;
	}
}
function writeSaved(saved) {
	try {
		localStorage.setItem(KEY, JSON.stringify(saved));
	} catch {}
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-50", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg",
			secondary: "border border-line bg-sheet text-ink hover:bg-paper",
			ghost: "bg-transparent text-ink"
		},
		size: {
			md: "h-11 px-4",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function shortRatio(value, guide) {
	const ratio = value / guide;
	if (ratio < 1) return "Under WHO";
	if (ratio < 1.25) return "Near WHO";
	return `${ratio >= 10 ? String(Math.round(ratio)) : String(Math.round(ratio * 10) / 10)}× WHO`;
}
function weatherLine(air) {
	const bits = [];
	if (air.temperatureC != null) bits.push(`${Math.round(air.temperatureC)}°C`);
	if (air.humidity != null) bits.push(`${Math.round(air.humidity)}% humidity`);
	if (air.windKmh != null) {
		const wind = air.windKmh < 10 ? air.windKmh.toFixed(1) : String(Math.round(air.windKmh));
		bits.push(`wind ${wind} km/h`);
	}
	return bits.join(" · ");
}
function AirChart({ hours, bestLabel }) {
	const [Chart, setChart] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		import("./hour-chart-QHCUap9k.mjs").then((mod) => setChart(() => mod.HourChart));
	}, []);
	if (!Chart) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-28 w-full rounded-sm bg-line/70",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Loading the hourly chart"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart, {
		hours,
		bestLabel
	});
}
function ConditionsPanel({ result, guide, pending, onRefresh }) {
	if (!result.ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8 border-t border-line pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-xl",
				children: "Forecast unavailable"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-prose text-sm text-muted",
				children: result.error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				className: "mt-4",
				variant: "secondary",
				onClick: onRefresh,
				disabled: pending,
				children: pending ? "Trying again…" : "Try again"
			})
		]
	});
	const air = result.air;
	const band = bandOf(air.aqi);
	const pollutants = [
		{
			label: "PM2.5",
			value: Math.round(air.pm25),
			note: shortRatio(air.pm25, WHO.pm25)
		},
		air.pm10 != null ? {
			label: "PM10",
			value: Math.round(air.pm10),
			note: shortRatio(air.pm10, WHO.pm10)
		} : null,
		air.no2 != null ? {
			label: "NO₂",
			value: Math.round(air.no2),
			note: shortRatio(air.no2, WHO.no2)
		} : null
	].filter((row) => row !== null);
	const coNote = air.co != null && air.pm25 > WHO.pm25 * 3 && air.co < WHO.co ? "Carbon monoxide is under the WHO daily guideline. Today's problem is particles." : air.co != null && air.co >= WHO.co ? `Carbon monoxide is ${shortRatio(air.co, WHO.co).toLowerCase()} daily guideline.` : null;
	const observed = air.observedAt.includes("T") ? air.observedAt.slice(11, 16) : air.observedAt;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8 border-t border-line pt-6",
		"aria-busy": pending,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("inline-flex min-h-7 items-center rounded-full px-2.5 py-1 text-xs font-medium", band.chip),
					children: band.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 text-sm text-muted underline-offset-2 hover:underline",
					onClick: onRefresh,
					disabled: pending,
					children: pending ? "Updating the forecast…" : `Updated ${observed}`
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-4 font-display leading-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-display tabular-nums",
						children: air.aqi
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "sr-only",
						children: [
							" US AQI, ",
							band.label,
							" in ",
							air.place.name,
							". "
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-3 block font-display text-xl leading-snug",
						children: [
							band.label,
							" in ",
							air.place.name
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: weatherLine(air)
			}),
			guide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-prose text-sm",
				children: guide.lead
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-6 grid grid-cols-3 gap-3",
				children: pollutants.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-faint",
							children: row.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 text-xl font-medium tabular-nums",
							children: row.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: row.note
						})
					]
				}, row.label))
			}),
			coNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-prose text-sm text-muted",
				children: coNote
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AirChart, {
					hours: air.hours,
					bestLabel: guide?.best.label ?? "later"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-faint",
					children: guide ? `Next 24 hours, local time. Darker bars are dirtier. Lightest ${guide.best.label}, AQI ${guide.best.aqi}. Heaviest ${guide.worst.label}, AQI ${guide.worst.aqi}.` : "Next 24 hours, local time."
				})]
			})
		]
	});
}
function Block({ item }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "border-t border-line py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-medium",
				children: item.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm",
				children: item.action
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-ink",
					children: "Impact. "
				}), item.impact]
			})
		]
	});
}
function GuidePanel({ guide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl",
			children: "What changes the day"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-prose text-sm text-muted",
			children: "Built from this forecast and the household, before any tailored plan. Figures are rough, and labeled as such."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2",
			children: guide.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rise",
				style: { animationDelay: `${index * 40}ms` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, { item })
			}, item.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "With others"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, { item: guide.together })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "What does not work"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-prose border-t border-line pt-4 text-sm text-muted",
				children: guide.myth
			})]
		})
	] });
}
var audiences = [
	{
		id: "family",
		label: "Family"
	},
	{
		id: "school",
		label: "School"
	},
	{
		id: "neighborhood",
		label: "Neighbors"
	}
];
var commutes = [
	{
		id: "walk",
		label: "Walk"
	},
	{
		id: "cycle",
		label: "Cycle"
	},
	{
		id: "transit",
		label: "Transit"
	},
	{
		id: "car",
		label: "Car"
	},
	{
		id: "remote",
		label: "At home"
	}
];
var cookings = [
	{
		id: "gas",
		label: "Gas"
	},
	{
		id: "induction",
		label: "Induction"
	},
	{
		id: "biomass",
		label: "Biomass"
	},
	{
		id: "mixed",
		label: "Mixed"
	}
];
var heatings = [
	{
		id: "none",
		label: "None"
	},
	{
		id: "electric",
		label: "Electric"
	},
	{
		id: "gas",
		label: "Gas"
	},
	{
		id: "solid",
		label: "Wood / coal"
	}
];
function Choice({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
		className: "mb-2 text-sm font-medium",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2",
		role: "radiogroup",
		"aria-label": label,
		children: options.map((option) => {
			const selected = option.id === value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				role: "radio",
				"aria-checked": selected,
				variant: selected ? "primary" : "secondary",
				onClick: () => onChange(option.id),
				children: option.label
			}, option.id);
		})
	})] });
}
function Stepper({ label, value, max, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-11 items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-0 text-sm",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					size: "icon",
					"aria-label": `Fewer ${label}`,
					disabled: value <= 0,
					onClick: () => onChange(value - 1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {
						className: "size-4",
						"aria-hidden": true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-8 text-center text-sm tabular-nums",
					children: value
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					size: "icon",
					"aria-label": `More ${label}`,
					disabled: value >= max,
					onClick: () => onChange(value + 1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						className: "size-4",
						"aria-hidden": true
					})
				})
			]
		})]
	});
}
function Toggle({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		onClick: () => onChange(!checked),
		className: "flex min-h-11 w-full items-center justify-between gap-3 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("relative h-6 w-11 shrink-0 rounded-full border", checked ? "border-accent bg-accent" : "border-line bg-paper"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("knob absolute top-0.5 size-5 rounded-full", checked ? "translate-x-5 bg-accent-fg" : "translate-x-0.5 bg-ink") })
		})]
	});
}
function HouseholdPanel({ profile, onChange }) {
	const counts = profile.audience === "school" ? [
		{
			key: "adults",
			label: "Staff",
			max: 20
		},
		{
			key: "children",
			label: "Students",
			max: 40
		},
		{
			key: "elders",
			label: "Other adults",
			max: 20
		}
	] : profile.audience === "neighborhood" ? [
		{
			key: "adults",
			label: "Adults coordinating",
			max: 20
		},
		{
			key: "children",
			label: "Children",
			max: 40
		},
		{
			key: "elders",
			label: "Older neighbors",
			max: 20
		}
	] : [
		{
			key: "adults",
			label: "Adults",
			max: 12
		},
		{
			key: "children",
			label: "Children",
			max: 12
		},
		{
			key: "elders",
			label: "Older adults",
			max: 12
		}
	];
	const sensitive = profile.audience === "school" ? "Students with asthma or heart disease" : profile.audience === "neighborhood" ? "Neighbors who are pregnant or have heart or lung disease" : "Someone pregnant, or with asthma, heart, or lung disease";
	const exercise = profile.audience === "school" ? "Outdoor play or PE" : "Outdoor exercise";
	const road = profile.audience === "school" ? "The yard faces a busy road" : "Windows face a busy road";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "rounded-panel border border-line bg-sheet p-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Who this is for"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "The guide changes with the household. It stays on this device."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						label: "Setting",
						value: profile.audience,
						options: audiences,
						onChange: (audience) => onChange({ audience })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-1",
						children: counts.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
							label: row.label,
							max: row.max,
							value: profile[row.key],
							onChange: (next) => {
								if (row.key === "adults") onChange({ adults: next });
								else if (row.key === "children") onChange({ children: next });
								else onChange({ elders: next });
							}
						}, row.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: sensitive,
						checked: profile.sensitive,
						onChange: (sensitiveFlag) => onChange({ sensitive: sensitiveFlag })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						label: "Getting around",
						value: profile.commute,
						options: commutes,
						onChange: (commute) => onChange({ commute })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						label: profile.audience === "school" ? "Meals on site" : "Cooking",
						value: profile.cooking,
						options: cookings,
						onChange: (cooking) => onChange({ cooking })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						label: "Heating",
						value: profile.heating,
						options: heatings,
						onChange: (heating) => onChange({ heating })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: road,
						checked: profile.streetFacing,
						onChange: (streetFacing) => onChange({ streetFacing })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "A HEPA purifier is in the main room",
						checked: profile.purifier,
						onChange: (purifier) => onChange({ purifier })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: exercise,
						checked: profile.outdoorExercise,
						onChange: (outdoorExercise) => onChange({ outdoorExercise })
					})
				]
			})
		]
	});
}
var field = "h-11 w-full rounded-sm border border-line bg-sheet px-3 text-sm text-ink outline-none placeholder:text-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn(field, className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn(field, "h-auto min-h-24 py-3 leading-normal", className),
		...props
	});
}
function PlaceBar({ place, onPlace }) {
	const listId = (0, import_react.useId)();
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [geoError, setGeoError] = (0, import_react.useState)(null);
	const [locating, setLocating] = (0, import_react.useState)(false);
	const boxRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const q = query.trim();
		if (q.length < 2) {
			setResults([]);
			return;
		}
		let cancel = false;
		const timer = setTimeout(() => {
			searchCities({ data: { query: q } }).then((res) => {
				if (cancel) return;
				setResults(res.ok ? res.results : []);
				setOpen(true);
			}).catch(() => {
				if (!cancel) setResults([]);
			});
		}, 320);
		return () => {
			cancel = true;
			clearTimeout(timer);
		};
	}, [query]);
	(0, import_react.useEffect)(() => {
		function onPointer(event) {
			if (!boxRef.current?.contains(event.target)) setOpen(false);
		}
		window.addEventListener("pointerdown", onPointer);
		return () => window.removeEventListener("pointerdown", onPointer);
	}, []);
	function choose(next) {
		onPlace(next);
		setQuery("");
		setResults([]);
		setOpen(false);
		setGeoError(null);
	}
	function locate() {
		if (!navigator.geolocation) {
			setGeoError("This browser has no location. Search for a city instead.");
			return;
		}
		setLocating(true);
		setGeoError(null);
		navigator.geolocation.getCurrentPosition((pos) => {
			locatePlace({ data: {
				latitude: pos.coords.latitude,
				longitude: pos.coords.longitude
			} }).then((res) => choose(res.place)).catch(() => setGeoError("Couldn't name this location. Search for a city instead.")).finally(() => setLocating(false));
		}, () => {
			setLocating(false);
			setGeoError("Location is blocked. Search for a city instead.");
		}, {
			enableHighAccuracy: false,
			timeout: 8e3,
			maximumAge: 3e5
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: boxRef,
					className: "relative min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: query,
							onChange: (event) => {
								setQuery(event.target.value);
								setOpen(true);
							},
							onFocus: () => {
								if (results.length > 0) setOpen(true);
							},
							placeholder: "Search a city",
							"aria-label": "Search for a city",
							"aria-expanded": open && results.length > 0,
							"aria-controls": listId,
							autoComplete: "off",
							className: "bg-sheet pl-10"
						}),
						open && results.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							id: listId,
							role: "listbox",
							className: "shadow-panel absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-line bg-sheet",
							children: results.map((result) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "option",
								className: "flex min-h-11 w-full items-center px-3 text-left text-sm hover:bg-paper",
								onClick: () => choose(result),
								children: placeLabel(result)
							}) }, `${result.latitude}-${result.longitude}-${result.name}`))
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "secondary",
					onClick: locate,
					disabled: locating,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, {
						className: "size-4",
						"aria-hidden": true
					}), locating ? "Locating…" : "Use my location"]
				})]
			}),
			geoError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-bad",
				children: geoError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto pb-1",
				children: PRESETS.map((preset) => {
					const selected = sameCoord(preset, place);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": selected,
						onClick: () => choose(preset),
						className: cn("h-11 shrink-0 rounded-full px-3 text-sm font-medium", selected ? "bg-accent text-accent-fg" : "border border-line bg-sheet text-ink"),
						children: preset.name
					}, preset.name);
				})
			})
		]
	});
}
function suggestionsFor(profile) {
	return [
		profile.children > 0 || profile.audience === "school" ? "Is the school run better at another hour today?" : "When is the least-bad time to be outside today?",
		profile.cooking === "induction" ? "What indoor sources should we still avoid tonight?" : "How should we cook tonight without filling the home?",
		profile.audience === "neighborhood" ? "What should we ask the block to stop doing?" : "What would actually change the air, and what is a waste of time?"
	];
}
function PlanPanel({ profile, ready, plan, stale, pending, error, onWrite, messages, askPending, askError, onAsk }) {
	const [question, setQuestion] = (0, import_react.useState)("");
	const suggestions = suggestionsFor(profile);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-panel border border-line bg-sheet p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Today, in order"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-prose text-sm text-muted",
				children: "Grok writes a day for this household from the forecast: routines, indoor air, lower-emission swaps, and the direct effect of each one. Nothing is sent until you ask."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				className: "mt-4 w-full sm:w-auto",
				onClick: onWrite,
				disabled: !ready || pending,
				children: pending ? "Writing the plan…" : plan ? "Rewrite today's plan" : "Write today's plan"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-bad",
				children: error
			}) : null,
			stale && plan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "This plan is for different air or a different household. Rewrite it before you rely on it."
			}) : null,
			plan ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl text-balance",
						children: plan.headline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-prose text-sm",
						children: plan.whyToday
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-8 text-sm font-medium",
						children: "Through the day"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: plan.routines.map((routine) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-line py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-faint",
								children: routine.time
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-medium",
								children: routine.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm",
								children: routine.action
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-ink",
									children: "Impact. "
								}), routine.impact]
							})
						]
					}, `${routine.time}-${routine.title}`)) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-8 text-sm font-medium",
						children: "Indoors"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: plan.indoor.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-line py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm",
								children: item.action
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-ink",
									children: "Impact. "
								}), item.impact]
							})
						]
					}, item.title)) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-8 text-sm font-medium",
						children: "Lower-emission swaps"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: plan.swaps.map((swap) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-line py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-faint",
								children: "Instead of"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: swap.insteadOf
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs font-medium text-faint",
								children: "Try"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-medium",
								children: swap.tryThis
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-ink",
									children: "Impact. "
								}), swap.impact]
							})
						]
					}, swap.insteadOf)) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-8 text-sm font-medium",
						children: "Together"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: plan.together.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-line py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm",
								children: item.action
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-ink",
									children: "Impact. "
								}), item.impact]
							})
						]
					}, item.title)) }),
					plan.doNotBother.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-8 text-sm font-medium",
						children: "Skip these"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: plan.doNotBother.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-t border-line py-3 text-sm text-muted",
						children: line
					}, line)) })] }) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-prose text-sm text-muted",
				children: "The guide beside this is the same shape for anyone in this air. The plan sequences your actual stove, commute, and the people in the room."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 border-t border-line pt-6",
				onSubmit: (event) => {
					event.preventDefault();
					const next = question.trim();
					if (!next || askPending || !ready) return;
					onAsk(next);
					setQuestion("");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium",
						children: "Ask about this air"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-col gap-2",
						children: suggestions.map((prompt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							className: "h-auto min-h-11 whitespace-normal px-3 py-2 text-left",
							disabled: !ready || askPending,
							onClick: () => onAsk(prompt),
							children: prompt
						}, prompt))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-4 block text-sm",
						htmlFor: "ask-air",
						children: "Or ask your own"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "ask-air",
						value: question,
						onChange: (event) => setQuestion(event.target.value),
						maxLength: 400,
						placeholder: "For example: should the windows stay shut overnight?",
						className: "mt-2 bg-paper"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "mt-3",
						disabled: !ready || askPending || question.trim().length < 2,
						children: askPending ? "Thinking…" : "Ask"
					}),
					askError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-bad",
						children: askError
					}) : null,
					messages.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex flex-col gap-4",
						"aria-live": "polite",
						children: messages.map((turn, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: turn.role === "user" ? "border-l-2 border-line pl-3" : "border-l-2 border-ink pl-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-faint",
								children: turn.role === "user" ? "You" : "Hearthline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm break-words whitespace-pre-wrap",
								children: turn.content
							})]
						}, `${turn.role}-${index}`))
					}) : null
				]
			})
		]
	});
}
function HearthApp({ initial }) {
	const [place, setPlace] = (0, import_react.useState)(DEFAULT_PLACE);
	const [profile, setProfile] = (0, import_react.useState)(DEFAULT_PROFILE);
	const [airResult, setAirResult] = (0, import_react.useState)(initial);
	const [airPending, setAirPending] = (0, import_react.useState)(false);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [reload, setReload] = (0, import_react.useState)(0);
	const [plan, setPlan] = (0, import_react.useState)(null);
	const [planKey, setPlanKey] = (0, import_react.useState)(null);
	const [planPending, setPlanPending] = (0, import_react.useState)(false);
	const [planError, setPlanError] = (0, import_react.useState)(null);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [askPending, setAskPending] = (0, import_react.useState)(false);
	const [askError, setAskError] = (0, import_react.useState)(null);
	const skipInitial = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		const saved = readSaved();
		if (saved) {
			setPlace(saved.place);
			setProfile(saved.profile);
			setPlan(saved.plan);
			setPlanKey(saved.planKey);
			setMessages(saved.messages);
		}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		writeSaved({
			place,
			profile,
			plan,
			planKey,
			messages
		});
	}, [
		hydrated,
		place,
		profile,
		plan,
		planKey,
		messages
	]);
	const placeRef = (0, import_react.useRef)(place);
	const airRef = (0, import_react.useRef)(airResult);
	placeRef.current = place;
	airRef.current = airResult;
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const currentPlace = placeRef.current;
		if (skipInitial.current) {
			skipInitial.current = false;
			const currentAir = airRef.current;
			if (currentAir.ok && sameCoord(currentAir.air.place, currentPlace)) return;
		}
		let cancel = false;
		setAirPending(true);
		fetchAir({ data: currentPlace }).then((result) => {
			if (!cancel) setAirResult(result);
		}).catch(() => {
			if (!cancel) setAirResult({
				ok: false,
				error: "The air forecast didn't answer. Try again in a moment."
			});
		}).finally(() => {
			if (!cancel) setAirPending(false);
		});
		return () => {
			cancel = true;
		};
	}, [
		hydrated,
		place.latitude,
		place.longitude,
		reload
	]);
	(0, import_react.useEffect)(() => {
		if (!airResult.ok) {
			document.title = "Hearthline";
			return;
		}
		document.title = `${airResult.air.aqi} · ${airResult.air.place.name} — Hearthline`;
	}, [airResult]);
	const guide = airResult.ok ? buildGuide(airResult.air, profile) : null;
	const cacheKey = airResult.ok ? planCacheKey(airResult.air.place, profile, bandOf(airResult.air.aqi).id, airResult.air.observedAt.slice(0, 10)) : null;
	const stale = Boolean(!airPending && plan && cacheKey && planKey !== cacheKey);
	function choosePlace(next) {
		if (!sameCoord(next, place)) {
			setPlan(null);
			setPlanKey(null);
			setMessages([]);
			setPlanError(null);
			setAskError(null);
		}
		setPlace(next);
	}
	async function onWrite() {
		setPlanPending(true);
		setPlanError(null);
		try {
			const result = await writePlan({ data: {
				place,
				profile
			} });
			if (!result.ok) {
				setPlanError(result.error);
				return;
			}
			setPlan(result.plan);
			setPlanKey(result.key);
			setAirResult({
				ok: true,
				air: result.air
			});
			setPlace((current) => sameCoord(current, result.air.place) ? {
				...current,
				timezone: result.air.place.timezone
			} : result.air.place);
		} catch {
			setPlanError("The plan couldn't be written. Try again.");
		} finally {
			setPlanPending(false);
		}
	}
	async function onAsk(question) {
		const history = messages.slice(-4);
		const next = [...messages, {
			role: "user",
			content: question
		}];
		setMessages(next);
		setAskPending(true);
		setAskError(null);
		try {
			const result = await askAir({ data: {
				place,
				profile,
				question,
				history
			} });
			if (!result.ok) {
				setAskError(result.error);
				return;
			}
			setMessages([...next, {
				role: "assistant",
				content: result.text
			}]);
			setAirResult({
				ok: true,
				air: result.air
			});
		} catch {
			setAskError("That question didn't go through. Try again.");
		} finally {
			setAskPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-5xl px-4 pt-6 pb-24 sm:pt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-baseline justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					children: "Hearthline"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-faint",
					children: "Winter air guide"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-prose text-sm text-muted",
				children: "For families, schools, and blocks in severe winter smog. A forecast, a lower-emission day, and the direct effect of each choice."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceBar, {
				place,
				onPlace: choosePlace
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConditionsPanel, {
				result: airResult,
				guide,
				pending: airPending,
				onRefresh: () => setReload((n) => n + 1)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid items-start gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HouseholdPanel, {
					profile,
					onChange: (patch) => setProfile((current) => ({
						...current,
						...patch
					}))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-col gap-10",
					children: [guide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuidePanel, { guide }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanPanel, {
						profile,
						ready: airResult.ok && !airPending,
						plan,
						stale,
						pending: planPending,
						error: planError,
						onWrite: () => void onWrite(),
						messages,
						askPending,
						askError,
						onAsk: (question) => void onAsk(question)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-12 border-t border-line pt-6 text-xs text-faint",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "max-w-prose",
					children: [
						"Outdoor air is a model estimate from the",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "underline decoration-line underline-offset-2",
							href: "https://open-meteo.com/en/docs/air-quality-api",
							children: "Open-Meteo air quality API"
						}),
						" ",
						"(CAMS), not a monitor at your window. Comparisons use the",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "underline decoration-line underline-offset-2",
							href: "https://www.who.int/publications/i/item/9789240034228",
							children: "WHO 2021 air quality guidelines"
						}),
						". Category names follow the",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "underline decoration-line underline-offset-2",
							href: "https://www.airnow.gov/aqi/aqi-basics/",
							children: "US EPA Air Quality Index"
						}),
						". This is not medical advice. Chest pain, severe breathlessness, or confusion needs urgent care."
					]
				})
			})
		]
	});
}
function Home() {
	const initial = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HearthApp, { initial });
}
//#endregion
export { Home as component, routes_Tb7EnPJT_exports as t };
