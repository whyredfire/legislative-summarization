import { motion } from "framer-motion";

const Home = () => {
  return (
    <main className="flex flex-col text-white">
      <section className="rounded-3xl bg-gradient-to-r from-blue-400 to-blue-500 p-8 text-center">
        <h1 className="text-5xl leading-[1.2] font-extrabold lg:text-8xl lg:leading-[1.2]">
          LegalEase
        </h1>
        <h2 className="text-xl leading-[1.5] font-bold lg:text-4xl lg:leading-[1.5]">
          Summarize all your investigations
        </h2>
      </section>
      <motion.a
        href="/summarize"
        whileHover={{ scale: 1.1 }}
        className="mt-6 cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-center text-xl font-bold text-transparent hover:from-blue-700"
      >
        Click here to get started
      </motion.a>
    </main>
  );
};

export default Home;
