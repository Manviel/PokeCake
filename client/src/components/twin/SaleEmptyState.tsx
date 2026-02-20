import { component$, type QRL } from "@builder.io/qwik";
import { TagIcon } from "lucide-qwik";
import { Button } from "../ui/button/button";

interface SaleEmptyStateProps {
  onRecord$: QRL<() => void>;
}

export const SaleEmptyState = component$<SaleEmptyStateProps>(({ onRecord$ }) => {
  return (
    <div class="mb-6 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-10 text-center">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <TagIcon class="h-6 w-6 text-gray-400" />
      </div>
      <div>
        <p class="font-semibold text-gray-700">No sale on record</p>
        <p class="mt-1 text-sm text-gray-400">
          Record a sale to unlock revenue analytics for this device.
        </p>
      </div>
      <Button look="primary" size="sm" onClick$={onRecord$}>
        Record Sale
      </Button>
    </div>
  );
});
