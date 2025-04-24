"use client";

import {
  Workflow,
  ChevronUp,
  LogOut,
  User2,
  ChevronDown,
  CirclePlus,
  LucideIcon,
  Store,
  Building2,
  Settings2,
} from "lucide-react";

import { useMemo, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Tooltip } from "@/components/Tooltip";

import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import { Workflow as WorkflowType } from "@/types/workflow";
import Link from "next/link";

import { triggerModal } from "@/lib/triggerModal";
import { useUserStore } from "@/stores/userStore";
import useGetWorkflowsQuery from "@/lib/queries/useGetWorkflowsQuery";
import SidebarSkeleton from "./skeleton/sidebar";
import React from "react";
import { SERVER_URL } from "@/constants/server";

interface SidebarItem {
  id: string;
  url?: string;
  title: string;
  icon?: LucideIcon;
  type: SidebarItemType;
  actionButton?: {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
  };
  subitems?: SidebarItem[];
}

interface SidebarItemProps {
  item: SidebarItem;
}

type SidebarItemType = "popover" | "collapsible" | "subitem" | "default";

const SidebarCollapsibleItem: React.FC<SidebarItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible
      className="group/collapsible"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton asChild className="cursor-pointer">
            {item.url ? (
              <Link href={item.url}>
                {item.icon && (
                  <item.icon className="h-4 w-4 mr-1 text-accent-foreground/50" />
                )}
                <span>{item.title}</span>
              </Link>
            ) : (
              <p className="w-full flex">
                {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                <span>{item.title}</span>
                {!isOpen ? (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronUp className="h-4 w-4 ml-auto" />
                )}
              </p>
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subitems?.map((subitem) => (
              <SidebarMenuSubItem key={subitem.title}>
                <SidebarMenuButton asChild>
                  <Link href={subitem.url || ""}>
                    {subitem.icon && <subitem.icon />}
                    <span>{subitem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarPopoverItem: React.FC<SidebarItemProps> = ({ item }) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton asChild className="cursor-pointer">
            <p className="w-full flex gap-2">
              {item.icon && (
                <item.icon className="h-4 w-4 mr-1 text-accent-foreground/80" />
              )}
              <span>{item.title || ""}</span>
            </p>
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="right"
          asChild
          className="w-[--radix-popper-anchor-width]"
        >
          <div>
            {item?.actionButton && (
              <div>
                <DropdownMenuItem
                  onClick={() =>
                    item.actionButton?.onClick
                      ? item.actionButton?.onClick()
                      : {}
                  }
                  className="py-2 px-2 flex w-full items-center justify-center cursor-pointer"
                >
                  <span>{item?.actionButton?.label || ""}</span>
                  <item.actionButton.icon className="h-4 w-4" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            )}

            <div className="flex flex-col overflow-y-auto max-h-[110px]">
              {item.subitems?.map((el) =>
                el?.url ? (
                  <Link href={el?.url} key={el.id}>
                    <DropdownMenuItem key={el.id} className="py-2 px-4">
                      <span>{el?.title || ""}</span>
                    </DropdownMenuItem>
                  </Link>
                ) : (
                  <DropdownMenuItem key={el.id} className="py-2 px-4">
                    <span>{el?.title || ""}</span>
                  </DropdownMenuItem>
                )
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

const getItems = ({
  workflows,
  organizationId,
  userId,
}: {
  workflows: WorkflowType[];
  organizationId: string;
  userId: string;
}): SidebarItem[] => [
  {
    id: "1",
    title: "Dashboards",
    url: "",
    icon: Workflow,
    type: "popover",
    actionButton: {
      icon: CirclePlus,
      label: "Add",
      onClick: () =>
        triggerModal({
          title: "Create new workflow",
          modalType: "workflow",
          organizationId: organizationId,
          userId: userId,
        }),
    },
    subitems: !workflows?.length
      ? []
      : workflows?.map((el: WorkflowType) => ({
          id: el.id,
          title: el?.name,
          url: `/workflow/${el.id}`,
          icon: Workflow,
          type: "subitem",
        })),
  },
  {
    id: "2",
    title: "Inventory",
    url: "/inventory",
    icon: Store,
    type: "default",
  },
  {
    id: "3",
    title: "Clients",
    url: "/clients",
    icon: Building2,
    type: "default",
  },
  {
    id: "4",
    title: "Settings",
    url: "",
    icon: Settings2,
    type: "collapsible",
    subitems: [
      {
        id: "sub1",
        title: "General",
        url: "/settings/general",
        type: "subitem",
      },
      {
        id: "sub2",
        title: "Account",
        url: "/settings/account",
        type: "subitem",
      },
    ],
  },
];

export default function AppSidebar() {
  const user = useUserStore((state) => state.user);
  const { state } = useSidebar();

  const { data: workflows } = useGetWorkflowsQuery();

  const sidebarItems = useMemo(
    () =>
      workflows
        ? getItems({
            workflows,
            organizationId: user?.organizationId,
            userId: user?.id,
          })
        : [],
    [workflows, user]
  );

  return (
    <Sidebar
      className="position-relative text-accent-foreground/80"
      variant="inset"
      collapsible="icon"
    >
      <SidebarTrigger className="absolute right-[-36px] top-[30px]" />

      <>
        <SidebarHeader className="p-3 flex-row items-center justify-start h-14">
          {/* <Button className="w-full" onClick={addOrg}>
          Add org.
        </Button> */}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="py-4">
            <SidebarGroupContent>
              <SidebarMenu>
                {!sidebarItems?.length ? (
                  <SidebarSkeleton />
                ) : (
                  sidebarItems?.map((item: SidebarItem) => (
                    <React.Fragment key={item.id}>
                      {item?.type === "collapsible" && state === "expanded" && (
                        <SidebarCollapsibleItem item={item} />
                      )}
                      {item?.type === "popover" ||
                      (state === "collapsed" &&
                        item?.type === "collapsible") ? (
                        <SidebarPopoverItem item={item} />
                      ) : null}
                      {item?.type === "default" && (
                        <Link href={item.url || ""}>
                          <SidebarMenuButton className="cursor-pointer flex w-full gap-2">
                            {item.icon && (
                              <item.icon className="h-4 w-4 mr-1" />
                            )}
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </Link>
                      )}
                    </React.Fragment>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-full cursor-pointer">
                    <User2 />
                    {!user?.id ? (
                      <Skeleton className="min-w-[90%] min-h-full" />
                    ) : (
                      <Tooltip
                        delayDuration={1000}
                        text={[
                          user?.lastName
                            ? `${user?.firstName} ${user?.lastName}`
                            : user?.firstName || "",
                          user?.email,
                        ]}
                      >
                        <div className="flex-col items-start justify-center overflow-hidden">
                          <p className="overflow-hidden truncate">
                            {user?.lastName
                              ? `${user?.firstName} ${user?.lastName}`
                              : user?.firstName || ""}
                          </p>

                          <p className="overflow-hidden truncate">
                            {user?.email}
                          </p>
                        </div>
                      </Tooltip>
                    )}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" asChild>
                  <DropdownMenuItem>
                    <SidebarMenuButton
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        localStorage.clear();
                        signOut({
                          redirect: true,
                          callbackUrl: `${SERVER_URL}/sign-in`,
                        });
                      }}
                    >
                      <LogOut />
                      <span> Sign out</span>
                    </SidebarMenuButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </>
    </Sidebar>
  );
}
