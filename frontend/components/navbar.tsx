import { ModeToggle } from "./themeswitch";
import Link from "next/link";
import { H3 } from "@/ui/Typography";
import { Button } from "./ui/button";

const NavigationBar = () => {
  return (
    <>
      <nav className="flex justify-between items-center p-4 border border-b-sidebar-border">
        <H3>
          <Link href={"/"}>LegalEase</Link>
        </H3>
        <div className="flex justify-between items-center gap-8">
          <div className="flex space-x-4 items-center">
            <Button variant={"ghost"}>
              <Link href={"/"}>Home</Link>
            </Button>
            <Button variant={"ghost"}>
              <Link href={"/register"}>Register</Link>
            </Button>
            <Button>
              <Link href={"/login"}>Login</Link>
            </Button>
          </div>
          <ModeToggle />
        </div>
      </nav>
    </>
  );
};

export default NavigationBar;
