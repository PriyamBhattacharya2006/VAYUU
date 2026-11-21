import type { Guide, GuideItem } from "@/lib/guide";

function Block({ item }: { item: GuideItem }) {
  return (
    <article className="border-t border-line py-4">
      <h3 className="text-sm font-medium">{item.title}</h3>
      <p className="mt-2 text-sm">{item.action}</p>
      <p className="mt-2 text-sm text-muted">
        <span className="font-medium text-ink">Impact. </span>
        {item.impact}
      </p>
    </article>
  );
}

export function GuidePanel({ guide }: { guide: Guide }) {
  return (
    <section>
      <h2 className="font-display text-xl">What changes the day</h2>
      <p className="mt-2 max-w-prose text-sm text-muted">
        Built from this forecast and the household, before any tailored plan. Figures are rough, and labeled as such.
      </p>
      <div className="mt-2">
        {guide.items.map((item, index) => (
          <div key={item.id} className="rise" style={{ animationDelay: `${index * 40}ms` }}>
            <Block item={item} />
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="font-display text-xl">With others</h2>
        <Block item={guide.together} />
      </div>
      <div className="mt-6">
        <h2 className="font-display text-xl">What does not work</h2>
        <p className="mt-3 max-w-prose border-t border-line pt-4 text-sm text-muted">{guide.myth}</p>
      </div>
    </section>
  );
}
