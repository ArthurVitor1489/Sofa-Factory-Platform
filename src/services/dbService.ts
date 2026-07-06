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
    id: 'cat-cadeiras',
    nome: 'Cadeiras',
    slug: 'cadeiras',
    descricao: 'Cadeiras estofadas e em madeira maciça com ergonomia e durabilidade.',
    imagem_url: '/images/cadeira_sofia.png',
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
  },
  {
    id: 'prod-sofa-modular-turim',
    categoria_id: 'cat-sofas',
    nome: 'Sofá Modular Turim Bouclé',
    slug: 'sofa-modular-turim-boucle',
    descricao: 'Sofá modular de canto com curvas orgânicas contemporâneas. Revestido em bouclé premium off-white, proporciona modularidade total para se adequar ao desenho da sua sala.',
    dimensoes: { largura: '3.40m x 2.20m', altura: '0.82m', profundidade: '1.05m' },
    garantia: '3 anos de garantia estrutural',
    ativo: true,
    destaque: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-7', produto_id: 'prod-sofa-modular-turim', url: '/images/sofa_turim.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[1], MOCK_FABRICS[0]],
    materiais: [MOCK_MATERIALS[0], MOCK_MATERIALS[1]]
  },
  {
    id: 'prod-sofa-couro-legacy',
    categoria_id: 'cat-sofas',
    nome: 'Sofá de Couro Legacy',
    slug: 'sofa-couro-legacy',
    descricao: 'Estofado estilo Chesterfield revestido em couro natural legítimo. Acabamento artesanal capitonê com costuras reforçadas e pés em madeira maciça com detalhes em bronze.',
    dimensoes: { largura: '2.30m', altura: '0.78m', profundidade: '0.95m' },
    garantia: '5 anos de garantia estrutural e do couro',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-8', produto_id: 'prod-sofa-couro-legacy', url: '/images/sofa_legacy.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[3]],
    materiais: [MOCK_MATERIALS[0], MOCK_MATERIALS[1]]
  },
  {
    id: 'prod-sofa-retratil-istambul',
    categoria_id: 'cat-sofas',
    nome: 'Sofá Retrátil Istambul',
    slug: 'sofa-retratil-istambul',
    descricao: 'Sofá retrátil e reclinável com acionamento manual suave. Pillow top de espuma D33 soft com molas ensacadas no assento e encosto de fibra de silicone siliconada.',
    dimensoes: { largura: '2.60m', altura: '1.02m', profundidade: '1.20m (fechado) / 1.80m (aberto)' },
    garantia: '3 anos de garantia estrutural',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-9', produto_id: 'prod-sofa-retratil-istambul', url: '/images/sofa_istambul.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[4], MOCK_FABRICS[2]],
    materiais: [MOCK_MATERIALS[0], MOCK_MATERIALS[1], MOCK_MATERIALS[2]]
  },
  {
    id: 'prod-poltrona-giratoria-genova',
    categoria_id: 'cat-poltronas',
    nome: 'Poltrona Giratória Gênova',
    slug: 'poltrona-giratoria-genova',
    descricao: 'Poltrona com base giratória 360 graus em aço carbono. Revestida em veludo verde floresta premium com encosto ergonômico anatômico e almofada decorativa de apoio lombar.',
    dimensoes: { largura: '0.82m', altura: '0.88m', profundidade: '0.80m' },
    garantia: '2 anos de garantia',
    ativo: true,
    destaque: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-10', produto_id: 'prod-poltrona-giratoria-genova', url: '/images/poltrona_genova.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[2], MOCK_FABRICS[0]],
    materiais: [MOCK_MATERIALS[0], MOCK_MATERIALS[1]]
  },
  {
    id: 'prod-poltrona-costela-adao',
    categoria_id: 'cat-poltronas',
    nome: 'Poltrona Costela de Adão Avelã',
    slug: 'poltrona-costela-adao-avela',
    descricao: 'Design clássico de Martin Eisler com estrutura de ripas em madeira curvada natural. Almofadas capitonê em tecido linho avelã preenchidas com fibra de poliéster siliconada super macia.',
    dimensoes: { largura: '0.74m', altura: '0.82m', profundidade: '0.90m' },
    garantia: '2 anos de garantia estrutural',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-11', produto_id: 'prod-poltrona-costela-adao', url: '/images/poltrona_costela.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[0], MOCK_FABRICS[2]],
    materiais: [MOCK_MATERIALS[0], MOCK_MATERIALS[1]]
  },
  {
    id: 'prod-poltrona-minimalista-viena',
    categoria_id: 'cat-poltronas',
    nome: 'Poltrona Minimalista Viena',
    slug: 'poltrona-minimalista-viena',
    descricao: 'Poltrona com estrutura aparente em tubo de aço carbono preto microtexturizado. Assento e encosto ergonômicos em couro legítimo suspenso com percintas de alta resistência.',
    dimensoes: { largura: '0.70m', altura: '0.75m', profundidade: '0.78m' },
    garantia: '2 anos de garantia estrutural',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-12', produto_id: 'prod-poltrona-minimalista-viena', url: '/images/poltrona_viena.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[3]],
    materiais: [MOCK_MATERIALS[0]]
  },
  {
    id: 'prod-mesa-jantar-fenix',
    categoria_id: 'cat-mesas',
    nome: 'Mesa de Jantar Retangular Fenix',
    slug: 'mesa-jantar-retangular-fenix',
    descricao: 'Mesa de jantar de alto padrão com tampo em MDF laminado de nogueira americana e bordas chanfradas. Base geométrica escultural em madeira maciça.',
    dimensoes: { largura: '2.40m', altura: '0.76m', profundidade: '1.20m' },
    garantia: '3 anos de garantia estrutural',
    ativo: true,
    destaque: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-13', produto_id: 'prod-mesa-jantar-fenix', url: '/images/mesa_fenix.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [],
    materiais: [MOCK_MATERIALS[0]]
  },
  {
    id: 'prod-mesa-centro-seixos',
    categoria_id: 'cat-mesas',
    nome: 'Mesa de Centro Orgânica Seixos',
    slug: 'mesa-centro-organica-seixos',
    descricao: 'Conjunto de duas mesas de centro orgânicas aninhadas com alturas diferentes. Tampo texturizado em microcimento off-white e pés cilíndricos robustos de carvalho.',
    dimensoes: { largura: '1.20m e 0.90m', altura: '0.35m e 0.28m', profundidade: '0.80m e 0.60m' },
    garantia: '2 anos de garantia',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-14', produto_id: 'prod-mesa-centro-seixos', url: '/images/mesa_seixos.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [],
    materiais: [MOCK_MATERIALS[0]]
  },
  {
    id: 'prod-mesa-apoio-latao',
    categoria_id: 'cat-mesas',
    nome: 'Mesa de Apoio Lateral Latão',
    slug: 'mesa-apoio-lateral-latao',
    descricao: 'Mesa de apoio lateral decorativa cilíndrica fabricada em chapa de latão escovado com detalhes martelados artesanalmente. Peça de destaque com design escultural.',
    dimensoes: { largura: '0.40m (diâmetro)', altura: '0.55m', profundidade: '0.40m' },
    garantia: '1 ano de garantia',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-15', produto_id: 'prod-mesa-apoio-latao', url: '/images/mesa_latao.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [],
    materiais: []
  },
  {
    id: 'prod-cadeira-olivia-madeira',
    categoria_id: 'cat-cadeiras',
    nome: 'Cadeira Olívia Madeira Estofada',
    slug: 'cadeira-olivia-madeira-estofada',
    descricao: 'Cadeira de jantar ergonômica clássica em madeira maciça com assento e encosto anatômicos estofados em linho bege de toque suave.',
    dimensoes: { largura: '0.50m', altura: '0.88m', profundidade: '0.54m' },
    garantia: '3 anos de garantia estrutural',
    ativo: true,
    destaque: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-16', produto_id: 'prod-cadeira-olivia-madeira', url: '/images/cadeira_olivia.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[0], MOCK_FABRICS[1]],
    materiais: [MOCK_MATERIALS[0], MOCK_MATERIALS[1]]
  },
  {
    id: 'prod-cadeira-melissa-couro',
    categoria_id: 'cat-cadeiras',
    nome: 'Cadeira Melissa Couro Sintético',
    slug: 'cadeira-melissa-couro-sintetico',
    descricao: 'Cadeira de jantar contemporânea com concha estofada revestida em couro ecológico terracota. Pés delgados de aço carbono preto.',
    dimensoes: { largura: '0.49m', altura: '0.84m', profundidade: '0.52m' },
    garantia: '2 anos de garantia',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-17', produto_id: 'prod-cadeira-melissa-couro', url: '/images/cadeira_melissa.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[3]],
    materiais: [MOCK_MATERIALS[1]]
  },
  {
    id: 'prod-cadeira-munique-minimalista',
    categoria_id: 'cat-cadeiras',
    nome: 'Cadeira Munique Minimalista',
    slug: 'cadeira-munique-minimalista',
    descricao: 'Cadeira de jantar com linhas retas e marcantes. Fabricada inteiramente em madeira maciça de freixo natural com encosto ligeiramente curvado para maior conforto.',
    dimensoes: { largura: '0.46m', altura: '0.81m', profundidade: '0.48m' },
    garantia: '3 anos de garantia estrutural',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-18', produto_id: 'prod-cadeira-munique-minimalista', url: '/images/cadeira_munique.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [],
    materiais: [MOCK_MATERIALS[0]]
  },
  {
    id: 'prod-sofa-modular-seul',
    categoria_id: 'cat-sofas',
    nome: 'Sofá Modular Seul',
    slug: 'sofa-modular-seul',
    descricao: 'Sofá modular retilíneo minimalista com assento baixo e design de inspiração oriental. Estofamento em linho rústico cinza-mescla e almofadas de encosto soltas.',
    dimensoes: { largura: '3.00m', altura: '0.72m', profundidade: '1.00m' },
    garantia: '3 anos de garantia estrutural',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-19', produto_id: 'prod-sofa-modular-seul', url: '/images/sofa_seul.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[4], MOCK_FABRICS[0]],
    materiais: [MOCK_MATERIALS[0], MOCK_MATERIALS[1]]
  },
  {
    id: 'prod-sofa-retratil-istambul-luxo',
    categoria_id: 'cat-sofas',
    nome: 'Sofá Retrátil Istambul Luxo',
    slug: 'sofa-retratil-istambul-luxo',
    descricao: 'A evolução do conforto. Sistema de reclinamento e abertura automatizados via controle remoto ou aplicativo. Pillow top duplo em espuma viscoelástica.',
    dimensoes: { largura: '2.80m', altura: '1.05m', profundidade: '1.25m (fechado) / 1.90m (aberto)' },
    garantia: '5 anos de garantia na estrutura e motorização',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-20', produto_id: 'prod-sofa-retratil-istambul-luxo', url: '/images/sofa_istambul_luxo.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[0], MOCK_FABRICS[1], MOCK_FABRICS[2]],
    materiais: [MOCK_MATERIALS[0], MOCK_MATERIALS[1], MOCK_MATERIALS[2]]
  },
  {
    id: 'prod-poltrona-decorativa-amora',
    categoria_id: 'cat-poltronas',
    nome: 'Poltrona Decorativa Amora',
    slug: 'poltrona-decorativa-amora',
    descricao: 'Poltrona compacta em formato de gomos orgânicos. Revestimento em bouclé avelã com base em madeira maciça torneada preta.',
    dimensoes: { largura: '0.78m', altura: '0.76m', profundidade: '0.76m' },
    garantia: '2 anos de garantia',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-21', produto_id: 'prod-poltrona-decorativa-amora', url: '/images/poltrona_amora.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[1], MOCK_FABRICS[0]],
    materiais: [MOCK_MATERIALS[0], MOCK_MATERIALS[1]]
  },
  {
    id: 'prod-poltrona-balanco-ninho',
    categoria_id: 'cat-poltronas',
    nome: 'Poltrona de Balanço Ninho',
    slug: 'poltrona-balanco-ninho',
    descricao: 'Poltrona de balanço suspensa ou com base de chão metálica. Tecida artesanalmente com corda náutica e almofada anatômica impermeável em linho cru.',
    dimensoes: { largura: '0.90m', altura: '1.20m', profundidade: '0.85m' },
    garantia: '2 anos de garantia',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-22', produto_id: 'prod-poltrona-balanco-ninho', url: '/images/poltrona_ninho.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[0]],
    materiais: [MOCK_MATERIALS[1]]
  },
  {
    id: 'prod-mesa-jantar-redonda-luna',
    categoria_id: 'cat-mesas',
    nome: 'Mesa de Jantar Redonda Luna',
    slug: 'mesa-jantar-redonda-luna',
    descricao: 'Mesa de jantar circular de design elegante. Base cônica ripada em carvalho americano e tampo com prato giratório embutido em madeira ou mármore.',
    dimensoes: { largura: '1.50m (diâmetro)', altura: '0.76m', profundidade: '1.50m' },
    garantia: '3 anos de garantia estrutural',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-23', produto_id: 'prod-mesa-jantar-redonda-luna', url: '/images/mesa_luna.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [],
    materiais: [MOCK_MATERIALS[0]]
  },
  {
    id: 'prod-mesa-centro-duo',
    categoria_id: 'cat-mesas',
    nome: 'Mesa de Centro Orgânica Duo',
    slug: 'mesa-centro-organica-duo',
    descricao: 'Mesa de centro dupla com tampos em formato ameboide e lâminas selecionadas de freixo natural. Pernas em formato de agulha com ponteiras de latão dourado.',
    dimensoes: { largura: '1.10m e 0.80m', altura: '0.38m e 0.32m', profundidade: '0.70m e 0.55m' },
    garantia: '2 anos de garantia',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-24', produto_id: 'prod-mesa-centro-duo', url: '/images/mesa_duo.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [],
    materiais: [MOCK_MATERIALS[0]]
  },
  {
    id: 'prod-cadeira-cecilia-estofada',
    categoria_id: 'cat-cadeiras',
    nome: 'Cadeira Cecília Estofada',
    slug: 'cadeira-cecilia-estofada',
    descricao: 'Cadeira com encosto arredondado abraçador. Estrutura interna metálica revestida em espuma injetada e estofada em tecido veludo chocolate.',
    dimensoes: { largura: '0.54m', altura: '0.82m', profundidade: '0.55m' },
    garantia: '2 anos de garantia',
    ativo: true,
    destaque: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imagens: [
      { id: 'img-25', produto_id: 'prod-cadeira-cecilia-estofada', url: '/images/cadeira_cecilia.png', ordem: 0, created_at: new Date().toISOString() }
    ],
    tecidos: [MOCK_FABRICS[2], MOCK_FABRICS[1]],
    materiais: [MOCK_MATERIALS[1]]
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
