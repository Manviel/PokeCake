import { component$ } from "@builder.io/qwik";
import type { Forecast } from "~/services/api";

interface ForecastPanelProps {
  forecast: Forecast | null;
}

export const ForecastPanel = component$<ForecastPanelProps>(({ forecast }) => {
  if (!forecast) return null;
  return (
    <section
      aria-labelledby="forecast-heading"
      class="group mt-4 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 shadow-lg backdrop-blur-md transition-all duration-500 hover:border-white/20"
    >
      <div class="flex items-start justify-between">
        <h3 id="forecast-heading" class="text-xl font-medium text-slate-200">
          AI Prediction Model
        </h3>
        <div class="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
          Linear Regression
        </div>
      </div>
      <div class="mt-6 grid grid-cols-2 gap-8">
        <div>
          <span class="mb-1 block text-sm font-medium tracking-wider text-slate-400 uppercase">
            Current
          </span>
          <div class="text-4xl font-bold tracking-tight text-white">
            {forecast.current_temperature?.toFixed(1)}°C
          </div>
        </div>
        <div>
          <span class="mb-1 block text-sm font-medium tracking-wider text-slate-400 uppercase">
            Forecast (T+1)
          </span>
          <div
            class={`flex items-center gap-2 text-4xl font-bold tracking-tight ${forecast.trend === "increasing" ? "text-red-400" : "text-emerald-400"}`}
          >
            {forecast.forecast_temperature?.toFixed(1)}°C
            <span class="text-lg">
              {forecast.trend === "increasing" ? "↑" : "↓"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});
