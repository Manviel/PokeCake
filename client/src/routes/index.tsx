import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Button } from "../components/ui/button/button";
import { Modal } from "../components/ui/modal/modal";

interface ProductTwin {
  _id: string;
  name: string;
  model_identifier: string;
  serial_number: string;
  os_version: string;
  battery_health: number;
  warranty_status: string;
  last_synced: string;
}

export default component$(() => {
  const twins = useSignal<ProductTwin[]>([]);
  const isLoading = useSignal(true);
  const isPairing = useSignal(false);

  const fetchTwins = $(async () => {
    isLoading.value = true;
    try {
      const response = await fetch("http://localhost:8000/api/v1/twins");
      if (response.ok) {
        twins.value = await response.json();
      }
    } catch (error) {
      console.error("Failed to fetch twins:", error);
    } finally {
      isLoading.value = false;
    }
  });

  // Fetch twins on client side
  useVisibleTask$(async () => {
    await fetchTwins();
  });

  const selectedTwin = useSignal<ProductTwin | null>(null);
  const showSpecs = useSignal(false);
  const showManage = useSignal(false);
  const isUpdating = useSignal(false);

  const handleOpenSpecs = $((twin: ProductTwin) => {
    selectedTwin.value = twin;
    showSpecs.value = true;
  });

  const handleOpenManage = $((twin: ProductTwin) => {
    selectedTwin.value = twin;
    showManage.value = true;
  });

  const handleUpdateOS = $(async () => {
    if (!selectedTwin.value) return;
    isUpdating.value = true;

    // Simulate update process
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const response = await fetch(`http://localhost:8000/api/v1/twins/${selectedTwin.value._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ os_version: "iOS 18.0 Beta" })
      });

      if (response.ok) {
        await fetchTwins();
        showManage.value = false;
        alert("OS Updated successfully!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      isUpdating.value = false;
    }
  });

  const handlePairDevice = $(async () => {
    isPairing.value = true;
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const mockDevice = {
        name: "iPhone 15 Pro",
        model_identifier: "iPhone16,1",
        serial_number: `QX${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        os_version: "iOS 17.4",
        battery_health: 98,
        warranty_status: "AppleCare+ Active",
        last_synced: new Date().toISOString()
      };

      const response = await fetch("http://localhost:8000/api/v1/twins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockDevice),
      });

      if (response.ok) {
        await fetchTwins();
        alert("New device paired successfully!");
      } else {
        alert("Failed to pair device. Please try again.");
      }
    } catch (error) {
      console.error("Pairing error:", error);
      alert("An error occurred during pairing.");
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
                <div key={twin._id} class="bg-apple-card rounded-[18px] p-6 transition-transform duration-300 hover:scale-[1.02] border border-apple-border glass">
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
                      onClick$={() => handleOpenManage(twin)}
                      class="flex-1"
                    >
                      Manage
                    </Button>
                    <Button
                      look="secondary"
                      onClick$={() => handleOpenSpecs(twin)}
                      class="flex-1"
                    >
                      Specs
                    </Button>
                  </div>
                </div>
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
      {/* Modals using Qwik UI components */}
      {showSpecs.value && (
        <Modal.Root show={showSpecs}>
          <Modal.Panel>
            {selectedTwin.value && (
              <div class="p-8">
                <div class="flex justify-between items-start mb-6">
                  <div>
                    <Modal.Title>{selectedTwin.value.name}</Modal.Title>
                    <p class="text-apple-accent font-semibold">{selectedTwin.value.model_identifier}</p>
                  </div>
                  <button
                    onClick$={() => (showSpecs.value = false)}
                    class="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <div class="bg-white/50 p-4 rounded-2xl border border-white/40">
                    <p class="text-xs text-apple-text-secondary uppercase mb-1 font-bold">Serial Number</p>
                    <p class="font-mono">{selectedTwin.value.serial_number}</p>
                  </div>
                  <div class="bg-white/50 p-4 rounded-2xl border border-white/40">
                    <p class="text-xs text-apple-text-secondary uppercase mb-1 font-bold">OS Version</p>
                    <p>{selectedTwin.value.os_version}</p>
                  </div>
                  <div class="bg-white/50 p-4 rounded-2xl border border-white/40">
                    <p class="text-xs text-apple-text-secondary uppercase mb-1 font-bold">Hardware ID</p>
                    <p>{selectedTwin.value.model_identifier}</p>
                  </div>
                  <div class="bg-white/50 p-4 rounded-2xl border border-white/40">
                    <p class="text-xs text-apple-text-secondary uppercase mb-1 font-bold">Warranty</p>
                    <p>{selectedTwin.value.warranty_status}</p>
                  </div>
                </div>

                <div class="mt-8 pt-6 border-t border-black/5">
                  <h3 class="text-sm font-bold uppercase text-apple-text-secondary mb-4">Technical Specifications</h3>
                  <ul class="space-y-3 text-sm">
                    <li class="flex justify-between">
                      <span class="text-apple-text-secondary">Processor</span>
                      <span class="font-medium">A17 Pro Chip</span>
                    </li>
                    <li class="flex justify-between">
                      <span class="text-apple-text-secondary">Storage Capacity</span>
                      <span class="font-medium">256 GB</span>
                    </li>
                    <li class="flex justify-between">
                      <span class="text-apple-text-secondary">Display</span>
                      <span class="font-medium">6.1" Super Retina XDR</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </Modal.Panel>
        </Modal.Root>
      )}

      {showManage.value && (
        <Modal.Root show={showManage}>
          <Modal.Panel>
            {selectedTwin.value && (
              <div class="p-8">
                <div class="flex justify-between items-start mb-8">
                  <div>
                    <Modal.Title>Manage Device</Modal.Title>
                    <Modal.Description>System controls for {selectedTwin.value.name}</Modal.Description>
                  </div>
                  <button
                    onClick$={() => (showManage.value = false)}
                    class="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/40">
                    <div>
                      <p class="font-semibold">Software Update</p>
                      <p class="text-xs text-apple-text-secondary">Current: {selectedTwin.value.os_version}</p>
                    </div>
                    <Button
                      look="primary"
                      size="sm"
                      onClick$={handleUpdateOS}
                      disabled={isUpdating.value}
                    >
                      {isUpdating.value ? "Updating..." : "Update OS"}
                    </Button>
                  </div>

                  <div class="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/40">
                    <div>
                      <p class="font-semibold">Simulate Diagnostics</p>
                      <p class="text-xs text-apple-text-secondary">Run hardware health check</p>
                    </div>
                    <Button look="secondary" size="sm">
                      Run
                    </Button>
                  </div>

                  <div class="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100/40">
                    <div>
                      <p class="font-semibold text-red-600">Unpair Device</p>
                      <p class="text-xs text-red-400">Remove from digital twin network</p>
                    </div>
                    <Button look="danger" size="sm">
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Modal.Panel>
        </Modal.Root>
      )}
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
