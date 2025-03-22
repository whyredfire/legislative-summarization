"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/api/api";
import { toast } from "sonner";

interface SummarizeFormProps {
  status: "abstractive" | "extractive";
}

const formSchema = z.object({
  summarizeText: z.string().min(15, "Input must be at least 15 characters."),
  summarizedText: z.string().optional(),
});

const SummarizeForm = ({ status }: SummarizeFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summarizeText: "",
      summarizedText: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    form.setValue("summarizedText", "Summarizing...");
    try {
      const response = await api.post(`/summary/${status}`, {
        text: values.summarizeText,
      });

      if (response.status === 200) {
        form.setValue("summarizedText", response.data.summary);
        toast.success("Text summarized successfully.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while summarizing.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="summarizeText"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    placeholder="Enter text to summarize"
                    className="min-h-[30vh] max-h-[30vh] resize-none"
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
                    {...field}
                    readOnly
                    placeholder="Summarized text will appear here"
                    className="min-h-[30vh] max-h-[30vh] resize-none bg-gray-100"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center">
          <Button size="lg" className="mt-4 rounded-full" type="submit">
            Summarize
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SummarizeForm;
