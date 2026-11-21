import { Minus, Plus } from "lucide-react";
import type { Audience, Commute, Cooking, Heating, Profile } from "@/lib/air";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const audiences: { id: Audience; label: string }[] = [
  { id: "family", label: "Family" },
  { id: "school", label: "School" },
  { id: "neighborhood", label: "Neighbors" },
];

const commutes: { id: Commute; label: string }[] = [
  { id: "walk", label: "Walk" },
  { id: "cycle", label: "Cycle" },
  { id: "transit", label: "Transit" },
  { id: "car", label: "Car" },
  { id: "remote", label: "At home" },
];

const cookings: { id: Cooking; label: string }[] = [
  { id: "gas", label: "Gas" },
  { id: "induction", label: "Induction" },
  { id: "biomass", label: "Biomass" },
  { id: "mixed", label: "Mixed" },
];

const heatings: { id: Heating; label: string }[] = [
  { id: "none", label: "None" },
  { id: "electric", label: "Electric" },
  { id: "gas", label: "Gas" },
  { id: "solid", label: "Wood / coal" },
];

function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (next: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <Button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              variant={selected ? "primary" : "secondary"}
              onClick={() => onChange(option.id)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Stepper({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-3">
      <span className="min-w-0 text-sm">{label}</span>
      <div className="flex items-center gap-1">
        <Button type="button" variant="secondary" size="icon" aria-label={`Fewer ${label}`} disabled={value <= 0} onClick={() => onChange(value - 1)}>
          <Minus className="size-4" aria-hidden />
        </Button>
        <span className="w-8 text-center text-sm tabular-nums">{value}</span>
        <Button type="button" variant="secondary" size="icon" aria-label={`More ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
          <Plus className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-11 w-full items-center justify-between gap-3 text-left"
    >
      <span className="text-sm">{label}</span>
      <span className={cn("relative h-6 w-11 shrink-0 rounded-full border", checked ? "border-accent bg-accent" : "border-line bg-paper")}>
        <span
          className={cn(
            "knob absolute top-0.5 size-5 rounded-full",
            checked ? "translate-x-5 bg-accent-fg" : "translate-x-0.5 bg-ink",
          )}
        />
      </span>
    </button>
  );
}

export function HouseholdPanel({
  profile,
  onChange,
}: {
  profile: Profile;
  onChange: (patch: Partial<Profile>) => void;
}) {
  const counts: { key: "adults" | "children" | "elders"; label: string; max: number }[] =
    profile.audience === "school"
      ? [
          { key: "adults", label: "Staff", max: 20 },
          { key: "children", label: "Students", max: 40 },
          { key: "elders", label: "Other adults", max: 20 },
        ]
      : profile.audience === "neighborhood"
        ? [
            { key: "adults", label: "Adults coordinating", max: 20 },
            { key: "children", label: "Children", max: 40 },
            { key: "elders", label: "Older neighbors", max: 20 },
          ]
        : [
            { key: "adults", label: "Adults", max: 12 },
            { key: "children", label: "Children", max: 12 },
            { key: "elders", label: "Older adults", max: 12 },
          ];

  const sensitive =
    profile.audience === "school"
      ? "Students with asthma or heart disease"
      : profile.audience === "neighborhood"
        ? "Neighbors who are pregnant or have heart or lung disease"
        : "Someone pregnant, or with asthma, heart, or lung disease";

  const exercise = profile.audience === "school" ? "Outdoor play or PE" : "Outdoor exercise";
  const road = profile.audience === "school" ? "The yard faces a busy road" : "Windows face a busy road";

  return (
    <aside className="rounded-panel border border-line bg-sheet p-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-auto">
      <h2 className="font-display text-xl">Who this is for</h2>
      <p className="mt-2 text-sm text-muted">The guide changes with the household. It stays on this device.</p>
      <div className="mt-5 flex flex-col gap-5">
        <Choice label="Setting" value={profile.audience} options={audiences} onChange={(audience) => onChange({ audience })} />
        <div className="flex flex-col gap-1">
          {counts.map((row) => (
            <Stepper
              key={row.key}
              label={row.label}
              max={row.max}
              value={profile[row.key]}
              onChange={(next) => {
                if (row.key === "adults") onChange({ adults: next });
                else if (row.key === "children") onChange({ children: next });
                else onChange({ elders: next });
              }}
            />
          ))}
        </div>
        <Toggle label={sensitive} checked={profile.sensitive} onChange={(sensitiveFlag) => onChange({ sensitive: sensitiveFlag })} />
        <Choice label="Getting around" value={profile.commute} options={commutes} onChange={(commute) => onChange({ commute })} />
        <Choice label={profile.audience === "school" ? "Meals on site" : "Cooking"} value={profile.cooking} options={cookings} onChange={(cooking) => onChange({ cooking })} />
        <Choice label="Heating" value={profile.heating} options={heatings} onChange={(heating) => onChange({ heating })} />
        <Toggle label={road} checked={profile.streetFacing} onChange={(streetFacing) => onChange({ streetFacing })} />
        <Toggle label="A HEPA purifier is in the main room" checked={profile.purifier} onChange={(purifier) => onChange({ purifier })} />
        <Toggle label={exercise} checked={profile.outdoorExercise} onChange={(outdoorExercise) => onChange({ outdoorExercise })} />
      </div>
    </aside>
  );
}
