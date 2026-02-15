import { component$, useStore, useTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Select } from "@qwik-ui/headless";
import { CheckIcon, ChevronDownIcon } from "lucide-qwik";
import { TelemetryChart } from "~/components/analytics/TelemetryChart";
import {
  fetchAnomalies,
  fetchForecast,
  fetchHistory,
  fetchTwins,
} from "~/services/api";

export const useAnalyticsTwins = routeLoader$(async () => {
  try {
    const twins = await fetchTwins();
    return twins;
  } catch (e) {
    console.error("Failed to load twins for analytics", e);
    return [];
  }
});

interface HistoryItem {
  last_synced: string;
  temperature: number;
  cpu_usage: number;
}

interface Forecast {
  current_temperature: number;
  forecast_temperature: number;
  trend: string;
}

interface Anomaly {
  timestamp: string;
  type: string;
  temperature: number;
}

interface AnalyticsData {
  history: HistoryItem[];
  forecast: Forecast | null;
  anomalies: Anomaly[];
  loading: boolean;
  selectedTwin: string | null;
}

export default component$(() => {
  const twinsLoader = useAnalyticsTwins();
  const state = useStore<AnalyticsData>({
    history: [],
    forecast: null,
    anomalies: [],
    loading: false,
    selectedTwin:
      twinsLoader.value.length > 0 ? twinsLoader.value[0].serial_number : null,
  });

  // Fetch analytics when selected twin changes
  useTask$(async ({ track }) => {
    track(() => state.selectedTwin);

    if (!state.selectedTwin) return;

    state.loading = true;
    try {
      const [hist, forecast, anomalies] = await Promise.all([
        fetchHistory(state.selectedTwin),
        fetchForecast(state.selectedTwin),
        fetchAnomalies(state.selectedTwin),
      ]);

      state.history = hist;
      state.forecast = forecast;
      state.anomalies = anomalies;
    } catch (e) {
      console.error("Failed to fetch analytics", e);
    } finally {
      state.loading = false;
    }
  });

  const timestamps = state.history.map((h) =>
    new Date(h.last_synced).toLocaleTimeString(),
  );
  const temps = state.history.map((h) => h.temperature);
  const cpu = state.history.map((h) => h.cpu_usage);

  return (
    <main class="min-h-screen bg-slate-950 p-8 pt-[80px] text-slate-50">
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:14px_24px]"></div>

      <div class="relative z-10 mx-auto max-w-7xl space-y-8">
        <header class="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl">
          <div>
            <h1 class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
              Neural Engine Analytics
            </h1>
            <div class="mt-4 flex items-center gap-4">
              <p class="text-slate-400">Analysis for:</p>
              <Select.Root
                value={state.selectedTwin || undefined}
                onChange$={(val: string) => {
                  state.selectedTwin = val;
                }}
              >
                <Select.Trigger class="flex min-w-[200px] items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white transition-colors hover:bg-white/10">
                  <Select.DisplayValue placeholder="Select a Twin" />
                  <ChevronDownIcon class="h-4 w-4 opacity-50" />
                </Select.Trigger>
                <Select.Popover class="z-50 min-w-[200px] rounded-xl border border-white/10 bg-slate-900/95 p-1 shadow-2xl backdrop-blur-xl">
                  <Select.Listbox class="max-h-[300px] overflow-auto">
                    {twinsLoader.value.map((twin) => (
                      <Select.Item
                        key={twin.serial_number}
                        value={twin.serial_number}
                        class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-slate-300 transition-colors outline-none hover:bg-white/10 hover:text-white data-[highlighted]:bg-white/10 data-[highlighted]:text-white"
                      >
                        <div class="flex items-center gap-2">
                          <Select.ItemLabel>{twin.name}</Select.ItemLabel>
                          <span class="text-xs text-slate-500">
                            ({twin.serial_number})
                          </span>
                        </div>
                        <Select.ItemIndicator>
                          <CheckIcon class="h-4 w-4 text-blue-400" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Listbox>
                </Select.Popover>
              </Select.Root>
            </div>
          </div>
          {state.loading && (
            <div class="animate-pulse font-medium text-blue-400">
              Syncing Telemetry...
            </div>
          )}
        </header>

        {state.loading && !state.history.length && state.selectedTwin && (
          <div class="flex animate-pulse justify-center space-x-4 p-12">
            <div class="text-xl text-slate-500">Initializing AI Models...</div>
          </div>
        )}

        {!state.loading && state.selectedTwin && (
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div class="space-y-4">
              <h2 class="flex items-center gap-2 text-xl font-semibold text-slate-200">
                <span class="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]"></span>
                Temperature Forecast
              </h2>
              <TelemetryChart
                data={temps}
                labels={timestamps}
                label="Temperature (°C)"
                color="rgb(248, 113, 113)"
              />
              {state.forecast && (
                <div class="group mt-4 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 shadow-lg backdrop-blur-md transition-all duration-500 hover:border-white/20">
                  <div class="flex items-start justify-between">
                    <h3 class="text-xl font-medium text-slate-200">
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
                        {state.forecast.current_temperature?.toFixed(1)}°C
                      </div>
                    </div>
                    <div>
                      <span class="mb-1 block text-sm font-medium tracking-wider text-slate-400 uppercase">
                        Forecast (T+1)
                      </span>
                      <div
                        class={`flex items-center gap-2 text-4xl font-bold tracking-tight ${state.forecast.trend === "increasing" ? "text-red-400" : "text-emerald-400"}`}
                      >
                        {state.forecast.forecast_temperature?.toFixed(1)}°C
                        <span class="text-lg">
                          {state.forecast.trend === "increasing" ? "↑" : "↓"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div class="space-y-4">
              <h2 class="flex items-center gap-2 text-xl font-semibold text-slate-200">
                <span class="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]"></span>
                CPU Usage History
              </h2>
              <TelemetryChart
                data={cpu}
                labels={timestamps}
                label="CPU Usage (%)"
                color="rgb(56, 189, 248)"
              />
              <div class="mt-4 min-h-[200px] rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 shadow-lg backdrop-blur-md">
                <h3 class="mb-4 text-xl font-medium text-slate-200">
                  Anomaly Detection Log
                </h3>
                <div class="custom-scrollbar h-32 overflow-y-auto pr-2">
                  {state.anomalies.length === 0 ? (
                    <div class="flex h-full flex-col items-center justify-center space-y-2 text-slate-500">
                      <span class="text-3xl">✓</span>
                      <span>System Normal. No anomalies detected.</span>
                    </div>
                  ) : (
                    <ul class="space-y-2">
                      {state.anomalies.map((a, i) => (
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
            </div>
          </div>
        )}
      </div>
    </main>
  );
});
