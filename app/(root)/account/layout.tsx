import { SidebarAccount } from "@/components/SidebarAccount"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-64 flex-shrink-0">
              <SidebarAccount />
            </div>
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}