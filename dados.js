export const biblioteca = [
  {
    title: 'Maçã',
    path: 'assets/biblioteca/maca.jpg',
    mime: 'image/jpeg',
    alt: 'Maçã vermelha com folha verde em fundo amarelo-claro.',
    description: 'Uma fruta para nomear, descrever e agrupar com outros alimentos.'
  },
  {
    title: 'Gato',
    path: 'assets/biblioteca/gato.jpg',
    mime: 'image/jpeg',
    alt: 'Gato laranja e branco sentado em fundo lilás.',
    description: 'Uma figura para conversar sobre animais, seus sons e onde vivem.'
  },
  {
    title: 'Guarda-chuva',
    path: 'assets/biblioteca/guarda-chuva.jpg',
    mime: 'image/jpeg',
    alt: 'Guarda-chuva turquesa aberto em fundo verde-claro.',
    description: 'Combine a figura com o som da chuva para trabalhar associações.'
  },
  {
    title: 'Sino suave',
    path: 'assets/biblioteca/sino-suave.wav',
    mime: 'audio/wav',
    duration: '3 s',
    description: 'Um toque breve para perceber quando o som começa e desaparece.'
  },
  {
    title: 'Três batidas',
    path: 'assets/biblioteca/tres-batidas.wav',
    mime: 'audio/wav',
    duration: '3 s',
    description: 'Uma sequência curta para contar e imitar o ritmo das batidas.'
  },
  {
    title: 'Chuva leve',
    path: 'assets/biblioteca/chuva-leve.wav',
    mime: 'audio/wav',
    duration: '6 s',
    description: 'Um som contínuo para identificar, descrever e relacionar a uma cena.'
  },
  {
    title: 'Grave e agudo',
    path: 'assets/biblioteca/grave-e-agudo.wav',
    mime: 'audio/wav',
    duration: '4 s',
    description: 'Duas batidas graves e duas agudas para comparar a altura dos sons.'
  },
  {
    title: 'Palmas ritmadas',
    path: 'assets/biblioteca/palmas-ritmadas.wav',
    mime: 'audio/wav',
    duration: '4 s',
    description: 'Um ritmo de palmas para ouvir, contar e repetir com o corpo.'
  },
  {
    title: 'Tique-taque',
    path: 'assets/biblioteca/tique-taque.wav',
    mime: 'audio/wav',
    duration: '5 s',
    description: 'O som de um relógio para trabalhar atenção, pulso e espera.'
  },
  {
    title: 'Escala que sobe',
    path: 'assets/biblioteca/escala-que-sobe.wav',
    mime: 'audio/wav',
    duration: '4 s',
    description: 'Oito notas do grave ao agudo para acompanhar com o corpo ou com a voz.'
  },
  {
    title: 'Longo e curto',
    path: 'assets/biblioteca/longo-e-curto.wav',
    mime: 'audio/wav',
    duration: '5 s',
    description: 'Um som longo seguido de dois curtos para comparar a duração.'
  },
  {
    title: 'Gotas',
    path: 'assets/biblioteca/gotas.wav',
    mime: 'audio/wav',
    duration: '5 s',
    description: 'Gotas caindo em ritmos diferentes para contar e imaginar uma cena.'
  }
];

export const demoProfile = {
  fullName: 'Marina Alves Ribeiro',
  personalEmail: 'marina.pessoal@example.com',
  personalPhone: '(00) 90000-0000',
  displayName: 'Marina Alves',
  role: 'Fonoaudióloga',
  bio: 'Atendimento em linguagem infantil e criação de atividades para famílias e educadores.',
  about: 'Trabalho com crianças em idade pré-escolar e escolar. Uso histórias, brincadeiras e materiais visuais para estimular a comunicação e orientar as famílias nas atividades do dia a dia.',
  specialties: 'Linguagem infantil\nDesenvolvimento da comunicação\nHabilidades narrativas',
  education: 'Graduação em Fonoaudiologia\nEspecialização em Linguagem',
  experience: 'Atendimento clínico infantil\nCriação de materiais e orientação a famílias e educadores',
  location: 'Marília, SP',
  officeAddress: 'Rua Exemplo, 120, sala 4',
  modality: 'Presencial e on-line',
  audience: 'Crianças em idade pré-escolar e escolar e suas famílias',
  registration: 'CRFa de demonstração',
  workEmail: 'marina.atendimento@example.com',
  workPhone: '(00) 90000-0001'
};

export const profissionais = [
  {
    slug: 'lia-martins',
    name: 'Lia Martins',
    initials: 'LM',
    role: 'Pedagoga',
    color: 'mint',
    bio: 'Propostas de alfabetização e aprendizagem para os primeiros anos.',
    location: 'Marília, SP',
    address: { street: 'Rua Exemplo', number: '120', complement: 'Sala 4', district: 'Bairro Modelo' },
    modalities: ['Presencial', 'On-line'],
    audience: 'Crianças dos anos iniciais, famílias e educadores',
    email: 'lia.martins@example.com',
    whatsapp: { display: '(14) 9XXXX-XXXX' },
    about: 'Lia trabalha com alfabetização nos anos iniciais do ensino fundamental. Planeja atividades de leitura, escrita e consciência fonológica com jogos e histórias. Também orienta famílias e educadores na adaptação dessas propostas para diferentes ritmos de aprendizagem.',
    specialties: ['Alfabetização e letramento', 'Consciência fonológica', 'Adaptação de atividades'],
    education: ['Licenciatura em Pedagogia', 'Especialização em Alfabetização e Letramento'],
    experience: ['Docência em turmas do 1º ao 3º ano do ensino fundamental', 'Criação de materiais e condução de oficinas de alfabetização'],
    portfolio: [
      {
        title: 'Rodas de rimas',
        description: 'Sequência de atividades em grupo para explorar sons finais de palavras com cantigas, leitura em voz alta e jogos de pareamento.',
        format: 'Atividade em grupo',
        audience: 'Turmas dos anos iniciais do ensino fundamental',
        image: { path: 'assets/rodas-de-rimas.jpg', alt: 'Cartas ilustradas com um pato, um gato e um rato sobre uma mesa lilás.' },
        steps: [
          'Convide a turma a nomear as figuras em voz alta. Comece com pato, gato e rato.',
          'Peça que as crianças agrupem as cartas que rimam e comparem o som final das palavras.',
          'Proponha que cada grupo sugira uma nova palavra para uma das rimas.'
        ],
        materialId: 'rimas'
      }
    ]
  },
  {
    slug: 'bia-costa',
    name: 'Bia Costa',
    initials: 'BC',
    role: 'Fonoaudióloga',
    color: 'violet',
    bio: 'Recursos para trabalhar linguagem oral e construção de narrativas.',
    location: 'Campinas, SP',
    address: { street: 'Avenida Exemplo', number: '240', complement: 'Sala 2', district: 'Bairro Modelo' },
    modalities: ['Presencial'],
    audience: 'Crianças em idade pré-escolar e escolar',
    email: 'bia.costa@example.com',
    whatsapp: { display: '(19) 9XXXX-XXXX' },
    about: 'Bia atua com linguagem infantil em contexto clínico. Desenvolve propostas para ampliar o vocabulário, organizar ideias e recontar histórias. Em suas atividades, usa imagens e brincadeiras para apoiar a comunicação no cotidiano.',
    specialties: ['Linguagem infantil', 'Linguagem oral', 'Habilidades narrativas'],
    education: ['Graduação em Fonoaudiologia', 'Especialização em Linguagem'],
    experience: ['Atendimento fonoaudiológico infantil', 'Elaboração de recursos para oficinas de narrativa oral'],
    portfolio: [
      {
        title: 'Oficinas de narrativa oral',
        description: 'Atividades para construir e recontar histórias usando imagens, perguntas de apoio e sequências de acontecimentos.',
        format: 'Oficina de linguagem',
        audience: 'Crianças em idade pré-escolar e escolar',
        image: { path: 'assets/oficina-de-narrativa.jpg', alt: 'Três cartões ilustram o plantio de uma semente, a rega de uma muda e um girassol aberto.' },
        steps: [
          'Apresente as imagens fora de ordem e peça que a criança descreva cada cena.',
          'Organizem juntos a sequência e conversem sobre o que aconteceu primeiro, depois e no final.',
          'Convide a criança a recontar a história com suas próprias palavras, usando as imagens como apoio.'
        ],
        materialId: 'historias'
      }
    ]
  },
  {
    slug: 'rafa-nunes',
    name: 'Rafa Nunes',
    initials: 'RN',
    role: 'Pedagogo',
    color: 'honey',
    bio: 'Brincadeiras e experiências de leitura pensadas para trabalhar em grupo.',
    location: 'Sorocaba, SP',
    address: { street: 'Rua Modelo', number: '80', district: 'Bairro Exemplo' },
    modalities: ['Presencial', 'On-line'],
    audience: 'Turmas do ensino fundamental e educadores',
    email: 'rafa.nunes@example.com',
    whatsapp: { display: '(15) 9XXXX-XXXX' },
    about: 'Rafa desenvolve experiências de leitura compartilhada para turmas do ensino fundamental. Usa jogos de palavras e rodas de leitura para que as crianças pratiquem a leitura em grupo e conversem sobre as histórias.',
    specialties: ['Mediação de leitura', 'Jogos de linguagem', 'Aprendizagem em grupo'],
    education: ['Licenciatura em Pedagogia', 'Formação complementar em Mediação de Leitura'],
    experience: ['Condução de rodas de leitura em escolas', 'Planejamento de oficinas e produção de materiais de linguagem']
  },
  {
    slug: 'carla-mendes',
    name: 'Carla Mendes',
    initials: 'CM',
    role: 'Fonoaudióloga',
    color: 'mint',
    bio: 'Atividades de escuta, atenção auditiva e consciência dos sons.',
    location: 'Ribeirão Preto, SP',
    modalities: ['Presencial', 'On-line'],
    audience: 'Crianças em idade escolar e suas famílias',
    email: 'carla.mendes@example.com',
    about: 'Carla atende crianças com dificuldades de atenção auditiva e de discriminação de sons. Cria jogos com sons do cotidiano para treinar a escuta de forma leve, em casa e na escola.',
    specialties: ['Processamento auditivo', 'Atenção auditiva', 'Jogos de escuta'],
    education: ['Graduação em Fonoaudiologia', 'Especialização em Audiologia'],
    experience: ['Atendimento clínico infantil', 'Formação de professores em atividades de escuta']
  },
  {
    slug: 'davi-rocha',
    name: 'Davi Rocha',
    initials: 'DR',
    role: 'Pedagogo',
    color: 'violet',
    bio: 'Rotinas visuais e adaptações para salas inclusivas.',
    location: 'Londrina, PR',
    modalities: ['Presencial'],
    audience: 'Educação infantil, professores e equipes escolares',
    email: 'davi.rocha@example.com',
    about: 'Davi trabalha com educação inclusiva na educação infantil. Organiza rotinas visuais, combinados e adaptações de atividades para que todas as crianças participem da aula.',
    specialties: ['Educação inclusiva', 'Rotina visual', 'Adaptação curricular'],
    education: ['Licenciatura em Pedagogia', 'Especialização em Educação Especial e Inclusiva'],
    experience: ['Professor de educação infantil', 'Apoio pedagógico a equipes escolares']
  },
  {
    slug: 'helena-sato',
    name: 'Helena Sato',
    initials: 'HS',
    role: 'Fonoaudióloga',
    color: 'honey',
    bio: 'Comunicação alternativa e pranchas para crianças que ainda não falam.',
    location: 'São Paulo, SP',
    modalities: ['Presencial', 'On-line'],
    audience: 'Crianças com necessidades complexas de comunicação e suas famílias',
    email: 'helena.sato@example.com',
    about: 'Helena atua com comunicação suplementar e alternativa. Monta pranchas e rotinas de comunicação junto com as famílias para que a criança consiga pedir, escolher e conversar.',
    specialties: ['Comunicação alternativa', 'Pranchas de comunicação', 'Orientação a famílias'],
    education: ['Graduação em Fonoaudiologia', 'Formação em Comunicação Suplementar e Alternativa'],
    experience: ['Atendimento clínico e domiciliar', 'Produção de pranchas personalizadas']
  }
];

const bySlug = new Map(profissionais.map(person => [person.slug, person]));

export const materials = [
  { id:'rimas', slug:'cartas-de-rimas', title:'Cartas de rimas', authorSlug:'lia-martins', area:'pedagogia', label:'Pedagogia', art:'Aa', color:'violet', type:'Ficha em PDF', description:'Cartas recortáveis para reconhecer palavras que terminam com sons parecidos.', download:{ path:'assets/cartas-de-rimas.pdf', filename:'miudoverso-cartas-de-rimas.pdf' } },
  { id:'historias', slug:'sequencias-para-contar-historias', title:'Sequências para contar histórias', authorSlug:'bia-costa', area:'fonoaudiologia', label:'Fonoaudiologia', art:'1·2·3', color:'mint', type:'Caderno', price:'R$ 19,90', description:'Atividades para ordenar acontecimentos, descrever ações e recontar uma história.' },
  { id:'palavras', slug:'brincar-com-as-palavras', title:'Brincar com as palavras', authorSlug:'rafa-nunes', area:'pedagogia', label:'Pedagogia', art:'A+B', color:'honey', type:'E-book', price:'R$ 29,90', description:'Brincadeiras com letras, palavras e histórias para atividades de alfabetização.' },
  { id:'bingo', slug:'bingo-de-sons', title:'Bingo de sons', authorSlug:'carla-mendes', area:'fonoaudiologia', label:'Fonoaudiologia', art:'♪', color:'mint', type:'Ficha em PDF', description:'Cartela para reconhecer sons do dia a dia, como chuva, sino e passarinho.', download:{ path:'assets/bingo-de-sons.pdf', filename:'miudoverso-bingo-de-sons.pdf' } },
  { id:'rotina', slug:'rotina-visual-da-sala', title:'Rotina visual da sala', authorSlug:'davi-rocha', area:'pedagogia', label:'Pedagogia', art:'1→6', color:'violet', type:'Cartões em PDF', description:'Seis cartões para organizar e antecipar os momentos do dia na educação infantil.', download:{ path:'assets/rotina-visual.pdf', filename:'miudoverso-rotina-visual.pdf' } },
  { id:'pranchas', slug:'pranchas-de-comunicacao', title:'Pranchas de comunicação', authorSlug:'helena-sato', area:'fonoaudiologia', label:'Fonoaudiologia', art:'Sim', color:'honey', type:'Kit para imprimir', price:'R$ 24,90', description:'Pranchas com pedidos, escolhas e sentimentos para crianças que usam comunicação alternativa.' },
  { id:'memoria', slug:'memoria-de-rimas', title:'Memória de rimas', authorSlug:'lia-martins', area:'pedagogia', label:'Pedagogia', art:'Par', color:'mint', type:'Jogo para imprimir', price:'R$ 12,90', description:'Um jogo da memória em que os pares são palavras que rimam.' },
  { id:'escuta', slug:'caderno-de-escuta', title:'Caderno de escuta', authorSlug:'carla-mendes', area:'fonoaudiologia', label:'Fonoaudiologia', art:'Ouvi', color:'violet', type:'E-book', price:'R$ 27,90', description:'Vinte propostas para treinar atenção e memória auditiva em casa e na escola.' },
  { id:'recontar', slug:'historias-para-recontar', title:'Histórias para recontar', authorSlug:'bia-costa', area:'fonoaudiologia', label:'Fonoaudiologia', art:'Era', color:'honey', type:'Caderno', price:'R$ 15,90', description:'Histórias curtas com perguntas de apoio para treinar o reconto oral.' }
].map(item => ({ ...item, author: bySlug.get(item.authorSlug).name }));

export const materialPath = item => 'materiais/' + item.slug + '/';

export const publicacoes = [
  {
    id: 'p1', authorSlug: 'lia-martins', when: 'há 2 horas', kind: 'Novo material', likes: 24, materialId: 'rimas',
    text: 'Publiquei as Cartas de rimas! São cartas para recortar e brincar de encontrar palavras que terminam com o mesmo som. O PDF é gratuito.'
  },
  {
    id: 'p2', authorSlug: 'bia-costa', when: 'ontem', kind: 'Dica', likes: 41,
    text: 'Dica para recontar histórias: antes de pedir o reconto, deixe a criança organizar as imagens sozinha e só depois pergunte o que aconteceu primeiro. Ela se apropria da sequência e o reconto fica mais rico.'
  },
  {
    id: 'p3', authorSlug: 'rafa-nunes', when: 'há 2 dias', kind: 'Experiência', likes: 18,
    text: 'A roda de leitura do 2º ano virou um jogo: cada criança dizia uma palavra que começasse com a última letra da palavra anterior. Ninguém queria parar.'
  },
  {
    id: 'p4', authorSlug: 'bia-costa', when: 'há 3 dias', kind: 'Portfólio', likes: 33,
    image: { path: 'assets/oficina-de-narrativa.jpg', alt: 'Três cartões ilustram o plantio de uma semente, a rega de uma muda e um girassol aberto.' },
    text: 'Registros da oficina de narrativa oral desta semana: plantar, regar e ver o girassol abrir. As crianças adoraram contar a história de trás para frente.'
  },
  {
    id: 'p5', authorSlug: 'lia-martins', when: 'há 5 dias', kind: 'Recurso', likes: 15,
    link: { href: 'sons/', label: 'Ouvir no Miudoverso Sons' },
    text: 'Usei o som Chuva leve junto com a imagem do guarda-chuva do Miudoverso Visual. A turma inventou uma história inteira a partir dos dois.'
  },
  {
    id: 'p6', authorSlug: 'carla-mendes', when: 'há 6 dias', kind: 'Novo material', likes: 37, materialId: 'bingo',
    text: 'Fiz um bingo de sons para as sessões de atenção auditiva e resolvi compartilhar. Funciona muito bem com os sons do Miudoverso Sons.'
  },
  {
    id: 'p7', authorSlug: 'davi-rocha', when: 'há 1 semana', kind: 'Dica', likes: 29, materialId: 'rotina',
    text: 'Rotina visual não é só para crianças com deficiência: quando todos sabem o que vem depois, a turma inteira fica mais tranquila. Deixei meus cartões para baixar.'
  },
  {
    id: 'p8', authorSlug: 'helena-sato', when: 'há 1 semana', kind: 'Experiência', likes: 52,
    text: 'Hoje uma criança que acompanho usou a prancha para pedir "mais" pela primeira vez durante o lanche. A família chorou junto. É por isso que vale cada recorte.'
  },
  {
    id: 'p9', authorSlug: 'rafa-nunes', when: 'há 2 semanas', kind: 'Dica', likes: 21,
    text: 'Para quem está começando a ler: leia o título, esconda a capa e peça que a turma adivinhe do que trata a história. A leitura começa antes da primeira página.'
  },
  {
    id: 'p10', authorSlug: 'carla-mendes', when: 'há 2 semanas', kind: 'Recurso', likes: 19,
    link: { href: 'sons/', label: 'Ouvir no Miudoverso Sons' },
    text: 'O som Grave e agudo é ótimo para começar a falar de altura dos sons. Peço que a criança suba os braços no agudo e abaixe no grave.'
  }
];

// Endereço público da prévia: usado nas tags de compartilhamento e na página de erro.
export const site = { url: 'https://preview.ywd.com.br/miudoverso/' };

// Troque os campos [definir …] antes de divulgar a prévia. O build avisa enquanto eles existirem.
export const privacidade = {
  responsavel: '[definir responsável pelos dados]',
  email: '[definir e-mail de contato]',
  atualizada: '27 de novembro de 2026'
};

// Artigos do Miudoverso Inspira. O texto de cada um fica em paginas/<slug>.html.
export const artigos = [
  { slug: 'rimas', label: 'Pedagogia', title: 'Como adaptar uma atividade de rimas para diferentes turmas', summary: 'Três caminhos para trabalhar a mesma proposta com níveis diferentes de autonomia.', link: 'Ler sobre atividades de rimas' },
  { slug: 'jogos-de-escuta', label: 'Fonoaudiologia', title: 'Quatro jogos de escuta com sons do dia a dia', summary: 'Propostas rápidas para treinar atenção auditiva em casa, na escola ou no consultório.', link: 'Ler sobre jogos de escuta' },
  { slug: 'imagens-e-vocabulario', label: 'Pedagogia', title: 'Como usar uma imagem para ampliar o vocabulário', summary: 'Três perguntas para tirar mais de cada figura.', link: 'Ler sobre imagens e vocabulário' },
  { slug: 'ebook-autoral', label: 'Criação de materiais', title: 'O que preparar antes de publicar seu primeiro e-book', summary: 'Cuidados com a descrição, a amostra e os direitos de uso dos recursos.', link: 'Ler sobre publicação de e-books' },
  { slug: 'precificar-material', label: 'Criação de materiais', title: 'Quanto cobrar pelo seu primeiro material', summary: 'Um roteiro simples para definir o preço sem desvalorizar o seu trabalho.', link: 'Ler sobre preço de materiais' }
];

// Quantos itens cada lista mostra por página. Para testar a paginação com pouco
// conteúdo, gere o site com MIUDOVERSO_POR_PAGINA=2 npm run build.
export const paginacao = { materiais: 12, visual: 12, sons: 12, inspira: 9, profissionais: 12, feed: 10 };
