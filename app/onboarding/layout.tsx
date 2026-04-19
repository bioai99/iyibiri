import { ThemeProvider } from '@/lib/theme'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider initial="light">{children}</ThemeProvider>
}
