import { component$, type QRL, type ReadonlySignal } from "@builder.io/qwik";
import { Loader2Icon, PlusIcon } from "lucide-qwik";

interface AddDeviceCardProps {
  isPairing: ReadonlySignal<boolean>;
  onClick$: QRL<() => void>;
}

export const AddDeviceCard = component$<AddDeviceCardProps>(
  ({ isPairing, onClick$ }) => {
    return (
      <button
        type="button"
        onClick$={onClick$}
        disabled={isPairing.value}
        class="bg-apple-card border-apple-border group glass flex min-h-[300px] flex-col items-center justify-center rounded-[18px] border border-dashed p-6 transition-colors hover:bg-black/5"
      >
        {isPairing.value ? (
          <div class="flex flex-col items-center gap-4">
            <Loader2Icon class="text-apple-accent h-10 w-10 animate-spin" />
            <span class="text-apple-text font-medium">Scanning...</span>
          </div>
        ) : (
          <>
            <div class="bg-apple-accent/10 text-apple-accent mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <PlusIcon size={24} />
            </div>
            <span class="text-apple-text font-medium">Pair New Device</span>
            <span class="text-apple-text-secondary mt-2 text-xs">
              Scan for nearby Apple devices
            </span>
          </>
        )}
      </button>
    );
  },
);
