"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const SummarizePage = () => {
  const formSchema = z.object({
    summarizeText: z.string().min(15),
    summarizedText: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summarizeText: "",
      summarizedText: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 flex-wrap gap-4 w-full"
        >
          <FormField
            control={form.control}
            name="summarizeText"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className="min-h-[30vh] max-h-[30vh] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="summarizedText"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    readOnly
                    className="min-h-[30vh] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-1 sm:col-span-2 flex justify-center">
            <Button
              size={"lg"}
              className="mt-4 mx-auto rounded-full"
              type="submit"
            >
              Summarize
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SummarizePage;
