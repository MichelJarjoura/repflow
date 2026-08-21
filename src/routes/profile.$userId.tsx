import { createFileRoute } from "@tanstack/react-router";
import { AthleteProfilePage } from "@/features/profile";

export const Route = createFileRoute("/profile/$userId")({
  head: () => ({
    meta: [
      { title: "REPFLOW — Athlete" },
      { name: "description", content: "View an athlete’s training profile and posts on Repflow." },
    ],
  }),
  component: AthleteRoute,
});

function AthleteRoute() {
  const { userId } = Route.useParams();
  return <AthleteProfilePage userId={userId} />;
}
