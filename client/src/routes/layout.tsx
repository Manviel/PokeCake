import { component$, Slot } from "@builder.io/qwik";
import { Header } from "../components/header/header";

export default component$(() => {
  return (
    <>
      <Header />
      <Slot />
      <footer class="text-apple-text-secondary p-16 text-center text-xs">
        Copyright © {new Date().getFullYear()} Apple Digital Twin Inc. All
        rights reserved.
      </footer>
    </>
  );
});
