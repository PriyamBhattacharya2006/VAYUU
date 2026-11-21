import { useState } from "react";
import type { ChatTurn, Profile, TailoredPlan } from "@/lib/air";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

function suggestionsFor(profile: Profile): string[] {
  const prompts = [
    profile.children > 0 || profile.audience === "school"
      ? "Is the school run better at another hour today?"
      : "When is the least-bad time to be outside today?",
    profile.cooking === "induction"
      ? "What indoor sources should we still avoid tonight?"
      : "How should we cook tonight without filling the home?",
    profile.audience === "neighborhood"
      ? "What should we ask the block to stop doing?"
      : "What would actually change the air, and what is a waste of time?",
  ];
  return prompts;
}

export function PlanPanel({
  profile,
  ready,
  plan,
  stale,
  pending,
  error,
  onWrite,
  messages,
  askPending,
  askError,
  onAsk,
}: {
  profile: Profile;
  ready: boolean;
  plan: TailoredPlan | null;
  stale: boolean;
  pending: boolean;
  error: string | null;
  onWrite: () => void;
  messages: ChatTurn[];
  askPending: boolean;
  askError: string | null;
  onAsk: (question: string) => void;
}) {
  const [question, setQuestion] = useState("");
  const suggestions = suggestionsFor(profile);

  return (
    <section className="rounded-panel border border-line bg-sheet p-6">
      <h2 className="font-display text-xl">Today, in order</h2>
      <p className="mt-2 max-w-prose text-sm text-muted">
        Grok writes a day for this household from the forecast: routines, indoor air, lower-emission swaps, and the direct effect of each one. Nothing is sent until you ask.
      </p>
      <Button type="button" className="mt-4 w-full sm:w-auto" onClick={onWrite} disabled={!ready || pending}>
        {pending ? "Writing the plan…" : plan ? "Rewrite today's plan" : "Write today's plan"}
      </Button>
      {error ? <p className="mt-3 text-sm text-bad">{error}</p> : null}
      {stale && plan ? (
        <p className="mt-3 text-sm text-muted">This plan is for different air or a different household. Rewrite it before you rely on it.</p>
      ) : null}

      {plan ? (
        <div className="mt-6">
          <h3 className="font-display text-xl text-balance">{plan.headline}</h3>
          <p className="mt-2 max-w-prose text-sm">{plan.whyToday}</p>

          <h3 className="mt-8 text-sm font-medium">Through the day</h3>
          <ol>
            {plan.routines.map((routine) => (
              <li key={`${routine.time}-${routine.title}`} className="border-t border-line py-4">
                <p className="text-xs font-medium text-faint">{routine.time}</p>
                <p className="mt-1 text-sm font-medium">{routine.title}</p>
                <p className="mt-2 text-sm">{routine.action}</p>
                <p className="mt-2 text-sm text-muted">
                  <span className="font-medium text-ink">Impact. </span>
                  {routine.impact}
                </p>
              </li>
            ))}
          </ol>

          <h3 className="mt-8 text-sm font-medium">Indoors</h3>
          <ul>
            {plan.indoor.map((item) => (
              <li key={item.title} className="border-t border-line py-4">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-2 text-sm">{item.action}</p>
                <p className="mt-2 text-sm text-muted">
                  <span className="font-medium text-ink">Impact. </span>
                  {item.impact}
                </p>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-sm font-medium">Lower-emission swaps</h3>
          <ul>
            {plan.swaps.map((swap) => (
              <li key={swap.insteadOf} className="border-t border-line py-4">
                <p className="text-xs font-medium text-faint">Instead of</p>
                <p className="mt-1 text-sm">{swap.insteadOf}</p>
                <p className="mt-3 text-xs font-medium text-faint">Try</p>
                <p className="mt-1 text-sm font-medium">{swap.tryThis}</p>
                <p className="mt-2 text-sm text-muted">
                  <span className="font-medium text-ink">Impact. </span>
                  {swap.impact}
                </p>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-sm font-medium">Together</h3>
          <ul>
            {plan.together.map((item) => (
              <li key={item.title} className="border-t border-line py-4">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-2 text-sm">{item.action}</p>
                <p className="mt-2 text-sm text-muted">
                  <span className="font-medium text-ink">Impact. </span>
                  {item.impact}
                </p>
              </li>
            ))}
          </ul>

          {plan.doNotBother.length > 0 ? (
            <>
              <h3 className="mt-8 text-sm font-medium">Skip these</h3>
              <ul>
                {plan.doNotBother.map((line) => (
                  <li key={line} className="border-t border-line py-3 text-sm text-muted">
                    {line}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 max-w-prose text-sm text-muted">
          The guide beside this is the same shape for anyone in this air. The plan sequences your actual stove, commute, and the people in the room.
        </p>
      )}

      <form
        className="mt-8 border-t border-line pt-6"
        onSubmit={(event) => {
          event.preventDefault();
          const next = question.trim();
          if (!next || askPending || !ready) return;
          onAsk(next);
          setQuestion("");
        }}
      >
        <h3 className="text-sm font-medium">Ask about this air</h3>
        <div className="mt-3 flex flex-col gap-2">
          {suggestions.map((prompt) => (
            <Button
              key={prompt}
              type="button"
              variant="secondary"
              className="h-auto min-h-11 whitespace-normal px-3 py-2 text-left"
              disabled={!ready || askPending}
              onClick={() => onAsk(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
        <label className="mt-4 block text-sm" htmlFor="ask-air">
          Or ask your own
        </label>
        <Textarea
          id="ask-air"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={400}
          placeholder="For example: should the windows stay shut overnight?"
          className="mt-2 bg-paper"
        />
        <Button type="submit" className="mt-3" disabled={!ready || askPending || question.trim().length < 2}>
          {askPending ? "Thinking…" : "Ask"}
        </Button>
        {askError ? <p className="mt-3 text-sm text-bad">{askError}</p> : null}
        {messages.length > 0 ? (
          <div className="mt-5 flex flex-col gap-4" aria-live="polite">
            {messages.map((turn, index) => (
              <div key={`${turn.role}-${index}`} className={turn.role === "user" ? "border-l-2 border-line pl-3" : "border-l-2 border-ink pl-3"}>
                <p className="text-xs font-medium text-faint">{turn.role === "user" ? "You" : "Hearthline"}</p>
                <p className="mt-1 text-sm break-words whitespace-pre-wrap">{turn.content}</p>
              </div>
            ))}
          </div>
        ) : null}
      </form>
    </section>
  );
}
