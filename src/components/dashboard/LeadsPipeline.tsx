'use client';

import { useState } from 'react';
import { FileSpreadsheet, MessageCircle, ArrowRightLeft, User, Calendar, Trash } from 'lucide-react';
import { LeadOrcamento, LeadStatus } from '@/types';

interface LeadsPipelineProps {
  initialLeads: LeadOrcamento[];
}

export default function LeadsPipeline({ initialLeads }: LeadsPipelineProps) {
  const [leads, setLeads] = useState<LeadOrcamento[]>(initialLeads);

  const statuses: { key: LeadStatus; label: string; bg: string; text: string }[] = [
    { key: 'novo', label: 'Novos', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
    { key: 'contato_realizado', label: 'Contato', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
    { key: 'orcamento_enviado', label: 'Orçamento', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
    { key: 'negociacao', label: 'Negociação', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
    { key: 'fechado', label: 'Fechados', bg: 'bg-green-50 border-green-200', text: 'text-green-700' },
  ];

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      const response = await fetch(`/api/leads/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const getLeadsByStatus = (statusKey: LeadStatus) => {
    if (statusKey === 'fechado') {
      // include fechado and perdido in the final column
      return leads.filter((l) => l.status === 'fechado' || l.status === 'perdido');
    }
    return leads.filter((l) => l.status === statusKey);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center space-x-2">
          <FileSpreadsheet className="w-8 h-8 text-primary" />
          <span>Pipeline de Leads & Orçamentos</span>
        </h1>
        <p className="text-stone-500 text-xs mt-1 font-light">
          Acompanhe o funil de vendas comercial e altere o status das negociações dos clientes.
        </p>
      </div>

      {/* Kanban Board columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4.5 overflow-x-auto pb-4">
        {statuses.map((column) => {
          const columnLeads = getLeadsByStatus(column.key);
          return (
            <div
              key={column.key}
              className="bg-stone-50/70 border border-border rounded-xl p-4 flex flex-col space-y-3 min-w-[240px] max-h-[80vh] overflow-y-auto"
            >
              {/* Column Header */}
              <div className={`p-2.5 rounded-lg border flex items-center justify-between font-semibold text-xs ${column.bg} ${column.text}`}>
                <span>{column.label}</span>
                <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded-md shadow-sm">
                  {columnLeads.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {columnLeads.length > 0 ? (
                  columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white border border-border p-4 rounded-xl shadow-sm hover:shadow-md transition-all space-y-3.5"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-foreground flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>{lead.nome}</span>
                        </h4>
                        <p className="text-[10px] text-stone-500 font-mono flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                        </p>
                      </div>

                      {lead.produto && (
                        <div className="bg-stone-50 border border-border p-2 rounded-lg">
                          <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                            Modelo
                          </p>
                          <p className="text-xs font-bold text-stone-700 leading-tight">
                            {lead.produto.nome}
                          </p>
                        </div>
                      )}

                      {lead.mensagem && (
                        <p className="text-[10px] text-stone-500 italic bg-stone-50/50 p-2 rounded leading-relaxed border border-stone-200/50 line-clamp-2">
                          &ldquo;{lead.mensagem}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px]">
                        {/* Status update select */}
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="text-[10px] font-semibold py-1 px-2 rounded bg-stone-50 border border-border hover:bg-stone-100 focus:outline-none"
                        >
                          <option value="novo">Novo</option>
                          <option value="contato_realizado">Contato</option>
                          <option value="orcamento_enviado">Orçamento</option>
                          <option value="negociacao">Negociação</option>
                          <option value="fechado">Fechado</option>
                          <option value="perdido">Perdido</option>
                        </select>

                        {/* WhatsApp CTA */}
                        <a
                          href={`https://wa.me/${lead.telefone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 bg-[#25D366] text-white py-1.5 px-2 rounded font-bold hover:bg-[#20ba59] transition-colors"
                          title="Falar no WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>Contato</span>
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-stone-400 text-[10px] font-light">
                    Sem leads nesta etapa.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
