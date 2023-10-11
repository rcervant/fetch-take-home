"use client";

import { BsSliders } from "react-icons/bs";
import ButtonWithIcon from "../ButtonWithIcon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import useSort from "@/hooks/useSort";
import { ASCENDING, DESCENDING } from "@/lib/constants";
import { SlidersHorizontal } from "lucide-react";
import { revalidatePath } from 'next/cache';
import revalidateSort from '@/actions/revalidateSort';

const Sort = () => {
  const router = useRouter();
  const url = usePathname();
  const searchParams = useSearchParams();

  const { field, sortOrder, setSortOrder } = useSort();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleSort = () => {
    const newSortOrder = sortOrder === DESCENDING ? ASCENDING : DESCENDING;
    setSortOrder(newSortOrder);

    const query = createQueryString("sort", `breed:${newSortOrder}`);

    router.push(`${url}?${query}`);
    router.refresh();
  };

  return (
    <ButtonWithIcon
      label={`Sort ${field} ${sortOrder === ASCENDING ? "A-Z" : "Z-A"}`}
      icon={SlidersHorizontal}
      onClick={handleSort}
    />
  );
};

export default Sort;
