import { component$, $, type PropFunction } from "@builder.io/qwik";
import { Button } from "../ui/button/button";
import type { ProductTwin } from "../../services/api";

interface TwinCardProps {
    twin: ProductTwin;
    onManage$: PropFunction<(twin: ProductTwin) => void>;
    onSpecs$: PropFunction<(twin: ProductTwin) => void>;
}

export const TwinCard = component$<TwinCardProps>(({ twin, onManage$, onSpecs$ }) => {
    return (
        <div class="bg-apple-card rounded-[18px] p-6 transition-transform duration-300 hover:scale-[1.02] border border-apple-border glass">
            <div class="text-xs text-apple-accent font-semibold mb-2">
                {twin.model_identifier}
            </div>
            <h2 class="text-2xl font-semibold mb-4">{twin.name}</h2>

            <div class="flex flex-col gap-2">
                <div class="flex justify-between">
                    <span class="text-apple-text-secondary">Battery Health</span>
                    <span class="font-medium">{twin.battery_health}%</span>
                </div>
                <div class="h-1 bg-black/10 rounded-full overflow-hidden">
                    <div
                        class={`h-full transition-[width] duration-1000 ease-out w-[var(--battery-level)] ${twin.battery_health > 80 ? 'bg-[#34c759]' : 'bg-[#ffcc00]'
                            }`}
                        style={{ "--battery-level": `${twin.battery_health}%` }}
                    />
                </div>

                <div class="flex justify-between mt-2">
                    <span class="text-apple-text-secondary">OS Version</span>
                    <span>{twin.os_version}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-apple-text-secondary">Serial</span>
                    <span class="font-mono">{twin.serial_number}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-apple-text-secondary">Warranty</span>
                    <span class={twin.warranty_status.includes('Active') ? 'text-[#34c759]' : ''}>
                        {twin.warranty_status}
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
});
