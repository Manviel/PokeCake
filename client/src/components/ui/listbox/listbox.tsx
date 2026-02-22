import { component$, type PropFunction } from "@builder.io/qwik";
import { Select } from "@qwik-ui/headless";
import { CheckIcon, ChevronDownIcon } from "lucide-qwik";

export interface ListboxOption {
  label: string;
  value: string;
  description?: string;
}

export interface ListboxProps {
  id?: string;
  value: string | undefined;
  onChange$: PropFunction<(val: string) => void>;
  options: ListboxOption[];
  placeholder?: string;
  triggerClass?: string;
  popoverClass?: string;
}

export const Listbox = component$<ListboxProps>(
  ({
    id,
    value,
    onChange$,
    options,
    placeholder = "Select an option",
    triggerClass = "flex w-full items-center justify-between rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-apple-text transition-colors hover:bg-gray-50 focus:border-apple-accent focus:outline-none focus:ring-1 focus:ring-apple-accent dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:focus:border-blue-400 dark:focus:ring-blue-400",
    popoverClass = "z-50 min-w-[200px] rounded-xl border border-black/10 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-slate-900/95 dark:shadow-2xl dark:backdrop-blur-xl",
  }) => {
    return (
      <Select.Root id={id} value={value} onChange$={onChange$}>
        <Select.Trigger class={triggerClass}>
          <Select.DisplayValue placeholder={placeholder} />
          <ChevronDownIcon class="h-4 w-4 opacity-50" />
        </Select.Trigger>
        <Select.Popover class={popoverClass}>
          <Select.Listbox class="max-h-[300px] overflow-auto">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                class="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors outline-none hover:bg-gray-100 data-[highlighted]:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white dark:data-[highlighted]:bg-white/10 dark:data-[highlighted]:text-white"
              >
                <div class="flex items-center gap-2">
                  <Select.ItemLabel>{opt.label}</Select.ItemLabel>
                  {opt.description && (
                    <span class="text-xs text-gray-400 dark:text-slate-500">
                      {opt.description}
                    </span>
                  )}
                </div>
                <Select.ItemIndicator>
                  <CheckIcon class="h-4 w-4 text-apple-accent dark:text-blue-400" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Listbox>
        </Select.Popover>
      </Select.Root>
    );
  },
);
