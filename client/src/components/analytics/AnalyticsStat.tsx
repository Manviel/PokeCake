import { component$, Slot } from "@builder.io/qwik";

interface AnalyticsStatProps {
  value: string | number;
  subtext?: string;
  valueClass?: string;
}

export const AnalyticsStat = component$<AnalyticsStatProps>(
  ({ value, subtext, valueClass = "text-4xl font-bold text-white" }) => {
    return (
      <>
        <div class="flex items-end gap-2">
          <p class={valueClass}>{value}</p>
          <Slot name="suffix" />
        </div>
        {subtext && <p class="mt-1 text-sm text-slate-400">{subtext}</p>}
        <Slot />
      </>
    );
  },
);
