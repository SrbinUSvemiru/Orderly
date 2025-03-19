"use client";

import {
  Calendar,
  Workflow,
  Inbox,
  UserRoundPen,
  Settings,
  ChevronUp,
  User2,
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
} from "@/components/ui/sidebar";

import { toast } from "sonner";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Avatar from "./Avatar";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

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
    title: "Account",
    url: "/account",
    icon: UserRoundPen,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
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
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
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
                  <Button asChild variant="outline" className="cursor-pointer">
                    <a href="/account">
                      <UserRoundPen />
                      <span>Account</span>
                    </a>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() =>
                      signOut({
                        redirect: true,
                        callbackUrl: `${window.location.origin}/sign-in`,
                      })
                    }
                  >
                    Sign out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
