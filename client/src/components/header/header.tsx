import { component$ } from "@builder.io/qwik";

export const Header = component$(() => {
  return (
    <header class="bg-apple-glass border-apple-glass-border sticky top-0 z-50 h-[44px] border-b shadow-sm backdrop-blur-3xl">
      <div class="container flex h-full items-center justify-center">
        <nav class="text-apple-text-secondary flex gap-8 text-xs font-normal">
          <a href="/" class="hover:text-apple-text transition-colors">
            Dashboard
          </a>
        </nav>
      </div>
    </header>
  );
});
