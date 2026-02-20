import { component$, type QRL } from "@builder.io/qwik";
import { CheckCircleIcon } from "lucide-qwik";
import type { SaleRecord } from "../../services/api";
import { Button } from "../ui/button/button";

interface SaleDetailViewProps {
  sale: SaleRecord;
  onEdit$: QRL<() => void>;
}

export const SaleDetailView = component$<SaleDetailViewProps>(
  ({ sale, onEdit$ }) => {
    return (
      <div class="mb-6 space-y-4">
        <div class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
          <div class="mb-3 flex items-center gap-2 text-emerald-700">
            <CheckCircleIcon class="h-4 w-4" />
            <span class="text-sm font-semibold">Sale on record</span>
          </div>
          <dl class="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <dt class="text-xs text-gray-500 uppercase tracking-wide">
                Price
              </dt>
              <dd class="text-2xl font-bold text-gray-900">
                $
                {sale.price_usd.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-gray-500 uppercase tracking-wide">
                Sold On
              </dt>
              <dd class="font-semibold text-gray-700">
                {new Date(sale.sold_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-gray-500 uppercase tracking-wide">
                Region
              </dt>
              <dd class="font-semibold text-gray-700">{sale.region}</dd>
            </div>
            <div>
              <dt class="text-xs text-gray-500 uppercase tracking-wide">
                Channel
              </dt>
              <dd class="font-semibold text-gray-700 capitalize">
                {sale.channel}
              </dd>
            </div>
            <div class="col-span-2">
              <dt class="text-xs text-gray-500 uppercase tracking-wide">
                Segment
              </dt>
              <dd class="font-semibold text-gray-700 capitalize">
                {sale.customer_segment}
              </dd>
            </div>
          </dl>
        </div>

        <Button
          look="primary"
          size="sm"
          class="w-full justify-center"
          onClick$={onEdit$}
        >
          Update Sale Record
        </Button>
      </div>
    );
  },
);
