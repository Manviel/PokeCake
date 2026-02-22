import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export const Header = component$(() => {
  const loc = useLocation();
  return (
    <header
      class={`sticky top-0 z-50 h-[44px] border-b shadow-sm backdrop-blur-3xl transition-colors ${
        loc.url.pathname.startsWith("/analytics")
          ? "border-white/10 bg-slate-900/50 text-slate-300"
          : "border-apple-glass-border bg-apple-glass text-apple-text-secondary"
      }`}
    >
      <div class="container flex h-full items-center justify-center">
        <nav class="flex gap-8 text-base font-normal">
          <a
            href="/"
            class={`transition-colors ${
              loc.url.pathname === "/"
                ? "font-medium text-apple-text"
                : loc.url.pathname.startsWith("/analytics")
                  ? "hover:text-white"
                  : "hover:text-apple-text"
            }`}
          >
            Dashboard
          </a>
          <a
            href="/analytics"
            class={`transition-colors ${
              loc.url.pathname.startsWith("/analytics")
                ? "font-medium text-white"
                : "hover:text-apple-text"
            }`}
          >
            Analytics
          </a>
        </nav>
      </div>
    </header>
  );
});
