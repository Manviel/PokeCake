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
import { AnalyticsCard } from "./AnalyticsCard";
import { AnalyticsStat } from "./AnalyticsStat";

interface KpiGridProps {
  da: DeviceAnalytics | null;
}

export const KpiGrid = component$<KpiGridProps>(({ da }) => {
  return (
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
      {/* Health Score */}
      <AnalyticsCard title="System Health" iconColor="emerald">
        <ActivityIcon q:slot="icon" class="h-6 w-6" />
        <AnalyticsStat
          value={da?.health_score ?? "--"}
          valueClass="text-5xl font-bold text-white"
        >
          <span q:slot="suffix" class="mb-1 text-lg text-slate-400">
            / 100
          </span>
          <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              class="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-1000"
              style={{ width: `${da?.health_score ?? 0}%` }}
            ></div>
          </div>
        </AnalyticsStat>
      </AnalyticsCard>

      {/* Usage Trend */}
      <AnalyticsCard title="Usage Trend" iconColor="blue">
        <TrendingUpIcon q:slot="icon" class="h-6 w-6" />
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
      </AnalyticsCard>

      {/* Revenue at Risk */}
      <AnalyticsCard title="Revenue at Risk" variant="danger" iconColor="red">
        <DollarSignIcon q:slot="icon" class="h-6 w-6" />
        {da?.revenue_at_risk != null ? (
          <AnalyticsStat
            value={`$${da.revenue_at_risk.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`}
            valueClass="text-4xl font-bold text-red-300"
            subtext="based on health score"
          />
        ) : (
          <div class="mt-4 text-sm text-slate-600">No sale record</div>
        )}
      </AnalyticsCard>

      {/* Days Since Sale */}
      <AnalyticsCard title="Days Since Sale" iconColor="purple">
        <CalendarIcon q:slot="icon" class="h-6 w-6" />
        {da?.days_since_sale != null ? (
          <AnalyticsStat
            value={da.days_since_sale}
            subtext={
              da.days_since_sale < 365
                ? `${365 - da.days_since_sale}d left in warranty`
                : "Warranty expired"
            }
          />
        ) : (
          <div class="mt-4 text-sm text-slate-600">No sale record</div>
        )}
      </AnalyticsCard>

      {/* Last Analyzed */}
      <AnalyticsCard title="Last Analysis">
        <AnalyticsStat
          value={
            da?.last_analyzed
              ? new Date(da.last_analyzed).toLocaleTimeString()
              : "--:--"
          }
          valueClass="text-3xl font-bold text-white"
          subtext={
            da?.last_analyzed
              ? new Date(da.last_analyzed).toLocaleDateString()
              : ""
          }
        />
      </AnalyticsCard>
    </div>
  );
});
