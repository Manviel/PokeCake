import { component$ } from "@builder.io/qwik";
import {
  ActivityIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  MinusIcon,
  ShieldAlertIcon,
  DollarSignIcon,
  CalendarIcon,
} from "lucide-qwik";
import { type DeviceAnalytics, UsageTrend } from "~/services/api";

interface KpiGridProps {
  da: DeviceAnalytics | null;
}

export const KpiGrid = component$<KpiGridProps>(({ da }) => {
  return (
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
      {/* Health Score */}
      <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 shadow-lg backdrop-blur-md">
        <div class="mb-2 flex items-center gap-3">
          <div class="rounded-full bg-emerald-500/20 p-2 text-emerald-400">
            <ActivityIcon class="h-6 w-6" />
          </div>
          <h3 class="text-lg font-medium text-slate-200">System Health</h3>
        </div>
        <div class="flex items-end gap-2">
          <span class="text-5xl font-bold text-white">
            {da?.health_score ?? "--"}
          </span>
          <span class="mb-1 text-lg text-slate-400">/ 100</span>
        </div>
        <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            class="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-1000"
            style={{ width: `${da?.health_score ?? 0}%` }}
          ></div>
        </div>
      </div>

      {/* Usage Trend */}
      <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 shadow-lg backdrop-blur-md">
        <div class="mb-2 flex items-center gap-3">
          <div class="rounded-full bg-blue-500/20 p-2 text-blue-400">
            <TrendingUpIcon class="h-6 w-6" />
          </div>
          <h3 class="text-lg font-medium text-slate-200">Usage Trend</h3>
        </div>
        <div class="mt-2 flex items-center gap-4">
          {da?.usage_trend === UsageTrend.INCREASING && (
            <TrendingUpIcon class="h-12 w-12 text-red-400" />
          )}
          {da?.usage_trend === UsageTrend.DECREASING && (
            <TrendingDownIcon class="h-12 w-12 text-emerald-400" />
          )}
          {da?.usage_trend === UsageTrend.STABLE && (
            <MinusIcon class="h-12 w-12 text-slate-400" />
          )}
          <div>
            <div class="text-2xl font-bold text-white capitalize">
              {da?.usage_trend}
            </div>
            <div class="text-sm text-slate-400">Based on recent load</div>
          </div>
        </div>
        {da?.return_risk_flag && (
          <div class="mt-3 flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400">
            <ShieldAlertIcon class="h-3.5 w-3.5" />
            Return Risk Active
          </div>
        )}
      </div>

      {/* Revenue at Risk */}
      <div class="rounded-3xl border border-red-500/20 bg-gradient-to-br from-slate-900 to-red-950/20 p-6 shadow-lg backdrop-blur-md">
        <div class="mb-2 flex items-center gap-3">
          <div class="rounded-full bg-red-500/20 p-2 text-red-400">
            <DollarSignIcon class="h-6 w-6" />
          </div>
          <h3 class="text-lg font-medium text-slate-200">Revenue at Risk</h3>
        </div>
        {da?.revenue_at_risk != null ? (
          <>
            <div class="text-4xl font-bold text-red-300">
              $
              {da.revenue_at_risk.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
            <div class="mt-1 text-xs text-slate-500">based on health score</div>
          </>
        ) : (
          <div class="mt-4 text-sm text-slate-600">No sale record</div>
        )}
      </div>

      {/* Days Since Sale */}
      <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 shadow-lg backdrop-blur-md">
        <div class="mb-2 flex items-center gap-3">
          <div class="rounded-full bg-purple-500/20 p-2 text-purple-400">
            <CalendarIcon class="h-6 w-6" />
          </div>
          <h3 class="text-lg font-medium text-slate-200">Days Since Sale</h3>
        </div>
        {da?.days_since_sale != null ? (
          <>
            <div class="text-4xl font-bold text-white">
              {da.days_since_sale}
            </div>
            <div class="mt-1 text-xs text-slate-500">
              {da.days_since_sale < 365
                ? `${365 - da.days_since_sale}d left in warranty`
                : "Warranty expired"}
            </div>
          </>
        ) : (
          <div class="mt-4 text-sm text-slate-600">No sale record</div>
        )}
      </div>

      {/* Last Analyzed */}
      <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 shadow-lg backdrop-blur-md">
        <h3 class="mb-2 text-lg font-medium text-slate-200">Last Analysis</h3>
        <div class="text-3xl font-bold text-white">
          {da?.last_analyzed
            ? new Date(da.last_analyzed).toLocaleTimeString()
            : "--:--"}
        </div>
        <div class="mt-1 text-sm text-slate-400">
          {da?.last_analyzed
            ? new Date(da.last_analyzed).toLocaleDateString()
            : ""}
        </div>
      </div>
    </div>
  );
});
