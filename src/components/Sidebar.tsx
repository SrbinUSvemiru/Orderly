"use client";

import {
  Workflow,
  UserRoundPen,
  Settings,
  ChevronUp,
  LogOut,
  User2,
  ChevronRight,
  ChevronDown,
  CirclePlus,
  LucideIcon,
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
} from "@/components/ui/sidebar";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// import { toast } from "sonner";

// import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import useWorkflows from "@/lib/queries/useWorkflows";
import { Workflow as WorkflowType } from "@/types/workflow";
import Link from "next/link";

import { triggerModal } from "@/lib/triggerModal";

interface SidebarItem {
  id: string;
  url?: string;
  title: string;
  icon: LucideIcon;
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

type SidebarItemType = "popover" | "collapsible" | "subitem";

const SidebarCollapsibleItem: React.FC<SidebarItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible
      className="group/collapsible"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CollapsibleTrigger asChild>
        <SidebarMenuButton asChild className="cursor-pointer">
          {item.url ? (
            <a href={item.url}>
              <item.icon className="h-4 w-4 mr-1" />
              <span>{item.title}</span>
            </a>
          ) : (
            <p className="w-full flex">
              <item.icon className="h-4 w-4 mr-1" />
              <span>{item.title}</span>
              {!isOpen ? (
                <ChevronRight className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-auto" />
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
                <a href={subitem.url}>
                  {subitem.icon && <subitem.icon />}
                  <span>{subitem.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};

const SidebarPopoverItem: React.FC<SidebarItemProps> = ({ item }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton asChild className="cursor-pointer">
          {item.url ? (
            <a href={item.url} className="w-full flex">
              <item.icon className="h-4 w-4 mr-1" />
              <span>{item.title}</span>
            </a>
          ) : (
            <p className="w-full flex">
              <item.icon className="h-4 w-4 mr-1" />
              <span>{item.title}</span>
              <ChevronRight className="h-4 w-4 ml-auto" />
            </p>
          )}
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="right"
        className="w-full py-2 px-1 bg-popover cursor-pointer rounded-md"
      >
        {item?.actionButton && (
          <>
            <DropdownMenuItem
              onClick={() =>
                item.actionButton?.onClick ? item.actionButton?.onClick() : {}
              }
              className="py-2 px-4 flex w-full items-center justify-center"
            >
              <span>{item?.actionButton?.label}</span>
              <item.actionButton.icon className="h-4 w-4 ml-1" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {item.subitems?.map((el) =>
          el?.url ? (
            <Link href={el?.url} key={el.id}>
              <DropdownMenuItem key={el.id} className="py-2 px-4">
                <span>{el?.title}</span>
              </DropdownMenuItem>
            </Link>
          ) : (
            <DropdownMenuItem key={el.id} className="py-2 px-4">
              <span>{el?.title}</span>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Menu items.
const getItems = ({
  workflows,
}: {
  workflows: WorkflowType[];
}): SidebarItem[] => [
  {
    id: "1",
    title: "Workflow",
    url: "",
    icon: Workflow,
    type: "popover",
    actionButton: {
      icon: CirclePlus,
      label: "Add",
      onClick: () =>
        triggerModal({ title: "Create new workflow", modalType: "workflow" }),
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
    title: "Settings",
    url: "",
    icon: Settings,
    type: "collapsible",
    subitems: [
      {
        id: "sub2",
        title: "Account",
        url: "/settings/account",
        icon: UserRoundPen,
        type: "subitem",
      },
    ],
  },
];

const getItem = (item: SidebarItem) => {
  const types: Record<SidebarItemType, JSX.Element> = {
    popover: <SidebarPopoverItem item={item} />,
    collapsible: <SidebarCollapsibleItem item={item} />, // Assuming this exists
    subitem: <div>{/* render subitem if needed */}</div>,
  };

  return types[item.type] || null;
};

export default function AppSidebar() {
  const { data: session, status } = useSession();
  const { workflows } = useWorkflows();

  const sidebarItems = useMemo(
    () => (workflows ? getItems({ workflows }) : []),
    [workflows]
  );

  // const { data, error, isMutating } = useSWR(
  //   ["http://localhost:3000/api/workflow", { method: "GET" }],
  //   fetcher
  // );

  // const addOrg = async () => {
  //   try {
  //     const response = await fetch("/api/organizations", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: "Home",
  //       }),
  //     });

  //     if (response.ok) {
  //       toast.success("Organization added");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  console.log(workflows);
  return (
    <Sidebar className="position-relative">
      <SidebarTrigger className="absolute right-[-30px] top-[18px]" />
      <SidebarHeader className="p-4 flex-row items-center justify-start h-16">
        {/* <Button className="w-full" onClick={addOrg}>
          Add org
        </Button> */}
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems?.map((item: SidebarItem) => (
                <SidebarMenuItem key={item.title}>
                  {getItem(item)}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-full">
                  <div>
                    <User2 />
                  </div>
                  {status === "loading" ? (
                    <Skeleton className="min-w-[90%] min-h-full" />
                  ) : (
                    <div className="flex-col items-start justify-center overflow-hidden">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                              {session?.user?.name}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>{session?.user?.name}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                              {session?.user?.email}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            {session?.user?.email}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-fit p-2 rounded-md bg-popover cursor-pointer"
              >
                <DropdownMenuItem>
                  <SidebarMenuButton
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() =>
                      signOut({
                        redirect: true,
                        callbackUrl: `${window.location.origin}/sign-in`,
                      })
                    }
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
    </Sidebar>
  );
}
