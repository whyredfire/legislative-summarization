import { Button } from "@/components/ui/button";
import GradientText from "@/components/ui/gradient-text";
import { H1, LeadingText } from "@/components/ui/typography";
import { siteConfig } from "@/data/globals";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <main className="text-center flex container m-auto flex-col gap-2">
        <GradientText>
          <H1 className="leading-14">{siteConfig.title}</H1>
        </GradientText>
        <LeadingText className="text-pretty">
          {siteConfig.description}
        </LeadingText>
        <Link href={"/summarize"}>
          <Button
            size={"lg"}
            className="rounded-full font-bold mt-2 mx-auto cursor-pointer"
          >
            Get Started
          </Button>
        </Link>
      </main>
    </>
  );
};

export default Home;
