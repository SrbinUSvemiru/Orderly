"use client";

import { Button } from "../../ui/button";
import { WorkflowHeaderData } from "@/stores/headerStore";
import { triggerModal } from "@/lib/triggerModal";

interface WorkflowProps {
  headerData: WorkflowHeaderData;
}

export const Workflow: React.FC<WorkflowProps> = ({ headerData }) => {
  return (
    <>
      <Button
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
        Add Stage
      </Button>
    </>
  );
};
