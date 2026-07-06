import { dbService } from '@/services/dbService';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

export const dynamic = 'force-dynamic'; // Prevent static generation as it displays real-time data

export default async function AdminPage() {
  // Fetch lists
  const leads = await dbService.getLeads();
  const products = await dbService.getProducts();
  const logs = await dbService.getAuditLogs();

  return (
    <AdminDashboard
      initialLeads={leads}
      initialProducts={products}
      initialLogs={logs}
    />
  );
}
