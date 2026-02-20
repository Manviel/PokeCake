import { component$, type ReadonlySignal } from "@builder.io/qwik";
import type { ProductTwin } from "../../services/api";

interface TelemetryPanelProps {
  twin: ProductTwin;
  isDataLive: ReadonlySignal<boolean>;
}

export const TelemetryPanel = component$<TelemetryPanelProps>(
  ({ twin, isDataLive }) => {
    return (
      <section
        class="mb-8 overflow-hidden rounded-2xl border border-gray-200/60 bg-gray-50 p-6"
        aria-labelledby="telemetry-heading"
      >
        <div class="mb-4 flex items-center justify-between">
          <h3
            id="telemetry-heading"
            class="text-xs font-bold tracking-widest text-gray-600 uppercase"
          >
            Live Telemetry
          </h3>
          <div class="flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              {isDataLive.value && (
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              )}
              <span
                class={`relative inline-flex h-2 w-2 rounded-full ${
                  isDataLive.value ? "bg-green-500" : "bg-black/20"
                }`}
              ></span>
            </span>
            <output
              class={`text-xs font-medium uppercase ${
                isDataLive.value ? "text-green-700" : "text-gray-600"
              }`}
              aria-live="polite"
            >
              {isDataLive.value ? "Receiving Hardware Data" : "Hardware Idle"}
            </output>
          </div>
        </div>

        <dl class="grid grid-cols-3 gap-4">
          {/* CPU Usage */}
          <div class="flex flex-col gap-1">
            <dt class="text-xs font-medium text-gray-600 uppercase">
              CPU Load
            </dt>
            <dd
              class={`flex items-end gap-1 text-2xl font-semibold tabular-nums ${
                twin.cpu_usage > 80 ? "text-red-500" : "text-black"
              }`}
            >
              {twin.cpu_usage}%
            </dd>
            <div
              class="h-1 w-full overflow-hidden rounded-full bg-black/10"
              role="progressbar"
              aria-valuenow={twin.cpu_usage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="CPU usage"
            >
              <div
                class={`h-full transition-all duration-500 ${
                  twin.cpu_usage > 80 ? "bg-red-500" : "bg-black"
                }`}
                style={{ width: `${twin.cpu_usage}%` }}
              />
            </div>
          </div>

          {/* Temperature */}
          <div class="flex flex-col gap-1">
            <dt class="text-xs font-medium text-gray-600 uppercase">
              Temperature
            </dt>
            <dd
              class={`flex items-end gap-1 text-2xl font-semibold tabular-nums ${
                twin.temperature > 50 ? "text-orange-500" : "text-black"
              }`}
            >
              {twin.temperature}°C
            </dd>
            <div
              class="h-1 w-full overflow-hidden rounded-full bg-black/10"
              role="progressbar"
              aria-valuenow={twin.temperature}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Temperature"
            >
              <div
                class={`h-full transition-all duration-500 ${
                  twin.temperature > 50 ? "bg-orange-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(100, twin.temperature * 2)}%` }}
              />
            </div>
          </div>

          {/* Battery */}
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <dt class="text-xs font-medium text-gray-600 uppercase">
                Battery
              </dt>
              {twin.is_charging && (
                <span class="animate-pulse text-xs font-bold text-green-700">
                  ⚡
                </span>
              )}
            </div>
            <dd class="flex items-end gap-1 text-2xl font-semibold tabular-nums">
              {twin.battery_health}%
            </dd>
            <div
              class="h-1 w-full overflow-hidden rounded-full bg-black/10"
              role="progressbar"
              aria-valuenow={twin.battery_health}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Battery health"
            >
              <div
                class={`h-full transition-all duration-500 ${
                  twin.battery_health < 20 ? "bg-red-500" : "bg-green-500"
                }`}
                style={{ width: `${twin.battery_health}%` }}
              />
            </div>
          </div>
        </dl>
      </section>
    );
  },
);
