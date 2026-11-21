import type { ChatTurn, Place, Profile, TailoredPlan } from "@/lib/air";
import { parsePlace, parseProfile } from "@/lib/parse";

const KEY = "hearthline.v1";

export type Saved = {
  place: Place;
  profile: Profile;
  plan: TailoredPlan | null;
  planKey: string | null;
  messages: ChatTurn[];
};

export function readSaved(): Saved | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const row = parsed as Record<string, unknown>;
    const place = parsePlace(row.place);
    const profile = parseProfile(row.profile);
    const plan = row.plan && typeof row.plan === "object" ? (row.plan as TailoredPlan) : null;
    const planKey = typeof row.planKey === "string" ? row.planKey : null;
    const messages = Array.isArray(row.messages)
      ? row.messages
          .filter(
            (turn): turn is ChatTurn =>
              !!turn &&
              typeof turn === "object" &&
              ((turn as ChatTurn).role === "user" || (turn as ChatTurn).role === "assistant") &&
              typeof (turn as ChatTurn).content === "string",
          )
          .slice(-8)
      : [];
    return { place, profile, plan, planKey, messages };
  } catch {
    return null;
  }
}

export function writeSaved(saved: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(saved));
  } catch {
    /* private mode or a full disk — the page still works for this visit */
  }
}
