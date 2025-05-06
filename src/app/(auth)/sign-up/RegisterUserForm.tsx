"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FormGrid, FormGridItem, GridItem } from "@/components/Grid/Grid";
import { Card, CardContent } from "@/components/ui/card";
import { signUpUser } from "@/lib/actions/signUp";
import { getDataFromUnixTimestamp } from "@/lib/date";
import { RegisterPayload } from "@/lib/encryption";
import { AccountSchema } from "@/types/register-schema";

import { PasswordInput } from "../../../components/PasswordInput";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";

export const RegisterUserForm = ({
  token,
}: {
  token: RegisterPayload | null;
}) => {
  const router = useRouter();

  const [isMutating, setisMutating] = useState(false);
  const organisationId = token?.organizationId;

  const accountForm = useForm<z.infer<typeof AccountSchema>>({
    resolver: zodResolver(AccountSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      lastName: "",
      firstName: "",
    },
  });

  const {
    formState: { isValid },
  } = accountForm;

  const onSubmit = async (values: z.infer<typeof AccountSchema>) => {
    if (!isValid) return;
    setisMutating(true);

    const res = await signUpUser({ ...values, organisationId });

    if (res?.success) {
      toast.success(res?.message);
      setisMutating(false);
      router.push("/sign-in");
    } else {
      setisMutating(false);
      toast.error(res?.message);
    }
  };

  useEffect(() => {
    if (token) {
      accountForm.reset({
        email: token?.email || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex flex-col space-y-4 w-[420px]">
      <p className="text-2xl font-bold ml-2.5">Register</p>
      <Card>
        <CardContent>
          <Form {...accountForm}>
            <FormGrid
              columns={12}
              className="text-center"
              onSubmit={accountForm.handleSubmit(onSubmit)}
            >
              <FormField
                control={accountForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormGridItem sm={12}>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormGridItem>
                )}
              />
              <FormField
                control={accountForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormGridItem sm={12}>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Smith" {...field} />
                    </FormControl>
                  </FormGridItem>
                )}
              />
              <FormField
                control={accountForm.control}
                name="email"
                render={({ field }) => (
                  <FormGridItem sm={12}>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="example@mail.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-left" />
                  </FormGridItem>
                )}
              />
              <FormField
                control={accountForm.control}
                name="password"
                render={({ field }) => (
                  <FormGridItem sm={12}>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="password" {...field} />
                    </FormControl>

                    <FormMessage className="text-left" />
                  </FormGridItem>
                )}
              />
              <FormField
                control={accountForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormGridItem sm={12}>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Re-enter password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-left" />
                  </FormGridItem>
                )}
              />
              <GridItem sm={12}>
                <Button
                  type="submit"
                  disabled={!isValid || isMutating}
                  className="w-full mt-4"
                >
                  {!organisationId ? "Next" : "Register"}
                </Button>
              </GridItem>
            </FormGrid>
          </Form>
        </CardContent>
      </Card>
      {token?.exp ? (
        <p className="text-lg font-bold w-full ">
          Invitation will expire:
          <span className="font-normal dark:text-teal-300 text-teal-600 ml-3.5">
            {getDataFromUnixTimestamp(token?.exp * 1000, "FF")}
          </span>
        </p>
      ) : null}
    </div>
  );
};
