import { component$, Slot } from "@builder.io/qwik";

interface ManageActionProps {
  title: string;
  description: string;
  isDanger?: boolean;
}

export const ManageAction = component$<ManageActionProps>(
  ({ title, description, isDanger = false }) => {
    const containerClasses = isDanger
      ? "bg-red-50/50 border-red-100/40"
      : "bg-white/50 border-white/40";

    const titleClasses = isDanger ? "text-red-700" : "text-apple-text";
    const descClasses = isDanger ? "text-red-700" : "text-apple-text-secondary";

    return (
      <div
        class={[
          "flex items-center justify-between rounded-2xl border p-4 transition-colors",
          containerClasses,
        ]}
      >
        <div>
          <p class={["font-semibold", titleClasses]}>{title}</p>
          <p class={["text-sm", descClasses]}>{description}</p>
        </div>
        <div class="flex shrink-0 items-center">
          <Slot name="action" />
        </div>
      </div>
    );
  },
);
