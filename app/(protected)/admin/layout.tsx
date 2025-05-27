import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/admin/Navbar";
import { Providers } from "@/components/providers/Providers";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <>
    <Providers>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider defaultOpen={defaultOpen}>
          <AdminSidebar />
          <main className="w-full">
              <Navbar />
              <div className="px-4">{children}</div>
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </Providers>
    </>
  );
}
