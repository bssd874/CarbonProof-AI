import type { ReactNode } from "react";
import { Header, type HeaderProps } from "@/components/header";
import { Sidebar, type SidebarItem } from "@/components/sidebar";

export interface AppShellProps {
  children: ReactNode;
  navigation: SidebarItem[];
  header: HeaderProps;
  brand?: ReactNode;
  sidebarFooter?: ReactNode;
  contentClassName?: string;
}

export function AppShell({ children, navigation, header, brand, sidebarFooter, contentClassName = "" }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <Sidebar items={navigation} brand={brand} footer={sidebarFooter} />
      <div className="min-w-0">
        <Header {...header} />
        <main className={`px-5 py-7 sm:px-8 lg:py-9 ${contentClassName}`}>{children}</main>
      </div>
    </div>
  );
}
