"use client";

import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/types/login-schema";
import { toast } from "sonner";
import {
  Form,
  FormMessage,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from "./ui/form";

import { Input } from "./ui/input";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const SignInForm = () => {
  const router = useRouter();
  const [isMutating, setisMutating] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setisMutating(true);
    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (response?.error) {
      toast.error(response.error);
    } else {
      console.log("Log-in succesfull");
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 text-center bg-sidebar-accent p-8 rounded-2xl"
      >
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
                <Input placeholder="Enter password" {...field} />
              </FormControl>

              <FormMessage className="text-left" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-8">
          {isMutating && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
      </form>
      {/* <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400 ">
        or
      </div>

      <p className="text-center text-sm mt-2">
        If you don&apos;t have an account, please&nbsp;
        <Link  href="/sign-up" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p> */}
    </Form>
  );
};
