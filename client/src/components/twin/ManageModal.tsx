import { component$, useSignal, $, type PropFunction, type Signal } from "@builder.io/qwik";
import { Button } from "../ui/button/button";
import { Modal } from "../ui/modal/modal";
import { type ProductTwin, updateTwinOs } from "../../services/api";

interface ManageModalProps {
    show: Signal<boolean>;
    twin: ProductTwin | null;
    onUpdate$: PropFunction<(twinId: string) => void>;
}

export const ManageModal = component$<ManageModalProps>(({ show, twin, onUpdate$ }) => {
    const isUpdating = useSignal(false);

    const handleUpdateOS = $(async () => {
        if (!twin) return;
        isUpdating.value = true;

        // Simulate update process
        await new Promise(resolve => setTimeout(resolve, 3000));

        try {
            await updateTwinOs(twin._id, "iOS 18.0 Beta");
            await onUpdate$(twin._id);
            show.value = false;
            alert("OS Updated successfully!");
        } catch (e) {
            console.error(e);
            alert("Failed to update OS");
        } finally {
            isUpdating.value = false;
        }
    });

    return (
        <Modal.Root show={show}>
            <Modal.Panel>
                {twin && (
                    <div class="p-8">
                        <div class="flex justify-between items-start mb-8">
                            <div>
                                <Modal.Title>Manage Device</Modal.Title>
                                <Modal.Description>System controls for {twin.name}</Modal.Description>
                            </div>
                            <button
                                onClick$={() => (show.value = false)}
                                class="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/40">
                                <div>
                                    <p class="font-semibold">Software Update</p>
                                    <p class="text-xs text-apple-text-secondary">Current: {twin.os_version}</p>
                                </div>
                                <Button
                                    look="primary"
                                    size="sm"
                                    onClick$={handleUpdateOS}
                                    disabled={isUpdating.value}
                                >
                                    {isUpdating.value ? "Updating..." : "Update OS"}
                                </Button>
                            </div>

                            <div class="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/40">
                                <div>
                                    <p class="font-semibold">Simulate Diagnostics</p>
                                    <p class="text-xs text-apple-text-secondary">Run hardware health check</p>
                                </div>
                                <Button look="secondary" size="sm">
                                    Run
                                </Button>
                            </div>

                            <div class="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100/40">
                                <div>
                                    <p class="font-semibold text-red-600">Unpair Device</p>
                                    <p class="text-xs text-red-400">Remove from digital twin network</p>
                                </div>
                                <Button look="danger" size="sm">
                                    Disconnect
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Panel>
        </Modal.Root>
    );
});
