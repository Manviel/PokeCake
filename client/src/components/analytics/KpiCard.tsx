import { component$, Slot } from "@builder.io/qwik";

interface KpiCardProps {
  label: string;
  value: string;
  subLabel: string;
  variant?: "default" | "danger" | "warning";
}

const baseStyles = {
  card: "rounded-2xl border p-4",
  label:
    "mb-1 flex items-center gap-2 text-sm font-medium tracking-wider uppercase",
  value: "text-2xl font-bold",
  sub: "mt-0.5 text-sm",
};

const variantStyles: Record<
  NonNullable<KpiCardProps["variant"]>,
  { card: string; label: string; value: string; sub: string }
> = {
  default: {
    card: "border-white/5 bg-white/5",
    label: "text-slate-400",
    value: "text-white",
    sub: "text-slate-500",
  },
  danger: {
    card: "border-red-500/20 bg-red-500/5",
    label: "text-red-400",
    value: "text-red-300",
    sub: "text-red-500/70",
  },
  warning: {
    card: "border-amber-500/20 bg-amber-500/5",
    label: "text-amber-400",
    value: "text-amber-300",
    sub: "text-amber-500/70",
  },
};

export const KpiCard = component$<KpiCardProps>(
  ({ label, value, subLabel, variant = "default" }) => {
    const vStyle = variantStyles[variant];
    return (
      <div class={`${baseStyles.card} ${vStyle.card}`}>
        <p class={`${baseStyles.label} ${vStyle.label}`}>
          <Slot name="icon" />
          {label}
        </p>
        <strong class={`${baseStyles.value} ${vStyle.value}`}>{value}</strong>
        <p class={`${baseStyles.sub} ${vStyle.sub}`}>{subLabel}</p>
      </div>
    );
  },
);
