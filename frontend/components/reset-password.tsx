"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/api/api";
import { useRouter } from "next/navigation";

interface ResetPasswordCardProps {
  email: string;
}

const ResetPasswordCard = ({ email }: ResetPasswordCardProps) => {
  const formSchema = z
    .object({
      email: z.string(),
      otp: z.string(),
      password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
          "Must only contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigator = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.email) {
      toast.error("Invalid email address");
      navigator.push("/signin");
      navigator.refresh();
    }

    if (!values.otp || !values.password) {
      toast.error("Enter required fields.");
      return;
    }

    // we remove confirmPassword from payload here
    const { confirmPassword, ...payload } = values;

    try {
      const response = await api.post("/user/resetpassword/verify", payload);
      console.log("response", response);
      if (response.status === 200) {
        toast.success("Password has been resetted.");
        navigator.push("/signin");
        navigator.refresh();
      }
    } catch (error: any) {
      toast.error("An error occurred while resetting the password.");
    }
  };

  return (
    <>
      <Card className="px-8 py-4 max-w-min min-w-[400px]">
        <CardHeader className="font-bold text-center">
          Change your password
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center items-center">
                  <FormLabel className="mb-2">Enter your OTP</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter new password</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Re-enter your password</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <Button className="mt-2 mx-auto" type="submit">
                Reset password
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default ResetPasswordCard;
