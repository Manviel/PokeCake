import { component$, type PropFunction } from "@builder.io/qwik";
import { Button } from "../ui/button/button";
import type { ProductTwin } from "../../services/api";

interface TwinCardProps {
  twin: ProductTwin;
  onManage$: PropFunction<(twin: ProductTwin) => void>;
  onSpecs$: PropFunction<(twin: ProductTwin) => void>;
}

export const TwinCard = component$<TwinCardProps>(
  ({ twin, onManage$, onSpecs$ }) => {
    return (
      <article class="bg-apple-card border-apple-border glass rounded-[18px] border p-6 transition-transform duration-300 hover:scale-[1.02]">
        <div class="text-apple-accent mb-2 text-xs font-semibold">
          {twin.model_identifier}
        </div>
        <h2 class="mb-4 text-2xl font-semibold">{twin.name}</h2>

        <dl class="flex flex-col gap-2">
          <div class="flex justify-between">
            <dt class="text-apple-text-secondary">OS Version</dt>
            <dd class="font-medium">{twin.os_version}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-apple-text-secondary">Serial</dt>
            <dd class="font-mono text-[10px]">{twin.serial_number}</dd>
          </div>
          <div class="mt-2 flex items-center gap-2">
            <span
              class="flex h-2 w-2 rounded-full bg-green-700"
              aria-hidden="true"
            ></span>
            <span
              class="text-[10px] font-semibold tracking-wider text-green-700 uppercase"
              role="status"
              aria-label="Device status: connected"
            >
              Connected
            </span>
          </div>
        </dl>

        <div class="mt-6 flex gap-4 text-xs">
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
        </div>
      </article>
    );
  },
);
