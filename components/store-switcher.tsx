"use client";

import React, { FC } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  SettingsIcon,
  StoreIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { Store, User } from "@prisma/client";
import { useAddStoreModal } from "@/hooks/use-add-store-modal";
import { useStoreList } from "@/hooks/use-store-list-modal";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
  user: User;
}

const StoreSwitcher: FC<StoreSwitcherProps> = ({ className, items, user }) => {
  const storeModal = useAddStoreModal();
  const storeList = useStoreList();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = React.useState(false);

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
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
          className={cn("min-w-[200px] justify-between", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Cari toko..." />
            <CommandEmpty>Toko tidak ditemukan.</CommandEmpty>
            <CommandGroup heading="Pilih Toko">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {user.role === "ADMIN" && (
            <>
              <CommandSeparator />
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      storeList.onOpen();
                    }}
                  >
                    <SettingsIcon className="mr-2 h-5 w-5" />
                    Kelola Toko
                  </CommandItem>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      storeModal.onOpen();
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Tambah Toko
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
