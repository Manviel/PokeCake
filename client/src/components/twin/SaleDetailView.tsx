import { component$, type QRL } from "@builder.io/qwik";
import { CheckCircleIcon, PencilIcon, Trash2Icon } from "lucide-qwik";
import type { SaleRecord } from "../../services/api";

interface SaleDetailViewProps {
  sale: SaleRecord;
  onEdit$: QRL<() => void>;
  onDelete$: QRL<() => void>;
}

export const SaleDetailView = component$<SaleDetailViewProps>(
  ({ sale, onEdit$, onDelete$ }) => {
    return (
      <article class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
        <div class="flex items-start justify-between gap-3">
          {/* Left: price + date */}
          <div class="flex items-center gap-2 min-w-0 text-emerald-700">
            <CheckCircleIcon class="h-4 w-4 shrink-0" />
            <div class="min-w-0">
              <p class="leading-tight text-xl font-bold text-gray-900">
                $
                {sale.price_usd.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p class="truncate text-xs text-gray-500">
                {new Date(sale.sold_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Centre: badges */}
          <div class="flex flex-1 flex-wrap justify-center gap-1.5">
            <span class="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              {sale.region}
            </span>
            <span class="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium capitalize text-blue-800">
              {sale.channel}
            </span>
            <span class="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium capitalize text-violet-800">
              {sale.customer_segment}
            </span>
          </div>

          {/* Right: actions */}
          <div class="flex shrink-0 gap-1">
            <button
              type="button"
              aria-label="Edit sale"
              onClick$={onEdit$}
              title="Edit sale"
              class="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-black/5 hover:text-gray-700"
            >
              <PencilIcon class="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Delete sale"
              onClick$={onDelete$}
              title="Delete sale"
              class="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2Icon class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </article>
    );
  },
);
