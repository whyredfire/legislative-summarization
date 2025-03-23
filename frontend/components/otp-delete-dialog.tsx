"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { api } from "@/api/api";
import { useRouter } from "next/navigation";

interface OTPDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OTPDeleteDialog = ({ open, onOpenChange }: OTPDeleteDialogProps) => {
  const navigator = useRouter();

  const formSchema = z.object({
    otp: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.otp) {
      toast.error("OTP field is empty.");
      return;
    }

    try {
      const response = await api.post("/user/delete/verify", values);
      if (response.status === 200) {
        toast.success("Account deleted successfully.");
        // Redirect and delete cookies
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigator.push("/");
        navigator.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP");
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
            <DialogTitle>Enter your OTP</DialogTitle>
            <DialogDescription>
              OTP has been sent to your email.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex flex-col items-center gap-4 justify-center"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mx-auto" variant={"destructive"}>
                Delete your account
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OTPDeleteDialog;
