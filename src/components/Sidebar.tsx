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
  LucideIcon,
} from "lucide-react";

import { useState } from "react";

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

interface SidebarItem {
  id: string;
  url?: string;
  title: string;
  icon: LucideIcon;
  type: SidebarItemType;
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

const SidebarPopoverItem: React.FC<SidebarItemProps> = ({ item }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton asChild>
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
      className="w-[--radix-popper-anchor-width] bg-popover cursor-pointer rounded-md"
    >
      {item.subitems?.map((el) => (
        <DropdownMenuItem key={el.id} className="py-3 px-6">
          <span>{el?.title}</span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

// Menu items.
const items: SidebarItem[] = [
  {
    id: "1",
    title: "Workflow",
    url: "",
    icon: Workflow,
    type: "popover",
    subitems: [
      {
        id: "sub1",
        title: "Home",
        url: "/",
        icon: Workflow,
        type: "subitem",
      },
    ],
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
  const session = useSession();

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
              {items.map((item) => (
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
                <SidebarMenuButton>
                  <User2 />
                  {session?.data?.user?.name || session?.data?.user?.email}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] bg-popover cursor-pointer"
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
