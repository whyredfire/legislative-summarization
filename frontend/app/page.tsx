import { Button } from "@/components/ui/button";
import { H1, LeadingText } from "@/ui/Typography";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <main className="text-center flex flex-col gap-4">
        <H1>LegalEase</H1>
        <LeadingText>Summarize all your legal stuffs</LeadingText>
        <Button className="rounded-full mx-auto cursor-pointer">
          <Link href={"/summarize"}>Click here to start</Link>
        </Button>
      </main>
    </>
  );
};

export default Home;
