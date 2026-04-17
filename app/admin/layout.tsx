export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
        <span className="font-display font-bold">İyiBiri Admin</span>
        <a href="/admin/missions" className="text-sm text-stone-300 hover:text-white">
          Misyonlar
        </a>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
