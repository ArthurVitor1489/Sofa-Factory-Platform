import { dbService } from '@/services/dbService';
import { History, User, Globe, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLogsPage() {
  const logs = await dbService.getAuditLogs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center space-x-2">
          <History className="w-8 h-8 text-primary" />
          <span>Histórico Geral de Auditoria</span>
        </h1>
        <p className="text-stone-500 text-xs mt-1 font-light">
          Consulte o registro cronológico de todas as modificações, acessos e ações administrativas efetuadas no sistema.
        </p>
      </div>

      {/* Logs Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-[10px] uppercase font-bold text-stone-500 tracking-wider border-b border-border">
                  <th className="px-6 py-4.5">Operação / Ação</th>
                  <th className="px-6 py-4.5">Usuário</th>
                  <th className="px-6 py-4.5">Endereço IP</th>
                  <th className="px-6 py-4.5">Detalhes da Ação</th>
                  <th className="px-6 py-4.5 text-right">Data/Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs sm:text-sm">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-foreground bg-stone-100 border border-stone-200 py-1 px-2.5 rounded-lg">
                        {log.acao}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-600 font-medium">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>{log.usuario?.nome || 'Sistema / Mock Admin'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-stone-500">
                      <div className="flex items-center space-x-1.5">
                        <Globe className="w-3.5 h-3.5 text-stone-400" />
                        <span>{log.ip_address || '127.0.0.1'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-stone-500 max-w-xs truncate">
                      {log.new_data ? JSON.stringify(log.new_data) : 'Nenhum detalhe adicional.'}
                    </td>
                    <td className="px-6 py-4 text-right text-stone-400 font-mono text-xs whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-300" />
                        <span>{new Date(log.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-stone-400 text-xs">
            Nenhum registro de auditoria encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
