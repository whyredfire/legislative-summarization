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
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { H3, MutedText } from "@/components/ui/typography";
import Link from "next/link";
import { api } from "@/api/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginCard = () => {
  const navigator = useRouter();

  const formSchema = z.object({
    email: z.string(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.email || !values.password) {
      toast.error("Enter required fields.");
      return;
    }

    try {
      const response = await api.post("/auth/login", values);
      console.log(response);
      if (response.status === 200) {
        toast.success("Logged in successfully");
        navigator.push("/summarize");
        navigator.refresh();
      }
      if (response.status == 400) {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while logging in.");
    }
  };

  return (
    <>
      <Card className="px-8 py-4">
        <CardTitle className="text-center">
          <H3>Login</H3>
        </CardTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 justify-items-center"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <Button variant={"link"}>
                <MutedText>
                  <Link href={"#!"}>Forgot your password?</Link>
                </MutedText>
              </Button>
              <Button className="mt-2 mx-auto" type="submit">
                Login
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default LoginCard;
