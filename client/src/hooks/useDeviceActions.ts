import { $, type PropFunction, type Signal, useSignal } from "@builder.io/qwik";
import {
  type ProductTwin,
  runDiagnostics,
  unpairDevice,
  updateTwinOs,
} from "~/services/api";
import { getNextVersion } from "~/utils/version";
import { useAlert } from "./useAlert";

export interface DeviceActionsProps {
  twin: ProductTwin | null;
  onUpdate$: PropFunction<(twinId: string) => void>;
  show: Signal<boolean>;
}

export function useDeviceActions(props: DeviceActionsProps) {
  const isUpdating = useSignal(false);
  const isRunningDiagnostics = useSignal(false);
  const isUnpairing = useSignal(false);
  const updateStatus = useSignal("Update OS");

  const {
    show: showAlert,
    message: alertMessage,
    type: alertType,
    notify,
  } = useAlert();

  const handleUpdateOS = $(async () => {
    if (!props.twin) return;
    isUpdating.value = true;

    try {
      updateStatus.value = "Checking...";
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nextVersion = getNextVersion(props.twin.os_version);

      updateStatus.value = "Downloading...";
      await new Promise((resolve) => setTimeout(resolve, 1500));

      updateStatus.value = "Installing...";
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await updateTwinOs(props.twin._id, nextVersion);
      await props.onUpdate$(props.twin._id);

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
    if (!props.twin) return;
    isRunningDiagnostics.value = true;
    try {
      const result = await runDiagnostics(props.twin._id);
      notify(result.message, result.healthy ? "success" : "error");
    } catch (e) {
      console.error(e);
      notify("Diagnostics failed to run", "error");
    } finally {
      isRunningDiagnostics.value = false;
    }
  });

  const executeUnpair = $(async () => {
    if (!props.twin) return;
    isUnpairing.value = true;
    try {
      await unpairDevice(props.twin._id);
      await props.onUpdate$(props.twin._id);
      props.show.value = false;
    } catch (e) {
      console.error(e);
      notify("Failed to unpair device", "error");
    } finally {
      isUnpairing.value = false;
    }
  });

  return {
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
  };
}
