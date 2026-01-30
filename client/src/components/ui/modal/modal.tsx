import { component$, Slot, type PropsOf, type Signal } from '@builder.io/qwik';
import { Modal as HeadlessModal } from '@qwik-ui/headless';

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
                    'fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/20 data-[state=closed]:hidden w-full h-full border-none m-0 max-w-none max-h-none',
                    className,
                ]}
            >
                <div class="relative bg-apple-bg/90 w-full max-w-lg rounded-[28px] shadow-2xl border border-white/20 overflow-hidden glass animate-in fade-in zoom-in duration-300">
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
