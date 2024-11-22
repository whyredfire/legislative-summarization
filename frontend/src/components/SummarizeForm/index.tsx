import { useState } from "react";
import { api } from "../../api/api";
import { toast } from "sonner";

const SummarizeForm = () => {
  const [text, setText] = useState<string>("");
  const [summarizedText, setSummarizedText] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Input text cannot be empty.");
      return;
    }

    const submitPromise = api.post("/summarize", { text });

    toast.promise(submitPromise, {
      loading: "Generating summary...",
      success: async (res) => {
        console.log(res.data.summary);
        try {
          const response = await api.get("/summarize");
          setSummarizedText(response.data.summary);
          return "Summary generated!";
        } catch (err) {
          console.log("Failed to fetch summary:", err);
          toast.error("Failed to fetch summary.");
          return;
        }
      },
      error: (err) => {
        console.error("Error while generating summary:", err);
        return "Error while generating summary.";
      },
    });
  };

  return (
    <>
      <div>
        <form
          className="flex flex-col gap-10 h-screen justify-center items-center mx-10"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col sm:flex-row gap-8">
            <textarea
              name="summarize"
              id="summarize"
              placeholder="Write your text here"
              className="min-h-60 max-h-[500px] w-full sm:w-[90%] md:w-[80%] lg:max-w-4xl p-4 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={10}
              cols={200}
              spellCheck={false}
              value={text}
              onChange={handleChange}
            />
            <textarea
              name="summarized"
              id="summarized"
              placeholder="Summarized text"
              className="min-h-60 max-h-[500px] w-full sm:w-[90%] md:w-[80%] lg:max-w-4xl p-4 border rounded-lg text-sm sm:text-base focus:outline-none resize-none"
              rows={10}
              cols={200}
              spellCheck={false}
              readOnly={true}
              value={summarizedText}
            />
          </div>
          <button
            type="submit"
            aria-label="submit"
            className="bg-blue-600 text-white rounded-full px-6 py-3 w-fit hover:bg-blue-700"
          >
            Summarize
          </button>
        </form>
      </div>
    </>
  );
};

export default SummarizeForm;
