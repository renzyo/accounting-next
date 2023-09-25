"use client";

import { Modal } from "@/components/ui/modal";
import { useImageModal } from "@/hooks/use-image-modal";
import Image from "next/image";

export const ImageModal = () => {
  const imageStore = useImageModal();

  return (
    <Modal
      title="Foto Produk"
      description={imageStore.productName ?? ""}
      isOpen={imageStore.isOpen}
      onClose={() => {
        imageStore.onClose();
      }}
    >
      <div>
        <Image
          src={imageStore.imageUrl ?? ""}
          alt="Product Image"
          width={1200}
          height={1200}
          loading="lazy"
        />
      </div>
    </Modal>
  );
};
