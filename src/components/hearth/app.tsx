import { useEffect, useRef, useState } from "react";
import {
  bandOf,
  DEFAULT_PLACE,
  DEFAULT_PROFILE,
  planCacheKey,
  sameCoord,
  type AirResult,
  type ChatTurn,
  type Place,
  type Profile,
  type TailoredPlan,
} from "@/lib/air";
import { askAir, fetchAir, writePlan } from "@/lib/hearth.functions";
import { buildGuide } from "@/lib/guide";
import { readSaved, writeSaved } from "@/lib/storage";
import { ConditionsPanel } from "@/components/hearth/conditions-panel";
import { GuidePanel } from "@/components/hearth/guide-panel";
import { HouseholdPanel } from "@/components/hearth/household-panel";
import { PlaceBar } from "@/components/hearth/place-bar";
import { PlanPanel } from "@/components/hearth/plan-panel";

export function HearthApp({ initial }: { initial: AirResult }) {
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [airResult, setAirResult] = useState<AirResult>(initial);
  const [airPending, setAirPending] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [reload, setReload] = useState(0);
  const [plan, setPlan] = useState<TailoredPlan | null>(null);
  const [planKey, setPlanKey] = useState<string | null>(null);
  const [planPending, setPlanPending] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [askPending, setAskPending] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);
  const skipInitial = useRef(true);

  useEffect(() => {
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

  useEffect(() => {
    if (!hydrated) return;
    writeSaved({ place, profile, plan, planKey, messages });
  }, [hydrated, place, profile, plan, planKey, messages]);

  const placeRef = useRef(place);
  const airRef = useRef(airResult);
  placeRef.current = place;
  airRef.current = airResult;

  useEffect(() => {
    if (!hydrated) return;
    const currentPlace = placeRef.current;
    if (skipInitial.current) {
      skipInitial.current = false;
      const currentAir = airRef.current;
      if (currentAir.ok && sameCoord(currentAir.air.place, currentPlace)) return;
    }
    let cancel = false;
    setAirPending(true);
    void fetchAir({ data: currentPlace })
      .then((result) => {
        if (!cancel) setAirResult(result);
      })
      .catch(() => {
        if (!cancel) setAirResult({ ok: false, error: "The air forecast didn't answer. Try again in a moment." });
      })
      .finally(() => {
        if (!cancel) setAirPending(false);
      });
    return () => {
      cancel = true;
    };
  }, [hydrated, place.latitude, place.longitude, reload]);

  useEffect(() => {
    if (!airResult.ok) {
      document.title = "Hearthline";
      return;
    }
    document.title = `${airResult.air.aqi} · ${airResult.air.place.name} — Hearthline`;
  }, [airResult]);

  const guide = airResult.ok ? buildGuide(airResult.air, profile) : null;
  const cacheKey = airResult.ok
    ? planCacheKey(airResult.air.place, profile, bandOf(airResult.air.aqi).id, airResult.air.observedAt.slice(0, 10))
    : null;
  const stale = Boolean(!airPending && plan && cacheKey && planKey !== cacheKey);

  function choosePlace(next: Place) {
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
      const result = await writePlan({ data: { place, profile } });
      if (!result.ok) {
        setPlanError(result.error);
        return;
      }
      setPlan(result.plan);
      setPlanKey(result.key);
      setAirResult({ ok: true, air: result.air });
      setPlace((current) => (sameCoord(current, result.air.place) ? { ...current, timezone: result.air.place.timezone } : result.air.place));
    } catch {
      setPlanError("The plan couldn't be written. Try again.");
    } finally {
      setPlanPending(false);
    }
  }

  async function onAsk(question: string) {
    const history = messages.slice(-4);
    const next = [...messages, { role: "user" as const, content: question }];
    setMessages(next);
    setAskPending(true);
    setAskError(null);
    try {
      const result = await askAir({ data: { place, profile, question, history } });
      if (!result.ok) {
        setAskError(result.error);
        return;
      }
      setMessages([...next, { role: "assistant", content: result.text }]);
      setAirResult({ ok: true, air: result.air });
    } catch {
      setAskError("That question didn't go through. Try again.");
    } finally {
      setAskPending(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-24 sm:pt-10">
      <header className="flex items-baseline justify-between gap-4">
        <p className="font-display text-xl">Hearthline</p>
        <p className="text-xs text-faint">Winter air guide</p>
      </header>
      <p className="mt-3 max-w-prose text-sm text-muted">
        For families, schools, and blocks in severe winter smog. A forecast, a lower-emission day, and the direct effect of each choice.
      </p>
      <PlaceBar place={place} onPlace={choosePlace} />
      <ConditionsPanel result={airResult} guide={guide} pending={airPending} onRefresh={() => setReload((n) => n + 1)} />
      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <HouseholdPanel profile={profile} onChange={(patch) => setProfile((current) => ({ ...current, ...patch }))} />
        <div className="flex min-w-0 flex-col gap-10">
          {guide ? <GuidePanel guide={guide} /> : null}
          <PlanPanel
            profile={profile}
            ready={airResult.ok && !airPending}
            plan={plan}
            stale={stale}
            pending={planPending}
            error={planError}
            onWrite={() => void onWrite()}
            messages={messages}
            askPending={askPending}
            askError={askError}
            onAsk={(question) => void onAsk(question)}
          />
        </div>
      </div>
      <footer className="mt-12 border-t border-line pt-6 text-xs text-faint">
        <p className="max-w-prose">
          Outdoor air is a model estimate from the{" "}
          <a className="underline decoration-line underline-offset-2" href="https://open-meteo.com/en/docs/air-quality-api">
            Open-Meteo air quality API
          </a>{" "}
          (CAMS), not a monitor at your window. Comparisons use the{" "}
          <a className="underline decoration-line underline-offset-2" href="https://www.who.int/publications/i/item/9789240034228">
            WHO 2021 air quality guidelines
          </a>
          . Category names follow the{" "}
          <a className="underline decoration-line underline-offset-2" href="https://www.airnow.gov/aqi/aqi-basics/">
            US EPA Air Quality Index
          </a>
          . This is not medical advice. Chest pain, severe breathlessness, or confusion needs urgent care.
        </p>
      </footer>
    </main>
  );
}
