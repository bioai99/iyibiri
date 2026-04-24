export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const showDevtools =
    process.env.NODE_ENV !== 'production' ||
    process.env.DEV_FIXTURES_ENABLED === '1'

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
        <span className="font-display font-bold">İyiBiri Admin</span>
        <div className="flex items-center gap-5">
          <a href="/admin/missions" className="text-sm text-stone-300 hover:text-white">
            Misyonlar
          </a>
          <a href="/admin/analytics" className="text-sm text-stone-300 hover:text-white">
            Analytics
          </a>
          {showDevtools && (
            <a
              href="/admin/devtools"
              className="text-sm font-medium text-amber-300 hover:text-amber-200"
            >
              🛠 Devtools
            </a>
          )}
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
