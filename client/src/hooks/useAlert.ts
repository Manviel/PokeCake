import { $, type Signal, useSignal } from "@builder.io/qwik";

export type AlertType = "success" | "error" | "info";

export interface UseAlert {
  show: Signal<boolean>;
  message: Signal<string>;
  type: Signal<AlertType>;
  notify: (message: string, type?: AlertType) => void;
}

export function useAlert() {
  const show = useSignal(false);
  const message = useSignal("");
  const type = useSignal<AlertType>("info");

  const notify = $((msg: string, t: AlertType = "info") => {
    message.value = msg;
    type.value = t;
    show.value = true;
  });

  return {
    show,
    message,
    type,
    notify,
  };
}
