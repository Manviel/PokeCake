import {
  component$,
  $,
  type Signal,
  type PropFunction,
} from "@builder.io/qwik";
import { Modal } from "../modal/modal";
import { Button } from "../button/button";

interface ConfirmDialogProps {
  show: Signal<boolean>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm$: PropFunction<() => void>;
  variant?: "danger" | "default";
}

export const ConfirmDialog = component$<ConfirmDialogProps>(
  ({
    show,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm$,
    variant = "default",
  }) => {
    return (
      <Modal.Root show={show}>
        <Modal.Panel>
          <div class="p-8">
            <Modal.Title>{title}</Modal.Title>
            <div class="mt-2 mb-8">
              <Modal.Description>{description}</Modal.Description>
            </div>

            <div class="flex justify-end gap-3">
              <Button look="ghost" onClick$={() => (show.value = false)}>
                {cancelText}
              </Button>
              <Button
                look={variant === "danger" ? "danger" : "primary"}
                onClick$={async () => {
                  await onConfirm$();
                  show.value = false;
                }}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </Modal.Panel>
      </Modal.Root>
    );
  },
);
