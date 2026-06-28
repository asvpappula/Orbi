import { Dashboard } from "./Dashboard";

// UI-only with mock data. Auth/data wiring is handled separately (Codex);
// the /app/* route stays protected by middleware.
export default function DashboardPage() {
  return <Dashboard />;
}
