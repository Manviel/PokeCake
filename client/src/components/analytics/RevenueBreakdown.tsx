import { component$ } from "@builder.io/qwik";

interface BreakdownRow {
  label: string;
  revenue: number;
}

interface RevenueBreakdownProps {
  title: string;
  rows: BreakdownRow[];
  total: number;
  color: "emerald" | "blue";
}

const gradientClass: Record<RevenueBreakdownProps["color"], string> = {
  emerald: "bg-gradient-to-r from-emerald-500 to-emerald-300",
  blue: "bg-gradient-to-r from-blue-500 to-blue-300",
};

export const RevenueBreakdown = component$<RevenueBreakdownProps>(
  ({ title, rows, total, color }) => {
    if (rows.length === 0) return null;

    return (
      <div>
        <h3 class="mb-3 text-sm font-medium tracking-wider text-slate-500 uppercase">
          {title}
        </h3>
        <div class="space-y-2">
          {rows.map((row) => {
            const pct = total > 0 ? (row.revenue / total) * 100 : 0;
            return (
              <div key={row.label}>
                <div class="mb-1 flex justify-between text-xs text-slate-400">
                  <span class="capitalize">{row.label}</span>
                  <span class="text-slate-200">
                    $
                    {row.revenue.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    class={`h-full rounded-full transition-all duration-700 ${gradientClass[color]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
