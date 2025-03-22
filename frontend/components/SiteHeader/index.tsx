import Link from "next/link";

import { H3 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

import { ModeSwitcher } from "./mode-switcher";
import { siteConfig } from "@/data/globals";
import { cn } from "@/lib/utils";
import { isUserLoggedIn } from "@/hooks/check-user-status";

const SiteHeader = async () => {
  const userLoggedIn = await isUserLoggedIn();

  return (
    <>
      <header className=" border-grid border-b-sidebar-border border">
        <div className="container-wrapper container flex justify-between items-center p-4">
          <Link href={"/"}>
            <H3>{siteConfig.title}</H3>
          </Link>
          <div className="flex justify-between items-center gap-8">
            <div className="flex items-center">
              <Link href={"/"}>
                <Button variant={"ghost"}>Home</Button>
              </Link>
              <Link
                className={cn(userLoggedIn ? "hidden" : "block")}
                href={"/signin"}
              >
                <Button>Sign in</Button>
              </Link>
            </div>
            <ModeSwitcher />
          </div>
        </div>
      </header>
    </>
  );
};

export default SiteHeader;
