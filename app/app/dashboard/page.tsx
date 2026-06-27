import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Orbit } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-white">
            <Orbit size={18} />
          </span>
          <span className="text-xl font-black tracking-[-0.04em]">Orbi</span>
        </div>
        <section className="glass mt-16 rounded-[32px] p-8 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Your inbox
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Hey, {firstName}.
          </h1>
          <p className="mt-5 text-slate-600">
            Your unified student inbox is ready for its first connection.
          </p>
        </section>
      </div>
    </main>
  );
}
