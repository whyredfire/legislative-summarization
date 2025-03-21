import Link from "next/link";

import { H3 } from "@/ui/Typography";
import { Button } from "@/components/ui/button";

import { ModeSwitcher } from "./mode-switcher";

const SiteHeader = () => {
  return (
    <>
      <header className=" border-grid border-b-sidebar-border border">
        <div className="container-wrapper container flex justify-between items-center p-4">
          <H3>
            <Link href={"/"}>LegalEase</Link>
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
