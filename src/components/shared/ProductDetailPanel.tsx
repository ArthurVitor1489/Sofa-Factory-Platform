'use client';

import { useState } from 'react';
import { Shield, Sparkles, MessageCircle, Ruler, FileText, CheckCircle2, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Produto, Tecido } from '@/types';

interface ProductDetailPanelProps {
  product: Produto;
}

export default function ProductDetailPanel({ product }: ProductDetailPanelProps) {
  const [selectedFabric, setSelectedFabric] = useState<Tecido | null>(
    product.tecidos && product.tecidos.length > 0 ? product.tecidos[0] : null
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSuccess(false);
    setErrorMsg('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !telefone) {
      setErrorMsg('Por favor, preencha Nome e Telefone.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          telefone,
          email,
          mensagem: `${mensagem}${selectedFabric ? `\nTecido de Interesse: ${selectedFabric.nome}` : ''}`,
          produto_id: product.id,
          confirm_email_address: honeypot, // Honeypot field
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Build WhatsApp redirect URL
        const baseMsg = `Olá, gostaria de solicitar um orçamento para o produto: ${product.nome}`;
        const fabricMsg = selectedFabric ? ` com acabamento em ${selectedFabric.nome}` : '';
        const contactMsg = `\n\nNome: ${nome}\nTelefone: ${telefone}`;
        const whatsAppUrl = `https://wa.me/5519987654321?text=${encodeURIComponent(baseMsg + fabricMsg + contactMsg)}`;
        
        // Wait a bit to redirect
        setTimeout(() => {
          window.open(whatsAppUrl, '_blank');
          setIsModalOpen(false);
          // Reset form
          setNome('');
          setTelefone('');
          setEmail('');
          setMensagem('');
        }, 1200);
      } else {
        setErrorMsg(result.error || 'Erro ao processar orçamento. Tente novamente.');
      }
    } catch (err) {
      console.error('Submit lead error:', err);
      setErrorMsg('Ocorreu um erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header info */}
      <div className="space-y-2 border-b border-border pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
          {product.nome}
        </h1>
        {product.categoria && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-0.5 rounded border border-primary/10">
            {product.categoria.nome}
          </span>
        )}
      </div>

      {/* 2. Short description */}
      <p className="text-stone-600 text-sm font-light leading-relaxed">
        {product.descricao}
      </p>

      {/* 3. Fabrics selector (Interactive) */}
      {product.tecidos && product.tecidos.length > 0 && (
        <div className="space-y-3.5 border-y border-border py-4.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold uppercase tracking-wider text-stone-500">
              Escolha o Revestimento
            </span>
            <span className="font-medium text-foreground">
              {selectedFabric ? `${selectedFabric.categoria} - ${selectedFabric.nome}` : 'Nenhum selecionado'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.tecidos.map((tec) => (
              <button
                key={tec.id}
                onClick={() => setSelectedFabric(tec)}
                title={tec.nome}
                className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                  selectedFabric?.id === tec.id
                    ? 'border-primary ring-2 ring-primary/20 scale-105'
                    : 'border-white hover:scale-105'
                }`}
                style={{ backgroundColor: tec.cor_hex || '#CCC', boxShadow: 'inset 0 0 2px rgba(0,0,0,0.1)' }}
              >
                {selectedFabric?.id === tec.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow mix-blend-difference" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Specifications (medidas, materiais) */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Especificações Técnicas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dimensions */}
          <div className="bg-stone-50/70 border border-border p-4 rounded-xl space-y-2 flex items-start space-x-3">
            <Ruler className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Dimensões</h4>
              <ul className="text-xs text-stone-500 space-y-0.5 pt-1 font-light">
                {product.dimensoes.largura && <li>Largura: {product.dimensoes.largura}</li>}
                {product.dimensoes.altura && <li>Altura: {product.dimensoes.altura}</li>}
                {product.dimensoes.profundidade && <li>Profundidade: {product.dimensoes.profundidade}</li>}
              </ul>
            </div>
          </div>

          {/* Warranty */}
          <div className="bg-stone-50/70 border border-border p-4 rounded-xl space-y-2 flex items-start space-x-3">
            <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Garantia estrutural</h4>
              <p className="text-xs text-stone-500 pt-1 font-light leading-relaxed">
                {product.garantia || 'Garantia integral de fábrica contra defeitos estruturais.'}
              </p>
            </div>
          </div>
        </div>

        {/* Materials List */}
        {product.materiais && product.materiais.length > 0 && (
          <div className="bg-stone-50/70 border border-border p-4 rounded-xl space-y-2.5">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Materiais de Fabricação</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
              {product.materiais.map((mat) => (
                <div key={mat.id} className="flex items-start space-x-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span className="text-stone-600 font-light">{mat.nome}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. CTA Budget Buttons */}
      <div className="pt-4">
        <Button
          onClick={handleOpenModal}
          size="lg"
          className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary/95 text-primary-foreground py-4 rounded-xl text-base font-bold shadow-xl shadow-primary/10 transition-transform active:scale-[0.99]"
        >
          <FileText className="w-5.5 h-5.5" />
          <span>Solicitar Orçamento Personalizado</span>
        </Button>
      </div>

      {/* 6. Form Budget Request Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Solicitar Orçamento">
        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-foreground">
                Orçamento Enviado!
              </h3>
              <p className="text-stone-500 text-xs max-w-xs mx-auto leading-relaxed">
                Seu lead foi gerado com sucesso. Redirecionando você para o WhatsApp comercial para atendimento imediato...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <p className="text-xs text-stone-500 leading-relaxed font-light mb-2">
              Preencha os dados abaixo e entraremos em contato para formalizar o orçamento e definir detalhes de medidas e entrega.
            </p>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Honeypot field (hidden from users) */}
            <input
              type="text"
              name="confirm_email_address"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              autoComplete="off"
            />

            <Input
              label="Nome Completo"
              placeholder="Digite seu nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <Input
              label="Telefone (WhatsApp)"
              placeholder="Ex: (19) 98765-4321"
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <Input
              label="E-mail (Opcional)"
              placeholder="seuemail@exemplo.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Mensagem ou Alterações de Medida (Opcional)"
              multiline
              rows={3}
              placeholder="Ex: Gostaria deste sofá com 2.80m de largura..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            />

            <div className="pt-2">
              <Button type="submit" loading={loading} className="w-full py-3.5 flex items-center justify-center space-x-2">
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Enviar e ir para o WhatsApp</span>
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
