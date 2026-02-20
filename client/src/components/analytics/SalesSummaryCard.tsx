import { component$ } from "@builder.io/qwik";
import type { SalesSummary } from "~/services/api";
import {
  DollarSignIcon,
  ShieldAlertIcon,
  PackageIcon,
  TrendingDownIcon,
} from "lucide-qwik";

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
          {/* Total Revenue */}
          <div class="rounded-2xl border border-white/5 bg-white/5 p-4">
            <div class="mb-1 flex items-center gap-2 text-xs font-medium tracking-wider text-slate-400 uppercase">
              <DollarSignIcon class="h-3.5 w-3.5" />
              Total Revenue
            </div>
            <div class="text-2xl font-bold text-white">
              ${summary.total_revenue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div class="mt-0.5 text-xs text-slate-500">
              {summary.total_units_sold} units sold
            </div>
          </div>

          {/* Revenue at Risk */}
          <div class="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <div class="mb-1 flex items-center gap-2 text-xs font-medium tracking-wider text-red-400 uppercase">
              <TrendingDownIcon class="h-3.5 w-3.5" />
              Revenue at Risk
            </div>
            <div class="text-2xl font-bold text-red-300">
              ${summary.total_revenue_at_risk.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div class="mt-0.5 text-xs text-red-500/70">
              {atRiskPct.toFixed(1)}% of portfolio
            </div>
          </div>

          {/* Devices at Risk */}
          <div class="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div class="mb-1 flex items-center gap-2 text-xs font-medium tracking-wider text-amber-400 uppercase">
              <ShieldAlertIcon class="h-3.5 w-3.5" />
              Devices at Risk
            </div>
            <div class="text-2xl font-bold text-amber-300">
              {summary.devices_at_risk}
            </div>
            <div class="mt-0.5 text-xs text-amber-500/70">
              health &lt; 40 within warranty
            </div>
          </div>

          {/* Units Sold */}
          <div class="rounded-2xl border border-white/5 bg-white/5 p-4">
            <div class="mb-1 flex items-center gap-2 text-xs font-medium tracking-wider text-slate-400 uppercase">
              <PackageIcon class="h-3.5 w-3.5" />
              Units Sold
            </div>
            <div class="text-2xl font-bold text-white">
              {summary.total_units_sold}
            </div>
            <div class="mt-0.5 text-xs text-slate-500">across all regions</div>
          </div>
        </div>

        {/* Breakdowns */}
        {(summary.by_region.length > 0 || summary.by_channel.length > 0) && (
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* By Region */}
            {summary.by_region.length > 0 && (
              <div>
                <h3 class="mb-3 text-xs font-medium tracking-wider text-slate-500 uppercase">
                  By Region
                </h3>
                <div class="space-y-2">
                  {summary.by_region.map((r) => {
                    const pct =
                      summary.total_revenue > 0
                        ? (r.revenue / summary.total_revenue) * 100
                        : 0;
                    return (
                      <div key={r.region}>
                        <div class="mb-1 flex justify-between text-xs text-slate-400">
                          <span>{r.region}</span>
                          <span class="text-slate-200">
                            ${r.revenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                          <div
                            class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* By Channel */}
            {summary.by_channel.length > 0 && (
              <div>
                <h3 class="mb-3 text-xs font-medium tracking-wider text-slate-500 uppercase">
                  By Channel
                </h3>
                <div class="space-y-2">
                  {summary.by_channel.map((c) => {
                    const pct =
                      summary.total_revenue > 0
                        ? (c.revenue / summary.total_revenue) * 100
                        : 0;
                    return (
                      <div key={c.channel}>
                        <div class="mb-1 flex justify-between text-xs text-slate-400">
                          <span class="capitalize">{c.channel}</span>
                          <span class="text-slate-200">
                            ${c.revenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                          <div
                            class="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
