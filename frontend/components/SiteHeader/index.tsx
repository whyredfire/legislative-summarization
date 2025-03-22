import Link from "next/link";

import { H3 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

import { ModeSwitcher } from "./mode-switcher";
import { siteConfig } from "@/data/globals";

const SiteHeader = () => {
  return (
    <>
      <header className=" border-grid border-b-sidebar-border border">
        <div className="container-wrapper container flex justify-between items-center p-4">
          <H3>
            <Link href={"/"}>{siteConfig.title}</Link>
          </H3>
          <div className="flex justify-between items-center gap-8">
            <div className="flex space-x-4 items-center">
              <Button variant={"ghost"}>
                <Link href={"/"}>Home</Link>
              </Button>
              <Button>
                <Link href={"/signin"}>Sign in</Link>
              </Button>
            </div>
            <ModeSwitcher />
          </div>
        </div>
      </header>
    </>
  );
};

export default SiteHeader;
