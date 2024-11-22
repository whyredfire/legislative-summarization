import "./App.css";

import { Toaster } from "sonner";

import SummarizeForm from "./components/SummarizeForm";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" expand={true} />
      <div className="flex flex-col h-screen">
        <NavigationBar />
        <div className="flex flex-grow justify-center items-center">
          <SummarizeForm />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
