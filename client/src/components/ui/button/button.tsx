import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      look: {
        primary: "bg-apple-accent text-white hover:opacity-90",
        secondary: "bg-black/5 text-apple-text hover:bg-black/10",
        outline: "border border-apple-border bg-transparent hover:bg-black/5",
        ghost: "hover:bg-black/5",
        link: "text-apple-accent underline-offset-4 hover:underline",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-6 py-2",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      look: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = PropsOf<"button"> &
  VariantProps<typeof buttonVariants>;

export const Button = component$<ButtonProps>(
  ({ look, size, class: className, ...props }) => {
    return (
      <button {...props} class={[buttonVariants({ look, size }), className]}>
        <Slot />
      </button>
    );
  },
);
