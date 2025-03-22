import { Button } from "@/components/ui/button";
import { H1, LeadingText } from "@/components/ui/typography";
import { siteConfig } from "@/data/globals";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <main className="text-center flex flex-col gap-4">
        <H1>{siteConfig.title}</H1>
        <LeadingText>{siteConfig.description}</LeadingText>
        <Button className="rounded-full mx-auto cursor-pointer">
          <Link href={"/summarize"}>Click here to start</Link>
        </Button>
      </main>
    </>
  );
};

export default Home;
