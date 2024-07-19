"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Record<string, any>[];
}

const StoreSwitcher: FC<StoreSwitcherProps> = ({ stores, className }) => {
  const params = useParams();
  const router = useRouter();

  // Format stores data
  const formattedItems = stores.map((store) => ({
    label: store.name,
    value: store.url,
  }));
  const [open, setOpen] = useState(false);

  // Get the active store
  const activeStore = formattedItems.find(
    (store) => store.value === params.storeUrl
  );

  const onStoreSelect = (store: { label: string; value: string }) => {
    setOpen(false);
    router.push(`/dashboard/seller/stores/${store.value}`);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[250px] justify-between", className)}
        >
          <StoreIcon className="mr-2 w-4 h-4" />
          {activeStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search stores..." />
            <CommandEmpty>No Store Selected.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm cursor-pointer"
                >
                  <StoreIcon className="mr-2 w-4 h-4" />
                  {store.label}
                  <Check
                    className={cn("ml-auto h-4 w-4 opacity-0", {
                      "opacity-100": activeStore?.value === store.value,
                    })}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandItem
              className="cursor-pointer"
              onSelect={() => {
                setOpen(false);
                router.push(`/dashboard/seller/stores/new`);
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Create Store
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
