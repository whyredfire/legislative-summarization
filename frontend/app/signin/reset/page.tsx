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
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H3 } from "@/components/ui/typography";

import { api } from "@/api/api";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const navigator = useRouter();

  const formSchema = z.object({
    email: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.email) {
      toast.error("Enter email address.");
      return;
    }

    const encodedEmail = btoa(values.email);

    try {
      const response = await api.post("/user/password/forget", values);
      if (response.status === 200) {
        toast.success("OTP sent successfully.");
        navigator.push(`/signin/reset/${encodedEmail}`);
        navigator.refresh();
      } else if (response.status === 404) {
        toast.error("Email address not found.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while resetting password.");
    }
  };

  return (
    <>
      <Card className="px-8 py-4">
        <CardTitle className="text-center">
          <H3>Forgot your password?</H3>
        </CardTitle>
        <CardDescription>
          We will send you a link to reset your password to your email
        </CardDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
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

export default ResetPassword;
