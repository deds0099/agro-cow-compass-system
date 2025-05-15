import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  DatabaseIcon, 
  CalendarIcon,
  ChartBarIcon,
  FileText,
  CircleCheck
} from "lucide-react";

export function SidebarNav() {
  const location = useLocation();

  const menuItems = [
    { title: "Página Inicial", url: "/", icon: LayoutDashboard },
    { title: "Cadastro de Animais", url: "/animais", icon: DatabaseIcon },
    { title: "Produção de Leite", url: "/producao", icon: ChartBarIcon },
    { title: "Reprodução", url: "/reproducao", icon: CalendarIcon },
    { title: "Relatórios", url: "/relatorios", icon: FileText },
    { title: "Alertas", url: "/alertas", icon: CircleCheck },
  ];

  return (
    <nav className="space-y-1 p-2">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.url || 
          (item.url !== '/' && location.pathname.startsWith(item.url));
        
        return (
          <NavLink
            key={item.title}
            to={item.url}
            end
            className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-md text-base transition-colors ${
              isActive
                ? "bg-primary text-white font-medium"
                : "text-secondary hover:bg-muted"
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
