import { dbService } from '@/services/dbService';
import LeadsPipeline from '@/components/dashboard/LeadsPipeline';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const leads = await dbService.getLeads();

  return <LeadsPipeline initialLeads={leads} />;
}
