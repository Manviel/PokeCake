import { component$, type PropFunction } from "@builder.io/qwik";
import { TagIcon } from "lucide-qwik";
import type { ProductTwin } from "../../services/api";
import { Button } from "../ui/button/button";

interface TwinCardProps {
  twin: ProductTwin;
  onManage$: PropFunction<(twin: ProductTwin) => void>;
  onSpecs$: PropFunction<(twin: ProductTwin) => void>;
  onSale$: PropFunction<(twin: ProductTwin) => void>;
}

export const TwinCard = component$<TwinCardProps>(
  ({ twin, onManage$, onSpecs$, onSale$ }) => {
    return (
      <article class="bg-apple-card border-apple-border glass rounded-[18px] border p-6 transition-transform duration-300 hover:scale-[1.02]">
        <h2 class="mb-4 text-2xl font-semibold">{twin.name}</h2>

        <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          <dt class="text-apple-text-secondary">OS Version</dt>
          <dd class="text-right font-medium">{twin.os_version}</dd>

          <dt class="text-apple-text-secondary">Serial</dt>
          <dd class="text-right font-mono">{twin.serial_number}</dd>

          <dt class="sr-only">Connection Status</dt>
          <dd class="col-span-2 mt-2 flex items-center gap-2">
            <span
              class="flex h-2 w-2 rounded-full bg-green-700"
              aria-hidden="true"
            ></span>
            <output
              class="font-semibold tracking-wider text-green-700 uppercase"
              aria-label="Device status: connected"
            >
              Connected
            </output>
          </dd>
        </dl>

        <div class="mt-6 flex gap-2 text-xs">
          <Button
            look="primary"
            onClick$={() => onManage$(twin)}
            class="flex-1"
          >
            Manage
          </Button>
          <Button
            look="secondary"
            onClick$={() => onSpecs$(twin)}
            class="flex-1"
          >
            Specs
          </Button>
          <Button
            look="secondary"
            onClick$={() => onSale$(twin)}
            class="flex-1 flex items-center justify-center gap-1.5"
          >
            <TagIcon class="h-3.5 w-3.5" />
            Sale
          </Button>
        </div>
      </article>
    );
  },
);
