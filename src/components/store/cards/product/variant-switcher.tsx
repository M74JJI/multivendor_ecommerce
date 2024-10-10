import { VariantImageType, VariantSimplified } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  images: VariantImageType[];
  variants: VariantSimplified[];
  setVariant: Dispatch<SetStateAction<VariantSimplified>>;
  selectedVariant: VariantSimplified;
}

const VariantSwitcher: FC<Props> = ({
  images,
  variants,
  setVariant,
  selectedVariant,
}) => {
  return (
    <div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {images.map((img, index) => (
            <Link
              key={index}
              href={img.url}
              className={cn("p-0.5 rounded-full border-2 border-transparent", {
                "border-border": variants[index] === selectedVariant,
              })}
              onMouseEnter={() => setVariant(variants[index])}
            >
              <Image
                src={img.image}
                alt=""
                width={100}
                height={100}
                className="w-8 h-8 object-cover rounded-full"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantSwitcher;
