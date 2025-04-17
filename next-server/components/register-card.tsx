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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { H3 } from "@/components/ui/typography";
import { api } from "@/api/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterCard = () => {
  const formSchema = z.object({
    email: z
      .string()
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Enter a valid email address."
      ),
    username: z
      .string()
      .regex(/^[a-zA-Z0-9]{3,}$/, "Must only contains characters and numbers."),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
        "Must only contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const navigator = useRouter();

  const [registerButtonLoading, setRegisterButtonLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.email || !values.username || !values.password) {
      toast.error("Enter required fields.");
      return;
    }

    setRegisterButtonLoading(true);

    try {
      const response = await api.post("/auth/register", values);
      if (response.status === 200) {
        toast.info(response.data.message);
      }
      navigator.push(`/signin/${response.data.uniqueId}`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while registering.");
    } finally {
      setRegisterButtonLoading(false);
    }
  };

  return (
    <>
      <Card className="px-8 py-4 max-w-min min-w-[350px]">
        <CardTitle className="text-center">
          <H3>Register</H3>
        </CardTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 justify-items-center"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={registerButtonLoading}
              className="mx-auto mt-4"
              type="submit"
            >
              Register
            </Button>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default RegisterCard;
