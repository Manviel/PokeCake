import { component$, Slot } from "@builder.io/qwik";

interface AnalyticsCardProps {
  title: string;
  variant?: "default" | "danger";
  iconColor?: "emerald" | "blue" | "red" | "purple";
}

const variantStyles = {
  default:
    "rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 shadow-lg backdrop-blur-md",
  danger:
    "rounded-3xl border border-red-500/20 bg-gradient-to-br from-slate-900 to-red-950/20 p-6 shadow-lg backdrop-blur-md",
};

const iconColorStyles = {
  emerald: "bg-emerald-500/20 text-emerald-400",
  blue: "bg-blue-500/20 text-blue-400",
  red: "bg-red-500/20 text-red-400",
  purple: "bg-purple-500/20 text-purple-400",
};

export const AnalyticsCard = component$<AnalyticsCardProps>(
  ({ title, variant = "default", iconColor }) => {
    return (
      <section aria-label={title} class={variantStyles[variant]}>
        <div class="mb-2 flex items-center gap-3">
          {iconColor && (
            <div class={`rounded-full p-2 ${iconColorStyles[iconColor]}`}>
              <Slot name="icon" />
            </div>
          )}
          <h3 class="text-lg font-medium text-slate-200">{title}</h3>
        </div>
        <Slot />
      </section>
    );
  },
);
