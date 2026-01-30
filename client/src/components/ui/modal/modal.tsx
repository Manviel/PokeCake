import { component$, Slot, type PropsOf, type Signal } from "@builder.io/qwik";
import { Modal as HeadlessModal } from "@qwik-ui/headless";

export const Modal = {
  Root: component$<{ show: Signal<boolean> }>(({ show }) => {
    return (
      <HeadlessModal.Root bind:show={show}>
        <Slot />
      </HeadlessModal.Root>
    );
  }),
  Panel: component$<{ class?: string }>(({ class: className }) => {
    return (
      <HeadlessModal.Panel
        class={[
          "fixed inset-0 z-[100] m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-none bg-black/20 backdrop-blur-md data-[state=closed]:hidden",
          className,
        ]}
      >
        <div class="bg-apple-bg/90 glass animate-in fade-in zoom-in relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/20 shadow-2xl duration-300">
          <Slot />
        </div>
      </HeadlessModal.Panel>
    );
  }),
  Title: component$(() => (
    <h2 class="text-3xl font-bold">
      <Slot />
    </h2>
  )),
  Description: component$(() => (
    <p class="text-apple-text-secondary">
      <Slot />
    </p>
  )),
};
