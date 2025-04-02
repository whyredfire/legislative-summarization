import Link from "next/link";

import { H4 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

import { ModeSwitcher } from "./mode-switcher";
import { siteConfig } from "@/data/globals";
import { cookies } from "next/headers";
import UserAvatarDropdown from "../user-dropdown";
import { SidebarTrigger } from "../ui/sidebar";

const SiteHeader = async () => {
  const cookieStore = await cookies();
  const userDataCookie = cookieStore.get("data");
  const boolUserIsAuthenticated = cookieStore.get("token");

  let username = "";
  let email = "";

  if (userDataCookie?.value) {
    try {
      const decoded = atob(userDataCookie.value);
      [username, email] = decoded.split(", ");
    } catch (error) {
      console.error("Error decoding user data:", error);
    }
  }

  return (
    <>
      <header className=" border-grid border-b-sidebar-border border shrink-0">
        <div className="container-wrapper container flex justify-between items-center p-4">
          <div className="flex flex-row gap-2">
            {boolUserIsAuthenticated && <SidebarTrigger className="-ml-1" />}
            <Link href={"/"}>
              <H4>{siteConfig.title}</H4>
            </Link>
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center">
              {!boolUserIsAuthenticated ? (
                <Link href={"/signin"}>
                  <Button>Sign in</Button>
                </Link>
              ) : (
                <UserAvatarDropdown username={username} email={email} />
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
