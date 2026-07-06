-- Schema SQL para o Portal Premium da Fábrica de Sofás e Móveis

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para roles de usuários
CREATE TYPE user_role AS ENUM ('admin', 'vendedor', 'editor');

-- Enum para status de leads
CREATE TYPE lead_status AS ENUM ('novo', 'contato_realizado', 'orcamento_enviado', 'negociacao', 'fechado', 'perdido');

-- Tabela: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'editor',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela: categorias
CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela: produtos
CREATE TABLE IF NOT EXISTS produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    categoria_id UUID REFERENCES categorias(id) ON DELETE RESTRICT,
    nome VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    descricao TEXT,
    dimensoes JSONB NOT NULL DEFAULT '{}'::jsonb, -- Ex: {"largura": "2.20m", "altura": "1.00m", "profundidade": "1.10m"}
    garantia VARCHAR(255),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    destaque BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela: produto_imagens
CREATE TABLE IF NOT EXISTS produto_imagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    ordem INTEGER NOT NULL DEFAULT 0,
    alt_text VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: tecidos
CREATE TABLE IF NOT EXISTS tecidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(255), -- Ex: Linho, Veludo, Couro Sintético
    cor_hex VARCHAR(7), -- Ex: #D2B48C (Bege)
    imagem_url TEXT, -- Opcional para texturas reais
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: materiais
CREATE TABLE IF NOT EXISTS materiais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabela de relacionamento: produto_tecidos
CREATE TABLE IF NOT EXISTS produto_tecidos (
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    tecido_id UUID REFERENCES tecidos(id) ON DELETE CASCADE,
    PRIMARY KEY (produto_id, tecido_id)
);

-- Tabela de relacionamento: produto_materiais
CREATE TABLE IF NOT EXISTS produto_materiais (
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materiais(id) ON DELETE CASCADE,
    PRIMARY KEY (produto_id, material_id)
);

-- Tabela: projetos (Portfólio)
CREATE TABLE IF NOT EXISTS projetos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    descricao TEXT,
    capa_url TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: projeto_imagens
CREATE TABLE IF NOT EXISTS projeto_imagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    ordem INTEGER NOT NULL DEFAULT 0
);

-- Tabela: depoimentos
CREATE TABLE IF NOT EXISTS depoimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_nome VARCHAR(255) NOT NULL,
    cidade_estado VARCHAR(150), -- Ex: "São Paulo - SP"
    texto TEXT NOT NULL,
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: banners
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255),
    subtitulo TEXT,
    imagem_url TEXT NOT NULL,
    link_destino VARCHAR(255),
    ordem INTEGER NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: leads_orcamento
CREATE TABLE IF NOT EXISTS leads_orcamento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    mensagem TEXT,
    produto_id UUID REFERENCES produtos(id) ON DELETE SET NULL,
    status lead_status NOT NULL DEFAULT 'novo',
    origem VARCHAR(100) DEFAULT 'Site', -- Ex: Site, Campanha Google, Instagram
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: logs_auditoria
CREATE TABLE IF NOT EXISTS logs_auditoria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    acao VARCHAR(100) NOT NULL, -- Ex: 'PRODUTO_CREATE', 'LOGIN', 'CATEGORIA_UPDATE'
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: produto_versions (Histórico)
CREATE TABLE IF NOT EXISTS produto_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    dados JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhoria de performance
CREATE INDEX IF NOT EXISTS idx_produtos_slug ON produtos(slug);
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads_orcamento(status);
CREATE INDEX IF NOT EXISTS idx_leads_produto ON leads_orcamento(produto_id);

-- Função e Trigger para atualizar auto-update 'updated_at'
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_changetimestamp BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_categorias_changetimestamp BEFORE UPDATE ON categorias FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_produtos_changetimestamp BEFORE UPDATE ON produtos FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_tecidos_changetimestamp BEFORE UPDATE ON tecidos FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_projetos_changetimestamp BEFORE UPDATE ON projetos FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_depoimentos_changetimestamp BEFORE UPDATE ON depoimentos FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_leads_changetimestamp BEFORE UPDATE ON leads_orcamento FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
