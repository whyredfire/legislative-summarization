import { Button } from "@/components/ui/button";
import GradientText from "@/components/ui/gradient-text";
import { H1, LeadingText } from "@/components/ui/typography";
import { siteConfig } from "@/data/globals";
import Link from "next/link";

import { cookies } from "next/headers";

const Home = async () => {
  const boolUserIsAuthenticated = (await cookies()).get("token");

  return (
    <>
      <main className="text-center flex container m-auto flex-col gap-2">
        <GradientText>
          <H1 className="leading-14">{siteConfig.title}</H1>
        </GradientText>
        <LeadingText className="text-pretty">
          {siteConfig.description}
        </LeadingText>
        <div className="flex flex-row gap-2 items-center justify-center">
          {!boolUserIsAuthenticated && (
            <Link
              href={{
                pathname: "/signin",
                query: {
                  tempUserMail: process.env.TEMP_USER_MAIL,
                  tempPass: process.env.TEMP_USER_PASSWORD,
                },
              }}
            >
              <Button
                size={"lg"}
                variant={"link"}
                className="rounded-full font-bold mt-2"
              >
                Try now
              </Button>
            </Link>
          )}
          <Link href={"/summarize"}>
            <Button size={"lg"} className="rounded-full font-bold mt-2">
              Get Started
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
