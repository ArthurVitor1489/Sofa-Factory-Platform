export type UserRole = 'admin' | 'vendedor' | 'editor';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  ativo: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  imagem_url?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Dimensoes {
  largura?: string;
  altura?: string;
  profundidade?: string;
  [key: string]: any;
}

export interface Produto {
  id: string;
  categoria_id: string;
  nome: string;
  slug: string;
  descricao?: string;
  dimensoes: Dimensoes;
  garantia?: string;
  ativo: boolean;
  destaque: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  // Relacionados
  categoria?: Categoria;
  imagens?: ProdutoImagem[];
  tecidos?: Tecido[];
  materiais?: Material[];
}

export interface ProdutoImagem {
  id: string;
  produto_id: string;
  url: string;
  ordem: number;
  alt_text?: string;
  created_at: string;
}

export interface Tecido {
  id: string;
  nome: string;
  categoria?: string; // Ex: Linho, Veludo, Couro
  cor_hex?: string;
  imagem_url?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface Projeto {
  id: string;
  titulo: string;
  cidade?: string;
  estado?: string;
  descricao?: string;
  capa_url?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  // Relacionados
  imagens?: ProjetoImagem[];
}

export interface ProjetoImagem {
  id: string;
  projeto_id: string;
  url: string;
  ordem: number;
}

export interface Depoimento {
  id: string;
  cliente_nome: string;
  cidade_estado?: string;
  texto: string;
  nota: number; // 1-5
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  titulo?: string;
  subtitulo?: string;
  imagem_url: string;
  link_destino?: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

export type LeadStatus =
  | 'novo'
  | 'contato_realizado'
  | 'orcamento_enviado'
  | 'negociacao'
  | 'fechado'
  | 'perdido';

export interface LeadOrcamento {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  mensagem?: string;
  produto_id?: string | null;
  status: LeadStatus;
  origem?: string;
  created_at: string;
  updated_at: string;
  // Relacionados
  produto?: Produto;
}

export interface LogAuditoria {
  id: string;
  usuario_id?: string | null;
  acao: string;
  old_data?: Record<string, any> | null;
  new_data?: Record<string, any> | null;
  ip_address?: string;
  created_at: string;
  // Relacionados
  usuario?: Usuario;
}

export interface ProdutoVersion {
  id: string;
  produto_id: string;
  usuario_id?: string | null;
  dados: Record<string, any>;
  created_at: string;
  // Relacionados
  usuario?: Usuario;
}
