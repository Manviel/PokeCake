import {
  $,
  component$,
  type PropFunction,
  type Signal,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { Loader2Icon, XIcon, TagIcon } from "lucide-qwik";
import { useAlert } from "../../hooks/useAlert";
import {
  type ProductTwin,
  type SaleRecord,
  runDiagnostics,
  unpairDevice,
  updateTwinOs,
  recordSale,
} from "../../services/api";
import { getNextVersion } from "../../utils/version";
import { Alert } from "../ui/alert/alert";
import { Button } from "../ui/button/button";
import { ConfirmDialog } from "../ui/dialog/confirm-dialog";
import { Modal } from "../ui/modal/modal";
import { ManageAction } from "./ManageAction";

interface ManageModalProps {
  show: Signal<boolean>;
  twin: ProductTwin | null;
  onUpdate$: PropFunction<(twinId: string) => void>;
}

interface SaleForm {
  price_usd: string;
  region: SaleRecord["region"];
  channel: SaleRecord["channel"];
  customer_segment: SaleRecord["customer_segment"];
}

export const ManageModal = component$<ManageModalProps>(
  ({ show, twin, onUpdate$ }) => {
    const isUpdating = useSignal(false);
    const isRunningDiagnostics = useSignal(false);
    const isUnpairing = useSignal(false);
    const isRecordingSale = useSignal(false);
    const showSaleForm = useSignal(false);

    const saleForm = useStore<SaleForm>({
      price_usd: "",
      region: "US",
      channel: "online",
      customer_segment: "consumer",
    });

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

    const handleRecordSale = $(async () => {
      if (!twin) return;
      const price = parseFloat(saleForm.price_usd);
      if (isNaN(price) || price <= 0) {
        notify("Please enter a valid price greater than 0.", "error");
        return;
      }

      isRecordingSale.value = true;
      try {
        await recordSale({
          serial_number: twin.serial_number,
          price_usd: price,
          region: saleForm.region,
          channel: saleForm.channel,
          customer_segment: saleForm.customer_segment,
          sold_at: new Date().toISOString(),
        });
        notify(
          `Sale recorded for ${twin.serial_number} — $${price.toFixed(2)}`,
          "success",
        );
        showSaleForm.value = false;
        saleForm.price_usd = "";
      } catch (e) {
        console.error(e);
        notify("Failed to record sale.", "error");
      } finally {
        isRecordingSale.value = false;
      }
    });

    const selectClass =
      "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-apple-text focus:border-apple-accent focus:ring-1 focus:ring-apple-accent focus:outline-none transition-colors";
    const labelClass = "mb-1 block text-xs font-medium text-gray-600 uppercase tracking-wide";

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

                {/* Real-time Telemetry Dashboard */}
                <section
                  class="mb-8 overflow-hidden rounded-2xl border border-gray-200/60 bg-gray-50 p-6"
                  aria-labelledby="telemetry-heading"
                >
                  <div class="mb-4 flex items-center justify-between">
                    <h3
                      id="telemetry-heading"
                      class="text-xs font-bold tracking-widest text-gray-600 uppercase"
                    >
                      Live Telemetry
                    </h3>
                    <div class="flex items-center gap-2">
                      <span class="relative flex h-2 w-2">
                        {isDataLive.value && (
                          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        )}
                        <span
                          class={`relative inline-flex h-2 w-2 rounded-full ${
                            isDataLive.value ? "bg-green-500" : "bg-black/20"
                          }`}
                        ></span>
                      </span>
                      <output
                        class={`text-xs font-medium uppercase ${
                          isDataLive.value ? "text-green-700" : "text-gray-600"
                        }`}
                        aria-live="polite"
                      >
                        {isDataLive.value
                          ? "Receiving Hardware Data"
                          : "Hardware Idle"}
                      </output>
                    </div>
                  </div>

                  <dl class="grid grid-cols-3 gap-4">
                    {/* CPU Usage */}
                    <div class="flex flex-col gap-1">
                      <dt class="text-xs font-medium text-gray-600 uppercase">
                        CPU Load
                      </dt>
                      <dd
                        class={`flex items-end gap-1 text-2xl font-semibold tabular-nums ${
                          twin.cpu_usage > 80 ? "text-red-500" : "text-black"
                        }`}
                      >
                        {twin.cpu_usage}%
                      </dd>
                      <div
                        class="h-1 w-full overflow-hidden rounded-full bg-black/10"
                        role="progressbar"
                        aria-valuenow={twin.cpu_usage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="CPU usage"
                      >
                        <div
                          class={`h-full transition-all duration-500 ${
                            twin.cpu_usage > 80 ? "bg-red-500" : "bg-black"
                          }`}
                          style={{ width: `${twin.cpu_usage}%` }}
                        />
                      </div>
                    </div>

                    {/* Temperature */}
                    <div class="flex flex-col gap-1">
                      <dt class="text-xs font-medium text-gray-600 uppercase">
                        Temperature
                      </dt>
                      <dd
                        class={`flex items-end gap-1 text-2xl font-semibold tabular-nums ${
                          twin.temperature > 50
                            ? "text-orange-500"
                            : "text-black"
                        }`}
                      >
                        {twin.temperature}°C
                      </dd>
                      <div
                        class="h-1 w-full overflow-hidden rounded-full bg-black/10"
                        role="progressbar"
                        aria-valuenow={twin.temperature}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Temperature"
                      >
                        <div
                          class={`h-full transition-all duration-500 ${
                            twin.temperature > 50
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          }`}
                          style={{
                            width: `${Math.min(100, twin.temperature * 2)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Battery */}
                    <div class="flex flex-col gap-1">
                      <div class="flex items-center justify-between">
                        <dt class="text-xs font-medium text-gray-600 uppercase">
                          Battery
                        </dt>
                        {twin.is_charging && (
                          <span class="animate-pulse text-xs font-bold text-green-700">
                            ⚡
                          </span>
                        )}
                      </div>
                      <dd class="flex items-end gap-1 text-2xl font-semibold tabular-nums">
                        {twin.battery_health}%
                      </dd>
                      <div
                        class="h-1 w-full overflow-hidden rounded-full bg-black/10"
                        role="progressbar"
                        aria-valuenow={twin.battery_health}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Battery health"
                      >
                        <div
                          class={`h-full transition-all duration-500 ${
                            twin.battery_health < 20
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${twin.battery_health}%` }}
                        />
                      </div>
                    </div>
                  </dl>
                </section>

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

                  {/* ── Record Sale ── */}
                  <div class="overflow-hidden rounded-2xl border border-emerald-100/60 bg-emerald-50/40 transition-colors">
                    {/* Header row — always visible */}
                    <div class="flex items-center justify-between p-4">
                      <div>
                        <p class="font-semibold text-emerald-800">
                          Record Sale
                        </p>
                        <p class="text-sm text-emerald-700">
                          Log this device as sold to unlock revenue analytics
                        </p>
                      </div>
                      <Button
                        look="primary"
                        size="sm"
                        onClick$={() =>
                          (showSaleForm.value = !showSaleForm.value)
                        }
                        disabled={isRecordingSale.value}
                      >
                        <TagIcon class="mr-1.5 h-3.5 w-3.5" />
                        {showSaleForm.value ? "Cancel" : "Record"}
                      </Button>
                    </div>

                    {/* Inline form — visible when expanded */}
                    {showSaleForm.value && (
                      <div class="border-t border-emerald-100/60 bg-white/60 px-4 pb-5 pt-4">
                        <div class="grid grid-cols-2 gap-4">
                          {/* Price */}
                          <div class="col-span-2">
                            <label for="sale-price" class={labelClass}>
                              Sale Price (USD)
                            </label>
                            <input
                              id="sale-price"
                              type="number"
                              min="0.01"
                              step="0.01"
                              placeholder="e.g. 1199.00"
                              value={saleForm.price_usd}
                              onInput$={(e) => {
                                saleForm.price_usd = (
                                  e.target as HTMLInputElement
                                ).value;
                              }}
                              class={selectClass}
                            />
                          </div>

                          {/* Region */}
                          <div>
                            <label for="sale-region" class={labelClass}>
                              Region
                            </label>
                            <select
                              id="sale-region"
                              value={saleForm.region}
                              onChange$={(e) => {
                                saleForm.region = (
                                  e.target as HTMLSelectElement
                                ).value as SaleRecord["region"];
                              }}
                              class={selectClass}
                            >
                              <option value="US">US</option>
                              <option value="EU">EU</option>
                              <option value="APAC">APAC</option>
                              <option value="LATAM">LATAM</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </div>

                          {/* Channel */}
                          <div>
                            <label for="sale-channel" class={labelClass}>
                              Channel
                            </label>
                            <select
                              id="sale-channel"
                              value={saleForm.channel}
                              onChange$={(e) => {
                                saleForm.channel = (
                                  e.target as HTMLSelectElement
                                ).value as SaleRecord["channel"];
                              }}
                              class={selectClass}
                            >
                              <option value="online">Online</option>
                              <option value="retail">Retail</option>
                              <option value="B2B">B2B</option>
                            </select>
                          </div>

                          {/* Customer Segment */}
                          <div class="col-span-2">
                            <label for="sale-segment" class={labelClass}>
                              Customer Segment
                            </label>
                            <select
                              id="sale-segment"
                              value={saleForm.customer_segment}
                              onChange$={(e) => {
                                saleForm.customer_segment = (
                                  e.target as HTMLSelectElement
                                ).value as SaleRecord["customer_segment"];
                              }}
                              class={selectClass}
                            >
                              <option value="consumer">Consumer</option>
                              <option value="enterprise">Enterprise</option>
                              <option value="education">Education</option>
                            </select>
                          </div>
                        </div>

                        <Button
                          look="primary"
                          size="sm"
                          class="mt-4 w-full justify-center"
                          onClick$={handleRecordSale}
                          disabled={isRecordingSale.value}
                        >
                          {isRecordingSale.value ? (
                            <>
                              <Loader2Icon class="mr-2 h-3 w-3 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Confirm Sale"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

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
