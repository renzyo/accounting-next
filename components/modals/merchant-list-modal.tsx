"use client";

import { Modal } from "@/components/ui/modal";
import { useMerchantList } from "@/hooks/use-merchant-list-modal";
import { Button } from "../ui/button";
import { useAddMerchantModal } from "@/hooks/use-add-merchant-modal";
import { ScrollArea } from "../ui/scroll-area";
import { Edit2Icon } from "lucide-react";
import { Separator } from "../ui/separator";
import { DeleteMerchantButton } from "../delete-merchant-button";
import { Fragment } from "react";

export const MerchantListModal = () => {
  const merchantListStore = useMerchantList();
  const addMerchantModal = useAddMerchantModal();

  return (
    <Modal
      title="List Merchant"
      description="List Merchant"
      isOpen={merchantListStore.isOpen}
      onClose={() => {
        merchantListStore.onClose();
      }}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <ScrollArea className="h-[500px]">
              <div className="flex gap-2 flex-col">
                <Separator />
                {merchantListStore.merchantList!.map((merchant) => (
                  <Fragment key={merchant.id}>
                    <div
                      key={merchant.id}
                      className="flex items-center justify-between"
                    >
                      <div>{merchant.name}</div>
                      <div className="flex">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            addMerchantModal.setIsEditing(true);
                            addMerchantModal.setMerchantData(merchant);
                            addMerchantModal.onOpen();
                          }}
                        >
                          <Edit2Icon className="w-4 h-4" />
                        </Button>
                        <DeleteMerchantButton
                          key={merchant.id}
                          merchantId={merchant.id}
                        />
                      </div>
                    </div>
                    <Separator key={merchant.id} />
                  </Fragment>
                ))}
              </div>
            </ScrollArea>
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                addMerchantModal.onOpen();
              }}
            >
              Tambah Merchant
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
