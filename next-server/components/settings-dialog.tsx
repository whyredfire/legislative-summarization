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
import ChangePasswordDialog from "./change-password-dialog";
import { Switch } from "./ui/switch";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);

  // so that we don't spam OTPs xD
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);

  const handleChangePasswordDialog = () => {
    setChangePasswordDialogOpen(true);
  };

  const handleOpenDeleteDialog = async () => {
    setDeleteButtonLoading(true);
    try {
      const response = await api.get("/user/delete");
      if (response.status === 200) {
        setDeleteDialogOpen(true);
        toast.success("OTP sent successfully.");
      } else {
        toast.error("Failed to delete account.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteButtonLoading(false);
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
              Make changes to your account here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row justify-between items-center">
            <DialogTitle className="h-full tracking-tight">
              Change password
            </DialogTitle>
            <Button
              size={"sm"}
              onClick={() => {
                handleChangePasswordDialog();
              }}
            >
              Change
            </Button>
          </div>
          <div className="flex flex-row justify-between items-center">
            <DialogTitle className="h-full tracking-tight">
              Delete account
            </DialogTitle>
            <Button
              size={"sm"}
              disabled={deleteButtonLoading}
              onClick={() => {
                handleOpenDeleteDialog();
              }}
              variant={"destructive"}
            >
              Delete
            </Button>
          </div>
          <div className="flex flex-row justify-between items-center">
            <DialogTitle>Incognito Mode</DialogTitle>
            <Switch />
          </div>
        </DialogContent>
      </Dialog>
      <OTPDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
      />
    </>
  );
};

export default SettingsDialog;
