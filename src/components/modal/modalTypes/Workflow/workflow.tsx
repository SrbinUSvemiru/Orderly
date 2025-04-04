"use client";
import { useSWRConfig } from "swr";

import { Input } from "../../../ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { WorkflowSchema } from "./schema";
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
import { Button } from "../../../ui/button";
import { WorkflowModalData } from "@/stores/modalStore";
import { Loader2 } from "lucide-react";

interface WorkflowProps {
  modalData: WorkflowModalData;
  closeModal: () => void;
}

export const Workflow: React.FC<WorkflowProps> = ({
  closeModal,
  modalData,
}) => {
  const [isMutating, setMutating] = useState(false);
  const { mutate } = useSWRConfig();

  const form = useForm<z.infer<typeof WorkflowSchema>>({
    resolver: zodResolver(WorkflowSchema),
    defaultValues: {
      name: "",
    },
  });

  const nameValue = form.watch("name");

  const onSubmit = async (values: z.infer<typeof WorkflowSchema>) => {
    setMutating(true);
    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          organizationId: modalData.organizationId,
          userId: modalData.userId,
        }),
      });

      if (response.ok) {
        toast.success("Workflow successfully created");
        mutate("/api/workflows");
        closeModal();
      }
    } catch {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Example name" {...field} />
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
            Create
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
