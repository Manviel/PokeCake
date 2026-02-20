import { component$ } from "@builder.io/qwik";
import type { SalesSummary } from "~/services/api";
import {
  DollarSignIcon,
  ShieldAlertIcon,
  PackageIcon,
  TrendingDownIcon,
} from "lucide-qwik";
import { KpiCard } from "./KpiCard";
import { RevenueBreakdown } from "./RevenueBreakdown";

interface SalesSummaryCardProps {
  summary: SalesSummary;
}

export const SalesSummaryCard = component$<SalesSummaryCardProps>(
  ({ summary }) => {
    const atRiskPct =
      summary.total_revenue > 0
        ? (summary.total_revenue_at_risk / summary.total_revenue) * 100
        : 0;

    return (
      <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 shadow-lg backdrop-blur-md">
        <h2 class="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-200">
          <span class="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"></span>
          Fleet Sales Overview
        </h2>

        {/* KPI row */}
        <div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <KpiCard
            label="Total Revenue"
            value={`$${summary.total_revenue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            subLabel={`${summary.total_units_sold} units sold`}
            variant="default"
          >
            <DollarSignIcon q:slot="icon" class="h-3.5 w-3.5" />
          </KpiCard>

          <KpiCard
            label="Revenue at Risk"
            value={`$${summary.total_revenue_at_risk.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            subLabel={`${atRiskPct.toFixed(1)}% of portfolio`}
            variant="danger"
          >
            <TrendingDownIcon q:slot="icon" class="h-3.5 w-3.5" />
          </KpiCard>

          <KpiCard
            label="Devices at Risk"
            value={String(summary.devices_at_risk)}
            subLabel="health < 40 within warranty"
            variant="warning"
          >
            <ShieldAlertIcon q:slot="icon" class="h-3.5 w-3.5" />
          </KpiCard>

          <KpiCard
            label="Units Sold"
            value={String(summary.total_units_sold)}
            subLabel="across all regions"
            variant="default"
          >
            <PackageIcon q:slot="icon" class="h-3.5 w-3.5" />
          </KpiCard>
        </div>

        {/* Breakdowns */}
        {(summary.by_region.length > 0 || summary.by_channel.length > 0) && (
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RevenueBreakdown
              title="By Region"
              rows={summary.by_region.map((r) => ({
                label: r.region,
                revenue: r.revenue,
              }))}
              total={summary.total_revenue}
              color="emerald"
            />
            <RevenueBreakdown
              title="By Channel"
              rows={summary.by_channel.map((c) => ({
                label: c.channel,
                revenue: c.revenue,
              }))}
              total={summary.total_revenue}
              color="blue"
            />
          </div>
        )}

        {summary.total_units_sold === 0 && (
          <div class="py-6 text-center text-sm text-slate-600">
            No sales recorded yet. Use{" "}
            <code class="rounded bg-white/5 px-1 text-slate-400">
              POST /api/v1/sales
            </code>{" "}
            to record your first sale.
          </div>
        )}
      </div>
    );
  },
);
