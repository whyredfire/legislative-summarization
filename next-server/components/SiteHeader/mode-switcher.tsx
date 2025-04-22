"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "../ui/button";
import ThemeContext from "@/context/theme-provider";

export function ModeSwitcher() {
  const { isDarkTheme, toggleThemeHandler } = React.useContext(ThemeContext);

  return (
    <Button
      variant="ghost"
      className="group/toggle h-8 w-8 px-0"
      onClick={toggleThemeHandler}
    >
      {isDarkTheme ? <SunIcon /> : <MoonIcon />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
