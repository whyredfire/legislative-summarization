"use client";

import { motion, AnimatePresence } from "framer-motion";

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
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { File, FileText } from "lucide-react";
import { useState } from "react";

interface SummarizeFormProps {
  status: "abstractive" | "extractive";
}

const SummarizeForm = ({ status }: SummarizeFormProps) => {
  const formSchema = z.object({
    summarizeText: z.string().min(15, "Input must be at least 15 characters."),
    summarizedText: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summarizeText: "",
      summarizedText: "",
    },
  });

  const showSummary = !!form.watch("summarizedText");

  const [showDownloadPdf, setShowDownloadPdf] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    form.setValue("summarizedText", "Summarizing...");
    setShowDownloadPdf(false);
    setSummarizedButtonStatus(false);

    try {
      const res = await api.post(`/summary/${status}`, {
        text: values.summarizeText,
      });

      if (res.status === 200) {
        form.setValue("summarizedText", res.data.summary);
        toast.success("Text summarized successfully.");
        setShowDownloadPdf(true);
        setSummarizedButtonStatus(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while summarizing.");
      setShowDownloadPdf(false);
      setSummarizedButtonStatus(true);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isFileCompatible =
      file.name.endsWith(".txt") || file.name.endsWith(".pdf");

    if (!isFileCompatible) {
      toast.error("Only .txt and .pdf file are accepted!");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload/extract", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        form.setValue("summarizeText", res.data.extracted_text);
      }
    } catch (error) {
      console.error(error);
    }

    // we require this to be null, as retrigger doesnt occur if target.value is same
    event.target.value = "";
  };

  const downloadPdf = async (values: z.infer<typeof formSchema>) => {
    const payload = {
      text: values.summarizeText,
      summary: values.summarizedText,
    };

    // https://medium.com/@khushbooverma8319/download-api-file-in-frontend-91bd51e4ee19
    try {
      const res = await api.post("/summary/abstractive/pdf", payload, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "summary.pdf";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  // make sure summarize button is enabled first
  const [summarizeButtonStatus, setSummarizedButtonStatus] = useState(true);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-wrap-reverse sm:flex-nowrap gap-4">
            <div className="w-full sm:flex-1 transition-all duration-300">
              <FormField
                control={form.control}
                name="summarizeText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck="false"
                        placeholder="Enter text to summarize"
                        className="min-h-[30vh] max-h-[30vh] sm:min-h-[50vh] sm:max-h-[50vh] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AnimatePresence>
              {showSummary && (
                <motion.div
                  initial={{ opacity: 0, width: "50%" }}
                  animate={{ opacity: 1, width: "100%" }}
                  transition={{ duration: 0.32, ease: "easeInOut" }}
                  className="sm:w-[100%] sm:flex-1 transition-all duration-300"
                >
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
                            className="min-h-[30vh] max-h-[30vh] sm:min-h-[50vh] sm:max-h-[50vh] text-muted-foreground resize-none bg-gray-100"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <Button
              title="Select a file"
              type="button"
              variant="secondary"
              onClick={() => document.getElementById("inputFile")?.click()}
            >
              <File />
              File
            </Button>

            <input
              type="file"
              className="hidden"
              id="inputFile"
              accept=".txt, .pdf"
              onChange={handleFileChange}
            />

            {showDownloadPdf && (
              <Button
                title="Download PDF"
                type="button"
                variant={"secondary"}
                onClick={() => downloadPdf(form.getValues())}
              >
                <FileText />
                Download PDF
              </Button>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              disabled={!summarizeButtonStatus}
              size="lg"
              className="mt-4 rounded-full "
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

export default SummarizeForm;
