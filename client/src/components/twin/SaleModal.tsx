import {
  $,
  component$,
  type PropFunction,
  type Signal,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { Loader2Icon, XIcon, TagIcon, CheckCircleIcon } from "lucide-qwik";
import { useAlert } from "../../hooks/useAlert";
import {
  type ProductTwin,
  type SaleRecord,
  fetchSaleRecord,
  recordSale,
} from "../../services/api";
import { Alert } from "../ui/alert/alert";
import { Button } from "../ui/button/button";
import { Modal } from "../ui/modal/modal";

interface SaleModalProps {
  show: Signal<boolean>;
  twin: ProductTwin | null;
  onRecorded$?: PropFunction<() => void>;
}

interface SaleForm {
  price_usd: string;
  region: SaleRecord["region"];
  channel: SaleRecord["channel"];
  customer_segment: SaleRecord["customer_segment"];
}

export const SaleModal = component$<SaleModalProps>(({ show, twin, onRecorded$ }) => {
  const isRecordingSale = useSignal(false);
  const isLoadingExisting = useSignal(false);
  const existingSale = useSignal<SaleRecord | null>(null);
  const showForm = useSignal(false);

  const saleForm = useStore<SaleForm>({
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
    if (isNaN(price) || price <= 0) {
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

  const selectClass =
    "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-apple-text focus:border-apple-accent focus:ring-1 focus:ring-apple-accent focus:outline-none transition-colors";
  const labelClass =
    "mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide";

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
              <div class="mb-6 space-y-4">
                <div class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                  <div class="mb-3 flex items-center gap-2 text-emerald-700">
                    <CheckCircleIcon class="h-4 w-4" />
                    <span class="text-sm font-semibold">Sale on record</span>
                  </div>
                  <dl class="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <dt class="text-xs text-gray-500 uppercase tracking-wide">Price</dt>
                      <dd class="text-2xl font-bold text-gray-900">
                        ${existingSale.value.price_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-xs text-gray-500 uppercase tracking-wide">Sold On</dt>
                      <dd class="font-semibold text-gray-700">
                        {new Date(existingSale.value.sold_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-xs text-gray-500 uppercase tracking-wide">Region</dt>
                      <dd class="font-semibold text-gray-700">{existingSale.value.region}</dd>
                    </div>
                    <div>
                      <dt class="text-xs text-gray-500 uppercase tracking-wide">Channel</dt>
                      <dd class="font-semibold text-gray-700 capitalize">{existingSale.value.channel}</dd>
                    </div>
                    <div class="col-span-2">
                      <dt class="text-xs text-gray-500 uppercase tracking-wide">Segment</dt>
                      <dd class="font-semibold text-gray-700 capitalize">{existingSale.value.customer_segment}</dd>
                    </div>
                  </dl>
                </div>

                <Button
                  look="secondary"
                  size="sm"
                  class="w-full justify-center"
                  onClick$={() => (showForm.value = true)}
                >
                  Update Sale Record
                </Button>
              </div>
            )}

            {/* No sale yet + form trigger */}
            {!isLoadingExisting.value && !existingSale.value && !showForm.value && (
              <div class="mb-6 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-10 text-center">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <TagIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p class="font-semibold text-gray-700">No sale on record</p>
                  <p class="mt-1 text-sm text-gray-400">Record a sale to unlock revenue analytics for this device.</p>
                </div>
                <Button look="primary" size="sm" onClick$={() => (showForm.value = true)}>
                  Record Sale
                </Button>
              </div>
            )}

            {/* Form */}
            {!isLoadingExisting.value && showForm.value && (
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="col-span-2">
                    <label for="sale-price" class={labelClass}>Sale Price (USD)</label>
                    <input
                      id="sale-price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="e.g. 1199.00"
                      value={saleForm.price_usd}
                      onInput$={(e) => {
                        saleForm.price_usd = (e.target as HTMLInputElement).value;
                      }}
                      class={selectClass}
                    />
                  </div>

                  <div>
                    <label for="sale-region" class={labelClass}>Region</label>
                    <select
                      id="sale-region"
                      value={saleForm.region}
                      onChange$={(e) => {
                        saleForm.region = (e.target as HTMLSelectElement).value as SaleRecord["region"];
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

                  <div>
                    <label for="sale-channel" class={labelClass}>Channel</label>
                    <select
                      id="sale-channel"
                      value={saleForm.channel}
                      onChange$={(e) => {
                        saleForm.channel = (e.target as HTMLSelectElement).value as SaleRecord["channel"];
                      }}
                      class={selectClass}
                    >
                      <option value="online">Online</option>
                      <option value="retail">Retail</option>
                      <option value="B2B">B2B</option>
                    </select>
                  </div>

                  <div class="col-span-2">
                    <label for="sale-segment" class={labelClass}>Customer Segment</label>
                    <select
                      id="sale-segment"
                      value={saleForm.customer_segment}
                      onChange$={(e) => {
                        saleForm.customer_segment = (e.target as HTMLSelectElement).value as SaleRecord["customer_segment"];
                      }}
                      class={selectClass}
                    >
                      <option value="consumer">Consumer</option>
                      <option value="enterprise">Enterprise</option>
                      <option value="education">Education</option>
                    </select>
                  </div>
                </div>

                <div class="flex gap-3 pt-1">
                  <Button
                    look="secondary"
                    size="sm"
                    class="flex-1 justify-center"
                    onClick$={() => (showForm.value = false)}
                    disabled={isRecordingSale.value}
                  >
                    Cancel
                  </Button>
                  <Button
                    look="primary"
                    size="sm"
                    class="flex-1 justify-center"
                    onClick$={handleRecordSale}
                    disabled={isRecordingSale.value}
                  >
                    {isRecordingSale.value ? (
                      <>
                        <Loader2Icon class="mr-2 h-3 w-3 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      "Confirm Sale"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal.Panel>
    </Modal.Root>
  );
});
