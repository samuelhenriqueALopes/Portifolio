// ============================================================
//  TODOS OS DADOS DO PORTFÓLIO FICAM AQUI.
// ============================================================

export const profile = {
  name: 'Samuel Henrique Alvarenga e Lopes',
  role: {
    pt: 'Estudante de Engenharia de Software · Back-end & Dados',
    en: 'Software Engineering Student · Back-end & Data',
  },
  photo: '/foto.webp', // foto em public/foto.webp
  cv: '/curriculo.pdf',
  about: {
    pt: [
      'Sou de Belo Horizonte - MG, técnico em Eletroeletrônica formado pelo CEFET-MG (2022–2024) e atualmente curso o 3º período de Engenharia de Software na PUC Minas.',
      'Meu foco é desenvolvimento back-end e dados: gosto de construir APIs, modelar regras de negócio e transformar dados em informação útil. Minha base em eletrônica, microcontroladores (Arduino e ESP32) e redes me dá uma visão prática de como software e hardware se conectam.',
      'Tenho experiência em suporte técnico, manutenção de equipamentos hospitalares e atendimento ao cliente, o que fortaleceu minha comunicação e minha capacidade de resolver problemas sob pressão.',
      'Meu objetivo é atuar como desenvolvedor back-end e evoluir na área de dados, contribuindo em projetos que gerem impacto real enquanto sigo aprendendo continuamente.',
    ],
    en: [
      'I am from Belo Horizonte, Brazil. I hold a technical degree in Electronics from CEFET-MG (2022–2024) and I am currently in the 3rd semester of Software Engineering at PUC Minas.',
      'My focus is back-end development and data: I enjoy building APIs, modeling business rules and turning data into useful information. My background in electronics, microcontrollers (Arduino and ESP32) and networking gives me a practical view of how software and hardware connect.',
      'I have experience in technical support, hospital equipment maintenance and customer service, which strengthened my communication skills and my ability to solve problems under pressure.',
      'My goal is to work as a back-end developer and grow in the data field, contributing to projects with real impact while continuously learning.',
    ],
  },
  skills: [
    'Java', 'Spring Boot', 'Python', 'C', 'C++', 'JavaScript', 'HTML', 'CSS',
    'APIs REST', 'Sistemas ERP', 'Git', 'VS Code', 'Arduino / ESP32', 'Redes de computadores', 'AutoCAD', 'Inglês avançado',
  ],
}

export const contacts = {
  email: 'samuellopescefet@gmail.com',
  whatsapp: '5531981196676',
  linkedin: 'https://www.linkedin.com/in/samuel-lopes-423681334',
  github: 'https://github.com/samuelhenriqueALopes',
  instagram: '',
}

// Projetos: a timeline ordena por data (do mais antigo para o mais recente)
export const projects = [
  {
    name: 'Motor Trifásico com Inversor de Frequência e CLP (Laboratório — CEFET-MG)',
    date: '2024-06',
    description: {
      pt: 'Prática no laboratório de circuitos elétricos: montagem e acionamento de um motor de indução trifásico com inversor de frequência, alimentado por uma fonte trifásica. Ligação na caixa de bornes, parametrização do inversor para controle de partida e velocidade, comando via CLP e medições com osciloscópio.',
      en: 'Electrical circuits lab practice: wiring and driving a three-phase induction motor with a variable frequency drive (VFD), powered by a three-phase supply. Terminal box connections, drive parameterization for start-up and speed control, PLC command and oscilloscope measurements.',
    },
    technologies: ['Inversor de Frequência', 'CLP / PLC', 'Automação Industrial', 'Motor Trifásico', 'Osciloscópio'],
    image: '/projects/motor-plc.webp',
  },
  {
    name: 'Irrigador Automático com ESP32 (TCC — CEFET-MG)',
    date: '2024-12',
    featured: true,
    description: {
      pt: 'Sistema de irrigação automática que lê sensores de temperatura e de umidade do solo e aciona uma bomba d’água. Pelo celular, conectado ao ESP32 via Bluetooth, o usuário define a temperatura e o nível de umidade em que o sistema deve irrigar (modo automático) ou liga e desliga a bomba diretamente (modo manual). Um display OLED e LEDs mostram o estado do sistema.',
      en: 'Automatic irrigation system that reads temperature and soil moisture sensors and drives a water pump. From a smartphone connected to the ESP32 via Bluetooth, the user sets the temperature and moisture thresholds that trigger irrigation (automatic mode) or turns the pump on and off directly (manual mode). An OLED display and LEDs show the system status.',
    },
    technologies: ['ESP32', 'C++', 'Bluetooth', 'Sensores', 'Display OLED', 'App Android', 'IoT'],
    video: 'https://youtu.be/IxVBg9mHUFE',
    image: '/projects/tcc-irrigador.webp',
  },
  {
    name: 'Clima API — Belo Horizonte',
    date: '2026-08',
    description: {
      pt: 'API REST que consulta a API pública Open-Meteo e expõe a temperatura e as condições climáticas atuais de Belo Horizonte em endpoints próprios, com tratamento global de erros.',
      en: 'REST API that queries the public Open-Meteo API and exposes current weather conditions for Belo Horizonte through its own endpoints, with global error handling.',
    },
    technologies: ['Java', 'Spring Boot', 'Maven', 'API REST'],
    repo: 'https://github.com/samuelhenriqueALopes/diaw-atv01',
    image: '/projects/clima-api.jpg',
  },
  {
    name: 'Valorum — Protótipo de Interface',
    date: '2026-09',
    description: {
      pt: 'Protótipo navegável do Valorum, um fórum de investimentos: telas de cadastro e login, feed de análises com filtros (ações/FIIs, cripto, renda fixa, macroeconomia), painel de mercado (IBOV, dólar, BTC), comunidades recomendadas e campo para perguntar à IA sobre ativos.',
      en: 'Clickable prototype of Valorum, an investing forum: sign-up and login screens, an analysis feed with filters (stocks/REITs, crypto, fixed income, macro), a market panel (IBOV, USD, BTC), recommended communities and a field to ask AI about assets.',
    },
    technologies: ['HTML', 'CSS', 'JavaScript'],
    repo: 'https://github.com/samuelhenriqueALopes/Interface',
    image: '/projects/valorum.jpg',
    imagePosition: 'top left',
  },
  {
    name: 'Candidatos — Eleições 2026 MG',
    date: '2026-10',
    description: {
      pt: 'Aplicação Spring Boot que lê o CSV oficial de candidatos do TSE (eleições 2026, Minas Gerais) e exibe os candidatos em cards com foto oficial, número, cargo, partido, idade, ocupação e escolaridade, com filtros por cargo, partido e busca por nome ou número.',
      en: 'Spring Boot application that reads the official TSE candidates CSV (2026 elections, Minas Gerais) and displays candidates as cards with official photo, number, office, party, age, occupation and education, with filters by office, party and search by name or number.',
    },
    technologies: ['Java', 'Spring Boot', 'Maven', 'HTML', 'CSS', 'Dados (CSV)'],
    repo: 'https://github.com/samuelhenriqueALopes/candidatos-tse-2026-mg',
    image: '/projects/candidatos-tse-2026.png',
    imagePosition: 'top left',
  },
  {
    name: 'Clínica Veterinária — Sistema em Java',
    date: '2026-09',
    description: {
      pt: 'Sistema em Java (console) para gerenciar uma clínica veterinária: cadastro de atendimentos e procedimentos, associação de veterinários a salas, atribuição de atendimentos, busca por status e finalização, aplicando orientação a objetos e enums.',
      en: 'Java console system to manage a veterinary clinic: appointment and procedure registration, assigning vets to rooms, allocating appointments, searching by status and closing them, applying object-oriented design and enums.',
    },
    technologies: ['Java', 'POO'],
    repo: 'https://github.com/samuelhenriqueALopes/PM-Samuel-Henrique',
    image: '/projects/clinica.jpg',
    imagePosition: 'top center',
  },
  {
    name: 'Portfólio Profissional',
    date: '2026-10',
    description: {
      pt: 'Este site: portfólio bilíngue (PT/EN) com linha do tempo de projetos, experiências e formulário de contato com envio de e-mail.',
      en: 'This website: a bilingual (PT/EN) portfolio with a project timeline, experience section and a contact form that sends emails.',
    },
    technologies: ['React', 'Vite', 'JavaScript', 'CSS', 'EmailJS'],
    repo: 'https://github.com/samuelhenriqueALopes/Portifolio',
    image: '/projects/portfolio.png',
    imagePosition: 'top left',
  },
]

export const experiences = [
  {
    company: 'Mafra Informática',
    role: { pt: 'Suporte Técnico e Sistemas ERP', en: 'IT Support & ERP Systems' },
    period: { pt: 'jul. 2025 – atual', en: 'Jul 2025 – present' },
    current: true,
    description: {
      pt: 'Suporte e implantação de softwares ERP e sistemas de gestão comercial, além de suporte técnico em hardware e software. Atendimento presencial, telefônico e remoto, diagnósticos, manutenção básica e orientação ao usuário.',
      en: 'Support and deployment of ERP and business management software, plus hardware and software technical support. In-person, phone and remote customer service, diagnostics, basic maintenance and user guidance.',
    },
    systems: ['SISMOTEL', 'Hiper', 'EMC Sistemas', 'EZPoint', 'Saurus'],
    image: '/experiences/mafra-certificado-hiper.webp',
    caption: {
      pt: 'Certificado Hiper — Jornada Hiper: Ativação, Implantação e Primeiros Passos (31/07/2026).',
      en: 'Hiper certificate — Hiper Journey: Activation, Deployment and First Steps (Jul 31, 2026).',
    },
  },
  {
    company: 'WF Tecnologia Ltda',
    role: { pt: 'Técnico — Área Hospitalar', en: 'Technician — Hospital Equipment' },
    period: { pt: 'fev. 2025 – jul. 2025', en: 'Feb 2025 – Jul 2025' },
    description: {
      pt: 'Manutenção, conserto e calibração de equipamentos hospitalares, como monitores multiparamétricos testados com simulador de sinais vitais (ECG, SpO2, pressão não invasiva e respiração). Apoio técnico na identificação de falhas elétricas e eletrônicas, seguindo procedimentos técnicos e normas de segurança.',
      en: 'Maintenance, repair and calibration of hospital equipment, such as multiparameter patient monitors tested with a vital signs simulator (ECG, SpO2, non-invasive blood pressure and respiration). Technical support in diagnosing electrical and electronic failures, following technical procedures and safety standards.',
    },
    image: '/experiences/wf-calibracao-mindray.webp',
    caption: {
      pt: 'Calibração de um monitor Mindray uMEC12 com simulador de paciente — maio de 2025.',
      en: 'Calibrating a Mindray uMEC12 patient monitor with a patient simulator — May 2025.',
    },
  },
  {
    company: 'CEFET-MG',
    role: { pt: 'Ensino Médio Técnico em Eletroeletrônica', en: 'Technical High School in Electronics' },
    period: { pt: '2022 – 2024', en: '2022 – 2024' },
    description: {
      pt: 'Formação em elétrica e eletrônica, automação industrial, microcontroladores (Arduino e ESP32), AutoCAD e interpretação de projetos técnicos.',
      en: 'Training in electrical and electronic systems, industrial automation, microcontrollers (Arduino and ESP32), AutoCAD and technical drawings.',
    },
  },
  {
    company: 'Bradesco',
    role: { pt: 'Curso de Lei Geral de Proteção de Dados (LGPD)', en: 'Brazilian Data Protection Law (LGPD) Course' },
    period: { pt: '2024', en: '2024' },
    description: {
      pt: 'Capacitação sobre tratamento de dados pessoais, direitos dos titulares e boas práticas de privacidade.',
      en: 'Training on personal data processing, data subject rights and privacy best practices.',
    },
  },
]

// EmailJS (https://www.emailjs.com) — envio do formulário de contato.
// Os valores ficam no arquivo .env (veja .env.example).
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}
