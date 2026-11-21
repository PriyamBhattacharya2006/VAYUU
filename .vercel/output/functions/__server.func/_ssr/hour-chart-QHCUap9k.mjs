import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ResponsiveContainer, i as Cell, n as XAxis, r as Bar, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hour-chart-QHCUap9k.js
var import_jsx_runtime = require_jsx_runtime();
function HourChart({ hours, bestLabel }) {
	const aqis = hours.map((hour) => hour.aqi);
	const min = Math.min(...aqis);
	const max = Math.max(...aqis);
	const data = hours.map((hour, index) => ({
		key: String(index),
		label: hour.time.slice(11, 13),
		aqi: hour.aqi,
		opacity: max === min ? .72 : .32 + (hour.aqi - min) / (max - min) * .68
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-28 w-full min-w-0",
		role: "img",
		"aria-label": `Hourly US AQI for the next day. Lightest stretch ${bestLabel}.`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
				data,
				margin: {
					top: 8,
					right: 0,
					left: 0,
					bottom: 0
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "label",
					interval: 3,
					axisLine: false,
					tickLine: false,
					tick: {
						fill: "var(--color-faint)",
						fontSize: 11,
						fontFamily: "inherit"
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: "aqi",
					radius: [
						2,
						2,
						0,
						0
					],
					maxBarSize: 16,
					isAnimationActive: false,
					children: data.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						fill: "var(--color-ink)",
						fillOpacity: row.opacity
					}, row.key))
				})]
			})
		})
	});
}
//#endregion
export { HourChart };
