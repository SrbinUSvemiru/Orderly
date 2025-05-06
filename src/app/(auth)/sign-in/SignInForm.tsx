"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "@/lib/actions/signIn";
import { LoginSchema } from "@/types/login-schema";

import { PasswordInput } from "../../../components/PasswordInput";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";

export const SignInForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const res = await signIn(values);
    if (res?.success) {
      router.push("/");
    } else {
      toast.error(res?.message);
    }
  };

  useEffect(() => {
    localStorage.removeItem("user-storage");
    localStorage.removeItem("header-storage");
  }, []);

  return (
    <Card className="min-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Log in</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Enter password" {...field} />
                  </FormControl>

                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full mt-8"
            >
              {isSubmitting && <Loader2 className="animate-spin" />}
              Sign in
            </Button>
            <div className="mx-auto  flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400 ">
              or
            </div>

            <Button disabled type="submit" className="w-full">
              Google
            </Button>
            <p className="text-center text-sm ">
              Sign in with google for a demo
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
