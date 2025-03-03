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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Ticket,
  LogOut,
  Briefcase,
} from "lucide-react";

interface MenuItem {
  name: string;
  url: string;
  icon: React.ElementType;
}

const MenuItems: MenuItem[] = [
  { name: "My Assets", url: "/dashboard/my-assets", icon: LayoutDashboard },
  { name: "My Requests", url: "/dashboard/my-requests", icon: Ticket },
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar collapsible="icon" className="max-w-[250px] bg-secondary">
          <SidebarHeader>
            <SidebarLogo />
          </SidebarHeader>
          <SidebarContent className="overflow-x-hidden">
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                My Dashboard
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
                        <Link
                          href={item.url}
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 truncate">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleLogout}
                      className="w-full text-red-500 hover:text-red-600"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span className="flex-1 truncate">Logout</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarCopyright />
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-8">
              <div className="flex flex-1 items-center">
                <h1 className="text-xl font-semibold">SmartAssets</h1>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-8">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
} 