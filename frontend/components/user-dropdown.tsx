"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "./settings-dialog";
import { useState } from "react";

interface UserAvatarDropdownProps {
  username: string;
  email: string;
}

const UserAvatarDropdown = ({ username, email }: UserAvatarDropdownProps) => {
  const navigator = useRouter();

  const handleSignOut = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigator.push("/");
    navigator.refresh();
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleOpenDialog = () => {
    setDropdownOpen(false);
    setTimeout(() => {
      setDialogOpen(true);
    }, 10);
  };
  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="size-8 rounded-full border-none p-0"
          >
            <Avatar>
              <AvatarImage src="#!" alt={username} />
              <AvatarFallback className="rounded-lg">
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={20}
          alignOffset={-150}
          hideWhenDetached
          align="start"
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar>
                <AvatarImage src="#!" alt={username} />
                <AvatarFallback className="rounded-lg">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{username}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleOpenDialog();
            }}
          >
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SettingsDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default UserAvatarDropdown;
