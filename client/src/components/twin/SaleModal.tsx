import {
  $,
  component$,
  type PropFunction,
  type Signal,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { Loader2Icon, XIcon } from "lucide-qwik";
import { useAlert } from "../../hooks/useAlert";
import {
  type ProductTwin,
  type SaleRecord,
  fetchSaleRecord,
  recordSale,
} from "../../services/api";
import { Alert } from "../ui/alert/alert";
import { Modal } from "../ui/modal/modal";
import { SaleDetailView } from "./SaleDetailView";
import { SaleEmptyState } from "./SaleEmptyState";
import { type SaleFormStore, SaleForm } from "./SaleForm";

interface SaleModalProps {
  show: Signal<boolean>;
  twin: ProductTwin | null;
  onRecorded$?: PropFunction<() => void>;
}

export const SaleModal = component$<SaleModalProps>(({ show, twin, onRecorded$ }) => {
  const isRecordingSale = useSignal(false);
  const isLoadingExisting = useSignal(false);
  const existingSale = useSignal<SaleRecord | null>(null);
  const showForm = useSignal(false);

  const saleForm = useStore<SaleFormStore>({
    price_usd: "",
    region: "US",
    channel: "online",
    customer_segment: "consumer",
  });

  const { show: showAlert, message: alertMessage, type: alertType, notify } =
    useAlert();

  // Fetch existing sale record whenever the modal opens for a new twin
  useTask$(async ({ track }) => {
    const serial = track(() => twin?.serial_number);
    track(() => show.value);

    if (!serial || !show.value) {
      existingSale.value = null;
      showForm.value = false;
      return;
    }

    isLoadingExisting.value = true;
    try {
      existingSale.value = await fetchSaleRecord(serial);
      // Pre-fill form with existing values if a record exists
      if (existingSale.value) {
        saleForm.price_usd = String(existingSale.value.price_usd);
        saleForm.region = existingSale.value.region;
        saleForm.channel = existingSale.value.channel;
        saleForm.customer_segment = existingSale.value.customer_segment;
      } else {
        saleForm.price_usd = "";
        saleForm.region = "US";
        saleForm.channel = "online";
        saleForm.customer_segment = "consumer";
      }
    } finally {
      isLoadingExisting.value = false;
    }
  });

  const handleRecordSale = $(async () => {
    if (!twin) return;
    const price = parseFloat(saleForm.price_usd);
    if (Number.isNaN(price) || price <= 0) {
      notify("Please enter a valid price greater than 0.", "error");
      return;
    }

    isRecordingSale.value = true;
    try {
      const result = await recordSale({
        serial_number: twin.serial_number,
        price_usd: price,
        region: saleForm.region,
        channel: saleForm.channel,
        customer_segment: saleForm.customer_segment,
        sold_at: existingSale.value?.sold_at ?? new Date().toISOString(),
      });
      existingSale.value = result;
      showForm.value = false;
      notify(`Sale saved — $${price.toFixed(2)} (${saleForm.region})`, "success");
      if (onRecorded$) await onRecorded$();
    } catch (e) {
      console.error(e);
      notify("Failed to save sale.", "error");
    } finally {
      isRecordingSale.value = false;
    }
  });

  return (
    <Modal.Root show={show}>
      <Modal.Panel>
        {twin && (
          <div class="text-apple-text p-8">
            {/* Header */}
            <div class="mb-6 flex items-start justify-between">
              <div>
                <Modal.Title>Sale Record</Modal.Title>
                <Modal.Description>{twin.name} · {twin.serial_number}</Modal.Description>
              </div>
              <button
                type="button"
                onClick$={() => (show.value = false)}
                class="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10"
              >
                <XIcon size={20} />
              </button>
            </div>

            <Alert show={showAlert} message={alertMessage} type={alertType.value} />

            {/* Loading state */}
            {isLoadingExisting.value && (
              <div class="flex items-center justify-center gap-3 py-10 text-gray-400">
                <Loader2Icon class="h-5 w-5 animate-spin" />
                <span class="text-sm">Fetching sale record…</span>
              </div>
            )}

            {/* Existing sale record */}
            {!isLoadingExisting.value && existingSale.value && !showForm.value && (
              <SaleDetailView
                sale={existingSale.value}
                onEdit$={$(() => (showForm.value = true))}
              />
            )}

            {/* No sale yet */}
            {!isLoadingExisting.value && !existingSale.value && !showForm.value && (
              <SaleEmptyState onRecord$={$(() => (showForm.value = true))} />
            )}

            {/* Form */}
            {!isLoadingExisting.value && showForm.value && (
              <SaleForm
                form={saleForm}
                isSubmitting={isRecordingSale}
                onCancel$={$(() => (showForm.value = false))}
                onSubmit$={handleRecordSale}
              />
            )}
          </div>
        )}
      </Modal.Panel>
    </Modal.Root>
  );
});
