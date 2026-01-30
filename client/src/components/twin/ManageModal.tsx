import { component$, useSignal, $, type PropFunction, type Signal } from "@builder.io/qwik";
import { Button } from "../ui/button/button";
import { Modal } from "../ui/modal/modal";
import { type ProductTwin, updateTwinOs, runDiagnostics, unpairDevice } from "../../services/api";
import { Alert } from "../ui/alert/alert";
import { ConfirmDialog } from "../ui/dialog/confirm-dialog";
import { XIcon, Loader2Icon } from "lucide-qwik";

const getNextVersion = (current: string) => {
    const match = current.match(/(\d+)\.(\d+)/);
    if (match) {
        const major = parseInt(match[1]);
        const minor = parseInt(match[2]);
        return `iOS ${major}.${minor + 1}`;
    }
    return "iOS 18.0";
};

interface ManageModalProps {
    show: Signal<boolean>;
    twin: ProductTwin | null;
    onUpdate$: PropFunction<(twinId: string) => void>;
}

export const ManageModal = component$<ManageModalProps>(({ show, twin, onUpdate$ }) => {
    const isUpdating = useSignal(false);
    const isRunningDiagnostics = useSignal(false);
    const isUnpairing = useSignal(false);

    // Alert State
    const showAlert = useSignal(false);
    const alertMessage = useSignal("");
    const alertType = useSignal<"success" | "error" | "info">("info");

    const notify = $((message: string, type: "success" | "error" | "info" = "info") => {
        alertMessage.value = message;
        alertType.value = type;
        showAlert.value = true;
    });
    const updateStatus = useSignal("Update OS");
    const showUnpairConfirm = useSignal(false);

    const handleUpdateOS = $(async () => {
        if (!twin) return;
        isUpdating.value = true;

        try {
            // Stage 1: Checking
            updateStatus.value = "Checking...";
            await new Promise(resolve => setTimeout(resolve, 1000));

            const nextVersion = getNextVersion(twin.os_version);

            // Stage 2: Downloading
            updateStatus.value = "Downloading...";
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Stage 3: Installing
            updateStatus.value = "Installing...";
            await new Promise(resolve => setTimeout(resolve, 1500));

            await updateTwinOs(twin._id, nextVersion);
            await onUpdate$(twin._id);

            notify(`Software Updated to ${nextVersion}`, "success");
        } catch (e) {
            console.error(e);
            notify("Failed to update OS", "error");
        } finally {
            isUpdating.value = false;
            updateStatus.value = "Update OS";
        }
    });

    const handleDiagnostics = $(async () => {
        if (!twin) return;
        isRunningDiagnostics.value = true;
        try {
            const result = await runDiagnostics(twin._id);
            notify(result.message, result.healthy ? "success" : "error");
        } catch (e) {
            console.error(e);
            notify("Diagnostics failed to run", "error");
        } finally {
            isRunningDiagnostics.value = false;
        }
    });

    const handleUnpairClick = $(() => {
        showUnpairConfirm.value = true;
    });

    const executeUnpair = $(async () => {
        if (!twin) return;
        isUnpairing.value = true;
        try {
            await unpairDevice(twin._id);
            await onUpdate$(twin._id);
            show.value = false;
        } catch (e) {
            console.error(e);
            notify("Failed to unpair device", "error");
        } finally {
            isUnpairing.value = false;
        }
    });

    return (
        <>
            <Modal.Root show={show}>
                <Modal.Panel>
                    {twin && (
                        <div class="p-8 text-apple-text">
                            <div class="flex justify-between items-start mb-8">
                                <div>
                                    <Modal.Title>Manage Device</Modal.Title>
                                    <Modal.Description>System controls for {twin.name}</Modal.Description>
                                </div>
                                <button
                                    onClick$={() => (show.value = false)}
                                    class="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                                >
                                    <XIcon size={20} />
                                </button>
                            </div>

                            <Alert show={showAlert} message={alertMessage} type={alertType.value} />

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
                                        disabled={isUpdating.value || isUnpairing.value}
                                    >
                                        {updateStatus.value}
                                    </Button>
                                </div>

                                <div class="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/40">
                                    <div>
                                        <p class="font-semibold">Simulate Diagnostics</p>
                                        <p class="text-xs text-apple-text-secondary">Run hardware health check</p>
                                    </div>
                                    <Button
                                        look="secondary"
                                        size="sm"
                                        onClick$={handleDiagnostics}
                                        disabled={isRunningDiagnostics.value || isUpdating.value}
                                    >
                                        {isRunningDiagnostics.value ? (
                                            <>
                                                <Loader2Icon class="animate-spin h-3 w-3 mr-2" />
                                                Running...
                                            </>
                                        ) : "Run"}
                                    </Button>
                                </div>

                                <div class="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100/40">
                                    <div>
                                        <p class="font-semibold text-red-600">Unpair Device</p>
                                        <p class="text-xs text-red-400">Remove from digital twin network</p>
                                    </div>
                                    <Button
                                        look="danger"
                                        size="sm"
                                        onClick$={handleUnpairClick}
                                        disabled={isUnpairing.value || isUpdating.value}
                                    >
                                        {isUnpairing.value ? "Unpairing..." : "Disconnect"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Panel>
            </Modal.Root>
            <ConfirmDialog
                show={showUnpairConfirm}
                title="Unpair Device?"
                description="Are you sure you want to unpair this device? This action cannot be undone and will stop all telemetry data collection."
                confirmText="Unpair"
                variant="danger"
                onConfirm$={executeUnpair}
            />
        </>
    );
});
