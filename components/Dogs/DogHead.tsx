"use client";

import Image from "next/image";
import { SerializableUser } from "@/types";
import Heading from "../Heading";
import HeartButton from "../HeartButton";
import ButtonWithIcon from "../ButtonWithIcon";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface DogHeadProps {
  name: string;
  age: number;
  imageSrc: string;
  id: string;
  currentUser?: SerializableUser | null;
  subtitle?: string;
}

const DogHead = ({
  name,
  imageSrc,
  id,
  currentUser,
  subtitle,
}: DogHeadProps) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-start">
        <div className="flex-none">
          <ButtonWithIcon
            label=""
            onClick={() => router.back()}
            icon={ChevronLeft}
            variant={"ghost"}
            size={"lg"}
          />
        </div>
        <div className="w-full flex-1 grow pr-12">
          <Heading title={name} subtitle={subtitle} center />
        </div>
        <div className="flex-none grow-0"></div>
      </div>
      <div className="flex w-full items-center justify-center">
        <div
          className="relative
        aspect-square
        w-full
        overflow-hidden 
        rounded-xl
        sm:w-4/5
        md:w-3/5
        "
        >
          <Image
            src={imageSrc}
            fill
            className="w-full object-cover"
            alt={`Image of ${name}`}
            sizes="100%"
          />
          <div className="absolute right-5 top-5">
            <HeartButton dogId={id} currentUser={currentUser} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DogHead;
