import {
  $,
  component$,
  type PropFunction,
  type Signal,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { Loader2Icon, XIcon } from "lucide-qwik";
import type { ProductTwin } from "../../services/api";
import { Alert } from "../ui/alert/alert";
import { Button } from "../ui/button/button";
import { ConfirmDialog } from "../ui/dialog/confirm-dialog";
import { Modal } from "../ui/modal/modal";
import { ManageAction } from "./ManageAction";
import { TelemetryPanel } from "./TelemetryPanel";
import { useDeviceActions } from "../../hooks/useDeviceActions";

export interface ManageModalProps {
  show: Signal<boolean>;
  twin: ProductTwin | null;
  onUpdate$: PropFunction<(twinId: string) => void>;
}

export const ManageModal = component$<ManageModalProps>((props) => {
  const {
    isUpdating,
    isRunningDiagnostics,
    isUnpairing,
    updateStatus,
    showAlert,
    alertMessage,
    alertType,
    handleUpdateOS,
    handleDiagnostics,
    executeUnpair,
  } = useDeviceActions(props);

  const showUnpairConfirm = useSignal(false);
  const isDataLive = useSignal(false);

  useTask$(({ track, cleanup }) => {
    track(() => props.twin?.last_synced);
    if (props.twin) {
      isDataLive.value = true;
      const timeout = setTimeout(() => {
        isDataLive.value = false;
      }, 4000);
      cleanup(() => clearTimeout(timeout));
    }
  });

  const handleUnpairClick = $(() => {
    showUnpairConfirm.value = true;
  });

  return (
    <>
      <Modal.Root show={props.show}>
        <Modal.Panel>
          {props.twin && (
            <div class="text-apple-text p-8">
              <div class="mb-8 flex items-start justify-between">
                <div>
                  <Modal.Title>Manage Device</Modal.Title>
                  <Modal.Description>
                    System controls for {props.twin.name}
                  </Modal.Description>
                </div>
                <button
                  type="button"
                  onClick$={() => (props.show.value = false)}
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

              <TelemetryPanel twin={props.twin} isDataLive={isDataLive} />

              <div class="space-y-4">
                <ManageAction
                  title="Software Update"
                  description={`Current: ${props.twin.os_version}`}
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
});
