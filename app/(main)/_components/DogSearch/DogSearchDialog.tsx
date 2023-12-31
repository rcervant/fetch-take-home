"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/base/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/base/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/base/form";
import { Input } from "@/components/base/input";
import {
  DEFAULT_PAGE_SIZE,
  MAX_AGE,
  MIN_AGE,
  SEARCH_PATH,
  START_DOG_INDEX,
} from "@/lib/constants";
import useSearchStore from "@/hooks/useSearchStore";
import DogBreedCombobox from "./DogBreedCombobox";
import SelectedBreedsAccordion from "./SelectedBreedsAccordion";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import { DialogClose, DialogOverlay } from "@radix-ui/react-dialog";
import { useState } from "react";
import SearchBar from "./SearchBar";

const FormSchema = z
  .object({
    ageMin: z.coerce
      .number()
      .int()
      .min(MIN_AGE, {
        message: `Min age must be greater than or equal to ${MIN_AGE}`,
      })
      .finite()
      .max(MAX_AGE, {
        message: `Min age must be less than ${MAX_AGE}`,
      }),
    ageMax: z.coerce
      .number()
      .int()
      .min(MIN_AGE, {
        message: "Max age must be a positive number",
      })
      .finite()
      .max(MAX_AGE, {
        message: `Max age must be less than ${MAX_AGE}`,
      }),
    breeds: z.array(z.string()),
    zipCodes: z.array(z.string()),
  })
  .refine(
    ({ ageMin, ageMax }) => {
      return ageMax >= ageMin;
    },
    {
      path: ["ageMax"],
      message: `Max age must be greater than or equal to Min age`,
    },
  );

export const dynamic = true;

const SearchDialog = () => {
  const {
    ageMin = MIN_AGE,
    ageMax = MAX_AGE,
    setMaxAge,
    setMinAge,
    selectedBreeds,
    selectedZipCodes,
    resetSearch,
    resetBreeds,
    resetZipCodes,
    setIsSearching,
  } = useSearchStore();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ageMin,
      ageMax,
      breeds: selectedBreeds,
      zipCodes: selectedZipCodes,
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setMinAge(data.ageMin);
    setMaxAge(data.ageMax);

    const query = queryString.stringify(
      {
        breeds: selectedBreeds,
        zipCodes: selectedZipCodes,
        ageMin: data.ageMin,
        ageMax: data.ageMax,
        size: DEFAULT_PAGE_SIZE,
        from: START_DOG_INDEX,
      },
      {
        arrayFormat: "none",
        skipEmptyString: true,
        skipNull: true,
      },
    );

    router.push(`${SEARCH_PATH}?${query}`);
    setOpen(false);
    setIsSearching(true);
  };

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="sm:w-2/6" data-testid="search-dialog-trigger">
          <SearchBar />
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="m-auto w-2/3 items-center space-y-6 "
          >
            <DialogOverlay>
              <DialogHeader className="m-auto items-center justify-center pb-5">
                <DialogTitle>Search for your pups</DialogTitle>
                <DialogDescription>
                  Select one or more breeds to search for
                </DialogDescription>
              </DialogHeader>
              <DogBreedCombobox data-testid="dog-combobox" />
              <SelectedBreedsAccordion data-testid="selected-breeds-accordion" />
              <div className="flex gap-1">
                <FormField
                  control={form.control}
                  name="ageMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Age</FormLabel>
                      <FormControl>
                        <Input
                          min={MIN_AGE}
                          max={MAX_AGE}
                          {...field}
                          onClick={() => field.onChange("")}
                          data-testid="min-age-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ageMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Age</FormLabel>
                      <FormControl>
                        <Input
                          min={MIN_AGE}
                          max={MAX_AGE}
                          {...field}
                          onClick={() => field.onChange("")}
                          data-testid="max-age-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                onClick={() => {
                  form.reset();
                  resetSearch();
                }}
                variant={"ghost"}
                className="underline"
                data-testid="reset-filters"
              >
                Reset Filters
              </Button>
              <DialogFooter>
                <div className="flex justify-between gap-4">
                  <DialogClose asChild>
                    <Button variant={"secondary"} className="w-full">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="w-full"
                    data-testid="submit-search"
                    disabled={form.formState.isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              </DialogFooter>
            </DialogOverlay>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default SearchDialog;
