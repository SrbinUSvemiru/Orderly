"use client";

import { Button } from "../../ui/button";
import { HeaderData } from "@/stores/headerStore";
import { triggerModal } from "@/lib/triggerModal";

interface WorkflowProps {
  headerData: HeaderData;
}

export const Workflow: React.FC<WorkflowProps> = ({ headerData }) => {
  return (
    <>
      <Button
        onClick={() =>
          triggerModal({
            title: "Add new stage",
            submitButton: { label: "Create" },
            workflowId: headerData.workflowId,
            modalType: "stage",
          })
        }
      >
        Add Stage
      </Button>
    </>
  );
};
