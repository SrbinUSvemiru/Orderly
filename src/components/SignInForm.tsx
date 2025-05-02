"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { signIn } from "@/lib/actions/signIn";
import { LoginSchema } from "@/types/login-schema";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export const SignInForm = () => {
  const [isMutating, setisMutating] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setisMutating(true);

    const res = await signIn(values);
    if (res?.success) {
      router.push("/");
    } else {
      toast.error(res?.message);
    }
    setisMutating(false);
  };

  useEffect(() => {
    localStorage.removeItem("user-storage");
    localStorage.removeItem("header-storage");
  }, []);

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
