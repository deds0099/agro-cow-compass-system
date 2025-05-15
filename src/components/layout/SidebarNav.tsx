
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  DatabaseIcon, 
  CalendarIcon,
  ChartBarIcon,
  FileText,
  CircleCheck,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

export function SidebarNav() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Cadastro de Animais", url: "/animais", icon: DatabaseIcon },
    { title: "Produção de Leite", url: "/producao", icon: ChartBarIcon },
    { title: "Reprodução", url: "/reproducao", icon: CalendarIcon },
    { title: "Relatórios", url: "/relatorios", icon: FileText },
    { title: "Alertas", url: "/alertas", icon: CircleCheck },
  ];

  // Determine if group should be expanded based on current path
  const isInSection = (path: string) => currentPath.startsWith(path);

  // Get navigation class based on active state
  const getNavClass = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      isActive 
        ? "bg-sidebar-primary text-white font-medium" 
        : "hover:bg-sidebar-accent text-sidebar-foreground"
    }`;
  };

  return (
    <Sidebar
      className={`h-screen border-r ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
      collapsible
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <span className="text-xl font-bold text-farm-primary">FarmGest</span>
        )}
        <SidebarTrigger>
          {collapsed ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </SidebarTrigger>
      </div>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} end className={getNavClass}>
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
