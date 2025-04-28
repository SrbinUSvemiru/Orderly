"use client";

import { CirclePlus } from "lucide-react";

import { triggerModal } from "@/lib/triggerModal";
import { WorkflowHeaderData } from "@/stores/headerStore";

import { Button } from "../__ui/button";

interface WorkflowProps {
  headerData: WorkflowHeaderData;
}

export const Workflow: React.FC<WorkflowProps> = ({ headerData }) => {
  return (
    <>
      <Button
        className="p-0"
        onClick={() =>
          triggerModal({
            title: "Add new stage",
            submitButton: { label: "Create" },
            workflowId: headerData.workflowId ? headerData.workflowId : "",
            modalType: "stage",
            action: () => (headerData.action ? headerData.action() : {}),
          })
        }
      >
        <span className="hidden md:block">Add Stage</span>
        <CirclePlus className="h-3 w-3" />
      </Button>
    </>
  );
};
