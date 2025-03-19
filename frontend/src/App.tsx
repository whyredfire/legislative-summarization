import { Toaster } from "sonner";

import SummarizeForm from "./components/SummarizeForm";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <main className="flex h-screen flex-col">
        <NavigationBar />
        <section className="mt-8 flex flex-grow items-center justify-center">
          <SummarizeForm />
        </section>
        <Footer />
      </main>
      <Toaster richColors position="top-center" expand={true} />
    </>
  );
}

export default App;
