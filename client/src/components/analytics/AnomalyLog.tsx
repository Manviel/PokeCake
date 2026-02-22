import { component$ } from "@builder.io/qwik";
import type { Anomaly } from "~/services/api";

interface AnomalyLogProps {
  anomalies: Anomaly[];
}

export const AnomalyLog = component$<AnomalyLogProps>(({ anomalies }) => {
  return (
    <div class="mt-4 min-h-[200px] rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 shadow-lg backdrop-blur-md">
      <h3 class="mb-4 text-xl font-medium text-slate-200">
        Anomaly Detection Log
      </h3>
      <div class="custom-scrollbar h-32 overflow-y-auto pr-2">
        {anomalies.length === 0 ? (
          <div class="flex h-full flex-col items-center justify-center space-y-2 text-slate-500">
            <span class="text-3xl">✓</span>
            <span>System Normal. No anomalies detected.</span>
          </div>
        ) : (
          <ul class="space-y-2">
            {anomalies.map((a, i) => (
              <li
                key={i}
                class="group flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm transition-colors hover:bg-red-500/20"
              >
                <span class="font-mono text-slate-400">
                  {new Date(a.timestamp).toLocaleTimeString()}
                </span>
                <div class="flex items-center gap-3">
                  <span class="rounded border border-red-500/30 bg-red-500/20 px-2 py-0.5 text-xs font-medium tracking-wide text-red-300 uppercase">
                    {a.type}
                  </span>
                  <span class="font-bold text-white">
                    {a.temperature.toFixed(1)}°C
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});
