import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/layouts/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If there is no session (e.g. on the /admin/login page), render children directly without dashboard shell
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-screen bg-stone-100 overflow-hidden font-sans">
      {/* Sidebar Panel */}
      <AdminSidebar session={session} />
      
      {/* Dynamic Content Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
