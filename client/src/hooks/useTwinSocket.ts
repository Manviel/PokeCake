import { $, useOnDocument, useOnWindow, type Signal } from "@builder.io/qwik";
import type { ProductTwin } from "../services/api";
import { socketService } from "../services/socket";

/**
 * Connects to the WebSocket on window load, wires telemetry updates
 * into the provided `twins` and `selectedTwin` signals, and
 * disconnects when the document becomes hidden.
 */
export function useTwinSocket(
  twins: Signal<ProductTwin[]>,
  selectedTwin: Signal<ProductTwin | null>,
) {
  useOnWindow(
    "load",
    $(() => {
      socketService.connect();

      socketService.onTelemetryUpdate((data) => {
        const currentSelectedTwin = selectedTwin.value;

        const updatedTwins = twins.value.map((t) => {
          if (t._id === data._id) {
            const updated = { ...t, ...data };

            if (currentSelectedTwin?._id === data._id) {
              selectedTwin.value = updated;
            }

            return updated;
          }
          return t;
        });
        twins.value = [...updatedTwins];
      });
    }),
  );

  useOnDocument(
    "qvisible",
    $(() => {
      return () => {
        socketService.disconnect();
      };
    }),
  );
}
