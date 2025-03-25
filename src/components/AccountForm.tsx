"use client";

import { Button } from "./ui/button";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { AccountSchema } from "@/types/account-schema";
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

import { Loader2 } from "lucide-react";
import { User } from "@/types/user";
import { updateUser } from "@/lib/updateUser";

export const AccountForm = ({ user }: { user: User }) => {
  const [isMutating, setisMutating] = useState(false);

  const form = useForm<z.infer<typeof AccountSchema>>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      email: user.email,
      phone: user.phone,
      lastName: user.lastName || "",
      firstName: user.firstName,
    },
  });

  const onSubmit = async (values: z.infer<typeof AccountSchema>) => {
    setisMutating(true);
    const response = await updateUser(user.id, {
      email: values.email,
      phone: values.phone,
      lastName: values.lastName || "",
      firstName: values.firstName,
    });
    if (response?.error) {
      toast.error(response.error);
    } else {
      toast.success("Account successfully updated!");
    }
    setisMutating(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("❌ Validation errors:", errors);
        })}
        className="space-y-6 text-center"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Smith" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          disabled={true}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@mail.com" {...field} />
              </FormControl>

              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+12345678" {...field} />
              </FormControl>

              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} />
              </FormControl>

              <FormMessage className="text-left" />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input placeholder="Re-enter password" {...field} />
              </FormControl>

              <FormMessage className="text-left" />
            </FormItem>
          )}
        /> */}
        <Button
          type="submit"
          disabled={isMutating}
          className="w-full bg-green-700 cursor-pointer"
        >
          {isMutating && <Loader2 className="animate-spin" />}
          Save
        </Button>
      </form>
    </Form>
  );
};
