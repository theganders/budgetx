import * as React from "react";
import { IconWallet, IconSparkles, IconChartBar } from "@tabler/icons-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "BudgetX",
      url: "#",
      items: [
        {
          title: "Expenses",
          url: "/dashboard",
          icon: IconWallet,
        },
        {
          title: "What-If Simulator",
          url: "/dashboard/simulator",
          icon: IconSparkles,
        },
        {
          title: "Stats & Insights",
          url: "/dashboard/stats",
          icon: IconChartBar,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} >
      <SidebarContent >
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title} className="py-0 px-4">
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className="font-medium flex items-center gap-2"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span className="tracking-tight">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
