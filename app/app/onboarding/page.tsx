import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, Orbit } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase";

async function completeOnboarding() {
  "use server";

  const supabase = createSupabaseServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase
    .from("users")
    .update({ onboarding_complete: true })
    .eq("id", user.id);

  if (error) throw new Error("Could not complete onboarding");
  redirect("/app/dashboard");
}

export default function OnboardingPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
      <section className="glass w-full max-w-xl rounded-[32px] p-3">
        <div className="rounded-[24px] border border-white bg-white/60 p-8 sm:p-12">
          <span className="grid size-11 place-items-center rounded-full bg-primary text-white shadow-lg shadow-indigo-200">
            <Orbit size={22} />
          </span>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Welcome to Orbi
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Let&apos;s connect your student life.
          </h1>
          <p className="mt-5 leading-relaxed text-slate-600">
            Next, we&apos;ll connect your campus tools and tune Orbi to the way you
            work.
          </p>
          <form action={completeOnboarding}>
            <button className="group mt-9 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500">
              Finish setup
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
