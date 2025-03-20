import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer/Footer";

import Summarize from "./pages/Summarize";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <main className="flex h-screen flex-col">
        <NavigationBar />
        <section className="mt-8 flex flex-grow items-center justify-center">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/summarize" element={<Summarize />} />
              {/* <Route path="*" element={< />} /> */}
            </Routes>
          </BrowserRouter>
        </section>
        <Footer />
      </main>
      <Toaster richColors position="top-center" expand={true} />
    </>
  );
}

export default App;
