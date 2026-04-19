import { ThemeProvider } from "@/lib/theme";
import { BottomNav } from "@/components/bottom-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider initial="dark">
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
        <BottomNav />
      </div>
    </ThemeProvider>
  );
}
