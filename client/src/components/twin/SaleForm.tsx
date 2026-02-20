import {
  $,
  component$,
  type QRL,
  type ReadonlySignal,
} from "@builder.io/qwik";
import { Loader2Icon } from "lucide-qwik";
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

const selectClass =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-apple-text focus:border-apple-accent focus:ring-1 focus:ring-apple-accent focus:outline-none transition-colors";
const labelClass =
  "mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide";

export const SaleForm = component$<SaleFormProps>(
  ({ form, isSubmitting, isEditing = false, onCancel$, onSubmit$ }) => {
    const handleSelectChange = $((e: Event, key: keyof SaleFormStore) => {
      const target = e.target as HTMLSelectElement;
      const val = target.value;
      if (key === "region") form.region = val as SaleRecord["region"];
      else if (key === "channel") form.channel = val as SaleRecord["channel"];
      else if (key === "customer_segment")
        form.customer_segment = val as SaleRecord["customer_segment"];
    });

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
              class={selectClass}
            />
          </div>

          <div>
            <label for="sale-region" class={labelClass}>
              Region
            </label>
            <select
              id="sale-region"
              value={form.region}
              onChange$={(e) => handleSelectChange(e, "region")}
              class={selectClass}
            >
              <option value="US">US</option>
              <option value="EU">EU</option>
              <option value="APAC">APAC</option>
              <option value="LATAM">LATAM</option>
            </select>
          </div>

          <div>
            <label for="sale-channel" class={labelClass}>
              Channel
            </label>
            <select
              id="sale-channel"
              value={form.channel}
              onChange$={(e) => handleSelectChange(e, "channel")}
              class={selectClass}
            >
              <option value="online">Online</option>
              <option value="retail">Retail</option>
              <option value="B2B">B2B</option>
            </select>
          </div>

          <div class="col-span-2">
            <label for="sale-segment" class={labelClass}>
              Customer Segment
            </label>
            <select
              id="sale-segment"
              value={form.customer_segment}
              onChange$={(e) => handleSelectChange(e, "customer_segment")}
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
