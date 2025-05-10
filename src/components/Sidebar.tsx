"use client";

import {
  Building2,
  ChevronDown,
  CirclePlus,
  LayoutDashboardIcon,
  LucideIcon,
  Settings2,
  Store,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useGetWorkflowsQuery from "@/lib/queries/useGetWorkflowsQuery";
import { triggerModal } from "@/lib/triggerModal";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";
import { Workflow as WorkflowType } from "@/types/workflow";

import { NavUser } from "./NavUser";
import SidebarSkeleton from "./skeleton/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { DropdownMenuSeparator } from "./ui/dropdown-menu";

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
  isMobile?: boolean;
  item: SidebarItem;
  state: string;
  onClick: () => void;
}

type SidebarItemType = "popover" | "collapsible" | "subitem" | "default";

const SidebarCollapsibleItem: React.FC<SidebarItemProps> = ({
  item,
  state,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible
      className="group/collapsible"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            asChild
            className="data-[state=open]:bg-sidebar-accent/50 data-[state=open]:text-sidebar-accent-foreground"
          >
            {item.url ? (
              <Link href={item.url} onClick={() => onClick()}>
                {item.icon && (
                  <item.icon
                    className={cn(
                      "!w-3.5 !h-3.5 transition-all",
                      isOpen && "!w-0 !h-0",
                      state === "collapsed" && "!w-4 !h-4"
                    )}
                  />
                )}
                <span className="text-[16px]">{item.title}</span>
              </Link>
            ) : (
              <p className="w-full flex text-[16px]">
                {item.icon && (
                  <item.icon
                    className={cn(
                      "!w-3.5 !h-3.5 transition-all",
                      isOpen && "!w-0 !h-0",
                      state === "collapsed" && "!w-4 !h-4"
                    )}
                  />
                )}
                <span>{item.title}</span>
                <ChevronDown
                  className={cn(
                    "ml-auto transition-transform",
                    isOpen ? "rotate-180" : ""
                  )}
                />
              </p>
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subitems?.map((subitem) => (
              <SidebarMenuSubItem key={subitem.title}>
                <SidebarMenuButton asChild>
                  <Link href={subitem.url || ""} onClick={() => onClick()}>
                    {subitem.icon && <subitem.icon />}
                    <span className="text-[16px]">{subitem.title}</span>
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

const SidebarPopoverItem: React.FC<SidebarItemProps> = ({
  item,
  state,
  isMobile,
  onClick,
}) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            asChild
            className="data-[state=open]:bg-sidebar-accent/50 data-[state=open]:text-sidebar-accent-foreground"
          >
            <p className="w-full flex gap-2">
              {item.icon && (
                <item.icon
                  className={cn(
                    "!w-3.5 !h-3.5 transition-transform",
                    state === "collapsed" ? "!w-4 !h-4" : ""
                  )}
                />
              )}
              <span className="text-[16px]">{item.title || ""}</span>
            </p>
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          asChild
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
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
                  className="py-2 px-2 flex w-full  items-center justify-center cursor-pointer"
                >
                  <span>{item?.actionButton?.label || ""}</span>
                  <item.actionButton.icon className="h-4 w-4" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            )}
            {item.subitems?.length && (
              <div className="flex flex-col overflow-y-auto max-h-[110px]">
                {item.subitems?.map((el) =>
                  el?.url ? (
                    <Link href={el?.url} key={el.id} onClick={() => onClick()}>
                      <DropdownMenuItem key={el.id} className="py-2 px-4">
                        <span className="text-[16px]">{el?.title || ""}</span>
                      </DropdownMenuItem>
                    </Link>
                  ) : (
                    <DropdownMenuItem key={el.id} className="py-2 px-4">
                      <span className="text-[16px]">{el?.title || ""}</span>
                    </DropdownMenuItem>
                  )
                )}
              </div>
            )}
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
  orgType,
}: {
  workflows: WorkflowType[];
  organizationId: string;
  userId: string;
  orgType: string;
}): SidebarItem[] => [
  {
    id: "0",
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboardIcon,
    type: "default",
  },
  {
    id: "1",
    title: "Workflows",
    url: "",
    icon: Workflow,
    type: "popover",
    actionButton: {
      icon: CirclePlus,
      label: "Add",
      onClick: () =>
        triggerModal({
          title: "Create workflow",
          modalType: "workflow",
          organizationId: organizationId,
          userId: userId,
          type: "drawer",
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
  ...(orgType === "enterprise"
    ? [
        {
          id: "2",
          title: "Inventory",
          url: "/inventory",
          icon: Store,
          type: "default" as SidebarItemType,
        },
        {
          id: "3",
          title: "Clients",
          url: "/clients",
          icon: Building2,
          type: "default" as SidebarItemType,
        },
      ]
    : []),
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

  const { state, isMobile, setOpenMobile } = useSidebar();

  const { data: workflows } = useGetWorkflowsQuery();

  const sidebarItems = useMemo(
    () =>
      workflows
        ? getItems({
            orgType: user?.organisation?.type,
            workflows,
            organizationId: user?.organizationId,
            userId: user?.id,
          })
        : [],
    [workflows, user]
  );

  return (
    <Sidebar
      className="position-relative text-accent-foreground/80 pt-4"
      variant="inset"
      collapsible="icon"
    >
      <SidebarHeader className="">
        <NavUser
          name={user?.organisation?.name}
          email={user?.organisation?.type}
          avatar={user?.image || ""}
          isDisabled
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {!sidebarItems?.length ? (
                <SidebarSkeleton />
              ) : (
                sidebarItems?.map((item: SidebarItem) => (
                  <React.Fragment key={item.id}>
                    {item?.type === "collapsible" && state === "expanded" && (
                      <SidebarCollapsibleItem
                        item={item}
                        onClick={() => setOpenMobile(false)}
                        state={state}
                      />
                    )}
                    {item?.type === "popover" ||
                    (state === "collapsed" && item?.type === "collapsible") ? (
                      <SidebarPopoverItem
                        item={item}
                        isMobile={isMobile}
                        onClick={() => setOpenMobile(false)}
                        state={state}
                      />
                    ) : null}
                    {item?.type === "default" && (
                      <Link
                        href={item.url || ""}
                        onClick={() => setOpenMobile(false)}
                      >
                        <SidebarMenuButton className="cursor-pointer flex w-full gap-2">
                          {item.icon && (
                            <item.icon
                              className={cn(
                                "!w-3.5 !h-3.5",
                                state === "collapsed" ? "!w-4 !h-4" : ""
                              )}
                            />
                          )}
                          <span className="text-[16px]">{item.title}</span>
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
        <NavUser
          name={`${user?.firstName} ${user?.lastName}`}
          email={user?.email}
          avatar={user?.image || ""}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
