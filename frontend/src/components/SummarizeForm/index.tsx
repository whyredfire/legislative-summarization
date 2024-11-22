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
        if (res.data && res.data.data.summary) {
          setSummarizedText(res.data.data.summary);
        } else {
          console.error("Unexpected response structure:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error while submitting text:", err);
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
        className="flex flex-col gap-10 flex-grow justify-center items-center mx-10"
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
            className="min-h-60 text-gray-500 max-h-[500px] w-full sm:w-[90%] md:w-[80%] lg:max-w-4xl p-4 border rounded-lg text-sm sm:text-base focus:outline-none resize-none"
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
