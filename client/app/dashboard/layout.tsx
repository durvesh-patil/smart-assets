"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, Users, Briefcase } from "lucide-react";

interface MenuItem {
  name: string;
  url: string;
  icon: React.ElementType;
}

const MenuItems: MenuItem[] = [
  { name: "Assets", url: "/dashboard/assets", icon: LayoutDashboard },
  { name: "Templates", url: "/dashboard/templates", icon: FileText },
  { name: "Employees", url: "/dashboard/employees", icon: Users },
];

function SidebarLogo() {
  const { state } = useSidebar();
  
  return (
    <div className="flex items-center p-4">
      <Briefcase className="h-6 w-6 mr-2" />
      {state === "expanded" && (
        <h2 className="text-xl font-bold">SmartAssets</h2>
      )}
    </div>
  );
}

function SidebarCopyright() {
  const { state } = useSidebar();
  
  return (
    <div className="p-4 text-sm text-muted-foreground">
      {state === "expanded" && "© 2024 SmartAssets"}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Function to determine if a menu item is active
  const isActive = (url: string) => {
    return pathname.startsWith(url);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarLogo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {MenuItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                      >
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarCopyright />
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
            <SidebarTrigger className="mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              {MenuItems.find(item => isActive(item.url))?.name || "Dashboard"}
            </h1>
            <div className="border-t pt-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
