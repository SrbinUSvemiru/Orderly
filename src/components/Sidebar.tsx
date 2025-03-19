"use client";

import {
  Calendar,
  Workflow,
  Inbox,
  UserRoundPen,
  Settings,
  ChevronUp,
  LogOut,
  User2,
  ChevronRight,
} from "lucide-react";

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

import { toast } from "sonner";

import { Button } from "./ui/button";
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

// Menu items.
const items = [
  {
    title: "Workflow",
    url: "/",
    icon: Workflow,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },

  {
    title: "Settings",
    url: "",
    icon: Settings,
    subitems: [
      {
        title: "Account",
        url: "/settings/account",
        icon: UserRoundPen,
      },
    ],
  },
];

export default function AppSidebar() {
  const session = useSession();

  const addOrg = async () => {
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Home",
        }),
      });

      if (response.ok) {
        toast.error("success");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Sidebar className="position-relative">
      <SidebarTrigger className="absolute right-[-30px] top-[18px]" />
      <SidebarHeader className="p-4 flex-row items-center justify-start">
        <Button className="w-full" onClick={addOrg}>
          Add org
        </Button>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Collapsible className="group/collapsible data-[open]">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        disabled={!item?.subitems?.length}
                        className="cursor-pointer"
                      >
                        {item.url ? (
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        ) : (
                          <p className="w-full flex">
                            <item.icon />
                            <span>{item.title}</span>
                            <ChevronRight className="h-4 w-4 ml-auto" />
                          </p>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {item.subitems?.length && (
                        <SidebarMenuSub>
                          {item.subitems?.map((subitem) => (
                            <SidebarMenuSubItem key={subitem.title}>
                              <SidebarMenuButton asChild>
                                <a href={subitem.url}>
                                  <subitem.icon />
                                  <span>{subitem.title}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
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
                    asChild
                    variant="outline"
                    className="cursor-pointer"
                  >
                    <a href="/account">
                      <UserRoundPen />
                      <span>Account</span>
                    </a>
                  </SidebarMenuButton>
                </DropdownMenuItem>
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
