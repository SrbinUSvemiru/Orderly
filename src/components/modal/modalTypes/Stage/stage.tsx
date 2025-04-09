"use client";

import { Input } from "../../../ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { StageSchema } from "./schema";
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
import { StageModalData } from "@/stores/modalStore";
import { Loader2 } from "lucide-react";

interface StageProps {
  modalData: StageModalData;
  closeModal: () => void;
}

export const Stage: React.FC<StageProps> = ({
  closeModal,
  modalData: { action, workflowId },
}) => {
  const [isMutating, setMutating] = useState(false);

  const form = useForm<z.infer<typeof StageSchema>>({
    resolver: zodResolver(StageSchema),
    defaultValues: {
      name: "",
    },
  });

  const nameValue = form.watch("name");

  const onSubmit = async (values: z.infer<typeof StageSchema>) => {
    setMutating(true);
    try {
      const response = await fetch("/api/stages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          workflowId: workflowId,
        }),
      });

      if (response.ok) {
        toast.success("Stage successfully created");
        action?.();
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
