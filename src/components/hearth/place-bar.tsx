import { LocateFixed, Search } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { PRESETS, placeLabel, sameCoord, type Place } from "@/lib/air";
import { locatePlace, searchCities } from "@/lib/hearth.functions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PlaceBar({ place, onPlace }: { place: Place; onPlace: (place: Place) => void }) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    let cancel = false;
    const timer = setTimeout(() => {
      void searchCities({ data: { query: q } })
        .then((res) => {
          if (cancel) return;
          setResults(res.ok ? res.results : []);
          setOpen(true);
        })
        .catch(() => {
          if (!cancel) setResults([]);
        });
    }, 320);
    return () => {
      cancel = true;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function onPointer(event: PointerEvent) {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, []);

  function choose(next: Place) {
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
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void locatePlace({ data: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } })
          .then((res) => choose(res.place))
          .catch(() => setGeoError("Couldn't name this location. Search for a city instead."))
          .finally(() => setLocating(false));
      },
      () => {
        setLocating(false);
        setGeoError("Location is blocked. Search for a city instead.");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div ref={boxRef} className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" aria-hidden />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              if (results.length > 0) setOpen(true);
            }}
            placeholder="Search a city"
            aria-label="Search for a city"
            aria-expanded={open && results.length > 0}
            aria-controls={listId}
            autoComplete="off"
            className="bg-sheet pl-10"
          />
          {open && results.length > 0 ? (
            <ul id={listId} role="listbox" className="shadow-panel absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-line bg-sheet">
              {results.map((result) => (
                <li key={`${result.latitude}-${result.longitude}-${result.name}`}>
                  <button
                    type="button"
                    role="option"
                    className="flex min-h-11 w-full items-center px-3 text-left text-sm hover:bg-paper"
                    onClick={() => choose(result)}
                  >
                    {placeLabel(result)}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Button type="button" variant="secondary" onClick={locate} disabled={locating}>
          <LocateFixed className="size-4" aria-hidden />
          {locating ? "Locating…" : "Use my location"}
        </Button>
      </div>
      {geoError ? <p className="mt-2 text-sm text-bad">{geoError}</p> : null}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {PRESETS.map((preset) => {
          const selected = sameCoord(preset, place);
          return (
            <button
              key={preset.name}
              type="button"
              aria-pressed={selected}
              onClick={() => choose(preset)}
              className={cn(
                "h-11 shrink-0 rounded-full px-3 text-sm font-medium",
                selected ? "bg-accent text-accent-fg" : "border border-line bg-sheet text-ink",
              )}
            >
              {preset.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
