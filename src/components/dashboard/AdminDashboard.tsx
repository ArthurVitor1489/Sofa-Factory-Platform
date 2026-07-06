'use client';

import { useState } from 'react';
import { FileSpreadsheet, Package, History, MessageCircle, RefreshCw, BadgeInfo } from 'lucide-react';
import { LeadOrcamento, LogAuditoria, Produto, LeadStatus } from '@/types';

interface AdminDashboardProps {
  initialLeads: LeadOrcamento[];
  initialProducts: Produto[];
  initialLogs: LogAuditoria[];
}

export default function AdminDashboard({
  initialLeads,
  initialProducts,
  initialLogs,
}: AdminDashboardProps) {
  const [leads, setLeads] = useState<LeadOrcamento[]>(initialLeads);
  const [products] = useState<Produto[]>(initialProducts);
  const [logs, setLogs] = useState<LogAuditoria[]>(initialLogs);
  const [loading, setLoading] = useState(false);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'novo').length;
  const activeProducts = products.filter((p) => p.ativo).length;
  const totalLogs = logs.length;

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const response = await fetch(`/api/leads/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      if (response.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        // Refresh audit logs simulation
        fetchLogs();
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to refresh logs:', error);
    }
  };

  const getStatusBadgeClass = (status: LeadStatus) => {
    switch (status) {
      case 'novo':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contato_realizado':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'orcamento_enviado':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'negociacao':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'fechado':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'perdido':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  const formatStatus = (status: LeadStatus) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Painel Executivo
          </h1>
          <p className="text-stone-500 text-xs mt-1 font-light">
            Estatísticas operacionais e fluxo de captação comercial.
          </p>
        </div>
      </div>

      {/* 2. KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Leads */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Orçamentos / Leads
            </p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{totalLeads}</span>
              {newLeads > 0 && (
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  {newLeads} novos
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Products */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Produtos Ativos
            </p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{activeProducts}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Audit Logs */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
            <History className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Ações Auditadas
            </p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{totalLogs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main content: Leads List */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center">
          <h2 className="font-serif text-lg font-bold text-foreground">
            Pipeline Comercial - Últimos Orçamentos
          </h2>
        </div>

        {leads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-[10px] uppercase font-bold text-stone-500 tracking-wider border-b border-border">
                  <th className="px-6 py-4.5">Cliente</th>
                  <th className="px-6 py-4.5">Contato</th>
                  <th className="px-6 py-4.5">Modelo</th>
                  <th className="px-6 py-4.5">Origem</th>
                  <th className="px-6 py-4.5">Status</th>
                  <th className="px-6 py-4.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {leads.slice(0, 8).map((lead) => (
                  <tr key={lead.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{lead.nome}</td>
                    <td className="px-6 py-4 text-xs text-stone-500 font-light">
                      <p>{lead.telefone}</p>
                      <p>{lead.email}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-stone-600">
                      {lead.produto ? lead.produto.nome : 'Orçamento Geral'}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{lead.origem}</td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs font-semibold py-1.5 px-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary ${getStatusBadgeClass(
                          lead.status
                        )}`}
                      >
                        <option value="novo">Novo</option>
                        <option value="contato_realizado">Contato Realizado</option>
                        <option value="orcamento_enviado">Orçamento Enviado</option>
                        <option value="negociacao">Negociação</option>
                        <option value="fechado">Fechado</option>
                        <option value="perdido">Perdido</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`https://wa.me/${lead.telefone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 bg-[#25D366] text-white hover:bg-[#20ba59] py-1.5 px-3 rounded-lg text-xs font-bold shadow-sm"
                        title="Chamar no WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>Chamar</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-stone-400 text-xs">
            Nenhum lead de orçamento recebido até o momento.
          </div>
        )}
      </div>

      {/* 4. Secondary Content: Audit logs */}
      {logs.length > 0 && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h2 className="font-serif text-lg font-bold text-foreground">
              Histórico Recente de Auditoria (Logs)
            </h2>
          </div>
          <div className="divide-y divide-border text-xs">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-4 hover:bg-stone-50/50 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-foreground">{log.acao}</span>
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
                      IP: {log.ip_address}
                    </span>
                  </div>
                  <p className="text-stone-500 font-light">
                    Alteração efetuada no sistema.
                  </p>
                </div>
                <span className="text-stone-400 font-mono text-[10px]">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
