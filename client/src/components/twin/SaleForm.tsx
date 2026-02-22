import { component$, type QRL, type ReadonlySignal } from "@builder.io/qwik";
import { Loader2Icon } from "lucide-qwik";
import { Listbox } from "../ui/listbox/listbox";
import type { SaleRecord } from "../../services/api";
import { Button } from "../ui/button/button";

export interface SaleFormStore {
  price_usd: string;
  region: SaleRecord["region"];
  channel: SaleRecord["channel"];
  customer_segment: SaleRecord["customer_segment"];
}

interface SaleFormProps {
  form: SaleFormStore;
  isSubmitting: ReadonlySignal<boolean>;
  isEditing?: boolean;
  onCancel$: QRL<() => void>;
  onSubmit$: QRL<() => void>;
}

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-apple-text focus:border-apple-accent focus:ring-1 focus:ring-apple-accent focus:outline-none transition-colors";
const labelClass =
  "mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide";

const REGION_OPTIONS: { label: string; value: SaleRecord["region"] }[] = [
  { label: "US", value: "US" },
  { label: "EU", value: "EU" },
  { label: "APAC", value: "APAC" },
  { label: "LATAM", value: "LATAM" },
];

const CHANNEL_OPTIONS: { label: string; value: SaleRecord["channel"] }[] = [
  { label: "Online", value: "online" },
  { label: "Retail", value: "retail" },
  { label: "B2B", value: "B2B" },
];

const SEGMENT_OPTIONS: {
  label: string;
  value: SaleRecord["customer_segment"];
}[] = [
  { label: "Consumer", value: "consumer" },
  { label: "Enterprise", value: "enterprise" },
  { label: "Education", value: "education" },
];

export const SaleForm = component$<SaleFormProps>(
  ({ form, isSubmitting, isEditing = false, onCancel$, onSubmit$ }) => {
    return (
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
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
              value={form.price_usd}
              onInput$={(e) => {
                form.price_usd = (e.target as HTMLInputElement).value;
              }}
              class={inputClass}
            />
          </div>

          <div>
            <label for="sale-region" class={labelClass}>
              Region
            </label>
            <Listbox
              id="sale-region"
              value={form.region}
              onChange$={(val: string) => {
                form.region = val as SaleRecord["region"];
              }}
              options={REGION_OPTIONS}
              placeholder="Select Region"
            />
          </div>

          <div>
            <label for="sale-channel" class={labelClass}>
              Channel
            </label>
            <Listbox
              id="sale-channel"
              value={form.channel}
              onChange$={(val: string) => {
                form.channel = val as SaleRecord["channel"];
              }}
              options={CHANNEL_OPTIONS}
              placeholder="Select Channel"
            />
          </div>

          <div class="col-span-2">
            <label for="sale-segment" class={labelClass}>
              Customer Segment
            </label>
            <Listbox
              id="sale-segment"
              value={form.customer_segment}
              onChange$={(val: string) => {
                form.customer_segment = val as SaleRecord["customer_segment"];
              }}
              options={SEGMENT_OPTIONS}
              placeholder="Select Segment"
            />
          </div>
        </div>

        <div class="flex gap-3 pt-1">
          <Button
            look="secondary"
            size="sm"
            class="flex-1 justify-center"
            onClick$={onCancel$}
            disabled={isSubmitting.value}
          >
            Cancel
          </Button>
          <Button
            look="primary"
            size="sm"
            class="flex-1 justify-center"
            onClick$={onSubmit$}
            disabled={isSubmitting.value}
          >
            {isSubmitting.value ? (
              <>
                <Loader2Icon class="mr-2 h-3 w-3 animate-spin" />
                Saving…
              </>
            ) : isEditing ? (
              "Update Sale"
            ) : (
              "Confirm Sale"
            )}
          </Button>
        </div>
      </div>
    );
  },
);
