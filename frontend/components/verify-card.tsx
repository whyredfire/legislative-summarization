"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { api } from "@/api/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const VerifyCard = ({ uniqueId }: { uniqueId: string }) => {
  const formSchema = z.object({
    uniqueId: z.string(),
    otp: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uniqueId: uniqueId,
      otp: "",
    },
  });

  const navigator = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    api.post("/auth/register/verify", values).then((res) => {
      if (res.status === 200) {
        toast.success("OTP verified");
        navigator.push("/signin");
      }
    });
  }

  return (
    <>
      <Card className="p-4">
        <CardTitle className="text-center">Verify OTP</CardTitle>
        <CardDescription className="text-center">
          Check your email for the OTP code.
        </CardDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
            <div className="flex flex-col">
              <Button className="mx-auto mt-4" type="submit">
                Verify
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default VerifyCard;
