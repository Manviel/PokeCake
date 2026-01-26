import { component$, Slot } from "@builder.io/qwik";
import { Header } from "../components/header/header";

export default component$(() => {
    return (
        <>
            <Header />
            <main class="container pt-[50px]">
                <Slot />
            </main>
            <footer class="text-center p-16 text-apple-text-secondary text-xs">
                Copyright © {new Date().getFullYear()} Apple Digital Twin Inc. All rights reserved.
            </footer>
        </>
    );
});
