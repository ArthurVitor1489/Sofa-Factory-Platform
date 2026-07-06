'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Copy, Edit, Trash2, ShieldCheck, Star, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Produto, Categoria } from '@/types';


interface ProductsManagerProps {
  initialProducts: Produto[];
  categories: Categoria[];
}

export default function ProductsManager({
  initialProducts,
  categories,
}: ProductsManagerProps) {
  const [products, setProducts] = useState<Produto[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Partial<Produto> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [largura, setLargura] = useState('');
  const [altura, setAltura] = useState('');
  const [profundidade, setProfundidade] = useState('');
  const [garantia, setGarantia] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [destaque, setDestaque] = useState(false);

  const handleOpenNew = () => {
    setSelectedProduct({});
    setNome('');
    setSlug('');
    setDescricao('');
    setCategoriaId(categories[0]?.id || '');
    setLargura('');
    setAltura('');
    setProfundidade('');
    setGarantia('3 anos de garantia');
    setAtivo(true);
    setDestaque(false);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Produto) => {
    setSelectedProduct(product);
    setNome(product.nome);
    setSlug(product.slug);
    setDescricao(product.descricao || '');
    setCategoriaId(product.categoria_id);
    setLargura(product.dimensoes.largura || '');
    setAltura(product.dimensoes.altura || '');
    setProfundidade(product.dimensoes.profundidade || '');
    setGarantia(product.garantia || '');
    setAtivo(product.ativo);
    setDestaque(product.destaque);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setNome(val);
    // Slug auto generation helper
    if (!selectedProduct?.id) {
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
      setSlug(generatedSlug);
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !slug || !categoriaId) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedProduct?.id,
          nome,
          slug,
          descricao,
          categoria_id: categoriaId,
          dimensoes: { largura, altura, profundidade },
          garantia,
          ativo,
          destaque,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh products list
        if (selectedProduct?.id) {
          // Update
          setProducts((prev) =>
            prev.map((p) => (p.id === selectedProduct.id ? result.product : p))
          );
        } else {
          // Create
          setProducts((prev) => [result.product, ...prev]);
        }
        setIsModalOpen(false);
      } else {
        setErrorMsg(result.error || 'Falha ao salvar produto.');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setErrorMsg('Erro de conexão ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (productId: string) => {
    if (!confirm('Deseja realmente duplicar este produto para agilizar o cadastro?')) return;
    try {
      const response = await fetch('/api/admin/products/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId }),
      });

      if (response.ok) {
        const result = await response.json();
        setProducts((prev) => [result.product, ...prev]);
      } else {
        alert('Erro ao duplicar produto.');
      }
    } catch (error) {
      console.error('Error duplicating product:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;
    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } else {
        alert('Erro ao deletar produto.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <Package className="w-8 h-8 text-primary" />
            <span>Gerenciar Catálogo de Produtos</span>
          </h1>
          <p className="text-stone-500 text-xs mt-1 font-light">
            Cadastre, edite, duplique ou remova produtos de seu showroom.
          </p>
        </div>
        <Button onClick={handleOpenNew} className="flex items-center space-x-1.5 self-start">
          <Plus className="w-4.5 h-4.5" />
          <span>Cadastrar Produto</span>
        </Button>
      </div>

      {/* Table grid */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-[10px] uppercase font-bold text-stone-500 tracking-wider border-b border-border">
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">URL Amigável</th>
                  <th className="px-6 py-4">Garantia</th>
                  <th className="px-6 py-4">Destaque</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {products.filter(p => !p.deleted_at).map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/30 transition-colors">
                    <td className="px-6 py-4.5">
                      <div>
                        <p className="font-semibold text-foreground leading-tight">{prod.nome}</p>
                        {prod.categoria && (
                          <span className="text-[10px] text-muted-foreground bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 uppercase font-sans font-medium mt-1 inline-block">
                            {prod.categoria.nome}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-stone-500">
                      /{prod.categoria?.slug || 'produtos'}/{prod.slug}
                    </td>
                    <td className="px-6 py-4 text-xs text-stone-500 font-light">{prod.garantia}</td>
                    <td className="px-6 py-4">
                      {prod.destaque ? (
                        <span className="inline-flex items-center space-x-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Sim</span>
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400 font-light">Não</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs py-1 px-2.5 rounded-full border font-medium inline-block ${
                          prod.ativo
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-stone-100 text-stone-400 border-stone-200'
                        }`}
                      >
                        {prod.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {prod.ativo && (
                        <Link
                          href={`/${prod.categoria?.slug || 'produtos'}/${prod.slug}`}
                          target="_blank"
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200"
                          title="Visualizar no Site"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <button
                        onClick={() => handleDuplicate(prod.id)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 cursor-pointer"
                        title="Duplicar Produto"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-stone-400 text-xs">
            Nenhum produto cadastrado no catálogo.
          </div>
        )}
      </div>

      {/* CRUD Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct?.id ? 'Editar Produto' : 'Cadastrar Novo Produto'}
      >
        <form onSubmit={handleSaveSubmit} className="space-y-4.5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
              {errorMsg}
            </div>
          )}

          <Input
            label="Nome do Produto *"
            placeholder="Ex: Sofá Retrátil Florenza"
            required
            value={nome}
            onChange={(e) => handleNameChange(e.target.value)}
          />

          <Input
            label="URL Amigável (Slug) *"
            placeholder="ex-sofa-retratil-florenza"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Categoria *
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Descrição do Produto"
            multiline
            rows={3}
            placeholder="Descreva detalhes de estilo, espuma, costuras..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          {/* Dimensions */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground block">
              Dimensões (Sob Medida)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Largura (ex: 2.20m)"
                value={largura}
                onChange={(e) => setLargura(e.target.value)}
              />
              <Input
                placeholder="Altura (ex: 1.05m)"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
              />
              <Input
                placeholder="Prof. (ex: 1.10m)"
                value={profundidade}
                onChange={(e) => setProfundidade(e.target.value)}
              />
            </div>
          </div>

          <Input
            label="Garantia Estrutural"
            placeholder="Ex: 3 anos de garantia"
            value={garantia}
            onChange={(e) => setGarantia(e.target.value)}
          />

          {/* Status Switches */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ativo-chk"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary rounded border-border"
              />
              <label htmlFor="ativo-chk" className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                Produto Ativo no Site
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="destaque-chk"
                checked={destaque}
                onChange={(e) => setDestaque(e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary rounded border-border"
              />
              <label htmlFor="destaque-chk" className="text-xs font-semibold text-stone-700 uppercase tracking-wide flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Destaque Home</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
