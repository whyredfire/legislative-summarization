import Link from "next/link";

import { H4 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ModeSwitcher } from "./mode-switcher";
import { siteConfig } from "@/data/globals";
import { headers } from "next/headers";
import { HomeIcon, LogIn, MoreHorizontalIcon } from "lucide-react";

const SiteHeader = async () => {
  const userIsAuthenticated = (await headers()).get("X-User-Authenticated");
  const boolUserIsAuthenticated = userIsAuthenticated === "true";
  console.log("boolUserIsAuthenticated", boolUserIsAuthenticated);

  return (
    <>
      <header className=" border-grid border-b-sidebar-border border">
        <div className="container-wrapper container flex justify-between items-center p-4">
          <Link href={"/"}>
            <H4>{siteConfig.title}</H4>
          </Link>
          <div className="flex justify-between items-center gap-8">
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontalIcon />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={20}
                  alignOffset={-50}
                  hideWhenDetached
                >
                  <DropdownMenuItem>
                    <Link className="inline-flex items-center gap-2" href={"/"}>
                      <HomeIcon />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  {!boolUserIsAuthenticated && (
                    <DropdownMenuItem>
                      <Link
                        className="inline-flex items-center gap-2"
                        href={"/signin"}
                      >
                        <LogIn />
                        Login
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="hidden sm:flex items-center">
              <Link href={"/"}>
                <Button variant={"ghost"}>Home</Button>
              </Link>
              {!boolUserIsAuthenticated && (
                <Link href={"/signin"}>
                  <Button>Sign in</Button>
                </Link>
              )}
            </div>
            <ModeSwitcher />
          </div>
        </div>
      </header>
    </>
  );
};

export default SiteHeader;
