
import { PropsWithChildren } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNav } from "./SidebarNav";
import { Header } from "./Header";

export function Layout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <SidebarNav />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
