import { component$, useSignal, $, type QRL, type Signal } from "@builder.io/qwik";
import { XIcon } from "lucide-qwik";
import type { ProductTwin } from "../../services/api";
import { updateTwin } from "../../services/api";
import { Modal } from "../ui/modal/modal";

interface SpecsModalProps {
  show: Signal<boolean>;
  twin: ProductTwin | null;
  onUpdate$?: QRL<(id: string) => void>;
}

export const SpecsModal = component$<SpecsModalProps>(({ show, twin, onUpdate$ }) => {
  const nameValue = useSignal(twin?.name ?? "");
  const saving = useSignal(false);

  const handleSubmit = $(async () => {
    if (!twin || !nameValue.value.trim()) return;
    saving.value = true;
    try {
      await updateTwin(twin._id, { name: nameValue.value.trim() });
      await onUpdate$?.(twin._id);
      show.value = false;
    } finally {
      saving.value = false;
    }
  });

  return (
    <Modal.Root show={show}>
      <Modal.Panel>
        {twin && (
          <div class="p-8">
            <div class="mb-6 flex items-start justify-between">
              <div>
                <Modal.Title>{twin.name}</Modal.Title>
              </div>
              <button
                type="button"
                onClick$={() => (show.value = false)}
                class="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="rounded-2xl border border-white/40 bg-white/50 p-4">
                <p class="text-apple-text-secondary mb-1 text-xs font-bold uppercase">
                  Serial Number
                </p>
                <p class="font-mono">{twin.serial_number}</p>
              </div>
              <div class="rounded-2xl border border-white/40 bg-white/50 p-4">
                <p class="text-apple-text-secondary mb-1 text-xs font-bold uppercase">
                  OS Version
                </p>
                <p>{twin.os_version}</p>
              </div>
            </div>

            <div class="mt-8 border-t border-black/5 pt-6">
              <h3 class="text-apple-text-secondary mb-4 text-sm font-bold uppercase">
                Rename Device
              </h3>
              <form
                preventdefault:submit
                onSubmit$={handleSubmit}
                class="flex gap-3"
              >
                <input
                  type="text"
                  value={nameValue.value}
                  onInput$={(e) =>
                    (nameValue.value = (e.target as HTMLInputElement).value)
                  }
                  placeholder="Device name"
                  class="flex-1 rounded-xl border border-black/10 bg-white/60 px-4 py-2 text-sm outline-none focus:border-apple-accent focus:ring-2 focus:ring-apple-accent/20"
                />
                <button
                  type="submit"
                  disabled={saving.value}
                  class="rounded-xl bg-apple-accent px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {saving.value ? "Saving…" : "Save"}
                </button>
              </form>
            </div>
          </div>
        )}
      </Modal.Panel>
    </Modal.Root>
  );
});
