import "./App.css";

import { Toaster } from "sonner";

import SummarizeForm from "./components/SummarizeForm";
import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" expand={true} />
      <NavigationBar />
      <SummarizeForm />
    </>
  );
}

export default App;
