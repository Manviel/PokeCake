import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Button } from "../components/ui/button/button";
import { fetchTwins, pairNewDevice, type ProductTwin } from "../services/api";
import { TwinCard } from "../components/twin/TwinCard";
import { SpecsModal } from "../components/twin/SpecsModal";
import { ManageModal } from "../components/twin/ManageModal";

export default component$(() => {
  const twins = useSignal<ProductTwin[]>([]);
  const isLoading = useSignal(true);
  const isPairing = useSignal(false);

  const selectedTwin = useSignal<ProductTwin | null>(null);
  const showSpecs = useSignal(false);
  const showManage = useSignal(false);

  // Core Data Fetching
  const loadTwins = $(async () => {
    isLoading.value = true;
    try {
      twins.value = await fetchTwins();
    } catch (error) {
      console.error("Failed to fetch twins:", error);
    } finally {
      isLoading.value = false;
    }
  });

  // Initial Load
  useVisibleTask$(async () => {
    await loadTwins();
  });

  // Handlers
  const handleOpenSpecs = $((twin: ProductTwin) => {
    selectedTwin.value = twin;
    showSpecs.value = true;
  });

  const handleOpenManage = $((twin: ProductTwin) => {
    selectedTwin.value = twin;
    showManage.value = true;
  });

  const handleTwinUpdate = $(async () => {
    await loadTwins();
  });

  const handlePairDevice = $(async () => {
    isPairing.value = true;
    // Simulate scanning delay for UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await pairNewDevice();
      await loadTwins();
      alert("New device paired successfully!");
    } catch (error) {
      console.error("Pairing error:", error);
      alert("Failed to pair device. Please try again.");
    } finally {
      isPairing.value = false;
    }
  });

  return (
    <div class="mt-8">
      <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 text-center">Your Digital Twins</h1>

      {isLoading.value ? (
        <div class="text-center p-8">Loading devices...</div>
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
          {twins.value.length === 0 ? (
            <div class="glass col-span-full flex flex-col items-center text-center p-12 rounded-[18px]">
              <p class="text-apple-text-secondary max-w-md">No digital twins found. Pair your first device to start tracking its telemetry and status in real-time.</p>
              <Button
                look="primary"
                class="mt-6 flex items-center gap-2"
                onClick$={handlePairDevice}
                disabled={isPairing.value}
              >
                {isPairing.value ? (
                  <>
                    <span class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                    Scanning...
                  </>
                ) : (
                  "Pair New Device"
                )}
              </Button>
            </div>
          ) : (
            <>
              {twins.value.map((twin) => (
                <TwinCard
                  key={twin._id}
                  twin={twin}
                  onManage$={handleOpenManage}
                  onSpecs$={handleOpenSpecs}
                />
              ))}

              {/* Add New Device Card */}
              <button
                onClick$={handlePairDevice}
                disabled={isPairing.value}
                class="bg-apple-card rounded-[18px] p-6 border border-dashed border-apple-border flex flex-col items-center justify-center min-h-[300px] hover:bg-black/5 transition-colors group glass"
              >
                {isPairing.value ? (
                  <div class="flex flex-col items-center gap-4">
                    <div class="relative w-16 h-16">
                      <div class="absolute inset-0 border-4 border-apple-accent/20 rounded-full"></div>
                      <div class="absolute inset-0 border-4 border-apple-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span class="font-medium text-apple-text">Scanning...</span>
                  </div>
                ) : (
                  <>
                    <div class="w-12 h-12 rounded-full bg-apple-accent/10 flex items-center justify-center text-apple-accent mb-4 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <span class="font-medium text-apple-text">Pair New Device</span>
                    <span class="text-xs text-apple-text-secondary mt-2">Scan for nearby Apple devices</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}

      <SpecsModal show={showSpecs} twin={selectedTwin.value} />
      <ManageModal show={showManage} twin={selectedTwin.value} onUpdate$={handleTwinUpdate} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Apple Digital Twin - Dashboard",
  meta: [
    {
      name: "description",
      content: "Manage your Apple hardware digital twins.",
    },
  ],
};
