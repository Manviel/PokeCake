import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Button } from "../components/ui/button/button";
import { fetchTwins, pairNewDevice, type ProductTwin } from "../services/api";
import { TwinCard } from "../components/twin/TwinCard";
import { SpecsModal } from "../components/twin/SpecsModal";
import { ManageModal } from "../components/twin/ManageModal";
import { PlusIcon, Loader2Icon } from "lucide-qwik";
import { Alert } from "../components/ui/alert/alert";

export default component$(() => {
  const twins = useSignal<ProductTwin[]>([]);
  const isLoading = useSignal(true);
  const isPairing = useSignal(false);

  const selectedTwin = useSignal<ProductTwin | null>(null);
  const showSpecs = useSignal(false);
  const showManage = useSignal(false);

  // Alert State
  const showAlert = useSignal(false);
  const alertMessage = useSignal("");
  const alertType = useSignal<"success" | "error" | "info">("info");

  const notify = $(
    (message: string, type: "success" | "error" | "info" = "info") => {
      alertMessage.value = message;
      alertType.value = type;
      showAlert.value = true;
    },
  );

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

  const handleTwinUpdate = $(async (updatedTwinId?: string) => {
    await loadTwins();
    if (
      updatedTwinId &&
      selectedTwin.value &&
      selectedTwin.value._id === updatedTwinId
    ) {
      const freshTwin = twins.value.find((t) => t._id === updatedTwinId);
      if (freshTwin) {
        selectedTwin.value = freshTwin;
      }
    }
  });

  const handlePairDevice = $(async () => {
    isPairing.value = true;
    // Simulate scanning delay for UX
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await pairNewDevice();
      await loadTwins();
      await pairNewDevice();
      await loadTwins();
      notify("New device paired successfully!", "success");
    } catch (error) {
      console.error("Pairing error:", error);
      notify("Failed to pair device. Please try again.", "error");
    } finally {
      isPairing.value = false;
    }
  });

  return (
    <div class="relative mt-8">
      <div class="pointer-events-none absolute top-0 right-0 left-0 z-50 flex justify-center">
        <div class="pointer-events-auto w-full max-w-md">
          <Alert
            show={showAlert}
            message={alertMessage}
            type={alertType.value}
          />
        </div>
      </div>
      <h1 class="mb-8 text-center text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        Your Digital Twins
      </h1>

      {isLoading.value ? (
        <div class="p-8 text-center">Loading devices...</div>
      ) : (
        <div class="grid grid-cols-1 gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {twins.value.length === 0 ? (
            <div class="glass col-span-full flex flex-col items-center rounded-[18px] p-12 text-center">
              <p class="text-apple-text-secondary max-w-md">
                No digital twins found. Pair your first device to start tracking
                its telemetry and status in real-time.
              </p>
              <Button
                look="primary"
                class="mt-6 flex items-center gap-2"
                onClick$={handlePairDevice}
                disabled={isPairing.value}
              >
                {isPairing.value ? (
                  <>
                    <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
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
                class="bg-apple-card border-apple-border group glass flex min-h-[300px] flex-col items-center justify-center rounded-[18px] border border-dashed p-6 transition-colors hover:bg-black/5"
              >
                {isPairing.value ? (
                  <div class="flex flex-col items-center gap-4">
                    <Loader2Icon class="text-apple-accent h-10 w-10 animate-spin" />
                    <span class="text-apple-text font-medium">Scanning...</span>
                  </div>
                ) : (
                  <>
                    <div class="bg-apple-accent/10 text-apple-accent mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                      <PlusIcon size={24} />
                    </div>
                    <span class="text-apple-text font-medium">
                      Pair New Device
                    </span>
                    <span class="text-apple-text-secondary mt-2 text-xs">
                      Scan for nearby Apple devices
                    </span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}

      <SpecsModal show={showSpecs} twin={selectedTwin.value} />
      <ManageModal
        show={showManage}
        twin={selectedTwin.value}
        onUpdate$={handleTwinUpdate}
      />
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
