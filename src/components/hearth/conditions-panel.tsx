import { useEffect, useState } from "react";
import { bandOf, WHO, type AirResult, type AirSnapshot } from "@/lib/air";
import type { Guide } from "@/lib/guide";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function shortRatio(value: number, guide: number): string {
  const ratio = value / guide;
  if (ratio < 1) return "Under WHO";
  if (ratio < 1.25) return "Near WHO";
  const rounded = ratio >= 10 ? String(Math.round(ratio)) : String(Math.round(ratio * 10) / 10);
  return `${rounded}× WHO`;
}

function weatherLine(air: AirSnapshot): string {
  const bits: string[] = [];
  if (air.temperatureC != null) bits.push(`${Math.round(air.temperatureC)}°C`);
  if (air.humidity != null) bits.push(`${Math.round(air.humidity)}% humidity`);
  if (air.windKmh != null) {
    const wind = air.windKmh < 10 ? air.windKmh.toFixed(1) : String(Math.round(air.windKmh));
    bits.push(`wind ${wind} km/h`);
  }
  return bits.join(" · ");
}

function AirChart({ hours, bestLabel }: { hours: AirSnapshot["hours"]; bestLabel: string }) {
  const [Chart, setChart] = useState<typeof import("./hour-chart").HourChart | null>(null);
  useEffect(() => {
    void import("./hour-chart").then((mod) => setChart(() => mod.HourChart));
  }, []);
  if (!Chart) {
    return (
      <div className="h-36 w-full rounded-sm bg-line/70" aria-hidden>
        <span className="sr-only">Loading the hourly chart</span>
      </div>
    );
  }
  return <Chart hours={hours} bestLabel={bestLabel} />;
}

export function ConditionsPanel({
  result,
  guide,
  pending,
  onRefresh,
}: {
  result: AirResult;
  guide: Guide | null;
  pending: boolean;
  onRefresh: () => void;
}) {
  if (!result.ok) {
    return (
      <section className="mt-8 border-t border-line pt-6">
        <h1 className="font-display text-xl">Forecast unavailable</h1>
        <p className="mt-2 max-w-prose text-sm text-muted">{result.error}</p>
        <Button type="button" className="mt-4" variant="secondary" onClick={onRefresh} disabled={pending}>
          {pending ? "Trying again…" : "Try again"}
        </Button>
      </section>
    );
  }

  const air = result.air;
  const band = bandOf(air.aqi);
  const pollutants = [
    { label: "PM2.5", value: Math.round(air.pm25), note: shortRatio(air.pm25, WHO.pm25) },
    air.pm10 != null ? { label: "PM10", value: Math.round(air.pm10), note: shortRatio(air.pm10, WHO.pm10) } : null,
    air.no2 != null ? { label: "NO₂", value: Math.round(air.no2), note: shortRatio(air.no2, WHO.no2) } : null,
  ].filter((row): row is { label: string; value: number; note: string } => row !== null);

  const coNote =
    air.co != null && air.pm25 > WHO.pm25 * 3 && air.co < WHO.co
      ? "Carbon monoxide is under the WHO daily guideline. Today's problem is particles."
      : air.co != null && air.co >= WHO.co
        ? `Carbon monoxide is ${shortRatio(air.co, WHO.co).toLowerCase()} daily guideline.`
        : null;

  const observed = air.observedAt.includes("T") ? air.observedAt.slice(11, 16) : air.observedAt;

  return (
    <section className="mt-8 border-t border-line pt-6" aria-busy={pending}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className={cn("inline-flex min-h-7 items-center rounded-full px-2.5 py-1 text-xs font-medium", band.chip)}>
          {band.label}
        </p>
        <button type="button" className="min-h-11 text-sm text-muted underline-offset-2 hover:underline" onClick={onRefresh} disabled={pending}>
          {pending ? "Updating the forecast…" : `Updated ${observed}`}
        </button>
      </div>
      <h1 className="mt-4 font-display leading-none">
        <span className="text-display tabular-nums">{air.aqi}</span>
        <span className="sr-only"> US AQI. </span>
        <span className="mt-3 block font-display text-xl leading-snug">
          {band.label} in {air.place.name}
        </span>
      </h1>
      <p className="mt-3 text-sm text-muted">{weatherLine(air)}</p>
      {guide ? <p className="mt-4 max-w-prose text-sm">{guide.lead}</p> : null}
      <dl className="mt-6 grid grid-cols-3 gap-3">
        {pollutants.map((row) => (
          <div key={row.label} className="min-w-0">
            <dt className="text-xs text-faint">{row.label}</dt>
            <dd className="mt-1 text-xl font-medium tabular-nums">{row.value}</dd>
            <p className="text-xs text-muted">{row.note}</p>
          </div>
        ))}
      </dl>
      {coNote ? <p className="mt-3 max-w-prose text-sm text-muted">{coNote}</p> : null}
      <div className="mt-6">
        <AirChart hours={air.hours} bestLabel={guide?.best.label ?? "later"} />
        <p className="mt-2 text-xs text-faint">
          {guide
            ? `Next 24 hours, local time. Darker bars are dirtier. Lightest ${guide.best.label}, AQI ${guide.best.aqi}. Heaviest ${guide.worst.label}, AQI ${guide.worst.aqi}.`
            : "Next 24 hours, local time."}
        </p>
      </div>
    </section>
  );
}
