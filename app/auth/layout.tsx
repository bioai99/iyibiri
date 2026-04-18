import { ThemeProvider } from '@/lib/theme'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider initial="dark">{children}</ThemeProvider>
}
