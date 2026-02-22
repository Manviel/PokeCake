import { component$, Slot } from "@builder.io/qwik";

interface KpiCardProps {
  label: string;
  value: string;
  subLabel: string;
  variant?: "default" | "danger" | "warning";
}

const variantStyles: Record<
  NonNullable<KpiCardProps["variant"]>,
  { card: string; label: string; value: string; sub: string }
> = {
  default: {
    card: "rounded-2xl border border-white/5 bg-white/5 p-4",
    label:
      "mb-1 flex items-center gap-2 text-xs font-medium tracking-wider text-slate-400 uppercase",
    value: "text-2xl font-bold text-white",
    sub: "mt-0.5 text-xs text-slate-500",
  },
  danger: {
    card: "rounded-2xl border border-red-500/20 bg-red-500/5 p-4",
    label:
      "mb-1 flex items-center gap-2 text-xs font-medium tracking-wider text-red-400 uppercase",
    value: "text-2xl font-bold text-red-300",
    sub: "mt-0.5 text-xs text-red-500/70",
  },
  warning: {
    card: "rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4",
    label:
      "mb-1 flex items-center gap-2 text-xs font-medium tracking-wider text-amber-400 uppercase",
    value: "text-2xl font-bold text-amber-300",
    sub: "mt-0.5 text-xs text-amber-500/70",
  },
};

export const KpiCard = component$<KpiCardProps>(
  ({ label, value, subLabel, variant = "default" }) => {
    const styles = variantStyles[variant];
    return (
      <div class={styles.card}>
        <div class={styles.label}>
          <Slot name="icon" />
          {label}
        </div>
        <div class={styles.value}>{value}</div>
        <div class={styles.sub}>{subLabel}</div>
      </div>
    );
  },
);
