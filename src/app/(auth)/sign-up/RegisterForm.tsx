"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { upperFirst } from "lodash";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signUp } from "@/lib/actions/signUp";
import { getDataFromUnixTimestamp } from "@/lib/date";
import { RegisterPayload } from "@/lib/encryption";
import { cn } from "@/lib/utils";
import { AccountSchema, CompanySchema } from "@/types/register-schema";

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

export const RegisterForm = ({ token }: { token: RegisterPayload | null }) => {
  const router = useRouter();
  const [step, setStep] = useState<"account" | "company">("account");
  const [isMutating, setisMutating] = useState(false);

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

  const companyForm = useForm<z.infer<typeof CompanySchema>>({
    resolver: zodResolver(CompanySchema),
    mode: "onChange",
    defaultValues: {
      companyName: "",
    },
  });

  const {
    formState: { isValid },
  } = accountForm;

  const {
    formState: { isValid: isCompanyValid },
  } = companyForm;

  const onSubmit = async () => {
    const values = { ...accountForm.getValues(), ...companyForm.getValues() };
    if (!isCompanyValid && !isValid) return;
    setisMutating(true);
    const res = await signUp(values);

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
    <div className="flex flex-col space-y-4">
      <Card>
        <CardHeader className="relative flex-row justify-center items-center">
          <CardTitle
            className={cn(
              "cursor-pointer",
              step === "account" &&
                "font-bold text-accent-foreground cursor-default"
            )}
            onClick={() => (step === "company" ? setStep("account") : {})}
          >
            {upperFirst("account")}
          </CardTitle>
          <Separator
            orientation="horizontal"
            className={cn(
              "max-w-[50px] mx-1.5 !h-0.5 bg-accent-foreground/50",
              isValid && "bg-accent-foreground"
            )}
          />
          <CardTitle
            className={cn(
              "text-accent-foreground/50",
              step === "company" && "font-bold text-accent-foreground"
            )}
          >
            {upperFirst("company")}
          </CardTitle>
        </CardHeader>
        <Separator orientation="horizontal" />
        <CardContent>
          {step === "account" && (
            <Form {...accountForm}>
              <form className="space-y-4 text-center min-w-[390px] min-h-[420px]">
                <FormField
                  control={accountForm.control}
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
                  control={accountForm.control}
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
                  control={accountForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="example@mail.com"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="password" {...field} />
                      </FormControl>

                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Re-enter password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={() => setStep("company")}
                  disabled={!isValid}
                  className="w-full mt-4"
                >
                  Next
                </Button>
              </form>
            </Form>
          )}
          {step === "company" && (
            <Form {...companyForm}>
              <form className="space-y-4 text-center min-w-[390px] min-h-[420px]">
                <FormField
                  control={companyForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Example LTD" {...field} />
                      </FormControl>
                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  disabled={!isCompanyValid || !isValid}
                  className="w-full mt-4"
                  onClick={onSubmit}
                >
                  {isMutating && <Loader2 className="animate-spin" />}
                  Register
                </Button>
              </form>
            </Form>
          )}
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
