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
  }
];

const bySlug = new Map(profissionais.map(person => [person.slug, person]));

export const materials = [
  { id:'rimas', slug:'cartas-de-rimas', title:'Cartas de rimas', authorSlug:'lia-martins', area:'pedagogia', label:'Pedagogia', art:'Aa', color:'violet', type:'Ficha em PDF', description:'Cartas recortáveis para reconhecer palavras que terminam com sons parecidos.', download:{ path:'assets/cartas-de-rimas.pdf', filename:'miudoverso-cartas-de-rimas.pdf' } },
  { id:'historias', slug:'sequencias-para-contar-historias', title:'Sequências para contar histórias', authorSlug:'bia-costa', area:'fonoaudiologia', label:'Fonoaudiologia', art:'1·2·3', color:'mint', type:'Caderno', price:'R$ 19,90', description:'Atividades para ordenar acontecimentos, descrever ações e recontar uma história.' },
  { id:'palavras', slug:'brincar-com-as-palavras', title:'Brincar com as palavras', authorSlug:'rafa-nunes', area:'pedagogia', label:'Pedagogia', art:'A+B', color:'honey', type:'E-book', price:'R$ 29,90', description:'Brincadeiras com letras, palavras e histórias para atividades de alfabetização.' }
].map(item => ({ ...item, author: bySlug.get(item.authorSlug).name }));

export const materialPath = item => 'materiais/' + item.slug + '/';
