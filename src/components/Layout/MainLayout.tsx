
import { ReactNode } from "react";
import { Navbar } from "@/components/Navigation/Navbar";
import { CustomSidebar } from "@/components/UI/CustomSidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

export const MainLayout = ({ 
  children, 
  pageTitle = "Dashboard", 
  pageDescription = "Welcome back! Here's what's happening with your tests."
}: MainLayoutProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden w-full bg-gradient-to-br from-background to-background/80">
      <CustomSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleSidebar}
                className="md:hidden rounded-full bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10 hover:text-primary"
                data-testid="sidebar-toggle"
              >
                <PanelLeft className="h-4 w-4" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gradient">{pageTitle}</h1>
                <p className="text-muted-foreground">
                  {pageDescription}
                </p>
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};
