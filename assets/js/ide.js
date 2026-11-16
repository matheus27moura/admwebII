/* =========================================================
   IDE PHP — Projeto da disciplina e Prática das aulas
   ---------------------------------------------------------
   - HTML, CSS e JS dos modelos vêm prontos; arquivos travados
     abrem somente para leitura. O aluno escreve o PHP.
   - Cada etapa tem requisitos verificados automaticamente:
     a IDE executa o PHP do aluno como um navegador faria
     (abre páginas, envia formulários, faz login...) e confere
     o resultado.
   - Para estimular a escrita do código, o roteiro não pode ser
     selecionado e colar texto vindo de fora do editor é bloqueado.
   ========================================================= */
(function () {
const { b64dec, carregarPHP, processar, resolver, montarHTML, extensao } = window.PHPMotor;

const $ = (s) => document.querySelector(s);
const CFG = window.IDE_CONFIG || {};
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const ler = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
const pad = (n) => String(n).padStart(2, '0');

// =========================================================
// 1) Datas no fuso de São Paulo (o mesmo usado pelo PHP)
// =========================================================
function agoraSP() {
  const p = {};
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach((x) => { p[x.type] = x.value; });
  const y = +p.year, m = +p.month, d = +p.day;
  return { y, m, d, hora: +p.hour, dow: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
}
function isoMais(dias) {
  const a = agoraSP();
  const dt = new Date(Date.UTC(a.y, a.m - 1, a.d + dias));
  return { iso: dt.getUTCFullYear() + '-' + pad(dt.getUTCMonth() + 1) + '-' + pad(dt.getUTCDate()), dow: dt.getUTCDay() };
}

// =========================================================
// 2) Trilhas: Projeto da disciplina e Prática das aulas
// =========================================================
const dedentar = (v) => R.dedent(v) + '\n';
const cacheIniciais = {};
const TRILHAS = {
  projeto: {
    nome: 'Projeto da disciplina',
    itens: () => window.PROJETO_ETAPAS,
    chave: () => 'ide:projeto',                       // um único projeto que cresce a cada etapa
    iniciais: () => Object.assign({}, window.PROJETO_SITE),
    travado: (nome) => /\.(css|js)$/i.test(nome),
    base: () => Object.keys(window.PROJETO_SITE),
    zip: 'patas-e-cia'
  },
  pratica: {
    nome: 'Prática das aulas',
    itens: () => window.PRATICAS,
    chave: (item) => 'ide:pratica:' + pad(item.n),   // cada aula tem os seus arquivos
    iniciais: (item) => {
      if (cacheIniciais[item.n]) return Object.assign({}, cacheIniciais[item.n]);
      const a = R.aula(item.aula);
      const o = {};
      for (const [k, v] of Object.entries(a.modelo.arquivos)) o[k] = dedentar(v);
      for (const [k, v] of Object.entries(item.arquivos || {})) o[k] = dedentar(v);
      for (const k of item.remover || []) delete o[k];
      cacheIniciais[item.n] = o;
      return Object.assign({}, o);
    },
    travado: (nome, item) => !(item.editaveis || []).includes(nome) && TRILHAS.pratica.iniciais(item)[nome] !== undefined,
    base: (item) => Object.keys(TRILHAS.pratica.iniciais(item)),
    zip: 'pratica-aula'
  }
};

// =========================================================
// 3) Estado
// =========================================================
const params = new URLSearchParams(location.search);
let trilha = TRILHAS[params.get('trilha')] ? params.get('trilha') : (ler('ide:trilha') || 'projeto');
let item = null;            // etapa (projeto) ou prática (aula) aberta
let chaveAtual = null;      // prefixo do localStorage dos arquivos abertos
let arquivos = {}, docs = {}, ativo = null;
let dados = { arquivos: {}, sessao: null, sessao_arr: null };
let historico = [], ultimaReq = null;
let prof = sessionStorage.getItem('ide:prof') === '1';
const resultados = {};      // "trilha:n" -> [true/false/null...]
let verificando = false;

const progresso = () => ler('ide:progresso') || {};
function marcar(campo, valor) {
  const p = progresso();
  p[trilha] = p[trilha] || { feitas: {}, dicas: {} };
  if (campo === 'feita') p[trilha].feitas[item.n] = valor;
  if (campo === 'dicas') p[trilha].dicas[item.n] = valor;
  guardar('ide:progresso', p);
}
const prog = () => (progresso()[trilha] || { feitas: {}, dicas: {} });

// =========================================================
// 4) Editor (CodeMirror) + bloqueio de colar
// =========================================================
const editor = CodeMirror.fromTextArea($('#editor'), {
  lineNumbers: true, indentUnit: 4, tabSize: 4, indentWithTabs: false,
  matchBrackets: true, autoCloseBrackets: true, autoCloseTags: true, styleActiveLine: true,
  extraKeys: {
    'Ctrl-Enter': () => executar(), 'Cmd-Enter': () => executar(),
    'Ctrl-S': () => executar(), 'Cmd-S': () => executar(),
    'Ctrl-/': 'toggleComment', 'Cmd-/': 'toggleComment',
    Tab: (cm) => cm.somethingSelected() ? cm.indentSelection('add') : cm.replaceSelection('    ', 'end')
  }
});

// Textos copiados/recortados DENTRO do editor podem ser colados normalmente
const copiados = new Set();
const normal = (s) => s.replace(/\r/g, '').trim();
editor.on('copy', (cm) => copiados.add(normal(cm.getSelection())));
editor.on('cut', (cm) => copiados.add(normal(cm.getSelection())));
editor.on('beforeChange', (cm, ch) => {
  if (prof || (ch.origin !== 'paste' && ch.origin !== 'drop')) return;
  const txt = normal(ch.text.join('\n'));
  const hash = /^\$2y\$\d{2}\$[./A-Za-z0-9]{53}$/.test(txt);     // hash de senha gerado na etapa 7
  if (txt.length <= (CFG.colarMaximo || 20) || copiados.has(txt) || hash) return;
  ch.cancel();
  aviso('Colar código de fora do editor está desativado. Digite o código: é escrevendo que se aprende. (Copiar e colar dentro do próprio editor continua funcionando.)');
});

function modoDe(nome) {
  return { php: 'application/x-httpd-php', html: 'htmlmixed', css: 'css', js: 'javascript', json: { name: 'javascript', json: true } }[extensao(nome)] || null;
}
const travado = (nome) => TRILHAS[trilha].travado(nome, item);

function carregarArquivos() {
  const t = TRILHAS[trilha];
  const chave = t.chave(item);
  if (chave === chaveAtual) return false;   // mesmo conjunto de arquivos (etapas do projeto)
  chaveAtual = chave;
  const salvo = ler(chave + ':arquivos');
  arquivos = salvo && Object.keys(salvo).length ? salvo : t.iniciais(item);
  // garante que arquivos travados estejam sempre na versão original
  const orig = t.iniciais(item);
  for (const n of Object.keys(orig)) if (travado(n)) arquivos[n] = orig[n];
  dados = ler(chave + ':dados') || { arquivos: {}, sessao: null, sessao_arr: null };
  docs = {};
  for (const n of Object.keys(arquivos)) criarDoc(n);
  historico = []; ultimaReq = null;
  return true;
}
function criarDoc(nome) {
  const d = CodeMirror.Doc(arquivos[nome], modoDe(nome));
  d.on('change', () => { arquivos[nome] = d.getValue(); salvarDepois(); });
  docs[nome] = d;
}
let tSalvar;
function salvarDepois() { clearTimeout(tSalvar); tSalvar = setTimeout(salvarAgora, 400); }
function salvarAgora() { clearTimeout(tSalvar); guardar(chaveAtual + ':arquivos', arquivos); }

function abrirArquivo(nome) {
  if (!docs[nome]) nome = Object.keys(docs)[0];
  ativo = nome;
  editor.swapDoc(docs[nome]);
  const tr = travado(nome);
  editor.setOption('readOnly', tr);
  $('#aviso-travado').hidden = !tr;
  document.querySelector('.painel-editor').classList.toggle('editor-travado', tr);
  desenharAbas();
}
const CADEADO = '<svg class="cadeado" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
function peso(n) { return n === 'index.php' ? 0 : travado(n) ? 5 : ({ php: 1, html: 1, json: 3 }[extensao(n)] || 4); }
function desenharAbas() {
  const abas = $('#abas');
  abas.innerHTML = '';
  const base = TRILHAS[trilha].base(item);
  Object.keys(arquivos).sort((a, b) => peso(a) - peso(b) || a.localeCompare(b)).forEach((nome) => {
    const b = document.createElement('button');
    b.type = 'button';
    const tr = travado(nome);
    b.className = 'aba' + (nome === ativo ? ' ativa' : '') + (tr ? ' travada' : '');
    const e = extensao(nome);
    b.innerHTML = (tr ? CADEADO : '') + '<span class="tipo ' + e + '">' + e.toUpperCase() + '</span>' + R.esc(nome) +
      (!base.includes(nome) ? '<span class="fechar" title="Excluir arquivo">&times;</span>' : '');
    b.title = tr ? 'Arquivo pronto (somente leitura)' : '';
    b.onclick = (ev) => { if (ev.target.classList.contains('fechar')) excluirArquivo(nome); else abrirArquivo(nome); };
    abas.appendChild(b);
  });
  const novo = document.createElement('button');
  novo.className = 'aba-nova'; novo.type = 'button'; novo.title = 'Criar arquivo'; novo.textContent = '+';
  novo.onclick = novoArquivo;
  abas.appendChild(novo);
}
function novoArquivo() {
  const nome = (prompt('Nome do novo arquivo PHP (ex.: dados.php, funcoes.php):') || '').trim();
  if (!nome) return;
  if (!/^[\w\-]+\.(php|json)$/.test(nome)) { alert('Use letras, números ou hífen e a extensão .php (ex.: funcoes.php).'); return; }
  if (arquivos[nome] === undefined) {
    arquivos[nome] = nome.endsWith('.php') ? '<?php\n// ' + nome + '\n\n' : '';
    criarDoc(nome); salvarAgora();
  }
  abrirArquivo(nome);
}
function excluirArquivo(nome) {
  if (!confirm('Excluir o arquivo "' + nome + '"?')) return;
  delete arquivos[nome]; delete docs[nome]; salvarAgora();
  abrirArquivo(ativo === nome ? Object.keys(arquivos)[0] : ativo);
}

// =========================================================
// 5) Pré-visualização (o "navegador" da direita)
// =========================================================
window.__labNavegar = function (metodo, destino, campos) {
  const atual = ultimaReq ? ultimaReq.pagina : paginaInicial();
  const alvo = resolver(destino || '', atual);
  const corpo = campos ? new URLSearchParams(campos).toString() : '';
  if (metodo === 'POST') requisitar({ metodo: 'POST', pagina: alvo.pagina, get: alvo.get, post: corpo });
  else requisitar({ metodo: 'GET', pagina: alvo.pagina, get: campos ? corpo : alvo.get, post: '' });
};
window.__labConsole = function (tipo, args) {
  log(tipo === 'error' ? 'erro' : tipo === 'warn' ? 'aviso' : '', 'JS', args.map((a) => { try { return typeof a === 'string' ? a : JSON.stringify(a); } catch (e) { return String(a); } }).join(' '));
};
function paginaInicial() {
  if (item && item.pagina && arquivos[item.pagina] !== undefined) return item.pagina;
  return arquivos['index.php'] !== undefined ? 'index.php' : Object.keys(arquivos).find((n) => n.endsWith('.php'));
}
let tCarregando;
async function requisitar(req, opcoes = {}) {
  if (!opcoes.recarga) historico.push(req);
  ultimaReq = req;
  $('#metodo').textContent = req.metodo;
  $('#metodo').className = 'metodo' + (req.metodo === 'POST' ? ' post' : '');
  $('#url').textContent = 'localhost/' + req.pagina + (req.get ? '?' + req.get : '');
  if (!opcoes.redirecionado) log('info', 'REQ', req.metodo + ' /' + req.pagina + (req.get ? '?' + req.get : '') + (req.post ? '   corpo: ' + decodeURIComponent(req.post.replace(/\+/g, ' ')) : ''));
  if (arquivos[req.pagina] === undefined) {
    mostrar(paginaErro('404 — Página não encontrada', 'O arquivo <b>' + R.esc(req.pagina) + '</b> não existe. Confira o nome no link, no <code>action</code> do formulário ou no <code>header("Location: ...")</code>.'));
    log('erro', 'HTTP', '404: arquivo "' + req.pagina + '" não existe');
    return;
  }
  if (extensao(req.pagina) !== 'php') { mostrar('<pre style="font:13px/1.5 monospace;padding:16px;white-space:pre-wrap">' + R.esc(arquivos[req.pagina]) + '</pre>'); return; }
  clearTimeout(tCarregando);
  tCarregando = setTimeout(() => { $('#carregando').hidden = false; }, 150);
  try {
    const r = await processar(arquivos, dados, req, { aviso: (tipo, txt) => log(tipo, 'API', txt) });
    dados = r.dados;
    guardar(chaveAtual + ':dados', dados);
    for (const l of r.meta.log || []) log(l.tipo === 'Fatal' ? 'erro' : 'aviso', 'PHP', l.msg + (l.linha ? '  →  ' + l.arquivo + ', linha ' + l.linha : ''), l);
    for (const e of r.meta.mails || []) log('ok', 'MAIL', 'E-mail simulado para ' + e.para + ' | ' + e.assunto);
    const loc = r.meta.cabecalhos.find((h) => h[0].toLowerCase() === 'location');
    if (loc && (opcoes.saltos || 0) < 6) {
      log('info', 'HTTP', 'Redirecionado para: ' + loc[1]);
      const alvo = resolver(loc[1], req.pagina);
      return requisitar({ metodo: 'GET', pagina: alvo.pagina, get: alvo.get, post: '' }, { redirecionado: true, recarga: true, saltos: (opcoes.saltos || 0) + 1 });
    }
    let html = r.html;
    const ct = r.meta.cabecalhos.find((h) => h[0].toLowerCase() === 'content-type');
    if (ct && /json|text\/plain/i.test(ct[1])) html = '<pre style="font:13px/1.5 monospace;padding:16px;white-space:pre-wrap">' + R.esc(html) + '</pre>';
    mostrar(html);
  } catch (err) {
    log('erro', 'IDE', 'Não foi possível executar o PHP: ' + err.message);
    mostrar(paginaErro('Não foi possível executar', R.esc(err.message) + '<br><br>Verifique a internet: o PHP é baixado na primeira execução.'));
  } finally {
    clearTimeout(tCarregando);
    $('#carregando').hidden = true;
    desenharConsole();
  }
}
function mostrar(html) { $('#preview').srcdoc = montarHTML(html, arquivos); }
function paginaErro(t, x) { return '<!doctype html><html><head><meta charset="utf-8"></head><body style="font:15px/1.6 system-ui,sans-serif;color:#333;padding:40px;max-width:640px"><h2 style="margin:0 0 8px">' + t + '</h2><p>' + x + '</p></body></html>'; }
function executar() {
  salvarAgora();
  if (/\.php$/.test(ativo) && !travado(ativo) && (!ultimaReq || ultimaReq.pagina !== ativo) && !/^(dados|funcoes|cabecalho|rodape|topo|menu|api|bot|protecao|usuarios)\.php$/.test(ativo)) {
    requisitar({ metodo: 'GET', pagina: ativo, get: '', post: '' });
  } else if (ultimaReq) requisitar(ultimaReq, { recarga: true });
  else requisitar({ metodo: 'GET', pagina: paginaInicial(), get: '', post: '' });
}

// ---------- Console ----------
let abaConsole = 'log', erros = 0;
const linhas = [];
function log(tipo, origem, texto, ref) { linhas.push({ tipo, origem, texto, ref }); if (tipo === 'erro') erros++; if (abaConsole === 'log') desenharConsole(); }
function limparConsole() { linhas.length = 0; erros = 0; desenharConsole(); }
function desenharConsole() {
  $('#cont-erros').textContent = erros || '';
  document.querySelectorAll('.console-abas [data-aba]').forEach((b) => b.classList.toggle('ativa', b.dataset.aba === abaConsole));
  const corpo = $('#console-corpo');
  if (abaConsole === 'log') {
    corpo.innerHTML = linhas.length ? '' : '<div class="vazio">Erros e avisos do PHP, chamadas de API e o console.log do JavaScript aparecem aqui.</div>';
    linhas.slice(-200).forEach((l) => {
      const d = document.createElement('div');
      d.className = 'linha-log ' + l.tipo;
      d.innerHTML = '<span class="origem">' + l.origem + '</span><span></span>';
      d.lastChild.textContent = l.texto;
      if (l.ref && l.ref.linha && arquivos[l.ref.arquivo] !== undefined) {
        d.style.cursor = 'pointer'; d.title = 'Ir até a linha';
        d.onclick = () => { abrirArquivo(l.ref.arquivo); editor.setCursor({ line: l.ref.linha - 1, ch: 0 }); editor.scrollIntoView(null, 120); editor.focus(); };
      }
      corpo.appendChild(d);
    });
    corpo.scrollTop = corpo.scrollHeight;
  } else {
    let h = '';
    if (dados.sessao_arr && Object.keys(dados.sessao_arr).length) h += '<div class="dados-arquivo"><b>$_SESSION</b><pre>' + R.esc(JSON.stringify(dados.sessao_arr, null, 2)) + '</pre></div>';
    Object.keys(dados.arquivos || {}).forEach((n) => {
      let t = b64dec(dados.arquivos[n]);
      try { if (/\.json$/i.test(n)) t = JSON.stringify(JSON.parse(t), null, 2); } catch (e) {}
      h += '<div class="dados-arquivo"><b>' + R.esc(n) + '</b> (criado pelo PHP)<pre>' + R.esc(t) + '</pre></div>';
    });
    corpo.innerHTML = h || '<div class="vazio">Nada salvo ainda. Arquivos criados pelo PHP e a sessão aparecem aqui.</div>';
  }
}

// =========================================================
// 6) Verificação automática dos requisitos
// =========================================================
const semComentarios = (s) => (s || '')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:\\])\/\/[^\n]*/g, '$1')
  .replace(/^\s*#.*$/gm, '');

function criarTestador(arqs) {
  let estado = { arquivos: {}, sessao: null };
  const a = agoraSP();
  const hoje = isoMais(0).iso;
  async function abrir(metodo, pagina, campos) {
    const qs = campos ? new URLSearchParams(campos).toString() : '';
    let req = metodo === 'POST' ? { metodo, pagina, get: '', post: qs } : { metodo, pagina, get: qs, post: '' };
    let redirecionou = false;
    const problemas = [];
    for (let salto = 0; salto < 6; salto++) {
      if (arqs[req.pagina] === undefined) return montarPagina('', req.pagina, redirecionou, ['404'], false);
      const r = await processar(arqs, estado, req, { cacheApi: true });
      estado = r.dados;
      problemas.push(...(r.meta.log || []).filter((l) => l.tipo !== 'Deprecated'));
      const loc = r.meta.cabecalhos.find((h) => h[0].toLowerCase() === 'location');
      if (loc) { const alvo = resolver(loc[1], req.pagina); req = { metodo: 'GET', pagina: alvo.pagina, get: alvo.get, post: '' }; redirecionou = true; continue; }
      return montarPagina(r.html, req.pagina, redirecionou, problemas, r.meta.status !== 'erro');
    }
    return montarPagina('', req.pagina, true, ['redirecionamentos demais'], false);
  }
  function montarPagina(html, nome, redirecionou, problemas, executou) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return {
      html, doc, pagina: nome, redirecionou,
      texto: (doc.body ? doc.body.textContent : '').replace(/\s+/g, ' '),
      semErros: executou && problemas.length === 0,
      $: (s) => doc.querySelector(s),
      $$: (s) => [...doc.querySelectorAll(s)]
    };
  }
  return {
    hoje, ano: a.y, mes: a.m, hora: a.hora, dow: a.dow, ontem: isoMais(-1).iso,
    br: (iso) => iso.split('-').reverse().join('/'),
    diaUtil(k) { let n = 0; for (let i = 1; i < 30; i++) { const d = isoMais(i); if (d.dow !== 0 && ++n === k) return d.iso; } },
    domingo() { for (let i = 1; i < 8; i++) { const d = isoMais(i); if (d.dow === 0) return d.iso; } },
    saudacao: () => (a.hora >= 5 && a.hora < 12 ? 'Bom dia' : a.hora >= 12 && a.hora < 18 ? 'Boa tarde' : 'Boa noite'),
    aberto: () => a.dow !== 0 && a.hora >= 8 && a.hora < 18,
    existe: (n) => arqs[n] !== undefined,
    fonte: (n) => arqs[n] || '',
    codigo: (n) => semComentarios(arqs[n]),
    todoCodigo: () => Object.keys(arqs).filter((n) => n.endsWith('.php')).map((n) => semComentarios(arqs[n])).join('\n'),
    get: (p, campos) => abrir('GET', p, campos),
    post: (p, campos) => abrir('POST', p, campos),
    json(n) { const b = (estado.arquivos || {})[n]; if (!b) return null; try { return JSON.parse(b64dec(b)); } catch (e) { return null; } }
  };
}

async function testarItem(it, arqs, aoAtualizar) {
  const res = [];
  for (let i = 0; i < it.requisitos.length; i++) {
    if (aoAtualizar) aoAtualizar(i, 'testando');
    let ok = false;
    try { ok = !!(await it.requisitos[i].teste(criarTestador(arqs))); } catch (e) { ok = false; }
    res.push(ok);
    if (aoAtualizar) aoAtualizar(i, ok ? 'ok' : 'falhou');
  }
  return res;
}

async function verificar() {
  if (verificando) return;
  verificando = true;
  salvarAgora();
  const btn = $('#btn-verificar');
  btn.disabled = true; btn.textContent = 'Verificando...';
  $('#resultado-etapa').innerHTML = '';
  const lis = [...document.querySelectorAll('.requisitos li')];
  lis.forEach((li) => { li.className = ''; });
  try {
    await carregarPHP();
    const res = await testarItem(item, arquivos, (i, estadoReq) => { lis[i].className = estadoReq; lis[i].querySelector('.marca').textContent = estadoReq === 'ok' ? '✓' : estadoReq === 'falhou' ? '!' : ''; });
    resultados[trilha + ':' + item.n] = res;
    const ok = res.filter(Boolean).length;
    if (ok === res.length) {
      if (!prog().feitas[item.n]) marcar('feita', new Date().toISOString());
      const prox = TRILHAS[trilha].itens().find((x) => x.n === item.n + 1);
      $('#resultado-etapa').innerHTML = '<div class="resultado-etapa ok"><b>Todos os requisitos cumpridos.</b> ' +
        (prox ? 'Quando quiser, avance para: ' + R.esc(prox.titulo) + '.' : 'Você concluiu a última etapa. Parabéns!') + '</div>';
      desenharEtapas();
    } else {
      $('#resultado-etapa').innerHTML = '<div class="resultado-etapa parcial">' + ok + ' de ' + res.length + ' requisitos cumpridos. Leia os que estão marcados, teste na pré-visualização e confira o Console.</div>';
    }
  } finally {
    verificando = false;
    btn.disabled = false; btn.textContent = 'Verificar requisitos';
  }
}

// =========================================================
// 7) Interface: faixa de etapas e roteiro
// =========================================================
function md(s) {
  return R.esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
}
function desenharTrilhas() {
  document.querySelectorAll('.trilhas button').forEach((b) => b.classList.toggle('ativa', b.dataset.trilha === trilha));
}
function desenharEtapas() {
  const itens = TRILHAS[trilha].itens();
  const feitas = prog().feitas;
  const n = itens.filter((x) => feitas[x.n]).length;
  const rot = trilha === 'projeto' ? 'etapas' : 'práticas';
  $('#etapas').innerHTML = '<span class="resumo"><b>' + n + ' de ' + itens.length + '</b> ' + rot + ' concluídas</span>' +
    itens.map((x) => '<button type="button" class="etapa-btn' + (feitas[x.n] ? ' feita' : '') + (x.n === item.n ? ' atual' : '') + '" data-n="' + x.n + '" title="' + R.esc((trilha === 'projeto' ? 'Etapa ' : 'Aula ') + x.n + ': ' + x.titulo) + '">' + (feitas[x.n] ? '✓' : x.n) + '</button>').join('') +
    '<span class="barra"><span style="width:' + (n / itens.length * 100) + '%"></span></span>';
  $('#etapas').querySelectorAll('.etapa-btn').forEach((b) => b.onclick = () => abrir(trilha, +b.dataset.n));
}

function desenharGuia() {
  const it = item;
  const ehProjeto = trilha === 'projeto';
  const total = TRILHAS[trilha].itens().length;
  const usadas = prog().dicas[it.n] || 0;
  const res = resultados[trilha + ':' + it.n] || [];
  let h = '<div class="rotulo">' + (ehProjeto ? 'Etapa ' + it.n + ' de ' + total + ' · Aula ' + pad(it.aula) : 'Prática da aula ' + pad(it.aula)) +
    ' <a href="aula.html?n=' + it.aula + '" target="_blank">rever a aula</a></div>';
  h += '<h1>' + R.esc(it.titulo) + '</h1>';
  if (it.conceitos) h += '<div class="conceitos">Conceitos: ' + R.esc(it.conceitos) + '</div>';
  (it.contexto || []).forEach((p) => { h += '<p>' + md(p) + '</p>'; });
  h += '<h2>O que fazer</h2><ol class="tarefas">' + it.tarefas.map((t) => '<li>' + md(t) + '</li>').join('') + '</ol>';
  if (it.exemplo) {
    h += '<h2>Exemplo parecido</h2><div class="exemplo"><div class="exemplo-topo"><span>' + R.esc(it.exemplo.titulo) + '</span><span>entenda a ideia, não é a resposta</span></div><pre>' + R.esc(it.exemplo.codigo) + '</pre></div>';
  }
  h += '<h2>Requisitos</h2><ul class="requisitos">' + it.requisitos.map((r, i) =>
    '<li class="' + (res[i] === true ? 'ok' : res[i] === false ? 'falhou' : '') + '"><span class="marca">' + (res[i] === true ? '✓' : res[i] === false ? '!' : '') + '</span><span>' + md(r.texto) + '</span></li>').join('') + '</ul>';
  h += '<div class="acoes-verificar"><button class="btn primario" id="btn-verificar" type="button">Verificar requisitos</button>' +
    (prog().feitas[it.n] ? '<span class="muted small">Concluída em ' + new Date(prog().feitas[it.n]).toLocaleDateString('pt-BR') + '</span>' : '') + '</div><div id="resultado-etapa"></div>';
  h += '<h2>Dicas</h2><div id="dicas">' + it.dicas.slice(0, prof ? it.dicas.length : usadas).map((d, i) => htmlDica(d, i)).join('') + '</div>';
  if (!prof && usadas < it.dicas.length) h += '<button class="btn pequeno" id="btn-dica" type="button">Ver dica ' + (usadas + 1) + ' de ' + it.dicas.length + '</button>';
  const anterior = TRILHAS[trilha].itens().find((x) => x.n === it.n - 1), prox = TRILHAS[trilha].itens().find((x) => x.n === it.n + 1);
  h += '<div class="nav-etapas"><button class="btn pequeno" type="button" id="btn-ant"' + (anterior ? '' : ' disabled') + '>&larr; Anterior</button><button class="btn pequeno" type="button" id="btn-prox"' + (prox ? '' : ' disabled') + '>Próxima &rarr;</button></div>';
  h += '<div class="ferramentas">' +
    '<button class="btn pequeno" type="button" id="btn-zip">Baixar .zip</button>' +
    '<button class="btn pequeno" type="button" id="btn-exportar" title="Leva o seu progresso para outro computador">Exportar backup</button>' +
    '<button class="btn pequeno" type="button" id="btn-importar">Importar backup</button>' +
    '<button class="btn pequeno" type="button" id="btn-recomecar">' + (ehProjeto ? 'Recomeçar projeto' : 'Restaurar prática') + '</button>' +
    (prof ? '<button class="btn pequeno" type="button" id="btn-gabarito">Carregar gabarito</button><button class="btn pequeno" type="button" id="btn-relatorio">Verificar todas</button>' : '') +
    '</div>';
  h += '<p class="aviso-copia">Para você aprender de verdade, o roteiro não pode ser copiado e colar código vindo de fora do editor está desativado.</p>';
  $('#guia').innerHTML = h;
  $('#guia').scrollTop = 0;

  $('#btn-verificar').onclick = verificar;
  if ($('#btn-dica')) $('#btn-dica').onclick = () => { marcar('dicas', usadas + 1); desenharGuia(); $('#dicas').lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  $('#btn-ant').onclick = () => anterior && abrir(trilha, anterior.n);
  $('#btn-prox').onclick = () => prox && abrir(trilha, prox.n);
  $('#btn-zip').onclick = baixarZip;
  $('#btn-exportar').onclick = exportarBackup;
  $('#btn-importar').onclick = () => $('#arquivo-backup').click();
  $('#btn-recomecar').onclick = recomecar;
  if (prof) { $('#btn-gabarito').onclick = carregarGabarito; $('#btn-relatorio').onclick = relatorio; }
}
function htmlDica(d, i) {
  const [primeira, ...resto] = d.split('\n');
  return '<div class="dica"><b>Dica ' + (i + 1) + '</b><p>' + md(primeira) + '</p>' + (resto.length ? '<pre class="esqueleto">' + R.esc(resto.join('\n')) + '</pre>' : '') + '</div>';
}

// Bloqueia copiar, recortar, arrastar e o menu do botão direito no roteiro
['copy', 'cut', 'dragstart', 'contextmenu'].forEach((ev) => $('#guia').addEventListener(ev, (e) => { if (!prof) e.preventDefault(); }));

// =========================================================
// 8) Abrir etapa / prática
// =========================================================
function abrir(nomeTrilha, n) {
  const mudouTrilha = nomeTrilha !== trilha;
  trilha = nomeTrilha;
  guardar('ide:trilha', trilha);
  const itens = TRILHAS[trilha].itens();
  item = itens.find((x) => x.n === n) || itens.find((x) => x.n === (ler('ide:' + trilha + ':ultimo') || 1)) || itens[0];
  guardar('ide:' + trilha + ':ultimo', item.n);
  history.replaceState(null, '', '?trilha=' + trilha + '&n=' + item.n);
  const novos = carregarArquivos();
  desenharTrilhas(); desenharEtapas(); desenharGuia();
  abrirArquivo(arquivos[item.arquivo] !== undefined ? item.arquivo : (ativo && arquivos[ativo] !== undefined && !novos ? ativo : paginaInicial()));
  if (novos || mudouTrilha) { limparConsole(); requisitar({ metodo: 'GET', pagina: paginaInicial(), get: '', post: '' }); }
}

// =========================================================
// 9) Ferramentas: zip, backup, recomeçar, professor
// =========================================================
async function baixarZip() {
  salvarAgora();
  const nome = trilha === 'projeto' ? TRILHAS.projeto.zip : TRILHAS.pratica.zip + pad(item.aula);
  const zip = new JSZip(); const pasta = zip.folder(nome);
  for (const [n, c] of Object.entries(arquivos)) pasta.file(n, c);
  for (const [n, b] of Object.entries(dados.arquivos || {})) pasta.file(n, b, { base64: true });
  pasta.file('LEIA-ME.txt', 'Projeto exportado da IDE PHP na Prática.\r\n\r\nPara rodar no seu computador:\r\n1. Instale o XAMPP (https://www.apachefriends.org).\r\n2. Copie esta pasta para C:\\xampp\\htdocs\\\r\n3. Inicie o Apache no painel do XAMPP.\r\n4. Acesse http://localhost/' + nome + '/\r\n');
  const blob = await zip.generateAsync({ type: 'blob' });
  baixar(blob, nome + '.zip');
}
function baixar(blob, nome) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nome; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
function exportarBackup() {
  salvarAgora();
  const tudo = {};
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('ide:')) tudo[k] = localStorage.getItem(k); }
  const quando = new Date().toISOString().slice(0, 10);
  baixar(new Blob([JSON.stringify({ tipo: 'backup-ide-php', data: quando, chaves: tudo })], { type: 'application/json' }), 'backup-ide-php-' + quando + '.json');
}
$('#arquivo-backup').onchange = async (e) => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try {
    const j = JSON.parse(await f.text());
    if (j.tipo !== 'backup-ide-php') throw new Error('arquivo não é um backup da IDE');
    if (!confirm('Importar o backup de ' + j.data + '? O progresso atual neste navegador será substituído.')) return;
    for (let i = localStorage.length - 1; i >= 0; i--) { const k = localStorage.key(i); if (k.startsWith('ide:')) localStorage.removeItem(k); }
    for (const [k, v] of Object.entries(j.chaves)) localStorage.setItem(k, v);
    location.reload();
  } catch (err) { alert('Não foi possível importar: ' + err.message); }
};
function recomecar() {
  const msg = trilha === 'projeto' ? 'Apagar TODO o código do projeto e voltar ao site HTML original? O progresso das etapas é mantido, mas o seu PHP será perdido.' : 'Voltar os arquivos desta prática ao início? O seu PHP desta aula será perdido.';
  if (!confirm(msg)) return;
  try { localStorage.removeItem(chaveAtual + ':arquivos'); localStorage.removeItem(chaveAtual + ':dados'); } catch (e) {}
  chaveAtual = null;
  abrir(trilha, item.n);
}
$('#btn-limpar-dados').onclick = () => {
  if (!confirm('Apagar os arquivos criados pelo PHP (ex.: dados/*.json) e a sessão?')) return;
  dados = { arquivos: {}, sessao: null, sessao_arr: null };
  guardar(chaveAtual + ':dados', dados);
  log('info', 'IDE', 'Dados e sessão apagados.');
  desenharConsole();
};

// ---------- Modo professor ----------
async function sha256(t) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}
function desenharProf() { $('#selo-prof').hidden = !prof; $('#btn-prof').textContent = prof ? 'Sair do modo professor' : 'Professor'; }
$('#btn-prof').onclick = async () => {
  if (prof) { prof = false; sessionStorage.removeItem('ide:prof'); desenharProf(); desenharGuia(); return; }
  const codigo = prompt('Código do professor:');
  if (!codigo) return;
  if ((await sha256(codigo.trim())) !== CFG.hashProfessor) { alert('Código incorreto.'); return; }
  prof = true; sessionStorage.setItem('ide:prof', '1'); desenharProf(); desenharGuia();
  aviso('Modo professor ativo: colar liberado, todas as dicas visíveis, gabarito e relatório disponíveis.');
};
function carregarScript(src) {
  return new Promise((ok, falha) => { const s = document.createElement('script'); s.src = src + '?v=' + Date.now(); s.onload = ok; s.onerror = () => falha(new Error('não encontrei ' + src)); document.head.appendChild(s); });
}
async function gabaritoDe(tr, it) {
  if (tr === 'projeto') {
    // código pronto de cada etapa (o site como fica no FIM daquela etapa)
    if (!window.CODIGO_ETAPAS) await carregarScript('professor/codigo-etapas.js');
    return window.CODIGO_ETAPAS.foto(it.n);
  }
  const o = {};
  for (const [k, v] of Object.entries(R.aula(it.aula).modelo.arquivos)) o[k] = dedentar(v);
  return o;
}
async function carregarGabarito() {
  if (!confirm('Substituir os arquivos abertos pelo gabarito? Use para demonstrar em aula. O código atual será perdido (exporte um backup antes, se quiser).')) return;
  try {
    arquivos = await gabaritoDe(trilha, item);
    docs = {}; for (const n of Object.keys(arquivos)) criarDoc(n);
    salvarAgora();
    abrirArquivo(item.arquivo);
    requisitar({ metodo: 'GET', pagina: paginaInicial(), get: '', post: '' });
  } catch (e) { alert('Não foi possível carregar o gabarito: ' + e.message); }
}
async function relatorio() {
  const itens = TRILHAS[trilha].itens();
  const caixa = document.createElement('div');
  caixa.className = 'relatorio';
  caixa.innerHTML = '<div class="caixa"><h2 style="margin-top:0">Relatório — ' + TRILHAS[trilha].nome + '</h2><p class="muted small" id="rel-status">Testando...</p><table><thead><tr><th>' + (trilha === 'projeto' ? 'Etapa' : 'Aula') + '</th><th>Requisitos</th><th>Dicas usadas</th><th>Pendências</th></tr></thead><tbody></tbody></table><p style="margin-top:16px"><button class="btn" type="button">Fechar</button></p></div>';
  document.body.appendChild(caixa);
  caixa.querySelector('button').onclick = () => caixa.remove();
  const corpo = caixa.querySelector('tbody');
  salvarAgora();
  await carregarPHP();
  let totalOk = 0, total = 0;
  for (const it of itens) {
    const chave = TRILHAS[trilha].chave(it);
    const arqs = chave === chaveAtual ? arquivos : (ler(chave + ':arquivos') || TRILHAS[trilha].iniciais(it));
    const res = await testarItem(it, arqs);
    const ok = res.filter(Boolean).length;
    totalOk += ok; total += res.length;
    const pend = it.requisitos.filter((r, i) => !res[i]).map((r) => R.esc(r.texto)).join('<br>');
    corpo.insertAdjacentHTML('beforeend', '<tr><td>' + it.n + '. ' + R.esc(it.titulo) + '</td><td><b>' + ok + '/' + res.length + '</b></td><td>' + ((prog().dicas || {})[it.n] || 0) + '</td><td class="small muted">' + (pend || '—') + '</td></tr>');
  }
  caixa.querySelector('#rel-status').textContent = 'Total: ' + totalOk + ' de ' + total + ' requisitos (' + Math.round(totalOk / total * 100) + '%).';
}

// ---------- Mensagem rápida ----------
let tAviso;
function aviso(txt) { const t = $('#toast'); t.textContent = txt; t.hidden = false; clearTimeout(tAviso); tAviso = setTimeout(() => { t.hidden = true; }, 5200); }

// =========================================================
// 10) Botões e início
// =========================================================
$('#btn-executar').onclick = executar;
$('#btn-recarregar').onclick = () => ultimaReq && requisitar(ultimaReq, { recarga: true });
$('#btn-voltar').onclick = () => { if (historico.length < 2) return; historico.pop(); requisitar(historico[historico.length - 1], { recarga: true }); };
$('#btn-recolher').onclick = (e) => { const c = $('#console'); c.classList.toggle('recolhido'); e.target.textContent = c.classList.contains('recolhido') ? 'Expandir' : 'Recolher'; };
document.querySelectorAll('.console-abas [data-aba]').forEach((b) => b.onclick = () => { abaConsole = b.dataset.aba; $('#console').classList.remove('recolhido'); desenharConsole(); });
document.querySelectorAll('.trilhas button').forEach((b) => b.onclick = () => { if (b.dataset.trilha !== trilha) { salvarAgora(); abrir(b.dataset.trilha, ler('ide:' + b.dataset.trilha + ':ultimo') || 1); } });
document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.key === 's')) { e.preventDefault(); executar(); } });
window.addEventListener('beforeunload', () => salvarAgora());

const status = $('#status');
carregarPHP().then(() => { status.textContent = 'PHP 8.4 pronto'; status.classList.add('pronto'); })
  .catch((e) => { status.textContent = 'Falha ao carregar o PHP'; status.classList.add('erro'); log('erro', 'IDE', 'Falha ao carregar o PHP: ' + e.message); });
desenharProf();
abrir(trilha, +(params.get('n') || params.get('etapa') || params.get('aula')) || ler('ide:' + trilha + ':ultimo') || 1);

// Atalho para testes automatizados (usado pelo professor/desenvolvedor no console)
window.__ide = { testarItem, gabaritoDe, TRILHAS, carregarPHP };
})();
