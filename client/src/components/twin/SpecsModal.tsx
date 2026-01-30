import { component$, type Signal } from "@builder.io/qwik";
import { Modal } from "../ui/modal/modal";
import type { ProductTwin } from "../../services/api";

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
                        <div class="flex justify-between items-start mb-6">
                            <div>
                                <Modal.Title>{twin.name}</Modal.Title>
                                <p class="text-apple-accent font-semibold">{twin.model_identifier}</p>
                            </div>
                            <button
                                onClick$={() => (show.value = false)}
                                class="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div class="grid grid-cols-2 gap-6">
                            <div class="bg-white/50 p-4 rounded-2xl border border-white/40">
                                <p class="text-xs text-apple-text-secondary uppercase mb-1 font-bold">Serial Number</p>
                                <p class="font-mono">{twin.serial_number}</p>
                            </div>
                            <div class="bg-white/50 p-4 rounded-2xl border border-white/40">
                                <p class="text-xs text-apple-text-secondary uppercase mb-1 font-bold">OS Version</p>
                                <p>{twin.os_version}</p>
                            </div>
                            <div class="bg-white/50 p-4 rounded-2xl border border-white/40">
                                <p class="text-xs text-apple-text-secondary uppercase mb-1 font-bold">Hardware ID</p>
                                <p>{twin.model_identifier}</p>
                            </div>
                            <div class="bg-white/50 p-4 rounded-2xl border border-white/40">
                                <p class="text-xs text-apple-text-secondary uppercase mb-1 font-bold">Warranty</p>
                                <p>{twin.warranty_status}</p>
                            </div>
                        </div>

                        <div class="mt-8 pt-6 border-t border-black/5">
                            <h3 class="text-sm font-bold uppercase text-apple-text-secondary mb-4">Technical Specifications</h3>
                            <ul class="space-y-3 text-sm">
                                <li class="flex justify-between">
                                    <span class="text-apple-text-secondary">Processor</span>
                                    <span class="font-medium">A17 Pro Chip</span>
                                </li>
                                <li class="flex justify-between">
                                    <span class="text-apple-text-secondary">Storage Capacity</span>
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
