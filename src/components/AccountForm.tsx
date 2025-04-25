"use client";

import { Button } from "./ui/button";
import { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { AccountSchema } from "@/types/account-schema";
import { toast } from "sonner";
import {
  Form,
  FormMessage,
  FormLabel,
  FormControl,
  FormField,
} from "./ui/form";

import { Input } from "./ui/input";

import { Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import updateUser from "../lib/actions/updateUser";
import AccountFormSkeleton from "./skeleton/accountForm";
import { triggerHeader } from "@/lib/triggerHeader";
import { FormGrid, FormGridItem, GridItem } from "./Grid/Grid";

export const AccountForm = () => {
  const [isMutating, setisMutating] = useState(false);

  const user = useUserStore((state) => state.user);
  const updateStoreUser = useUserStore((state) => state.update);

  const form = useForm<z.infer<typeof AccountSchema>>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      email: user.email,
      phone: user.phone,
      lastName: user.lastName || "",
      firstName: user.firstName,
    },
  });

  const handleError = useCallback((errorMessage = "User update failed...") => {
    toast.error(errorMessage);
  }, []);

  const onSubmit = async (values: z.infer<typeof AccountSchema>) => {
    setisMutating(true);
    const response = await updateUser(
      user.id,
      {
        email: values.email,
        phone: values.phone,
        lastName: values.lastName || "",
        firstName: values.firstName,
      },
      handleError
    );

    if (response?.success) {
      toast.success("Account successfully updated!");
      updateStoreUser({
        ...user,
        email: values.email,
        phone: values.phone,
        lastName: values.lastName || "",
        firstName: values.firstName,
      });
    }
    setisMutating(false);
  };

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email || "",
        phone: user.phone || "",
        lastName: user.lastName || "",
        firstName: user.firstName || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, form.reset]);

  useLayoutEffect(() => {
    triggerHeader({
      title: "Settings",
      type: "default",
      breadcrumb: [
        {
          id: "settings",
          label: "Settings",
          url: "",
        },
        {
          id: "account",
          label: "Account",
          url: "",
        },
      ],
      action: async () => {},
    });
  }, []);

  if (!user?.id) {
    return <AccountFormSkeleton />;
  }

  console.log("user", user);

  return (
    <Form {...form}>
      <FormGrid
        columns={12}
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("❌ Validation errors:", errors);
        })}
        className="text-center"
        gap={4}
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormGridItem sm={6} md={12} lg={4}>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage className="text-left" />
            </FormGridItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormGridItem sm={6} md={12} lg={4}>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Smith" {...field} />
              </FormControl>
            </FormGridItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormGridItem sm={6} md={12} lg={4}>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled placeholder="example@mail.com" {...field} />
              </FormControl>
              <FormMessage className="text-left" />
            </FormGridItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormGridItem sm={6} md={12} lg={4}>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+12345678" {...field} />
              </FormControl>
              <FormMessage className="text-left" />
            </FormGridItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormGridItem sm={6} >
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} />
              </FormControl>

              <FormMessage className="text-left" />
            </FormGridItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormGridItem sm={6} >
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input placeholder="Re-enter password" {...field} />
              </FormControl>

              <FormMessage className="text-left" />
            </FormGridItem>
          )}
        /> */}
        <GridItem sm={12}>
          <Button
            type="submit"
            disabled={isMutating}
            className=" mt-9 bg-green-700 cursor-pointer   hover:bg-green-800"
          >
            {isMutating && <Loader2 className="animate-spin" />}
            Save
          </Button>
        </GridItem>
      </FormGrid>
    </Form>
  );
};
