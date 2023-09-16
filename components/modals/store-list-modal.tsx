"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Edit2Icon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Fragment } from "react";
import { useStoreList } from "@/hooks/use-store-list-modal";
import { useAddStoreModal } from "@/hooks/use-add-store-modal";
import { DeleteStoreButton } from "../delete-store-button";
import { useTranslations } from "next-intl";

export const StoreListModal = () => {
  const t = useTranslations("Store");
  const storeListStore = useStoreList();
  const addStoreModal = useAddStoreModal();

  return (
    <Modal
      title={t("storeListTitle")}
      description={t("storeListDescription")}
      isOpen={storeListStore.isOpen}
      onClose={() => {
        storeListStore.onClose();
      }}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <ScrollArea className="h-[500px]">
              <div className="flex gap-2 flex-col">
                <Separator />
                {storeListStore.storeList!.map((store) => (
                  <Fragment key={store.id}>
                    <div
                      key={store.id}
                      className="flex items-center justify-between"
                    >
                      <div>{store.name}</div>
                      <div className="flex">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            addStoreModal.setIsEditing(true);
                            addStoreModal.setStoreData(store);
                            addStoreModal.onOpen();
                          }}
                        >
                          <Edit2Icon className="w-4 h-4" />
                        </Button>
                        <DeleteStoreButton key={store.id} storeId={store.id} />
                      </div>
                    </div>
                    <Separator key={store.id} />
                  </Fragment>
                ))}
              </div>
            </ScrollArea>
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                addStoreModal.onOpen();
              }}
            >
              {t("addStoreButton")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
