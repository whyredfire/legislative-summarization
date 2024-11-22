import "./App.css";

import { Toaster } from "sonner";

import SummarizeForm from "./components/SummarizeForm";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" expand={true} />
      <SummarizeForm />
    </>
  );
}

export default App;
