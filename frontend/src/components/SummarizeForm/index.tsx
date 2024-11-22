import { useState } from "react";
import { api } from "../../api/api";
import { toast } from "sonner";
import FormButton from "../FormButton";

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

    const submitPromise = api
      .post("/summary", { text })
      .then((res) => {
        try {
          if (res.data && res.data.data.summary) {
            setSummarizedText(res.data.data.summary);
          } else {
            console.error("Unexpected response structure:", res.data);
            throw new Error("Invalid response format.");
          }
        } catch (error) {
          console.error("Error while processing response:", error);
          throw error;
        }
      })
      .catch((err) => {
        console.error("Error while submitting text:", err);
        throw err;
      });

    toast.promise(submitPromise, {
      loading: "Generating summary...",
      success: "Summary generated!",
      error: "Error while generating summary.",
    });
  };

  return (
    <>
      <form
        className="mx-10 flex flex-grow flex-col items-center justify-center gap-10"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-8 sm:flex-row">
          <textarea
            name="summarize"
            id="summarize"
            placeholder="Write your text here"
            className="max-h-[500px] min-h-60 w-full resize-none rounded-lg border p-4 text-sm focus:border-blue-500 focus:shadow-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-[90%] sm:text-base md:w-[80%] lg:max-w-4xl"
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
            className="max-h-[500px] min-h-60 w-full cursor-context-menu resize-none rounded-lg border p-4 text-sm text-gray-500 focus:outline-none sm:w-[90%] sm:text-base md:w-[80%] lg:max-w-4xl"
            rows={10}
            cols={200}
            spellCheck={false}
            readOnly={true}
            value={summarizedText}
          />
        </div>
        <FormButton
          text="Summarize"
          buttonType="submit"
          color="bg-blue-700"
          textColor="white"
        />
      </form>
    </>
  );
};

export default SummarizeForm;
