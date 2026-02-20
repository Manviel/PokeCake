import {
  $,
  component$,
  type PropFunction,
  type Signal,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { Loader2Icon, XIcon } from "lucide-qwik";
import { useAlert } from "../../hooks/useAlert";
import {
  type ProductTwin,
  runDiagnostics,
  unpairDevice,
  updateTwinOs,
} from "../../services/api";
import { getNextVersion } from "../../utils/version";
import { Alert } from "../ui/alert/alert";
import { Button } from "../ui/button/button";
import { ConfirmDialog } from "../ui/dialog/confirm-dialog";
import { Modal } from "../ui/modal/modal";
import { ManageAction } from "./ManageAction";
import { TelemetryPanel } from "./TelemetryPanel";

interface ManageModalProps {
  show: Signal<boolean>;
  twin: ProductTwin | null;
  onUpdate$: PropFunction<(twinId: string) => void>;
}

export const ManageModal = component$<ManageModalProps>(
  ({ show, twin, onUpdate$ }) => {
    const isUpdating = useSignal(false);
    const isRunningDiagnostics = useSignal(false);
    const isUnpairing = useSignal(false);

    const {
      show: showAlert,
      message: alertMessage,
      type: alertType,
      notify,
    } = useAlert();

    const updateStatus = useSignal("Update OS");
    const showUnpairConfirm = useSignal(false);
    const isDataLive = useSignal(false);

    useTask$(({ track, cleanup }) => {
      track(() => twin?.last_synced);
      if (twin) {
        isDataLive.value = true;
        const timeout = setTimeout(() => {
          isDataLive.value = false;
        }, 4000);
        cleanup(() => clearTimeout(timeout));
      }
    });

    const handleUpdateOS = $(async () => {
      if (!twin) return;
      isUpdating.value = true;

      try {
        updateStatus.value = "Checking...";
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const nextVersion = getNextVersion(twin.os_version);

        updateStatus.value = "Downloading...";
        await new Promise((resolve) => setTimeout(resolve, 1500));

        updateStatus.value = "Installing...";
        await new Promise((resolve) => setTimeout(resolve, 1500));

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
              <div class="text-apple-text p-8">
                <div class="mb-8 flex items-start justify-between">
                  <div>
                    <Modal.Title>Manage Device</Modal.Title>
                    <Modal.Description>
                      System controls for {twin.name}
                    </Modal.Description>
                  </div>
                  <button
                    type="button"
                    onClick$={() => (show.value = false)}
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10"
                  >
                    <XIcon size={20} />
                  </button>
                </div>

                <Alert
                  show={showAlert}
                  message={alertMessage}
                  type={alertType.value}
                />

                <TelemetryPanel twin={twin} isDataLive={isDataLive} />

                <div class="space-y-4">
                  <ManageAction
                    title="Software Update"
                    description={`Current: ${twin.os_version}`}
                  >
                    <Button
                      q:slot="action"
                      look="primary"
                      size="sm"
                      onClick$={handleUpdateOS}
                      disabled={isUpdating.value || isUnpairing.value}
                    >
                      {updateStatus.value}
                    </Button>
                  </ManageAction>

                  <ManageAction
                    title="Simulate Diagnostics"
                    description="Run hardware health check"
                  >
                    <Button
                      q:slot="action"
                      look="secondary"
                      size="sm"
                      onClick$={handleDiagnostics}
                      disabled={isRunningDiagnostics.value || isUpdating.value}
                    >
                      {isRunningDiagnostics.value ? (
                        <>
                          <Loader2Icon class="mr-2 h-3 w-3 animate-spin" />
                          Running...
                        </>
                      ) : (
                        "Run"
                      )}
                    </Button>
                  </ManageAction>

                  <ManageAction
                    title="Unpair Device"
                    description="Remove from digital twin network"
                    isDanger
                  >
                    <Button
                      q:slot="action"
                      look="danger"
                      size="sm"
                      onClick$={handleUnpairClick}
                      disabled={isUnpairing.value || isUpdating.value}
                    >
                      {isUnpairing.value ? "Unpairing..." : "Disconnect"}
                    </Button>
                  </ManageAction>
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
  },
);
