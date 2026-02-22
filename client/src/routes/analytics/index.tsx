import { component$, useStore, useTask$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { Listbox } from "~/components/ui/listbox/listbox";
import { KpiGrid } from "~/components/analytics/KpiGrid";
import { ForecastPanel } from "~/components/analytics/ForecastPanel";
import { AnomalyLog } from "~/components/analytics/AnomalyLog";
import { TelemetryChart } from "~/components/analytics/TelemetryChart";
import { SalesSummaryCard } from "~/components/analytics/SalesSummaryCard";
import {
  fetchAnomalies,
  fetchForecast,
  fetchHistory,
  fetchTwins,
  fetchDeviceAnalytics,
  fetchSalesSummary,
  type DeviceAnalytics,
  type Anomaly,
  type HistoryItem,
  type Forecast,
  type SalesSummary,
} from "~/services/api";

export const useAnalyticsTwins = routeLoader$(async () => {
  try {
    return await fetchTwins();
  } catch (e) {
    console.error("Failed to load twins for analytics", e);
    return [];
  }
});

export const useSalesSummary = routeLoader$(async () => {
  try {
    return await fetchSalesSummary();
  } catch (e) {
    console.error("Failed to load sales summary", e);
    return {
      total_revenue: 0,
      total_units_sold: 0,
      total_revenue_at_risk: 0,
      devices_at_risk: 0,
      by_region: [],
      by_channel: [],
    } as SalesSummary;
  }
});

interface AnalyticsData {
  history: HistoryItem[];
  forecast: Forecast | null;
  anomalies: Anomaly[];
  deviceAnalytics: DeviceAnalytics | null;
  loading: boolean;
  selectedTwin: string | null;
}

export default component$(() => {
  const twinsLoader = useAnalyticsTwins();
  const salesSummaryLoader = useSalesSummary();

  const state = useStore<AnalyticsData>({
    history: [],
    forecast: null,
    anomalies: [],
    deviceAnalytics: null,
    loading: false,
    selectedTwin:
      twinsLoader.value.length > 0 ? twinsLoader.value[0].serial_number : null,
  });

  useTask$(async ({ track }) => {
    track(() => state.selectedTwin);
    if (!state.selectedTwin) return;

    state.loading = true;
    try {
      const [hist, forecast, anomalies, deviceAnalytics] = await Promise.all([
        fetchHistory(state.selectedTwin),
        fetchForecast(state.selectedTwin),
        fetchAnomalies(state.selectedTwin),
        fetchDeviceAnalytics(state.selectedTwin),
      ]);

      state.history = hist;
      state.forecast = forecast;
      state.anomalies = anomalies;
      state.deviceAnalytics = deviceAnalytics;
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

  const da = state.deviceAnalytics;

  return (
    <main class="min-h-screen bg-slate-950 p-8 pt-[80px] text-slate-50">
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:14px_24px]"></div>

      <div class="relative z-10 mx-auto max-w-7xl space-y-8">
        <SalesSummaryCard summary={salesSummaryLoader.value} />

        {/* Header + device selector */}
        <header class="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl">
          <div>
            <h1 class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
              Neural Engine Analytics
            </h1>
            <div class="mt-4 flex items-center gap-4">
              <p class="text-slate-400">Analysis for:</p>
              <Listbox
                value={state.selectedTwin || undefined}
                onChange$={(val: string) => {
                  state.selectedTwin = val;
                }}
                options={twinsLoader.value.map((twin) => ({
                  label: twin.name,
                  value: twin.serial_number,
                  description: `(${twin.serial_number})`,
                }))}
                placeholder="Select a Twin"
                triggerClass="flex min-w-[200px] items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white transition-colors hover:bg-white/10"
              />
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
            {/* KPI Row — 5 cards */}
            <div class="col-span-1 lg:col-span-2">
              <KpiGrid da={da} />
            </div>

            {/* Temperature Forecast chart */}
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
              <ForecastPanel forecast={state.forecast} />
            </div>

            {/* CPU chart + Anomaly log */}
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
              <AnomalyLog anomalies={state.anomalies} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Analytics - Apple Digital Twin",
  meta: [
    {
      name: "description",
      content: "Analytics data for your hardware digital twins.",
    },
  ],
};
