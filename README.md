# 💼 Portfólio Profissional — Samuel Henrique Alvarenga e Lopes 👨‍💻

> [!NOTE]
> Website de portfólio profissional bilíngue (PT/EN) que apresenta minha trajetória, projetos, experiências e formas de contato de maneira moderna, responsiva e acessível.

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        Este projeto foi desenvolvido no <b>Laboratório 01</b> da disciplina <i>Desenvolvimento e Integração de Aplicações Web (DIAW)</i> do curso de <b>Engenharia de Software da PUC Minas</b>. O site reúne, em uma única aplicação React, as seções <i>Sobre Mim</i>, <i>Projetos</i> (linha do tempo), <i>Experiências</i> e <i>Contato</i> (com envio de e-mail via EmailJS), e está hospedado gratuitamente na nuvem.
      </div>
    </td>
    <td>
      <div>
        <img src="https://joaopauloaramuni.github.io/image/logo_ES_vertical.png" alt="Logo" width="120px"/>
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue?style=for-the-badge) ![React](https://img.shields.io/badge/React-19-007ec6?style=for-the-badge&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8-007ec6?style=for-the-badge&logo=vite&logoColor=white) ![EmailJS](https://img.shields.io/badge/EmailJS-5-007ec6?style=for-the-badge) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel)

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Protótipos](#-protótipos)
- [Instalação e Execução](#-instalação-e-execução)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis
* 🌐 **Demo Online:** [Acesse o portfólio](<PREENCHER-link-da-vercel>)
* 🎨 **Protótipos (Figma):** [Wireframes de média fidelidade](<PREENCHER-link-do-figma>)

---

## 📝 Sobre o Projeto
O objetivo é oferecer um **cartão de visitas digital**: um lugar único onde recrutadores, professores e colegas conhecem minha formação, veem meus projetos funcionando (com imagens/GIFs e links para o GitHub), consultam minhas experiências e entram em contato diretamente pelo site.

Contexto: **acadêmico** (Lab01 de DIAW — PUC Minas), mas pensado para uso **profissional** real.

---

## ✨ Funcionalidades Principais

- 👤 **Sobre Mim:** apresentação em **português e inglês**, foto, habilidades e links sociais.
- 🗂️ **Projetos:** **linha do tempo dinâmica** (ordenada da mais antiga para a mais recente) com descrição, tecnologias, link do repositório e imagem/GIF; filtro por tecnologia.
- 💼 **Experiências:** cards com instituição, cargo/atividade, período e descrição.
- 📨 **Contato:** ícones clicáveis (e-mail, WhatsApp, LinkedIn, GitHub) e **formulário com validação** e envio de e-mail via **EmailJS**.
- 🌐 **Internacionalização (i18n):** alternância PT/EN em todo o site, com preferência salva no navegador.
- 🌗 **Modo claro e escuro:** alternância pelo botão no cabeçalho (ou pelo comando `theme` no terminal), respeitando a preferência do sistema e salva no navegador.
- 💻 **Terminal interativo:** na página inicial, o visitante digita comandos como `help`, `whoami`, `skills`, `projetos`, `exp`, `contato` e `cd projetos` para navegar pelo portfólio.
- 📊 **Estatísticas do GitHub:** repositórios públicos, linguagens mais usadas e repositórios atualizados recentemente, carregados em tempo real pela API pública do GitHub (com cache de 1 hora).
- 🎞️ **Animações:** transições entre páginas, cards que surgem ao rolar e filtro de projetos animado com Framer Motion (desativadas automaticamente para quem prefere movimento reduzido).
- 🎮 **Easter egg — Pac-Man:** jogo completo em Canvas (pastilhas, pastilhas de poder, 4 fantasmas com IA de perseguição/dispersão, vidas, fases e recorde salvo no navegador). Abre pelo botão 🎮 no cabeçalho ou pelo comando `pacman` no terminal; funciona com teclado, deslizando o dedo ou pelos botões na tela do celular. O código do jogo só é baixado quando alguém o abre.
- 🐓 **Modo Galo:** o botão *Sou atleticano!* (ou o comando `galo` no terminal) deixa o site em preto e branco, abre uma **cena 3D interativa em Three.js** — um galo low-poly modelado no código, num pedestal listrado, que segue o cursor com a cabeça, canta (pula, bate as asas e solta confete) ao ser clicado, e uma bola que pode ser chutada — e mostra os **próximos jogos e os últimos resultados do Atlético-MG** (Brasileirão, Libertadores, Sul-Americana, Copa do Brasil e Mineiro), com escudos, placar, estádio e V/E/D, em tempo real pela API pública da ESPN (cache de 30 min). O comando `jogos` mostra o mesmo no terminal.
- 📱 **Design responsivo:** layout adaptado para desktop, tablet e celular (menu hambúrguer).

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end
* **Biblioteca:** React 19
* **Linguagem:** JavaScript (ES2022+), JSX
* **Navegação:** página única (*single page*) com âncoras, rolagem suave e destaque automático da seção atual no menu
* **Estilização:** CSS puro com variáveis (custom properties) e media queries
* **Ícones:** React Icons
* **Animações:** Framer Motion
* **3D:** Three.js (WebGL)
* **Integrações:** API pública do GitHub (REST) e API pública de futebol da ESPN
* **Gerenciamento de Estado:** Context API (idioma e tema) + `useState`
* **Build Tool:** Vite 8
* **Lint:** Oxlint

### 🖥️ Back-end
* Não há back-end próprio. O envio de e-mails é feito pelo serviço **EmailJS** diretamente do front-end.

### ⚙️ Infraestrutura
* **Cloud:** Vercel (hospedagem gratuita, deploy contínuo a partir do GitHub)

### 📦 Dependências

| Pacote | Uso |
| :--- | :--- |
| `react`, `react-dom` | Construção da interface |
| `@emailjs/browser` | Envio do formulário de contato por e-mail |
| `react-icons` | Ícones (e-mail, WhatsApp, LinkedIn, GitHub...) |
| `framer-motion` | Animações de páginas, cards e filtros |
| `three` | Cena 3D interativa do Modo Galo (carregada sob demanda) |
| `vite`, `@vitejs/plugin-react` | Servidor de desenvolvimento e build (dev) |
| `oxlint` | Análise estática do código (dev) |

---

## 🏗 Arquitetura

Aplicação **SPA (Single Page Application)** estática, organizada em camadas simples:

- **`data/`** — *fonte única de conteúdo*: todos os textos, projetos, experiências e contatos ficam em `portfolio.js`; os textos da interface ficam em `i18n.js`. Para atualizar o portfólio, basta editar esses arquivos — nenhum componente precisa mudar.
- **`context/`** — `LanguageContext` fornece o idioma atual (`pt`/`en`) e as traduções para toda a árvore de componentes.
- **`components/`** — layout compartilhado (cabeçalho com menu, rodapé, ícones sociais).
- **`pages/`** — uma seção por item do menu (Sobre Mim, Projetos, Experiências, Contato), empilhadas em uma única página.
- **`utils/sections.js`** — lista das seções e função de rolagem suave usada pelo menu, pelos botões e pelo terminal.

**Fluxo do formulário:** `Contact.jsx` valida os campos → chama `emailjs.send()` com as chaves do `.env` → o EmailJS entrega a mensagem na minha caixa de e-mail.

**Decisões:** o site é uma página única: o visitante percorre todas as seções rolando a tela, e o menu leva direto a cada uma por âncoras (`#projetos`, `#experiencias`...), o que funciona em qualquer hospedagem estática sem configuração extra; CSS puro mantém o bundle pequeno e sem dependências de estilo.

---

## 🎨 Protótipos

Wireframes de média fidelidade feitos no Figma: [link](<PREENCHER-link-do-figma>)

| Sobre Mim | Projetos |
| :---: | :---: |
| <img src="docs/prototipos/sobre.png" width="380px"> | <img src="docs/prototipos/projetos.png" width="380px"> |
| **Experiências** | **Contato** |
| <img src="docs/prototipos/experiencias.png" width="380px"> | <img src="docs/prototipos/contato.png" width="380px"> |

---

## 🔧 Instalação e Execução

### Pré-requisitos
* **Node.js** 20 ou superior
* **npm**

### 🔑 Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha com os dados da sua conta no [EmailJS](https://www.emailjs.com/):

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_EMAILJS_SERVICE_ID` | ID do serviço de e-mail | `service_abc123` |
| `VITE_EMAILJS_TEMPLATE_ID` | ID do template | `template_xyz789` |
| `VITE_EMAILJS_PUBLIC_KEY` | Chave pública da conta | `AbCdEf123456` |

O template do EmailJS deve usar as variáveis `{{from_name}}`, `{{reply_to}}` e `{{message}}`.

### 📦 Instalação de Dependências

```bash
git clone https://github.com/samuelhenriqueALopes/Portifolio.git
cd Portifolio
npm install
```

### ⚡ Como Executar

```bash
npm run dev
```
🎨 *O site estará disponível em **http://localhost:5173**.*

### ✏️ Como editar o conteúdo
* Textos, projetos, experiências e contatos: `src/data/portfolio.js`
* Foto de perfil: `public/foto.jpg`
* Imagens/GIFs dos projetos: `public/projects/`

---

## 🚀 Deploy

1. Gere o build de produção (pasta `dist/`):
```bash
npm run build
```
2. Na **Vercel**: *Add New → Project*, importe o repositório do GitHub (framework detectado: **Vite**).
3. Em *Settings → Environment Variables*, adicione as três variáveis `VITE_EMAILJS_*`.
4. Clique em **Deploy**. A cada `git push` na `main` um novo deploy é feito automaticamente.

Para testar o build localmente:
```bash
npm run preview
```

---

## 📂 Estrutura de Pastas

```
.
├── .env.example              # 🧩 Variáveis necessárias (sem valores reais)
├── .gitignore                # 🧹 Ignora node_modules, dist, .env
├── index.html                # 📄 HTML base da SPA
├── package.json              # 📦 Dependências e scripts
├── vite.config.js            # ⚙️ Configuração do Vite
├── README.md                 # 📘 Esta documentação
├── docs/
│   └── prototipos/           # 🎨 Imagens dos wireframes (Figma)
├── public/
│   ├── foto.jpg              # 🖼️ Foto de perfil
│   └── projects/             # 🎞️ Imagens/GIFs dos projetos
└── src/
    ├── main.jsx              # 🚪 Ponto de entrada (providers de tema, idioma e animação)
    ├── App.jsx               # 🧭 Layout principal com as 4 seções
    ├── index.css             # 🎨 Estilos globais e responsividade
    ├── components/           # 🧱 Header, Footer, SocialLinks, Terminal, GitHubStats, Reveal, PacmanModal, GaloMatches, Galo3D
    ├── context/              # 🌐 LanguageContext (PT/EN) e ThemeContext (claro/escuro)
    ├── data/                 # 🗃️ portfolio.js (conteúdo) e i18n.js (textos da UI)
    ├── galo3d/               # 🐓 scene.js (cena 3D em Three.js)
    ├── game/                 # 🎮 pacman.js (lógica do jogo) e render.js (desenho no canvas)
    ├── pages/                # 📄 About, Projects, Experiences, Contact
    ├── services/             # 🔌 galo.js (jogos do Atlético-MG via API da ESPN)
    └── utils/                # 🛠️ sections.js (navegação por rolagem) e pacman.js (abrir o jogo)
```

---

## 🎥 Demonstração

### 🌐 Aplicação Web

| Sobre Mim | Projetos |
| :---: | :---: |
| <img src="docs/telas/sobre.png" width="380px"> | <img src="docs/telas/projetos.png" width="380px"> |
| **Experiências** | **Contato** |
| <img src="docs/telas/experiencias.png" width="380px"> | <img src="docs/telas/contato.png" width="380px"> |

---

## 🔗 Documentações utilizadas

* 📖 [React](https://react.dev/reference/react)
* 📖 [Vite](https://vitejs.dev/config/)
* 📖 [EmailJS](https://www.emailjs.com/docs/)
* 📖 [Vercel](https://vercel.com/docs)
* 📖 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 👥 Autores

| 👤 Nome | :octocat: GitHub | 💼 LinkedIn | 📤 E-mail |
|---------|-----------------|-------------|-----------|
| Samuel Henrique Alvarenga e Lopes | <a href="https://github.com/samuelhenriqueALopes"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="40px"></a> | <a href="https://www.linkedin.com/in/samuel-lopes-423681334"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="40px"></a> | <a href="mailto:samuellopescefet@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="40px"></a> |

---

## 🙏 Agradecimentos

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) — pelo apoio institucional.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) — pela orientação na disciplina de DIAW.

---

## 📄 Licença

Este projeto é distribuído sob a **Licença MIT**.
