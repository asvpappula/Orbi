import { Dashboard } from "./Dashboard";
import { getAuthenticatedContext } from "@/lib/auth/server";

export default async function DashboardPage() {
  const { user, supabase } = await getAuthenticatedContext();
  const [{ data: profile }, { data: integrations }] = await Promise.all([
    supabase.from("users").select("full_name").eq("id", user.id).single(),
    supabase
      .from("user_integrations")
      .select("integration_name")
      .eq("user_id", user.id),
  ]);
  const fullName = profile?.full_name ?? user.user_metadata.full_name ?? "Student";
  return (
    <Dashboard
      fullName={fullName}
      connectedApps={(integrations ?? []).map((row) => row.integration_name)}
    />
  );
}
