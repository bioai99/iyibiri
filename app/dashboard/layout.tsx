import { ThemeProvider } from "@/lib/theme";
import { BottomNav } from "@/components/bottom-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider initial="dark">
      <div className="min-h-screen">
        <div className="pb-20">
          {children}
        </div>
        <BottomNav />
      </div>
    </ThemeProvider>
  );
}
