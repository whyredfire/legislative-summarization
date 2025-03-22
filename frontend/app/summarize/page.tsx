import SummarizeForm from "@/components/summarize-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { value: "abstractive", label: "Abstractive" },
  { value: "extractive", label: "Extractive" },
] as const;

const SummarizePage = () => {
  return (
    <main className="grid grid-cols-1 w-full">
      <Tabs defaultValue="abstractive">
        <TabsList className="mx-auto mb-4">
          {TABS.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div>
          {TABS.map(({ value }) => (
            <TabsContent key={value} value={value}>
              <SummarizeForm status={value} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </main>
  );
};

export default SummarizePage;
