import { supabase, supabaseAdmin } from '@/lib/supabase';
import {
  Categoria,
  Produto,
  Tecido,
  Material,
  Projeto,
  Depoimento,
  Banner,
  LeadOrcamento,
  LogAuditoria,
  Usuario,
  ProdutoVersion,
  LeadStatus
} from '@/types';

// ==========================================
// MOCK DATASET FOR RESILIENT LOCAL DEV
// ==========================================

const MOCK_CATEGORIES: Categoria[] = [
  {
    id: 'cat-sofas',
    nome: 'Sofás',
    slug: 'sofas',
    descricao: 'Sofás sob medida, retráteis, reclináveis e fixos com alto padrão de conforto.',
    imagem_url: '/images/sofa_retratil.png',
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-poltronas',
    nome: 'Poltronas',
    slug: 'poltronas',
    descricao: 'Poltronas decorativas e de amamentação com design ergonômico.',
    imagem_url: '/images/poltrona_florenza.png',
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-mesas',
    nome: 'Mesas',
    slug: 'mesas',
    descricao: 'Mesas de jantar orgânicas e retangulares em madeira maciça.',
    imagem_url: '/images/mesa_jantar.png',
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-paineis',
    nome: 'Painéis',
    slug: 'paineis',
    descricao: 'Painéis ripados sob medida com acabamento impecável e LED.',
    imagem_url: '/images/hero_banner.png',
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-planejados',
    nome: 'Planejados',
    slug: 'planejados',
    descricao: 'Móveis planejados para cozinhas, dormitórios e salas.',
    imagem_url: '/images/hero_banner.png',
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-cadeiras',
    nome: 'Cadeiras',
    slug: 'cadeiras',
    descricao: 'Cadeiras estofadas e em madeira maciça com ergonomia e durabilidade.',
    imagem_url: '/images/cadeira_sofia.png',
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const MOCK_FABRICS: Tecido[] = [
  { id: 'tec-1', nome: 'Linho Cru Premium', categoria: 'Linho', cor_hex: '#EAE6DF', ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'tec-2', nome: 'Bouclé Off-White', categoria: 'Bouclé', cor_hex: '#F5F2EB', ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'tec-3', nome: 'Veludo Chocolate', categoria: 'Veludo', cor_hex: '#3D2F27', ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'tec-4', nome: 'Couro Natural Terracota', categoria: 'Couro', cor_hex: '#8B4513', ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'tec-5', nome: 'Linho Cinza Mescla', categoria: 'Linho', cor_hex: '#8C8C8C', ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

const MOCK_MATERIALS: Material[] = [
  { id: 'mat-1', nome: 'Madeira Maciça Eucalipto Tratada', descricao: 'Estrutura interna 100% reflorestada, imunizada e seca em estufa.', ativo: true },
  { id: 'mat-2', nome: 'Espuma D33 Soft com Manta de Fibra de Poliéster', descricao: 'Camada de conforto de altíssima densidade e maciez duradoura.', ativo: true },
  { id: 'mat-3', nome: 'Molas Ensacadas Individualmente', descricao: 'Molejo pocket que proporciona suporte independente ao peso.', ativo: true },
  { id: 'mat-4', nome: 'MDF Ultra Hidrófugo', descricao: 'Painéis resistentes à umidade com dupla face melamínica.', ativo: true }
];

const MOCK_PRODUCTS: Produto[] = [
  {
    id: 'prod-sofa-retratil-luxo',
    categoria_id: 'cat-sofas',
    nome: 'Sofá Retrátil e Reclinável de Luxo Aconchego',
    slug: 'sofa-retratil-luxo-aconchego',
    descricao: 'Sofá modular de altíssimo padrão, projetado com assento retrátil com molas ensacadas e encosto reclinável com fibras de silicone. O revestimento em linho premium confere um toque agradável e sofisticado a qualquer ambiente de estar.',
    dimensoes: { largura: '2.40m a 3.20m', altura: '1.05m', profundidade: '1.15m (fechado) / 1.70m (aberto)' },
    garantia: '3 anos de garantia estrutural',
    ativo: true,
    destaque: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-1', produto_id: 'prod-sofa-retratil-luxo', url: '/images/sofa_retratil.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[0], MOCK_FABRICS[1], MOCK_FABRICS[2]],
    materiais: [MOCK_MATERIALS[0], MOCK_MATERIALS[1], MOCK_MATERIALS[2]]
  },
  {
    id: 'prod-poltrona-florenza',
    categoria_id: 'cat-poltronas',
    nome: 'Poltrona Florenza Bouclé',
    slug: 'poltrona-florenza-boucle',
    descricao: 'Com curvas orgânicas inspiradas no design italiano, a Poltrona Florenza oferece uma experiência incomparável de conforto. O acabamento em tecido Bouclé traz textura e aconchego imediato, sendo a peça perfeita para salas de estar ou dormitórios.',
    dimensoes: { largura: '0.85m', altura: '0.80m', profundidade: '0.85m' },
    garantia: '2 anos de garantia contra defeitos de fabricação',
    ativo: true,
    destaque: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-2', produto_id: 'prod-poltrona-florenza', url: '/images/poltrona_florenza.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[1], MOCK_FABRICS[0]],
    materiais: [MOCK_MATERIALS[0], MOCK_MATERIALS[1]]
  },
  {
    id: 'prod-mesa-jantar-organica',
    categoria_id: 'cat-mesas',
    nome: 'Mesa de Jantar Orgânica Raízes',
    slug: 'mesa-jantar-organica-raizes',
    descricao: 'Desenvolvida com tampo de desenho orgânico em madeira maciça selecionada, a mesa Raízes celebra a beleza natural e a textura das fibras da madeira. Ideal para reunir familiares com elegância e requinte.',
    dimensoes: { largura: '2.20m', altura: '0.76m', profundidade: '1.10m' },
    garantia: '2 anos de garantia estrutural',
    ativo: true,
    destaque: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-3', produto_id: 'prod-mesa-jantar-organica', url: '/images/mesa_jantar.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [],
    materiais: [MOCK_MATERIALS[0]]
  },
  {
    id: 'prod-painel-ripado-led',
    categoria_id: 'cat-paineis',
    nome: 'Painel Ripado Home Theater com LED',
    slug: 'painel-ripado-home-theater-led',
    descricao: 'Painel ripado de alta definição em MDF Ultra, com sistema de iluminação em fita de LED embutida em tom quente. Possui passagem oculta de fiação e prateleiras suspensas chanfradas.',
    dimensoes: { largura: '3.00m', altura: '2.60m', profundidade: '0.12m' },
    garantia: '5 anos de garantia para defeitos de fabricação e montagem',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-4', produto_id: 'prod-painel-ripado-led', url: '/images/hero_banner.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [],
    materiais: [MOCK_MATERIALS[3]]
  },
  {
    id: 'prod-cadeira-sofia-boucle',
    categoria_id: 'cat-cadeiras',
    nome: 'Cadeira Sofia Bouclé',
    slug: 'cadeira-sofia-boucle',
    descricao: 'Cadeira de jantar estofada com design ergonômico moderno. O tecido bouclé premium oferece textura aconchegante e elegância atemporal para sua mesa de jantar.',
    dimensoes: { largura: '0.52m', altura: '0.85m', profundidade: '0.56m' },
    garantia: '2 anos de garantia contra defeitos de fabricação',
    ativo: true,
    destaque: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-5', produto_id: 'prod-cadeira-sofia-boucle', url: '/images/cadeira_sofia.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[1], MOCK_FABRICS[0]],
    materiais: [MOCK_MATERIALS[0], MOCK_MATERIALS[1]]
  },
  {
    id: 'prod-cadeira-eloa-madeira',
    categoria_id: 'cat-cadeiras',
    nome: 'Cadeira Eloá Madeira Maciça',
    slug: 'cadeira-eloa-madeira-macica',
    descricao: 'Fabricada em madeira maciça de eucalipto tratado e seco em estufa. Suas curvas orgânicas inspiradas no design escandinavo oferecem leveza e resistência estrutural diferenciada.',
    dimensoes: { largura: '0.48m', altura: '0.82m', profundidade: '0.50m' },
    garantia: '3 anos de garantia estrutural',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-6', produto_id: 'prod-cadeira-eloa-madeira', url: '/images/cadeira_eloa.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [],
    materiais: [MOCK_MATERIALS[0]]
  }
];

const MOCK_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    titulo: 'Conforto Premium sob Medida',
    subtitulo: 'Fabricação própria de estofados e móveis sob medida de alta qualidade.',
    imagem_url: '/images/hero_banner.png',
    link_destino: '/catalogo',
    ordem: 1,
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'ban-2',
    titulo: 'Linha Orgânica 2026',
    subtitulo: 'Curvas suaves e tecidos texturizados que trazem a natureza para dentro da sua sala.',
    imagem_url: '/images/mesa_jantar.png',
    link_destino: '/catalogo?categoria=mesas',
    ordem: 2,
    ativo: true,
    created_at: new Date().toISOString()
  }
];

const MOCK_TESTIMONIALS: Depoimento[] = [
  {
    id: 'dep-1',
    cliente_nome: 'Mariana Vasconcellos',
    cidade_estado: 'Campinas - SP',
    texto: 'O sofá retrátil que encomendei superou todas as expectativas. O linho é macio, a espuma é extremamente confortável e a entrega foi super pontual. Indico para todo mundo!',
    nota: 5,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'dep-2',
    cliente_nome: 'Roberto Silveira',
    cidade_estado: 'São Paulo - SP',
    texto: 'Fizemos os móveis planejados da cozinha e a mesa de jantar. Acabamento impecável, ferragens de alta qualidade. Minha cozinha virou o centro das atenções.',
    nota: 5,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const MOCK_PROJECTS: Projeto[] = [
  {
    id: 'proj-1',
    titulo: 'Residência Alphaville',
    cidade: 'Barueri',
    estado: 'SP',
    descricao: 'Projeto completo de estar integrado com nosso sofá Aconchego sob medida de 3.80m de largura.',
    capa_url: '/images/hero_banner.png',
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// In-memory leads simulation for local development
const MOCK_LEADS: LeadOrcamento[] = [];

// In-memory audit logs
const MOCK_LOGS: LogAuditoria[] = [];

// In-memory dynamic products catalog (for local crud simulations)
let dynamicProducts: Produto[] = [...MOCK_PRODUCTS];
let dynamicCategories: Categoria[] = [...MOCK_CATEGORIES];
let dynamicFabrics: Tecido[] = [...MOCK_FABRICS];
let dynamicMaterials: Material[] = [...MOCK_MATERIALS];
let dynamicTestimonials: Depoimento[] = [...MOCK_TESTIMONIALS];
let dynamicBanners: Banner[] = [...MOCK_BANNERS];
let dynamicProjects: Projeto[] = [...MOCK_PROJECTS];

const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mockproject');

// ==========================================
// DATA ACCESS LAYER SERVICES
// ==========================================

export const dbService = {
  // --- CATEGORIES ---
  async getCategories(): Promise<Categoria[]> {
    if (isMock) {
      return dynamicCategories.filter(c => !c.deleted_at);
    }
    const { data, error } = await supabase.from('categorias').select('*').is('deleted_at', null).eq('ativo', true);
    if (error) throw error;
    return data as Categoria[];
  },

  async getCategoryBySlug(slug: string): Promise<Categoria | null> {
    if (isMock) {
      return dynamicCategories.find(c => c.slug === slug && !c.deleted_at) || null;
    }
    const { data, error } = await supabase.from('categorias').select('*').eq('slug', slug).is('deleted_at', null).single();
    if (error) return null;
    return data as Categoria;
  },

  // --- PRODUCTS ---
  async getProducts(filters?: { categorySlug?: string; query?: string; onlyActive?: boolean }): Promise<Produto[]> {
    if (isMock) {
      let list = [...dynamicProducts].filter(p => !p.deleted_at);
      
      if (filters?.onlyActive) {
        list = list.filter(p => p.ativo);
      }

      if (filters?.categorySlug) {
        const cat = dynamicCategories.find(c => c.slug === filters.categorySlug);
        if (cat) {
          list = list.filter(p => p.categoria_id === cat.id);
        } else {
          return [];
        }
      }

      if (filters?.query) {
        const q = filters.query.toLowerCase();
        list = list.filter(p => p.nome.toLowerCase().includes(q) || p.descricao?.toLowerCase().includes(q));
      }

      // Map relation fields in mock
      return list.map(p => ({
        ...p,
        categoria: dynamicCategories.find(c => c.id === p.categoria_id)
      }));
    }

    let qBuilder = supabase.from('produtos').select('*, categoria:categorias(*), imagens:produto_imagens(*)').is('deleted_at', null);

    if (filters?.onlyActive) {
      qBuilder = qBuilder.eq('ativo', true);
    }

    if (filters?.categorySlug) {
      const cat = await this.getCategoryBySlug(filters.categorySlug);
      if (cat) {
        qBuilder = qBuilder.eq('categoria_id', cat.id);
      } else {
        return [];
      }
    }

    if (filters?.query) {
      qBuilder = qBuilder.ilike('nome', `%${filters.query}%`);
    }

    const { data, error } = await qBuilder.order('created_at', { ascending: false });
    if (error) throw error;
    return data as Produto[];
  },

  async getProductBySlug(slug: string): Promise<Produto | null> {
    if (isMock) {
      const prod = dynamicProducts.find(p => p.slug === slug && !p.deleted_at);
      if (!prod) return null;
      return {
        ...prod,
        categoria: dynamicCategories.find(c => c.id === prod.categoria_id)
      };
    }

    // Direct fetch with relations (joining fabrics/materials)
    const { data, error } = await supabase
      .from('produtos')
      .select('*, categoria:categorias(*), imagens:produto_imagens(*)')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error || !data) return null;

    // Fetch relational bindings
    const { data: fabrics } = await supabase.from('produto_tecidos').select('tecidos(*)').eq('produto_id', data.id);
    const { data: materials } = await supabase.from('produto_materiais').select('materiais(*)').eq('produto_id', data.id);

    return {
      ...data,
      tecidos: fabrics?.map((f: any) => f.tecidos) || [],
      materiais: materials?.map((m: any) => m.materiais) || []
    } as Produto;
  },

  async getDestaques(): Promise<Produto[]> {
    if (isMock) {
      return dynamicProducts.filter(p => p.destaque && p.ativo && !p.deleted_at).map(p => ({
        ...p,
        categoria: dynamicCategories.find(c => c.id === p.categoria_id)
      }));
    }
    const { data, error } = await supabase
      .from('produtos')
      .select('*, categoria:categorias(*), imagens:produto_imagens(*)')
      .eq('destaque', true)
      .eq('ativo', true)
      .is('deleted_at', null);

    if (error) throw error;
    return data as Produto[];
  },

  // --- BANNERS ---
  async getBanners(): Promise<Banner[]> {
    if (isMock) {
      return dynamicBanners.filter(b => b.ativo).sort((a, b) => a.ordem - b.ordem);
    }
    const { data, error } = await supabase.from('banners').select('*').eq('ativo', true).order('ordem', { ascending: true });
    if (error) throw error;
    return data as Banner[];
  },

  // --- TESTIMONIALS ---
  async getTestimonials(): Promise<Depoimento[]> {
    if (isMock) {
      return dynamicTestimonials.filter(t => t.ativo);
    }
    const { data, error } = await supabase.from('depoimentos').select('*').eq('ativo', true).order('created_at', { ascending: false });
    if (error) throw error;
    return data as Depoimento[];
  },

  // --- LEADS / BUDGETS ---
  async createLead(leadData: Partial<LeadOrcamento>): Promise<LeadOrcamento> {
    if (isMock) {
      const newLead: LeadOrcamento = {
        id: `lead-${Date.now()}`,
        nome: leadData.nome || '',
        telefone: leadData.telefone || '',
        email: leadData.email || '',
        mensagem: leadData.mensagem || '',
        produto_id: leadData.produto_id || null,
        status: 'novo',
        origem: leadData.origem || 'Site',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        produto: dynamicProducts.find(p => p.id === leadData.produto_id)
      };
      MOCK_LEADS.unshift(newLead);
      return newLead;
    }

    const { data, error } = await supabase.from('leads_orcamento').insert([leadData]).select('*, produto:produtos(*)').single();
    if (error) throw error;
    return data as LeadOrcamento;
  },

  async getLeads(): Promise<LeadOrcamento[]> {
    if (isMock) {
      return MOCK_LEADS;
    }
    const { data, error } = await supabase.from('leads_orcamento').select('*, produto:produtos(*)').order('created_at', { ascending: false });
    if (error) throw error;
    return data as LeadOrcamento[];
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
    if (isMock) {
      const lead = MOCK_LEADS.find(l => l.id === id);
      if (lead) {
        lead.status = status;
        lead.updated_at = new Date().toISOString();
        return true;
      }
      return false;
    }
    const { error } = await supabase.from('leads_orcamento').update({ status }).eq('id', id);
    return !error;
  },

  // --- TECIDOS & MATERIAIS ---
  async getTecidos(): Promise<Tecido[]> {
    if (isMock) return dynamicFabrics.filter(f => f.ativo);
    const { data, error } = await supabase.from('tecidos').select('*').eq('ativo', true);
    if (error) throw error;
    return data as Tecido[];
  },

  async getMateriais(): Promise<Material[]> {
    if (isMock) return dynamicMaterials.filter(m => m.ativo);
    const { data, error } = await supabase.from('materiais').select('*').eq('ativo', true);
    if (error) throw error;
    return data as Material[];
  },

  // --- PROJECTS ---
  async getProjects(): Promise<Projeto[]> {
    if (isMock) return dynamicProjects.filter(p => p.ativo);
    const { data, error } = await supabase.from('projetos').select('*, imagens:projeto_imagens(*)').eq('ativo', true);
    if (error) throw error;
    return data as Projeto[];
  },

  // --- USER AUTH & USERS (Server-only backend methods) ---
  async getUserByEmail(email: string): Promise<Usuario | null> {
    if (isMock) {
      // Return a default admin user mock
      if (email === 'admin@fabrica.com.br') {
        return {
          id: 'user-admin-id',
          nome: 'Administrador Fábrica',
          email: 'admin@fabrica.com.br',
          password_hash: '$2a$10$Y1sL9m1kHwXjP/7F.O2sU.JqN24Qx55s.6D2F3H5G6u5g4d3e2c1b', // bcrypt dummy for 'admin123'
          role: 'admin',
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return null;
    }

    if (!supabaseAdmin) return null;
    const { data, error } = await supabaseAdmin.from('usuarios').select('*').eq('email', email).eq('ativo', true).single();
    if (error) return null;
    return data as Usuario;
  },

  // --- AUDIT LOGS ---
  async createAuditLog(log: Partial<LogAuditoria>): Promise<void> {
    const newLog: LogAuditoria = {
      id: `log-${Date.now()}`,
      usuario_id: log.usuario_id || null,
      acao: log.acao || '',
      old_data: log.old_data || null,
      new_data: log.new_data || null,
      ip_address: log.ip_address || '127.0.0.1',
      created_at: new Date().toISOString()
    };

    if (isMock) {
      MOCK_LOGS.unshift(newLog);
      console.log('Audit Log Created:', newLog);
      return;
    }

    if (supabaseAdmin) {
      await supabaseAdmin.from('logs_auditoria').insert([newLog]);
    }
  },

  async getAuditLogs(): Promise<LogAuditoria[]> {
    if (isMock) {
      return MOCK_LOGS;
    }
    if (!supabaseAdmin) return [];
    const { data, error } = await supabaseAdmin.from('logs_auditoria').select('*, usuario:usuarios(nome, email)').order('created_at', { ascending: false });
    if (error) throw error;
    return data as LogAuditoria[];
  },

  // --- DYNAMIC CRUD METHODS (ADMIN PORTAL INTERFACES) ---
  // These simulate write-operations locally and execute them on Supabase in production.
  async saveProduct(prodData: Partial<Produto>): Promise<Produto> {
    if (isMock) {
      if (prodData.id && dynamicProducts.some(p => p.id === prodData.id)) {
        // Update
        const idx = dynamicProducts.findIndex(p => p.id === prodData.id);
        const oldProd = dynamicProducts[idx];
        const updatedProd = {
          ...oldProd,
          ...prodData,
          updated_at: new Date().toISOString()
        } as Produto;
        dynamicProducts[idx] = updatedProd;
        
        await this.createAuditLog({
          usuario_id: 'user-admin-id',
          acao: 'PRODUTO_UPDATE',
          old_data: oldProd as any,
          new_data: updatedProd as any
        });
        
        return updatedProd;
      } else {
        // Create
        const newProd: Produto = {
          id: `prod-${Date.now()}`,
          categoria_id: prodData.categoria_id || 'cat-sofas',
          nome: prodData.nome || '',
          slug: prodData.slug || '',
          descricao: prodData.descricao || '',
          dimensoes: prodData.dimensoes || {},
          garantia: prodData.garantia || '',
          ativo: prodData.ativo ?? true,
          destaque: prodData.destaque ?? false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          imagens: prodData.imagens || [],
          tecidos: prodData.tecidos || [],
          materiais: prodData.materiais || []
        };
        dynamicProducts.push(newProd);

        await this.createAuditLog({
          usuario_id: 'user-admin-id',
          acao: 'PRODUTO_CREATE',
          old_data: null,
          new_data: newProd as any
        });

        return newProd;
      }
    }

    // Production Supabase Write
    // Implemented inside Server Actions/API handlers for safety
    throw new Error('Database write operation must be executed via authenticated Server Action.');
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isMock) {
      const idx = dynamicProducts.findIndex(p => p.id === id);
      if (idx !== -1) {
        const oldProd = dynamicProducts[idx];
        dynamicProducts[idx] = {
          ...oldProd,
          deleted_at: new Date().toISOString(),
          ativo: false
        };
        await this.createAuditLog({
          usuario_id: 'user-admin-id',
          acao: 'PRODUTO_DELETE',
          old_data: oldProd as any,
          new_data: { deleted: true }
        });
        return true;
      }
      return false;
    }
    throw new Error('Database delete operation must be executed via authenticated Server Action.');
  }
};
export default dbService;
