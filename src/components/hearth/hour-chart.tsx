import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from "recharts";
import type { HourPoint } from "@/lib/air";

export function HourChart({ hours, bestLabel }: { hours: HourPoint[]; bestLabel: string }) {
  const aqis = hours.map((hour) => hour.aqi);
  const min = Math.min(...aqis);
  const max = Math.max(...aqis);
  const data = hours.map((hour, index) => ({
    key: String(index),
    label: hour.time.slice(11, 13),
    aqi: hour.aqi,
    opacity: max === min ? 0.72 : 0.32 + ((hour.aqi - min) / (max - min)) * 0.68,
  }));

  return (
    <div className="h-36 w-full min-w-0" role="img" aria-label={`Hourly US AQI for the next day. Lightest stretch ${bestLabel}.`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 16 }}>
          <XAxis
            dataKey="label"
            interval={3}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-faint)", fontSize: 11, fontFamily: "inherit" }}
          />
          <Bar dataKey="aqi" radius={[2, 2, 0, 0]} maxBarSize={16} isAnimationActive={false}>
            {data.map((row) => (
              <Cell key={row.key} fill="var(--color-ink)" fillOpacity={row.opacity} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
