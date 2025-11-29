import { AppSidebar } from "./dashboard-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import DashboardHeader from "./dashboard-header"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>  
    <DashboardHeader />
    <SidebarProvider>

      <AppSidebar className="mt-16 p-0" />
      <SidebarInset className="border border-ds-gray-alpha-400 rounded-xl mt-16! h-[calc(100vh-64px)]">
        {children}
      </SidebarInset>
    </SidebarProvider>
    </>
  )
}