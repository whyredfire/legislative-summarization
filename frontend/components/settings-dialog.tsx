"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import OTPDeleteDialog from "./otp-delete-dialog";
import { api } from "@/api/api";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = async () => {
    try {
      const response = await api.get("/user/delete");
      if (response.status === 200) {
        setDialogOpen(true);
        toast.success("OTP sent successfully.");
      } else {
        toast.error("Failed to delete account.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[425px]"
          onPointerDownOutside={(e) => {
            if (
              e.target instanceof HTMLElement &&
              e.target.closest('[role="dialog"]')
            ) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Make changes to your settings here.
            </DialogDescription>
          </DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <Button
            onClick={() => {
              handleOpenDialog();
            }}
            variant={"destructive"}
          >
            Delete
          </Button>
        </DialogContent>
      </Dialog>
      <OTPDeleteDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
