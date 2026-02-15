import { component$, type Signal } from "@builder.io/qwik";
import { XIcon } from "lucide-qwik";
import type { ProductTwin } from "../../services/api";
import { Modal } from "../ui/modal/modal";

interface SpecsModalProps {
  show: Signal<boolean>;
  twin: ProductTwin | null;
}

export const SpecsModal = component$<SpecsModalProps>(({ show, twin }) => {
  return (
    <Modal.Root show={show}>
      <Modal.Panel>
        {twin && (
          <div class="p-8">
            <div class="mb-6 flex items-start justify-between">
              <div>
                <Modal.Title>{twin.name}</Modal.Title>
                <p class="text-apple-accent font-semibold">
                  {twin.model_identifier}
                </p>
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
              <div class="rounded-2xl border border-white/40 bg-white/50 p-4">
                <p class="text-apple-text-secondary mb-1 text-xs font-bold uppercase">
                  Hardware ID
                </p>
                <p>{twin.model_identifier}</p>
              </div>
            </div>

            <div class="mt-8 border-t border-black/5 pt-6">
              <h3 class="text-apple-text-secondary mb-4 text-sm font-bold uppercase">
                Technical Specifications
              </h3>
              <ul class="space-y-3 text-sm">
                <li class="flex justify-between">
                  <span class="text-apple-text-secondary">Processor</span>
                  <span class="font-medium">A17 Pro Chip</span>
                </li>
                <li class="flex justify-between">
                  <span class="text-apple-text-secondary">
                    Storage Capacity
                  </span>
                  <span class="font-medium">256 GB</span>
                </li>
                <li class="flex justify-between">
                  <span class="text-apple-text-secondary">Display</span>
                  <span class="font-medium">6.1" Super Retina XDR</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </Modal.Panel>
    </Modal.Root>
  );
});
