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
      <div class="bg-apple-card border-apple-border glass rounded-[18px] border p-6 transition-transform duration-300 hover:scale-[1.02]">
        <div class="text-apple-accent mb-2 text-xs font-semibold">
          {twin.model_identifier}
        </div>
        <h2 class="mb-4 text-2xl font-semibold">{twin.name}</h2>

        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="text-apple-text-secondary">OS Version</span>
            <span class="font-medium">{twin.os_version}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-apple-text-secondary">Serial</span>
            <span class="font-mono text-[10px]">{twin.serial_number}</span>
          </div>
          <div class="mt-2 flex items-center gap-2">
            <span class="flex h-2 w-2 rounded-full bg-[#34c759]"></span>
            <span class="text-[10px] font-medium tracking-wider text-[#34c759] uppercase">
              Connected
            </span>
          </div>
        </div>

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
      </div>
    );
  },
);
