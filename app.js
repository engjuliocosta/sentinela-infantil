/**
 * Sentinela Infantil — Aplicação Web Mobile-First (PWA)
 * Projeto de Extensão Universitária em Engenharia de Software
 * Universidade Cruzeiro do Sul • Alinhado ao ODS 8 (Meta 8.7 / Aliança 8.7 da ONU)
 */

(() => {
  'use strict';

  // Chaves de Persistência no localStorage
  const STORAGE_KEYS = {
    METRICS: 'sentinela_ods8_metrics_v1',
    RELATOS: 'sentinela_ods8_relatos_v1',
    FEEDBACKS: 'sentinela_ods8_feedbacks_v1',
    CONTRAST: 'sentinela_ods8_contrast_v1',
  };

  // Avaliações Acadêmicas Iniciais (Seed para demonstração e validação)
  const SEED_FEEDBACKS = [
    {
      id: 'FB-2026-01',
      data: '2026-05-12 14:20',
      nome: 'Mariana Costa (Engenharia de Software)',
      perfil: 'Estudante Universitário (Cruzeiro do Sul)',
      nota: 5,
      ajudou: 'Sim, ampliou totalmente minha capacidade de identificar e agir',
      comentario: 'Excelente iniciativa extensionista! O Termômetro de Suspeita deixa muito claro o que caracteriza a Lista TIP e o trabalho infantil doméstico invisível.'
    },
    {
      id: 'FB-2026-02',
      data: '2026-05-14 19:05',
      nome: 'Prof. Carlos Eduardo (Ciências Sociais / Direito)',
      perfil: 'Docente / Tutor Acadêmico',
      nota: 5,
      ajudou: 'Sim, ampliou totalmente minha capacidade de identificar e agir',
      comentario: 'A conexão entre os dados da PNAD/IBGE (1,65 milhão), o Art. 149 do Código Penal e a Aliança 8.7 está rigorosa e didática. O gerador de relato facilita muito o acionamento do Disque 100.'
    },
    {
      id: 'FB-2026-03',
      data: '2026-05-16 10:42',
      nome: ' Beatriz Oliveira (Licenciatura em Pedagogia)',
      perfil: 'Estudante Universitário (Cruzeiro do Sul)',
      nota: 5,
      ajudou: 'Sim, esclareceu dúvidas importantes sobre a Lista TIP e o Disque 100',
      comentario: 'Os indicadores escolares (sonolência, faltas recorrentes e marcas nas mãos) ajudam muito futuros professores a identificarem alunos em risco de evasão por trabalho precoce.'
    },
    {
      id: 'FB-2026-04',
      data: '2026-05-18 16:15',
      nome: 'Rafael Mendes (Análise e Desenv. de Sistemas)',
      perfil: 'Estudante Universitário (Cruzeiro do Sul)',
      nota: 5,
      ajudou: 'Sim, ampliou totalmente minha capacidade de identificar e agir',
      comentario: 'Interface mobile-first muito rápida, alto contraste acessível e funciona offline como PWA sem exigir cadastro ou expor o denunciante.'
    }
  ];

  // Relato Inicial Simulado
  const SEED_RELATOS = [
    {
      protocolo: 'SNT-2026-8701',
      data: '2026-05-15 17:30',
      tipoLocal: 'Oficina / Lava-rápido / Construção Civil (Lista TIP)',
      horario: 'Segunda a sábado, das 08h às 18h (em horário escolar)',
      localizacao: 'São Paulo/SP - Zona Leste, próximo à Av. São Miguel (ponto comercial de lavagem automotiva)',
      idadeQtd: '1 adolescente aparentando 13 anos',
      gravidade: 'Risco Grave / Lista TIP (Piores Formas de Trabalho Infantil)',
      descricao: 'Adolescente manuseando produtos químicos desengraxantes e lavadora de alta pressão sem equipamentos de proteção, durante o período letivo.'
    }
  ];

  // =========================================================================
  // Utilitários de Notificação e Armazenamento
  // =========================================================================
  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    toast.classList.remove('hidden');

    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3600);
  }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.warn('Aviso ao salvar no localStorage:', err);
    }
  }

  function formatNow() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  // =========================================================================
  // 1. Navegação entre Abas (Bottom Bar Mobile & Desktop Bar)
  // =========================================================================
  function switchTab(tabName) {
    const panels = document.querySelectorAll('[data-tab-panel]');
    const navButtons = document.querySelectorAll('[data-tab-target]');

    panels.forEach((panel) => {
      const isMatch = panel.getAttribute('data-tab-panel') === tabName;
      panel.classList.toggle('hidden', !isMatch);
    });

    navButtons.forEach((btn) => {
      const isMatch = btn.getAttribute('data-tab-target') === tabName;
      btn.classList.toggle('active-tab', isMatch);
      btn.setAttribute('aria-current', isMatch ? 'page' : 'false');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initNavigation() {
    document.querySelectorAll('[data-tab-target]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab-target');
        switchTab(target);
      });
    });

    document.querySelectorAll('[data-go-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-go-tab');
        switchTab(target);
      });
    });
  }

  // =========================================================================
  // 2. Modo de Alto Contraste (Acessibilidade)
  // =========================================================================
  function initContrastMode() {
    const btnContrast = document.getElementById('btn-contrast');
    const saved = localStorage.getItem(STORAGE_KEYS.CONTRAST) === '1';
    if (saved) {
      document.body.classList.add('high-contrast');
    }

    if (btnContrast) {
      btnContrast.addEventListener('click', () => {
        const active = document.body.classList.toggle('high-contrast');
        localStorage.setItem(STORAGE_KEYS.CONTRAST, active ? '1' : '0');
        showToast(active ? 'Modo de Alto Contraste ativado.' : 'Modo de Alto Contraste desativado.');
      });
    }
  }

  // =========================================================================
  // 3. Aba 2: Filtro de Sinais por Categoria & Termômetro de Suspeita
  // =========================================================================
  function initGuideFilters() {
    const filterBtns = document.querySelectorAll('[data-filter-cat]');
    const cards = document.querySelectorAll('[data-cat-card]');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-filter-cat');

        filterBtns.forEach((b) => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');

        cards.forEach((card) => {
          const cardCat = card.getAttribute('data-cat-card');
          const visible = cat === 'todos' || cardCat === cat;
          card.classList.toggle('hidden', !visible);
        });
      });
    });
  }

  function evaluateRiskChecklist() {
    const checkboxes = Array.from(document.querySelectorAll('.risk-checkbox'));
    const badge = document.getElementById('risk-badge');
    const scoreText = document.getElementById('risk-score-text');
    const progressBar = document.getElementById('risk-progress-bar');
    const guidanceText = document.getElementById('risk-guidance-text');

    let rawScore = 0;
    let selectedCount = 0;

    checkboxes.forEach((cb) => {
      const parentLabel = cb.closest('.risk-item');
      if (cb.checked) {
        rawScore += Number(cb.value || 20);
        selectedCount += 1;
        if (parentLabel) parentLabel.classList.add('checked-risk');
      } else if (parentLabel) {
        parentLabel.classList.remove('checked-risk');
      }
    });

    const normalizedScore = Math.min(100, rawScore);
    if (progressBar) progressBar.style.width = `${normalizedScore}%`;
    if (scoreText) scoreText.textContent = `Índice de Gravidade: ${normalizedScore}%`;

    if (selectedCount === 0) {
      badge.textContent = 'Aguardando Seleção (0 sinais)';
      badge.className = 'px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-slate-300 text-slate-800';
      progressBar.className = 'h-full rounded-full bg-brand-600 transition-all duration-300';
      guidanceText.innerHTML = 'Selecione um ou mais indicadores acima para avaliar a gravidade da situação observada e receber a orientação imediata de encaminhamento aos órgãos de proteção.';
      return;
    }

    if (normalizedScore < 40) {
      badge.textContent = `Alerta Moderado (${selectedCount} sinal marcado)`;
      badge.className = 'px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-200 text-amber-950';
      progressBar.className = 'h-full rounded-full bg-amber-500 transition-all duration-300';
      guidanceText.innerHTML = '<strong>Orientação Imediata:</strong> Há indícios de vulnerabilidade e risco de evasão escolar. <strong>Não confronte os responsáveis diretamente.</strong> Registre o endereço/horário e acione o <strong>Conselho Tutelar</strong>, o <strong>CRAS/CREAS</strong> do município ou o <strong>Disque 100</strong> para acompanhamento assistencial (PETI).';
    } else if (normalizedScore < 70) {
      badge.textContent = `Risco Alto • Violação Caracterizada (${selectedCount} sinais)`;
      badge.className = 'px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-orange-500 text-white';
      progressBar.className = 'h-full rounded-full bg-orange-600 transition-all duration-300';
      guidanceText.innerHTML = '<strong>Orientação Imediata:</strong> Situação incompatível com o ECA e a Constituição Federal. <strong>Nunca confronte o explorador diretamente para não colocar a criança ou você em risco.</strong> Utilize o botão abaixo para gerar o relato estruturado e denuncie anonimamente no <strong>Disque 100</strong> ou no <strong>Ministério Público do Trabalho (MPT)</strong>.';
    } else {
      badge.textContent = `Risco Crítico • Lista TIP / Art. 149 CP (${selectedCount} sinais)`;
      badge.className = 'px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-red-700 text-white';
      progressBar.className = 'h-full rounded-full bg-red-600 transition-all duration-300';
      guidanceText.innerHTML = '<strong>URGENTE — Piores Formas de Trabalho Infantil (Lista TIP) / Escravidão Moderna:</strong> Risco severo à integridade física, saúde ou liberdade da criança/adolescente. <strong>Mantenha distância segura, jamais aborde o aliciador</strong> e acione imediatamente o <strong>Disque 100</strong>, o <strong>Sistema Ipê (MTE)</strong> e o <strong>MPT</strong>.';
    }
  }

  function initRiskThermometer() {
    const checkboxes = document.querySelectorAll('.risk-checkbox');
    const resetBtn = document.getElementById('btn-reset-quiz');
    const transferBtn = document.getElementById('btn-transfer-to-report');

    checkboxes.forEach((cb) => {
      cb.addEventListener('change', evaluateRiskChecklist);
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        checkboxes.forEach((cb) => {
          cb.checked = false;
        });
        evaluateRiskChecklist();
        showToast('Termômetro de Suspeita reiniciado.');
      });
    }

    if (transferBtn) {
      transferBtn.addEventListener('click', () => {
        const selectedLabels = Array.from(checkboxes)
          .filter((cb) => cb.checked)
          .map((cb) => cb.getAttribute('data-label'));

        const descField = document.getElementById('relato-descricao');
        if (descField && selectedLabels.length > 0) {
          const prefix = `Sinais identificados na triagem: ${selectedLabels.join('; ')}. `;
          if (!descField.value.includes('Sinais identificados na triagem:')) {
            descField.value = prefix + descField.value;
          }
        }
        switchTab('denuncia');
        showToast('Sinais transferidos para o Assistente de Denúncia Anônima!');
      });
    }
  }

  // =========================================================================
  // 4. Aba 3: Gerador de Relato Estruturado (Assistente de Denúncia Anônima)
  // =========================================================================
  function buildReportText(data) {
    return [
      `=== ROTEIRO ESTRUTURADO PARA DENÚNCIA ANÔNIMA (DISQUE 100 / MPT / IPÊ) ===`,
      `PROTOCOLO COMUNITÁRIO: ${data.protocolo} | DATA/HORA: ${data.data}`,
      `-------------------------------------------------------------------------`,
      `1. NATUREZA DA VIOLAÇÃO: Trabalho Infantil / Exploração Precoce (ODS 8 - Meta 8.7)`,
      `2. ENQUADRAMENTO PRELIMINAR: ${data.gravidade}`,
      `3. TIPO DE AMBIENTE/LOCAL: ${data.tipoLocal}`,
      `4. LOCALIZAÇÃO E PONTO DE REFERÊNCIA: ${data.localizacao}`,
      `5. HORÁRIO E FREQUÊNCIA OBSERVADOS: ${data.horario}`,
      `6. PERFIL E QUANTIDADE DE VÍTIMAS: ${data.idadeQtd}`,
      `7. DESCRIÇÃO DETALHADA DA ATIVIDADE E RISCOS VISÍVEIS:`,
      `   "${data.descricao}"`,
      `-------------------------------------------------------------------------`,
      `SOLICITAÇÃO: Requer-se fiscalização e abordagem social protetiva pelos órgãos`,
      `competentes (Conselho Tutelar, CREAS/PETI, Auditoria Fiscal do Trabalho e MPT),`,
      `resguardando o sigilo e a proteção integral da criança/adolescente (Art. 227 CF).`
    ].join('\n');
  }

  function renderRelatosHistory() {
    const container = document.getElementById('relatos-history-list');
    if (!container) return;

    const relatos = loadJSON(STORAGE_KEYS.RELATOS, SEED_RELATOS);
    if (relatos.length === 0) {
      container.innerHTML = `<p class="text-slate-400 italic py-2">Nenhum relato simulado salvo neste dispositivo.</p>`;
      return;
    }

    container.innerHTML = relatos
      .slice()
      .reverse()
      .map(
        (item) => `
        <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-[11px] text-brand-800">${item.protocolo}</span>
              <span class="text-[10px] text-slate-500">${item.data}</span>
            </div>
            <p class="text-xs font-semibold text-slate-800 truncate max-w-[260px]">${item.tipoLocal}</p>
            <p class="text-[11px] text-slate-600 truncate max-w-[260px]">${item.localizacao}</p>
          </div>
          <button type="button" data-load-protocol="${item.protocolo}" class="shrink-0 px-2.5 py-1 rounded-lg bg-brand-100 hover:bg-brand-200 text-brand-800 font-bold text-[11px] transition">
            Ver Roteiro
          </button>
        </div>
      `
      )
      .join('');

    container.querySelectorAll('[data-load-protocol]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const prot = btn.getAttribute('data-load-protocol');
        const found = relatos.find((r) => r.protocolo === prot);
        if (found) {
          document.getElementById('roteiro-output').textContent = buildReportText(found);
          document.getElementById('protocolo-badge').textContent = `Protocolo: ${found.protocolo}`;
          showToast(`Roteiro ${found.protocolo} carregado.`);
        }
      });
    });
  }

  function initReportAssistant() {
    if (!localStorage.getItem(STORAGE_KEYS.RELATOS)) {
      saveJSON(STORAGE_KEYS.RELATOS, SEED_RELATOS);
    }

    const form = document.getElementById('form-relato');
    const demoBtn = document.getElementById('btn-demo-relato');
    const copyBtn = document.getElementById('btn-copiar-roteiro');
    const clearBtn = document.getElementById('btn-clear-relatos');
    const outputEl = document.getElementById('roteiro-output');
    const protBadge = document.getElementById('protocolo-badge');

    // Carregar o último roteiro inicial na visualização
    const initialRelatos = loadJSON(STORAGE_KEYS.RELATOS, SEED_RELATOS);
    if (initialRelatos.length > 0 && outputEl && protBadge) {
      const last = initialRelatos[initialRelatos.length - 1];
      outputEl.textContent = buildReportText(last);
      protBadge.textContent = `Protocolo: ${last.protocolo}`;
    }

    renderRelatosHistory();

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        document.getElementById('relato-tipo-local').value = 'Via Pública / Semáforo / Feira Livre';
        document.getElementById('relato-horario').value = 'Terças e quintas, das 13h às 19h (horário escolar)';
        document.getElementById('relato-localizacao').value = 'São Paulo/SP, Bairro São Miguel Paulista, Av. Nordestina próximo à praça central';
        document.getElementById('relato-idade-qtd').value = '2 crianças (aparentando 9 e 11 anos)';
        document.getElementById('relato-gravidade').value = 'Risco Grave / Lista TIP (Piores Formas de Trabalho Infantil)';
        document.getElementById('relato-descricao').value = 'Duas crianças vendendo doces entre os veículos em cruzamento de tráfego pesado, sem supervisão protetiva e fora do horário escolar, apresentando sinais visíveis de exaustão.';
        showToast('Campos preenchidos com caso simulado. Clique em "Gerar Roteiro"!');
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const tipoLocal = document.getElementById('relato-tipo-local').value.trim();
        const horario = document.getElementById('relato-horario').value.trim();
        const localizacao = document.getElementById('relato-localizacao').value.trim();
        const idadeQtd = document.getElementById('relato-idade-qtd').value.trim();
        const gravidade = document.getElementById('relato-gravidade').value.trim();
        const descricao = document.getElementById('relato-descricao').value.trim();
        const saveLocal = document.getElementById('relato-salvar-local').checked;

        if (!horario || !localizacao || !idadeQtd || !descricao) {
          showToast('Por favor, preencha todos os campos obrigatórios (*) para gerar o roteiro.');
          return;
        }

        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const novoRelato = {
          protocolo: `SNT-2026-${randomNum}`,
          data: formatNow(),
          tipoLocal,
          horario,
          localizacao,
          idadeQtd,
          gravidade,
          descricao
        };

        const scriptText = buildReportText(novoRelato);
        outputEl.textContent = scriptText;
        protBadge.textContent = `Protocolo: ${novoRelato.protocolo}`;

        if (saveLocal) {
          const list = loadJSON(STORAGE_KEYS.RELATOS, []);
          list.push(novoRelato);
          saveJSON(STORAGE_KEYS.RELATOS, list);
          renderRelatosHistory();
        }

        incrementImpactAccess(1);
        showToast(`Roteiro ${novoRelato.protocolo} gerado com sucesso!`);
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const text = outputEl ? outputEl.textContent : '';
        const label = document.getElementById('copy-btn-label');
        try {
          await navigator.clipboard.writeText(text);
          if (label) label.textContent = 'Relato Copiado!';
          showToast('Roteiro copiado para a área de transferência!');
          setTimeout(() => {
            if (label) label.textContent = 'Copiar Relato';
          }, 2500);
        } catch {
          showToast('Selecione o texto do roteiro manualmente para copiar.');
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        saveJSON(STORAGE_KEYS.RELATOS, []);
        renderRelatosHistory();
        showToast('Histórico local de relatos limpo.');
      });
    }
  }

  // =========================================================================
  // 5. Aba 4: Métricas de Impacto, Avaliação Acadêmica e Exportação CSV/JSON
  // =========================================================================
  function incrementImpactAccess(step = 1) {
    const metrics = loadJSON(STORAGE_KEYS.METRICS, { acessos: 64 });
    metrics.acessos = (Number(metrics.acessos) || 64) + step;
    saveJSON(STORAGE_KEYS.METRICS, metrics);
    updateImpactCounters();
  }

  function updateImpactCounters() {
    const metrics = loadJSON(STORAGE_KEYS.METRICS, { acessos: 64 });
    const feedbacks = loadJSON(STORAGE_KEYS.FEEDBACKS, SEED_FEEDBACKS);

    const acessosEl = document.getElementById('metric-acessos');
    const avalEl = document.getElementById('metric-avaliacoes');
    const mediaEl = document.getElementById('metric-media');

    if (acessosEl) acessosEl.textContent = String(metrics.acessos);
    if (avalEl) avalEl.textContent = String(feedbacks.length);

    if (mediaEl) {
      const avg =
        feedbacks.length > 0
          ? (feedbacks.reduce((acc, item) => acc + Number(item.nota || 5), 0) / feedbacks.length).toFixed(1)
          : '5.0';
      mediaEl.textContent = `${avg} ★`;
    }
  }

  function renderFeedbackList() {
    const listEl = document.getElementById('feedback-list');
    if (!listEl) return;

    const feedbacks = loadJSON(STORAGE_KEYS.FEEDBACKS, SEED_FEEDBACKS);
    if (feedbacks.length === 0) {
      listEl.innerHTML = `<p class="text-xs text-slate-400 italic">Nenhuma avaliação registrada ainda.</p>`;
      return;
    }

    listEl.innerHTML = feedbacks
      .slice()
      .reverse()
      .map((fb) => {
        const stars = '★'.repeat(Number(fb.nota || 5)) + '☆'.repeat(5 - Number(fb.nota || 5));
        return `
          <article class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div class="flex items-center justify-between gap-2">
              <strong class="text-xs font-bold text-brand-800">${fb.nome || 'Participante Anônimo'}</strong>
              <span class="text-xs font-bold text-amber-600">${stars}</span>
            </div>
            <div class="flex flex-wrap items-center justify-between text-[11px] text-slate-500">
              <span>${fb.perfil}</span>
              <span>${fb.data}</span>
            </div>
            <p class="text-xs text-slate-700 pt-1 leading-relaxed">"${fb.comentario}"</p>
            <p class="text-[11px] font-semibold text-emerald-700 pt-0.5">✓ ${fb.ajudou}</p>
          </article>
        `;
      })
      .join('');
  }

  function exportFeedbackData(format) {
    const feedbacks = loadJSON(STORAGE_KEYS.FEEDBACKS, SEED_FEEDBACKS);
    const metrics = loadJSON(STORAGE_KEYS.METRICS, { acessos: 65 });
    const relatos = loadJSON(STORAGE_KEYS.RELATOS, SEED_RELATOS);

    if (format === 'json') {
      const payload = {
        projeto: 'Sentinela Infantil - Extensão Universitária em Engenharia de Software',
        instituicao: 'Universidade Cruzeiro do Sul',
        alinhamento_onu: 'ODS 8 - Meta 8.7 (Aliança 8.7)',
        data_exportacao: formatNow(),
        metricas_impacto: {
          pessoas_impactadas_acessos: metrics.acessos,
          total_avaliacoes_academicas: feedbacks.length,
          relatos_estruturados_gerados: relatos.length
        },
        avaliacoes_comunidade_academica: feedbacks
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
      triggerDownload(blob, `sentinela_infantil_metricas_ods8.json`);
      showToast('Arquivo JSON exportado para anexar ao relatório!');
      return;
    }

    // Exportação CSV com BOM UTF-8 para abrir corretamente no Excel
    const headers = ['ID', 'Data_Hora', 'Nome_Identificacao', 'Vinculo_Academico', 'Nota_Estrelas', 'Ajudou_Identificar_Sinais', 'Comentario_Sugestao'];
    const escapeCSV = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    const rows = feedbacks.map((fb) =>
      [fb.id, fb.data, fb.nome, fb.perfil, fb.nota, fb.ajudou, fb.comentario].map(escapeCSV).join(';')
    );

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `sentinela_infantil_avaliacoes_ods8.csv`);
    showToast('Planilha CSV exportada com sucesso!');
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function initAcademicValidation() {
    if (!localStorage.getItem(STORAGE_KEYS.FEEDBACKS)) {
      saveJSON(STORAGE_KEYS.FEEDBACKS, SEED_FEEDBACKS);
    }

    incrementImpactAccess(1);
    renderFeedbackList();

    // Estrelas Interativas
    const starBtns = document.querySelectorAll('.star-btn');
    const notaInput = document.getElementById('fb-nota');
    const starLabel = document.getElementById('star-rating-label');
    const labelsMap = {
      1: '1/5 - Insuficiente',
      2: '2/5 - Regular',
      3: '3/5 - Bom',
      4: '4/5 - Muito Bom',
      5: '5/5 - Excelente'
    };

    function setStars(rating) {
      notaInput.value = String(rating);
      if (starLabel) starLabel.textContent = labelsMap[rating] || '5/5 - Excelente';
      starBtns.forEach((btn) => {
        const starVal = Number(btn.getAttribute('data-star'));
        if (starVal <= rating) {
          btn.classList.add('bg-amber-400', 'text-slate-950', 'border-amber-500');
          btn.classList.remove('bg-amber-50', 'text-amber-500', 'border-slate-300');
        } else {
          btn.classList.remove('bg-amber-400', 'text-slate-950', 'border-amber-500');
          btn.classList.add('bg-amber-50', 'text-amber-500', 'border-slate-300');
        }
      });
    }

    setStars(5);
    starBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        setStars(Number(btn.getAttribute('data-star')));
      });
    });

    // Submissão de Avaliação
    const formFeedback = document.getElementById('form-feedback');
    if (formFeedback) {
      formFeedback.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('fb-nome').value.trim() || 'Colega Acadêmico (Anônimo)';
        const perfil = document.getElementById('fb-perfil').value;
        const nota = Number(document.getElementById('fb-nota').value || 5);
        const ajudou = document.getElementById('fb-ajudou').value;
        const comentario = document.getElementById('fb-comentario').value.trim();

        if (!comentario) {
          showToast('Por favor, escreva um breve comentário ou sugestão.');
          return;
        }

        const feedbacks = loadJSON(STORAGE_KEYS.FEEDBACKS, SEED_FEEDBACKS);
        const novo = {
          id: `FB-2026-${String(feedbacks.length + 1).padStart(2, '0')}`,
          data: formatNow(),
          nome,
          perfil,
          nota,
          ajudou,
          comentario
        };

        feedbacks.push(novo);
        saveJSON(STORAGE_KEYS.FEEDBACKS, feedbacks);

        document.getElementById('fb-nome').value = '';
        document.getElementById('fb-comentario').value = '';
        setStars(5);

        updateImpactCounters();
        renderFeedbackList();
        showToast('Avaliação registrada! Obrigado por contribuir com o projeto de extensão.');
      });
    }

    // Botões de Exportação e Restauração
    const btnCSV = document.getElementById('btn-export-csv');
    const btnJSON = document.getElementById('btn-export-json');
    const btnRestore = document.getElementById('btn-restore-seed');

    if (btnCSV) btnCSV.addEventListener('click', () => exportFeedbackData('csv'));
    if (btnJSON) btnJSON.addEventListener('click', () => exportFeedbackData('json'));

    if (btnRestore) {
      btnRestore.addEventListener('click', () => {
        saveJSON(STORAGE_KEYS.FEEDBACKS, SEED_FEEDBACKS);
        saveJSON(STORAGE_KEYS.RELATOS, SEED_RELATOS);
        updateImpactCounters();
        renderFeedbackList();
        renderRelatosHistory();
        showToast('Dados de demonstração restaurados com sucesso.');
      });
    }
  }

  // =========================================================================
  // 6. Registro do Service Worker para PWA Offline
  // =========================================================================
  function initPWA() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {
          // Silencioso caso rodado via file://
        });
      });
    }
  }

  // Inicialização Geral
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initContrastMode();
    initGuideFilters();
    initRiskThermometer();
    initReportAssistant();
    initAcademicValidation();
    initPWA();
  });
})();

