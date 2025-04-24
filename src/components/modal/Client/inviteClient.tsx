"use client";

import { Input } from "../../ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { InviteClient } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Button } from "../../ui/button";
import { ClientModalData } from "@/stores/modalStore";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

interface ClientProps {
  modalData: ClientModalData;
  closeModal: () => void;
}

export const Client: React.FC<ClientProps> = ({ closeModal }) => {
  const [isMutating, setMutating] = useState(false);

  const user = useUserStore((state) => state.user);

  console.log(user);

  const form = useForm<z.infer<typeof InviteClient>>({
    resolver: zodResolver(InviteClient),
    defaultValues: {
      email: "",
    },
  });

  const nameValue = form.watch("email");

  const onSubmit = async (values: z.infer<typeof InviteClient>) => {
    setMutating(true);
    try {
      if (!values?.email) {
        throw new Error("No email provided");
      }

      const response = await fetch(`/api/invite-client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          organizationId: user.organizationId,
        }),
      });

      const res = await response.json();

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.message);
      }

      closeModal();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Something went wrong");
    } finally {
      setMutating(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 text-center"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="example@mail.com" {...field} />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="submit"
            className="flex-1 cursor-pointer"
            disabled={isMutating || !nameValue}
          >
            {isMutating && <Loader2 className="animate-spin" />}
            Invite
          </Button>
          <Button
            disabled={isMutating}
            onClick={closeModal}
            className="flex-1 cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
