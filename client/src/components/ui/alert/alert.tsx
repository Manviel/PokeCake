import { component$, type Signal, useTask$ } from "@builder.io/qwik";
import { AlertCircleIcon, CheckIcon, InfoIcon } from "lucide-qwik";

export interface AlertProps {
  show: Signal<boolean>;
  message: Signal<string>;
  type?: "success" | "error" | "info";
  duration?: number;
}

export const Alert = component$<AlertProps>(
  ({ show, message, type = "info", duration = 3000 }) => {
    useTask$(({ track }) => {
      track(() => show.value);
      if (show.value) {
        const timer = setTimeout(() => {
          show.value = false;
        }, duration);
        return () => clearTimeout(timer);
      }
    });

    if (!show.value) return null;

    const bgColors = {
      success: "bg-green-700 text-white",
      error: "bg-red-600 text-white",
      info: "bg-apple-accent text-white",
    };

    const icons = {
      success: <CheckIcon size={16} />,
      error: <AlertCircleIcon size={16} />,
      info: <InfoIcon size={16} />,
    };

    return (
      <div
        class={`animate-in fade-in slide-in-from-top-2 mb-6 flex w-full items-center gap-2 rounded-2xl px-4 py-3 shadow-sm duration-300 ${bgColors[type]}`}
      >
        {icons[type]}
        <span class="text-sm font-medium">{message.value}</span>
      </div>
    );
  },
);
