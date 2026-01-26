import { component$ } from "@builder.io/qwik";

export const Header = component$(() => {
  return (
    <header class="sticky top-0 z-50 h-[44px] bg-apple-glass backdrop-blur-3xl border-b border-apple-glass-border shadow-sm">
      <div class="container h-full flex items-center justify-center">
        <nav class="flex gap-8 text-xs font-normal text-apple-text-secondary">
          <a href="/" class="hover:text-apple-text transition-colors">Dashboard</a>
        </nav>
      </div>
    </header>
  );
});
