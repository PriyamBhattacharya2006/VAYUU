import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_PLACE } from "@/lib/air";
import { HearthApp } from "@/components/hearth/app";
import { fetchAir } from "@/lib/hearth.functions";

export const Route = createFileRoute("/")({
  loader: () => fetchAir({ data: DEFAULT_PLACE }),
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  return <HearthApp initial={initial} />;
}
