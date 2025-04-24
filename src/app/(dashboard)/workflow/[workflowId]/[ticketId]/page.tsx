"use client";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { use, useEffect, useLayoutEffect, useState } from "react";
import { TicketSchema } from "@/components/modal/Ticket/schema";
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
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import addTicket from "@/lib/actions/addTicket";
import { refetchTickets, refetchTicketsCount } from "@/lib/queryConnector";

import { triggerHeader } from "@/lib/triggerHeader";
import useGetWorkflowsQuery from "@/lib/queries/useGetWorkflowsQuery";
import { useRouter } from "next/navigation";
import useGetTicketQuery from "@/lib/queries/useGetTicketQuery";

function Ticket({
  params,
}: {
  params: Promise<{ workflowId: string; ticketId: string }>;
}) {
  const [isMutating, setMutating] = useState(false);

  const router = useRouter();
  const { workflowId, ticketId } = use(params);

  const { data: ticket } = useGetTicketQuery(ticketId, { enabled: !!ticketId });
  console.log(ticket);

  const workflows = useGetWorkflowsQuery();

  const form = useForm<z.infer<typeof TicketSchema>>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      name: "",
    },
  });

  const nameValue = form.watch("name");

  const onSubmit = async (values: z.infer<typeof TicketSchema>) => {
    setMutating(true);
    if (!ticketId) return;
    const response = await addTicket({
      name: values.name,
      stageId: ticketId,
      handleError: () => toast.error("Something went wrong"),
    });

    if (response.success) {
      toast.success("Ticket successfully created");
      refetchTickets(ticketId);
      refetchTicketsCount(ticketId);
      router.push("/workflow/" + workflowId);
    }
  };

  useEffect(() => {
    if (ticket?.ticket) {
      form.reset({
        name: ticket?.ticket?.name || "",
      });
    }
  }, [ticket, form.reset]);

  useLayoutEffect(() => {
    const currentWorkflow = workflows?.data?.find((el) => el.id === workflowId);
    if (!currentWorkflow) return;
    triggerHeader({
      title: "Workflows",
      type: "ticket",
      workflowId: `${workflowId}`,
      breadcrumb: [
        {
          id: "dashboard",
          label: "Dashboard",
          url: "",
        },
        {
          id: workflowId,
          label: currentWorkflow?.name || "",
          url: "/workflow/" + workflowId,
        },
        {
          id: "ticket",
          label: ticket?.ticket?.name || "Create ticket",
          url: "",
        },
      ],
      action: async () => {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowId, workflows, ticket]);

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
          <Button disabled={isMutating} className="flex-1 cursor-pointer">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default Ticket;
