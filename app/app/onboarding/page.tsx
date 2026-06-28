import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";
import { OnboardingFlow } from "./OnboardingFlow";

export default async function OnboardingPage() {
  const supabase = createSupabaseServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, onboarding_complete")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_complete) redirect("/app/dashboard");

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  const { data: rows } = await supabase
    .from("user_integrations")
    .select("integration_name")
    .eq("user_id", user.id);

  const initialConnected = rows?.map((row) => row.integration_name) ?? [];

  return (
    <OnboardingFlow firstName={firstName} initialConnected={initialConnected} />
  );
}
