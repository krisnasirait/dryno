"use client";
import { useEffect, useRef } from "react";

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    const el = ref.current;
    if (!el) return;
    let done = false;
    const run = () => {
      if (done) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 100) {
        done = true;
        void import("countup.js").then(({ CountUp }) => {
          if (cancelled) return;
          new CountUp("stat-years", 10, { suffix: "+", duration: 2 }).start();
          new CountUp("stat-depth", 220, { suffix: "m", duration: 2 }).start();
          new CountUp("stat-services", 6, { duration: 2 }).start();
        });
      }
    };
    window.addEventListener("scroll", run, { passive: true });
    run();
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", run);
    };
  }, []);
  const stats = [
    { id: "stat-years", top: "10+", label: "Years Field Experience" },
    { id: "stat-depth", top: "220m", label: "Deepest well drilled (Uluwatu)" },
    { id: "stat-services", top: "6", label: "Integrated services, SIPA included" },
  ];
  return (
    <section className="stats-content bg-[#0B192C] text-white py-10">
      <div ref={ref} className="element-on-scroll max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 gap-4 text-center">
        {stats.map((s) => (
          <div key={s.id}>
            <div id={s.id} className="text-3xl sm:text-5xl font-black text-sky-300">{s.top}</div>
            <div className="text-[11px] sm:text-xs text-white/60 uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
