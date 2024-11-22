import { useState } from "react";
import { api } from "../../api/api";
import { toast } from "sonner";

const SummarizeForm = () => {
  const [text, setText] = useState<string>("");

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
      loading: "Submitting form...",
      success: (res) => {
        console.log(res.data.summary);
        return "Form submitted successfully!";
      },
      error: (err) => {
        console.error("Error submitting the form:", err);
        return "Error submitting the form.";
      },
    });
  };

  return (
    <>
      <div>
        <form
          className="flex flex-col gap-10 h-screen justify-center items-center"
          onSubmit={handleSubmit}
        >
          <textarea
            name="summarize"
            id="summarize"
            placeholder="Write your text here"
            className="h-48 max-h-[500px] min-h-48 max-w-4xl p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={10}
            cols={200}
            spellCheck={false}
            value={text}
            onChange={handleChange}
          />
          <button
            type="submit"
            aria-label="submit"
            className="bg-blue-600 text-white rounded-full px-6 py-3 w-fit hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Summarize
          </button>
        </form>
      </div>
    </>
  );
};

export default SummarizeForm;
