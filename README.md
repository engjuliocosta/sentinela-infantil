# 🛡️ Sentinela Infantil — Tecnologia Cidadã pela Erradicação do Trabalho Infantil (ODS 8.7)

> **Projeto de Extensão Universitária em Engenharia de Software**  
> **Instituição:** Universidade Cruzeiro do Sul  
> **Tema Institucional:** *"Agir local e pensar global: atuação multidisciplinar"*  
> **Alinhamento ONU:** Objetivo de Desenvolvimento Sustentável 8 (Trabalho Decente e Crescimento Econômico) — **Meta 8.7** & **Aliança 8.7**

---

## 📌 1. Visão Geral e Contextualização Social

O aplicativo web **Sentinela Infantil** é uma solução tecnológica de interesse público (*Civic Tech*), concebida no formato **Mobile-First / Progressive Web App (PWA)**, cujo propósito é capacitar a comunidade acadêmica da **Universidade Cruzeiro do Sul** e a sociedade civil a reconhecerem sinais visíveis e invisíveis de exploração do trabalho infantil e acionarem os canais oficiais de proteção com segurança, precisão e anonimato.

### Panorama Estatístico e Jurídico no Brasil (Dados Fundamentadores)
* **Dimensão Epidemiológica (IBGE):** Cerca de **1,65 milhão de crianças e adolescentes** (entre 5 e 17 anos) encontram-se em situação de trabalho infantil no Brasil, o que corresponde a **4,3%** da população nessa faixa etária.
* **Recorte Racial e de Gênero (FNPETI / OIT):** Em decorrência histórica do racismo estrutural pós-abolição (1888), **62,7%** da mão de obra infantil no país atinge crianças negras (pretas e pardas). No **trabalho infantil doméstico** (modalidade invisibilizada em residências de terceiros), esse índice salta para **73,5%**, sendo **mais de 94% meninas**.
* **Porta de Entrada para a Escravidão Moderna:** A inserção precoce no trabalho provoca evasão escolar e perpetua o ciclo de vulnerabilidade que alimenta o trabalho análogo ao de escravo, tipificado no **Art. 149 do Código Penal Brasileiro** (trabalhos forçados, jornada exaustiva, condições degradantes e restrição de locomoção por dívida).
* **Brasil como País Pioneiro na Aliança 8.7:** Em **maio de 2025**, o Governo Federal formalizou a adesão do Brasil como **País Pioneiro na Aliança 8.7 da ONU**, intensificando a articulação entre Estado (MTE, MPT, Polícia Federal, SUAS/PETI), sociedade civil e universidades para acelerar a erradicação do trabalho infantil e forçado.

---

## 🧩 2. Funcionalidades e Arquitetura das Abas

A aplicação foi projetada seguindo princípios de **Design Centrado no Usuário (UI/UX)**, alto contraste (WCAG AA/AAA), navegação inferior nativa para smartphones (*Bottom Navigation Bar*) e operação 100% independente de banco de dados externo:

1. **Aba 1 — Início & Panorama (Dashboard de Conscientização):**
   * Banner de impacto com atalho imediato para triagem de situações suspeitas.
   * Cards estatísticos oficiais (IBGE, OIT, FNPETI, Aliança 8.7 e Art. 149 do Código Penal).
   * Diagrama do funil de vulnerabilidade e síntese do marco legal brasileiro (< 14 anos proibido; 14–16 anos exclusivo Aprendiz; 16–18 anos proibido noturno, insalubre, perigoso ou Lista TIP).
2. **Aba 2 — Como Identificar Sinais (Guia Interativo por Locais + Termômetro de Suspeita):**
   * Filtro dinâmico por contextos: *Comércio, Feiras e Ruas*, *Trabalho Infantil Doméstico (Invisível)*, *Oficinas, Lava-rápidos e Construção Civil (Lista TIP)* e *Sinais Físicos e Comportamentais (Escolas/Comunidade)*.
   * **Termômetro de Suspeita (Checklist Interativo de Risco):** Algoritmo ponderado que calcula o índice de gravidade em tempo real a partir dos sinais marcados pelo usuário, exibindo orientações imediatas de segurança (*"Nunca confronte o explorador diretamente"*) e permitindo transferir os sinais marcados diretamente para o gerador de denúncia.
3. **Aba 3 — Central de Denúncia e Registro Seguro:**
   * Botões de acionamento direto: **Disque 100** (`tel:100`), **Ministério Público do Trabalho (MPT)** e **Sistema Ipê / Gov.br (MTE)**, além de orientação para acionamento do **Conselho Tutelar, CRAS e CREAS**.
   * **Assistente de Denúncia Anônima (Gerador de Relato Estruturado):** Formulário guiado que gera automaticamente um **Roteiro de Denúncia Pronto** com protocolo comunitário simulado e botão **"Copiar Relato"** para leitura rápida ao telefone no Disque 100 ou colagem no portal do MPT.
4. **Aba 4 — Projeto de Extensão & Avaliação Acadêmica (Cruzeiro do Sul):**
   * Contextualização institucional da Ação Extensionista de Engenharia de Software (*"Agir local e pensar global: atuação multidisciplinar — ODS 8"*).
   * Formulário de validação de usabilidade pelos colegas (avaliação de 1 a 5 estrelas, indicador pedagógico de eficácia e comentários).
   * Contadores visuais de impacto em tempo real e botões **"Exportar CSV"** e **"Exportar JSON"** para anexação das métricas no Relatório Final de Extensão.

---

## 🛠️ 3. Stack Tecnológica e Engenharia de Software

| Camada | Tecnologia / Padrão | Justificativa de Engenharia |
| :--- | :--- | :--- |
| **Marcação & Acessibilidade** | HTML5 Semântico + ARIA (`aria-live`, `role`, `sr-only`) | Acessibilidade para leitores de tela, navegação por teclado e indexação limpa. |
| **Estilização & UI/UX** | CSS3 + Tailwind CSS CDN + Modo Alto Contraste | Design responsivo Mobile-First, botões amplos para toque e conformidade visual institucional (Azul Marinho `#0F2C59` e Âmbar `#F59E0B`). |
| **Lógica da Aplicação** | JavaScript Vanilla Modular (ES6+ IIFE) | Zero dependências de build, carregamento instantâneo em redes móveis lentas e manutenção simplificada. |
| **Persistência Local** | Web Storage API (`localStorage`) + Exportador Blob CSV/JSON | Garante privacidade ao usuário, funcionamento 100% via link público estático e extração de métricas acadêmicas sem custo de servidor. |
| **Capacidade Offline (PWA)** | `manifest.json` + Service Worker (`sw.js`) | Permite instalar o app na tela inicial do celular Android/iOS e consultar o guia mesmo sem internet. |

### Estrutura de Arquivos do Repositório
```text
erradica_trabalho_infantil/
├── index.html                           # Estrutura SPA Mobile-First com as 4 abas e modais
├── styles.css                           # Estilos customizados, animações e Modo Alto Contraste
├── app.js                               # Lógica modular (Navegação, Termômetro, Gerador, Métricas, CSV/JSON)
├── manifest.json                        # Manifesto Web App (PWA) com ícones vetoriais embutidos
├── sw.js                                # Service Worker para cache offline
├── README.md                            # Documentação técnica e acadêmica do projeto
├── Relatorio_Extensao_Cruzeiro_do_Sul_Sentinela_Infantil.docx # Relatório Oficial preenchido no template
└── docs/                                # Documentos de referência, proposta institucional e template
```

---

## 💻 4. Como Executar Localmente

Como o projeto foi construído com arquitetura estática limpa (*Zero-Build*), você pode abri-lo diretamente no navegador ou servir localmente:

1. **Opção Direta:** Dê duplo clique no arquivo `index.html` para abri-lo em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).
2. **Opção com Servidor Local (recomendada para testar o Service Worker PWA):**
   ```bash
   npx serve .
   ```
   Ou utilizando a extensão **Live Server** do VS Code.

---

## 🚀 5. Como Subir no GitHub e Gerar o Link Público para os Colegas (Passo a Passo Rápido)

Siga este fluxo para colocar o aplicativo no ar gratuitamente em menos de 5 minutos:

### Passo 1: Suba o código para o GitHub
Abra o terminal na pasta raiz do projeto e execute:

```bash
git init
git add .
git commit -m "feat: versao inicial do app Sentinela Infantil - Extensao ODS 8"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git push -u origin main
```

### Passo 2: Ative o link público (Build automático)

#### Opção A — Pelo GitHub Pages (Mais simples para HTML/CSS/JS)
1. Entre no seu repositório no site do GitHub e clique em **Settings** (Configurações).
2. No menu lateral esquerdo, clique em **Pages**.
3. Em **Build and deployment > Branch**, selecione a branch `main` e a pasta `/ (root)`, depois clique em **Save**.
4. Em 1 a 2 minutos, o GitHub exibirá o link público no topo da página:  
   `https://seu-usuario.github.io/nome-do-repositorio/`

#### Opção B — Pela Vercel (Deploy instantâneo com HTTPS)
1. Acesse [vercel.com](https://vercel.com/) e faça login com sua conta do GitHub.
2. Clique em **Add New... > Project** e importe o repositório `sentinela-infantil`.
3. Mantenha **Framework Preset** como `Other` e clique em **Deploy**.
4. Em poucos segundos, sua URL pública (`https://sentinela-infantil.vercel.app`) estará pronta para compartilhar no WhatsApp e ambiente acadêmico com seus colegas!

---

## 📄 Licença e Uso Acadêmico
Projeto desenvolvido para fins educativos, comunitários e de extensão universitária na **Universidade Cruzeiro do Sul**, em apoio aberto à **Aliança 8.7 da ONU** e à erradicação do trabalho infantil no Brasil.

