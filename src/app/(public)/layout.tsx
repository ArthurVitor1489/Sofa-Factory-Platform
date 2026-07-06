import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      {/* We add top padding to push content below the fixed header */}
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
