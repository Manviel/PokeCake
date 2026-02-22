import {
  $,
  component$,
  type PropFunction,
  type Signal,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { Loader2Icon, PlusIcon, XIcon } from "lucide-qwik";
import { useAlert } from "../../hooks/useAlert";
import {
  type ProductTwin,
  type SaleRecord,
  deleteSaleRecord,
  fetchSaleRecords,
  recordSale,
  updateSaleRecord,
} from "../../services/api";
import { Alert } from "../ui/alert/alert";
import { Modal } from "../ui/modal/modal";
import { Button } from "../ui/button/button";
import { SaleDetailView } from "./SaleDetailView";
import { SaleEmptyState } from "./SaleEmptyState";
import { type SaleFormStore, SaleForm } from "./SaleForm";

interface SaleModalProps {
  show: Signal<boolean>;
  twin: ProductTwin | null;
  onRecorded$?: PropFunction<() => void>;
}

export const SaleModal = component$<SaleModalProps>(
  ({ show, twin, onRecorded$ }) => {
    const isSubmitting = useSignal(false);
    const isLoading = useSignal(false);
    const existingSales = useSignal<SaleRecord[]>([]);
    // null = no form open; string = editing record with that _id; "new" = adding new
    const editingId = useSignal<string | null>(null);

    const saleForm = useStore<SaleFormStore>({
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

    const resetForm = $(() => {
      saleForm.price_usd = "";
      saleForm.region = "US";
      saleForm.channel = "online";
      saleForm.customer_segment = "consumer";
    });

    const loadSales = $(async (serial: string) => {
      isLoading.value = true;
      try {
        existingSales.value = await fetchSaleRecords(serial);
      } finally {
        isLoading.value = false;
      }
    });

    useTask$(async ({ track }) => {
      const serial = track(() => twin?.serial_number);
      const isOpen = track(() => show.value);

      if (!serial || !isOpen) {
        existingSales.value = [];
        editingId.value = null;
        return;
      }

      await loadSales(serial);
    });

    const handleAddNew = $(() => {
      resetForm();
      editingId.value = "new";
    });

    const handleEdit = $((sale: SaleRecord) => {
      saleForm.price_usd = String(sale.price_usd);
      saleForm.region = sale.region;
      saleForm.channel = sale.channel;
      saleForm.customer_segment = sale.customer_segment;
      editingId.value = sale._id;
    });

    const handleDelete = $(async (sale: SaleRecord) => {
      if (!twin) return;
      try {
        await deleteSaleRecord(twin.serial_number, sale._id);
        await loadSales(twin.serial_number);
        notify("Sale record deleted.", "success");
        if (onRecorded$) await onRecorded$();
      } catch {
        notify("Failed to delete sale record.", "error");
      }
    });

    const handleCancel = $(() => {
      editingId.value = null;
    });

    const handleSubmit = $(async () => {
      if (!twin) return;
      const price = parseFloat(saleForm.price_usd);
      if (Number.isNaN(price) || price <= 0) {
        notify("Please enter a valid price greater than 0.", "error");
        return;
      }

      isSubmitting.value = true;
      try {
        const payload = {
          serial_number: twin.serial_number,
          price_usd: price,
          region: saleForm.region,
          channel: saleForm.channel,
          customer_segment: saleForm.customer_segment,
          sold_at: new Date().toISOString(),
        };

        if (editingId.value && editingId.value !== "new") {
          await updateSaleRecord(twin.serial_number, editingId.value, payload);
          notify(
            `Sale updated — $${price.toFixed(2)} (${saleForm.region})`,
            "success",
          );
        } else {
          await recordSale(payload);
          notify(
            `Sale recorded — $${price.toFixed(2)} (${saleForm.region})`,
            "success",
          );
        }

        editingId.value = null;
        await loadSales(twin.serial_number);
        if (onRecorded$) await onRecorded$();
      } catch {
        notify("Failed to save sale.", "error");
      } finally {
        isSubmitting.value = false;
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
                  <Modal.Title>Sale Records</Modal.Title>
                  <Modal.Description>
                    {twin.name} · {twin.serial_number}
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

              {/* Loading */}
              {isLoading.value && (
                <div class="flex items-center justify-center gap-3 py-10 text-gray-400">
                  <Loader2Icon class="h-5 w-5 animate-spin" />
                  <span class="text-sm">Loading sale records…</span>
                </div>
              )}

              {/* List of existing records */}
              {!isLoading.value && editingId.value === null && (
                <div class="space-y-3">
                  {existingSales.value.length === 0 && (
                    <SaleEmptyState onRecord$={handleAddNew} />
                  )}

                  {existingSales.value.map((sale) => (
                    <SaleDetailView
                      key={sale._id}
                      sale={sale}
                      onEdit$={$(async () => handleEdit(sale))}
                      onDelete$={$(async () => handleDelete(sale))}
                    />
                  ))}

                  {existingSales.value.length > 0 && (
                    <Button
                      look="secondary"
                      size="sm"
                      class="mt-2 w-full justify-center gap-2"
                      onClick$={handleAddNew}
                    >
                      <PlusIcon class="h-4 w-4" />
                      Add Another Sale
                    </Button>
                  )}
                </div>
              )}

              {/* Form (add new or edit existing) */}
              {!isLoading.value && editingId.value !== null && (
                <SaleForm
                  form={saleForm}
                  isSubmitting={isSubmitting}
                  isEditing={editingId.value !== "new"}
                  onCancel$={handleCancel}
                  onSubmit$={handleSubmit}
                />
              )}
            </div>
          )}
        </Modal.Panel>
      </Modal.Root>
    );
  },
);
