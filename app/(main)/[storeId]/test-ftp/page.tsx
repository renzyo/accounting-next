"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BadgeDollarSign } from "lucide-react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  image: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

const Page = () => {
  const [file, setFile] = React.useState<File | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("image", file as File);

      const response = await axios.post("/api/test-ftp", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.data;
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  return (
    <section className="mx-auto my-8 w-4/5 p-8 bg-slate-50 shadow-lg rounded-lg">
      <header className="flex flex-col md:flex-row items-center">
        <div className="flex gap-2 items-center">
          <BadgeDollarSign className="w-8 h-8" />
          <h2 className="font-semibold text-xl">TEST FTP</h2>
        </div>
      </header>
      <div className="mt-8">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="image">Image</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="file"
                      id="image"
                      onChange={(event) => {
                        setFile(event.target.files?.[0] ?? null);
                        field.onChange(event);
                      }}
                      accept="image/*"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default Page;
