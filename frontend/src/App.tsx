import { Toaster } from "sonner";

import SummarizeForm from "./components/SummarizeForm";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" expand={true} />
      <div className="flex h-screen flex-col">
        <NavigationBar />
        <div className="flex flex-grow items-center justify-center">
          <SummarizeForm />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
