"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { TicketSchema } from "@/components/modal/Ticket/schema";
import { Button } from "@/components/__ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/__ui/form";
import { Input } from "@/components/__ui/input";
import addTicket from "@/lib/actions/addTicket";
import useGetWorkflowsQuery from "@/lib/queries/useGetWorkflowsQuery";
import { refetchTickets, refetchTicketsCount } from "@/lib/queryConnector";
import { triggerHeader } from "@/lib/triggerHeader";

function Ticket({ params }: { params: Promise<{ workflowId: string }> }) {
  const [isMutating, setMutating] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();
  const stageId = searchParams.get("stageId");

  const { workflowId } = use(params);
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
    if (!stageId) return;
    const response = await addTicket({
      name: values.name,
      stageId: stageId,
      handleError: (error) => toast.error(error),
    });

    if (response?.success) {
      toast.success("Ticket successfully created");
      refetchTickets(stageId);
      refetchTicketsCount(stageId);
      router.push("/workflow/" + workflowId);
    }
    setMutating(false);
  };

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
          label: "Create Ticket",
          url: "",
        },
      ],
      action: async () => {},
    });
  }, [workflowId, workflows]);

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
