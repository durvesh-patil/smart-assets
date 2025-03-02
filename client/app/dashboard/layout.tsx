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
  
  const isActive = (url: string) => pathname.startsWith(url);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex w-full">
        <Sidebar collapsible="icon" className="max-w-[250px] bg-secondary">
          <SidebarHeader>
            <SidebarLogo />
          </SidebarHeader>
          <SidebarContent className="overflow-x-hidden">
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
                        className="w-full"
                      >
                        <Link href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 truncate">{item.name}</span>
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
        <div className="flex w-full flex-1 flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-8">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">
                {MenuItems.find(item => isActive(item.url))?.name || "Dashboard"}
              </h1>
            </div>
          </header>
          
          <main className="flex-1">
            <div className="flex-1 p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
