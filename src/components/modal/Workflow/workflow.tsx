"use client";

import { Input } from "../../ui/input";
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
import { Button } from "../../ui/button";
import { WorkflowModalData } from "@/stores/modalStore";
import { Loader2 } from "lucide-react";
import addWorkflow from "@/lib/actions/addWorkflow";
import { useCallback } from "react";
import { refetchWorkflows } from "@/lib/queryConnector";

interface WorkflowProps {
  modalData: WorkflowModalData;
  closeModal: () => void;
}

export const Workflow: React.FC<WorkflowProps> = ({
  closeModal,
  modalData,
}) => {
  const [isMutating, setMutating] = useState(false);

  const form = useForm<z.infer<typeof WorkflowSchema>>({
    resolver: zodResolver(WorkflowSchema),
    defaultValues: {
      name: "",
    },
  });

  const nameValue = form.watch("name");

  const handleError = useCallback(
    (errorMessage = "User update failed...") => {
      toast.error(errorMessage);
    },
    [toast]
  );

  const onSubmit = async (values: z.infer<typeof WorkflowSchema>) => {
    setMutating(true);
    const response = await addWorkflow({
      name: values.name,
      organizationId: modalData.organizationId,
      userId: modalData.userId,
      handleError,
    });

    if (response.success) {
      toast.success(response.message);
      refetchWorkflows();
      closeModal();
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
