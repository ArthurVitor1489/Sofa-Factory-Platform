'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sofa, Lock, Mail, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        router.push(redirectPath);
        router.refresh();
      } else {
        setErrorMsg(result.error || 'Falha ao efetuar login.');
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setErrorMsg('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-card border border-border p-8 rounded-2xl shadow-xl">
        {/* Brand/Logo header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mx-auto shadow-md shadow-primary/10">
            <Sofa className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
              Painel de Gestão Fábrica
            </h1>
            <p className="text-xs text-muted-foreground tracking-wider uppercase mt-1">
              Estofados Arte & Conforto
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div className="relative">
            <Input
              label="E-mail Administrativo"
              type="email"
              placeholder="seuemail@fabrica.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-10" />
          </div>

          <div className="relative">
            <Input
              label="Senha de Acesso"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
            />
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-10" />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              loading={loading}
              className="w-full py-3.5 flex items-center justify-center text-base"
            >
              Entrar no Sistema
            </Button>
          </div>
        </form>

        {/* Credentials guide for testing */}
        <div className="bg-stone-50 border border-border p-4 rounded-xl space-y-1.5 text-center text-xs">
          <p className="font-semibold text-stone-600">Acesso de Demonstração Local:</p>
          <div className="text-stone-500 font-mono space-y-0.5 select-all">
            <p>E-mail: admin@fabrica.com.br</p>
            <p>Senha: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
