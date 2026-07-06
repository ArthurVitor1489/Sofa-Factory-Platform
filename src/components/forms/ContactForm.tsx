'use client';

import { useState } from 'react';
import { Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot

  const handleSubmit = async (e: React.FormEvent) => {
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
          mensagem,
          confirm_email_address: honeypot, // Honeypot field
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Reset form fields
        setNome('');
        setTelefone('');
        setEmail('');
        setMensagem('');
      } else {
        setErrorMsg(result.error || 'Erro ao enviar contato. Tente novamente.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setErrorMsg('Ocorreu um erro ao enviar a mensagem.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-card border border-border p-8 rounded-2xl shadow-sm text-center space-y-5">
        <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-200 shadow-inner animate-pulse">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-bold text-foreground">
            Mensagem Recebida!
          </h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto leading-relaxed font-light">
            Agradecemos o contato. Um vendedor da fábrica entrará em contato via WhatsApp ou telefone nas próximas horas para dar andamento ao seu atendimento.
          </p>
        </div>
        <div className="pt-4 border-t border-border flex flex-col gap-3">
          <a
            href="https://wa.me/5519987654321?text=Olá,%20enviei%20um%20formulário%20pelo%20site%20e%20gostaria%20de%20antecipar%20o%20atendimento."
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center space-x-2 bg-[#25D366] text-white hover:bg-[#20ba59] py-3 rounded-lg text-sm font-bold shadow-md transition-colors"
          >
            <MessageCircle className="w-4.5 h-4.5 fill-white" />
            <span>Falar no WhatsApp Imediatamente</span>
          </a>
          <button
            onClick={() => setSuccess(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors py-1 hover:underline"
          >
            Enviar outra mensagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Honeypot hidden input */}
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
        label="Mensagem ou Peças de Interesse"
        multiline
        rows={4}
        placeholder="Gostaria de saber mais sobre..."
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
      />

      <div className="pt-2">
        <Button type="submit" loading={loading} className="w-full py-3.5 flex items-center justify-center space-x-2">
          <Send className="w-4 h-4" />
          <span>Enviar Mensagem</span>
        </Button>
      </div>
    </form>
  );
}
