import { useImageModal } from "@/hooks/use-image-modal";
import Image from "next/image";

const ProductImage = ({
  imageUrl,
  productName,
}: {
  imageUrl: string;
  productName: string;
}) => {
  const imageStore = useImageModal();

  return (
    <div className="flex items-center justify-center cursor-pointer">
      <Image
        src={imageUrl}
        width={200}
        height={200}
        alt="Product Image"
        className="w-20 h-20 rounded-lg"
        onClick={() => {
          imageStore.imageUrl = imageUrl;
          imageStore.productName = productName;
          imageStore.onOpen();
        }}
      />
    </div>
  );
};

export default ProductImage;
