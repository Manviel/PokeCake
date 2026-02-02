import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export const Header = component$(() => {
  const loc = useLocation();
  return (
    <header class="bg-apple-glass border-apple-glass-border sticky top-0 z-50 h-[44px] border-b shadow-sm backdrop-blur-3xl">
      <div class="container flex h-full items-center justify-center">
        <nav class="text-apple-text-secondary flex gap-8 text-xs font-normal">
          <a
            href="/"
            class={`transition-colors ${loc.url.pathname === "/" ? "text-apple-text font-medium" : "hover:text-apple-text"}`}
          >
            Dashboard
          </a>
          <a
            href="/analytics"
            class={`transition-colors ${loc.url.pathname.startsWith("/analytics") ? "text-apple-text font-medium" : "hover:text-apple-text"}`}
          >
            Analytics
          </a>
        </nav>
      </div>
    </header>
  );
});
