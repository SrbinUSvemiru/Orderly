"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/__ui/form";
import addTicket from "@/lib/actions/addTicket";
import { refetchTickets, refetchTicketsCount } from "@/lib/queryConnector";
import { TicketModalData } from "@/stores/modalStore";

import { Button } from "../../__ui/button";
import { Input } from "../../__ui/input";
import { TicketSchema } from "./schema";

interface StageProps {
  modalData: TicketModalData;
  closeModal: () => void;
}

export const Ticket: React.FC<StageProps> = ({
  closeModal,
  modalData: { stageId },
}) => {
  const [isMutating, setMutating] = useState(false);

  const form = useForm<z.infer<typeof TicketSchema>>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      name: "",
    },
  });

  const nameValue = form.watch("name");

  const onSubmit = async (values: z.infer<typeof TicketSchema>) => {
    setMutating(true);

    const response = await addTicket({
      name: values.name,
      stageId: stageId,
      handleError: () => toast.error("Something went wrong"),
    });

    if (response.success) {
      toast.success("Ticket successfully created");
      refetchTickets(stageId);
      refetchTicketsCount(stageId);
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
