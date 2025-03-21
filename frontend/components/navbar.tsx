import { ModeToggle } from "./themeswitch";
import Link from "next/link";
import { H3 } from "@/ui/Typography";

const NavigationBar = () => {
  return (
    <>
      <nav className="flex justify-between items-center p-4 border border-b-sidebar-border">
        <H3>
          <Link href={"/"}>LegalEase</Link>
        </H3>
        <div className="flex justify-between items-center gap-8">
          <div className="flex space-x-4">
            <Link href={"/"}>Home</Link>
            <Link href={"/login"}>Login</Link>
            <Link href={"/register"}>Register</Link>
          </div>
          <ModeToggle />
        </div>
      </nav>
    </>
  );
};

export default NavigationBar;
