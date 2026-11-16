/* =========================================================
   Laboratório PHP — roda PHP 8 dentro do navegador
   ---------------------------------------------------------
   Como funciona (resumo para curiosos):
   1. O PHP real (compilado para WebAssembly pelo projeto php-wasm)
      é baixado uma única vez e fica na memória do navegador.
   2. A cada "requisição" (abrir página, enviar formulário, clicar
      em link) montamos um pequeno servidor de mentira: gravamos os
      arquivos do projeto numa pasta virtual /lab, preenchemos
      $_GET, $_POST, $_SERVER e a sessão, e executamos a página.
   3. O HTML gerado aparece no quadro da direita. Links e
      formulários são interceptados e viram novas requisições.
   4. Arquivos criados pelo PHP (ex.: dados/recados.json) e a
      sessão são guardados no localStorage, então não se perdem.
   ========================================================= */

(function () {
const { b64dec, carregarPHP, processar, buscarURL, normalizar, resolver, montarHTML, extensao } = window.PHPMotor;
const $ = (s) => document.querySelector(s);
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const ler = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
// =========================================================
// 2) Projetos (modelos das aulas)
// =========================================================
const BRANCO = {
  'index.php': `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Meu projeto</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <?php
    // Escreva seu PHP aqui
    $nome = "Mundo";
  ?>
  <h1>Olá, <?= $nome ?>!</h1>
  <p>Hoje é <?= date("d/m/Y") ?>.</p>

  <script src="script.js"></script>
</body>
</html>
`,
  'style.css': `body {
  font-family: system-ui, sans-serif;
  max-width: 720px;
  margin: 40px auto;
  padding: 0 16px;
}
`,
  'script.js': `// JavaScript roda no navegador, depois que o PHP já terminou
console.log("Página carregada!");
`
};

// Exercício de cada aula: HTML, CSS e JS prontos (travados); o aluno escreve o PHP
// nos arquivos "editaveis" (vêm da Prática das aulas, em assets/js/ide/praticas.js)
function listarExercicios() {
  return (window.PRATICAS || []).map((p) => {
    const a = R.aula(p.aula);
    if (!a || !a.modelo) return null;
    const arqs = Object.assign({}, a.modelo.arquivos, p.arquivos || {});
    for (const k of p.remover || []) delete arqs[k];
    return {
      id: 'exercicio' + R.pad(p.aula),
      nome: 'Aula ' + R.pad(p.aula) + ' — ' + a.modelo.nome + ' (escreva o PHP)',
      arquivos: arqs,
      inicial: p.arquivo || p.editaveis[0],          // arquivo aberto no editor
      pagina: p.pagina || a.modelo.inicial || 'index.php', // página aberta na pré-visualização
      aula: p.aula,
      exercicio: p
    };
  }).filter(Boolean);
}
function travado(nome) {
  const ex = projeto && projeto.exercicio;
  return !!ex && !(ex.editaveis || []).includes(nome) && projeto.arquivos[nome] !== undefined;
}

function listarProjetos() {
  const lista = listarExercicios();
  lista.push(...R.ordenar().filter((a) => a.modelo).map((a) => ({
    id: 'aula' + R.pad(a.n),
    nome: 'Aula ' + R.pad(a.n) + ' — ' + a.modelo.nome,
    arquivos: a.modelo.arquivos,
    inicial: a.modelo.inicial || Object.keys(a.modelo.arquivos)[0],
    aula: a.n
  })));
  lista.push({ id: 'branco', nome: 'Projeto em branco', arquivos: BRANCO, inicial: 'index.php' });
  const t = ler('lab:trecho');
  if (t) lista.push({ id: 'trecho', nome: 'Exemplo da aula (trecho)', arquivos: t.arquivos, inicial: t.inicial });
  return lista;
}
function originais(proj) {
  const o = {};
  for (const [k, v] of Object.entries(proj.arquivos)) o[k] = R.dedent(v) + '\n';
  return o;
}

// =========================================================
// 3) Estado da interface
// =========================================================
const params = new URLSearchParams(location.search);
const projetos = listarProjetos();
let projeto = projetos.find((p) => p.id === params.get('projeto')) || projetos.find((p) => p.id === ler('lab:ultimo')) || projetos[0];
let arquivos = {};        // nome -> conteúdo atual
let docs = {};            // nome -> CodeMirror.Doc
let ativo = null;         // arquivo aberto no editor
let dados = { arquivos: {}, sessao: null, sessao_arr: null };
let historico = [];       // pilha de requisições
let ultimaReq = null;
let erros = 0;

const editor = CodeMirror.fromTextArea($('#editor'), {
  lineNumbers: true, indentUnit: 4, tabSize: 4, indentWithTabs: false,
  matchBrackets: true, autoCloseBrackets: true, autoCloseTags: true, styleActiveLine: true,
  lineWrapping: false,
  extraKeys: {
    'Ctrl-Enter': () => executar(), 'Cmd-Enter': () => executar(),
    'Ctrl-S': () => executar(), 'Cmd-S': () => executar(),
    'Ctrl-/': 'toggleComment', 'Cmd-/': 'toggleComment',
    Tab: (cm) => cm.somethingSelected() ? cm.indentSelection('add') : cm.replaceSelection('    ', 'end')
  }
});

function modoDe(nome) {
  const e = extensao(nome);
  return { php: 'application/x-httpd-php', html: 'htmlmixed', htm: 'htmlmixed', css: 'css', js: 'javascript', json: { name: 'javascript', json: true } }[e] || null;
}

function abrirProjeto(p) {
  projeto = p;
  guardar('lab:ultimo', p.id);
  const salvo = ler('lab:arquivos:' + p.id);
  arquivos = salvo && Object.keys(salvo).length ? salvo : originais(p);
  // nos exercícios, HTML/CSS/JS travados voltam sempre à versão original
  const orig = originais(p);
  for (const n of Object.keys(orig)) if (travado(n)) arquivos[n] = orig[n];
  dados = ler('lab:dados:' + p.id) || { arquivos: {}, sessao: null, sessao_arr: null };
  desenharFaixa();
  docs = {};
  for (const nome of Object.keys(arquivos)) criarDoc(nome);
  ativo = null;
  abrirArquivo(arquivos[p.inicial] !== undefined ? p.inicial : Object.keys(arquivos)[0]);
  const linkAula = $('#link-aula');
  if (p.aula) { linkAula.hidden = false; linkAula.href = 'aula.html?n=' + p.aula; } else linkAula.hidden = true;
  history.replaceState(null, '', '?projeto=' + p.id);
  historico = []; ultimaReq = null;
  limparConsole();
  requisitar({ metodo: 'GET', pagina: paginaInicial(), get: '', post: '' });
}
function paginaInicial() {
  if (projeto.pagina && arquivos[projeto.pagina] !== undefined) return projeto.pagina;
  if (arquivos[projeto.inicial] !== undefined && /\.(php|html?)$/.test(projeto.inicial)) return projeto.inicial;
  return Object.keys(arquivos).find((n) => /\.(php|html?)$/.test(n)) || 'index.php';
}
function criarDoc(nome) {
  const d = CodeMirror.Doc(arquivos[nome], modoDe(nome));
  d.on('change', () => { arquivos[nome] = d.getValue(); salvarDepois(); });
  docs[nome] = d;
}
let tSalvar;
function salvarDepois() { clearTimeout(tSalvar); tSalvar = setTimeout(() => guardar('lab:arquivos:' + projeto.id, arquivos), 400); }

function abrirArquivo(nome) {
  ativo = nome;
  editor.swapDoc(docs[nome]);
  const preso = travado(nome);
  editor.setOption('readOnly', preso);
  document.querySelector('.painel-editor').classList.toggle('editor-travado', preso);
  desenharAbas();
  editor.focus();
}

// Faixa do exercício: o que fazer e onde
function desenharFaixa() {
  const f = $('#faixa-exercicio');
  const ex = projeto.exercicio;
  if (!ex) { f.hidden = true; return; }
  f.hidden = false;
  f.innerHTML = '<div><b>Exercício:</b> o HTML, o CSS e o JavaScript já estão prontos; arquivos com cadeado não precisam ser mexidos. ' +
    'Escreva o PHP em ' + ex.editaveis.map((n) => '<code>' + R.esc(n) + '</code>').join(', ') +
    ' seguindo os comentários <b>PRÁTICA</b> e clique em Executar.</div>' +
    '<div class="faixa-links"><a href="ide.html?trilha=pratica&n=' + ex.n + '">Roteiro e verificação na IDE</a>' +
    '<a href="?projeto=aula' + R.pad(ex.aula) + '">Ver modelo resolvido</a></div>';
}
function desenharAbas() {
  const abas = $('#abas');
  abas.innerHTML = '';
  const ordem = Object.keys(arquivos).sort((a, b) => peso(a) - peso(b) || a.localeCompare(b));
  for (const nome of ordem) {
    const b = document.createElement('button');
    b.type = 'button';
    const preso = travado(nome);
    b.className = 'aba' + (nome === ativo ? ' ativa' : '') + (preso ? ' travada' : '');
    const e = extensao(nome);
    if (preso) b.title = 'Pronto: neste exercício você só escreve o PHP';
    b.innerHTML = '<span class="tipo ' + e + '">' + e.toUpperCase() + '</span>' + R.esc(nome) +
      (preso ? '<svg class="cadeado" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
        : nome !== projeto.inicial && !(projeto.exercicio && projeto.arquivos[nome] !== undefined) ? '<span class="fechar" title="Excluir arquivo">&times;</span>' : '');
    b.onclick = (ev) => {
      if (ev.target.classList.contains('fechar')) { excluirArquivo(nome); return; }
      abrirArquivo(nome);
    };
    abas.appendChild(b);
  }
  const novo = document.createElement('button');
  novo.className = 'aba-nova'; novo.type = 'button'; novo.title = 'Novo arquivo'; novo.textContent = '+';
  novo.onclick = novoArquivo;
  abas.appendChild(novo);
}
function peso(n) { return n === projeto.inicial ? 0 : { php: 1, html: 1, css: 2, js: 3 }[extensao(n)] || 4; }
function novoArquivo() {
  const nome = (prompt('Nome do novo arquivo (ex.: contato.php, sobre.html, dados.json):') || '').trim().replace(/^\/+/, '');
  if (!nome) return;
  if (!/^[\w\-./]+\.(php|html|css|js|json|txt)$/.test(nome)) { alert('Use letras, números, hífen e uma extensão: .php .html .css .js .json .txt'); return; }
  if (arquivos[nome] !== undefined) { abrirArquivo(nome); return; }
  if (projeto.exercicio && !/\.(php|json)$/.test(nome)) { alert('Neste exercício você só cria arquivos .php ou .json.'); return; }
  arquivos[nome] = extensao(nome) === 'php' ? '<?php\n// ' + nome + '\n\n' : '';
  criarDoc(nome); salvarDepois(); abrirArquivo(nome);
}
function excluirArquivo(nome) {
  if (!confirm('Excluir o arquivo "' + nome + '" deste projeto?')) return;
  delete arquivos[nome]; delete docs[nome]; salvarDepois();
  abrirArquivo(ativo === nome ? projeto.inicial : ativo);
}

// =========================================================
// 4) Requisições: o "navegador" da direita
// =========================================================
window.__labNavegar = function (metodo, destino, campos) {
  const atual = ultimaReq ? ultimaReq.pagina : paginaInicial();
  const alvo = resolver(destino || '', atual);
  const corpo = campos ? new URLSearchParams(campos).toString() : '';
  if (metodo === 'POST') requisitar({ metodo: 'POST', pagina: alvo.pagina, get: alvo.get, post: corpo });
  else requisitar({ metodo: 'GET', pagina: alvo.pagina, get: campos ? corpo : alvo.get, post: '' });
};
window.__labConsole = function (tipo, args) {
  const txt = args.map((a) => { try { return typeof a === 'string' ? a : JSON.stringify(a); } catch (e) { return String(a); } }).join(' ');
  log(tipo === 'error' ? 'erro' : tipo === 'warn' ? 'aviso' : '', 'JS', txt);
};

let carregandoTimer;
async function requisitar(req, opcoes = {}) {
  if (!opcoes.recarga) historico.push(req);
  ultimaReq = req;
  $('#metodo').textContent = req.metodo;
  $('#metodo').className = 'metodo' + (req.metodo === 'POST' ? ' post' : '');
  $('#url').textContent = 'localhost/' + req.pagina + (req.get ? '?' + req.get : '');
  if (!opcoes.redirecionado) log('info', 'REQ', req.metodo + ' /' + req.pagina + (req.get ? '?' + req.get : '') + (req.post ? '   corpo: ' + decodeURIComponent(req.post.replace(/\+/g, ' ')) : ''));

  const ext = extensao(req.pagina);
  if (arquivos[req.pagina] === undefined) {
    mostrar(paginaErro('404 — Página não encontrada', 'O arquivo <b>' + R.esc(req.pagina) + '</b> não existe neste projeto. Confira o nome no link ou no <code>action</code> do formulário.'));
    log('erro', 'HTTP', '404: arquivo "' + req.pagina + '" não existe no projeto');
    return;
  }
  if (ext !== 'php') {
    const tipo = { css: 'css', js: 'js', json: 'json', txt: 'txt' }[ext];
    mostrar(tipo ? '<pre style="font:13px/1.5 monospace;padding:16px;white-space:pre-wrap">' + R.esc(arquivos[req.pagina]) + '</pre>' : arquivos[req.pagina]);
    return;
  }

  clearTimeout(carregandoTimer);
  carregandoTimer = setTimeout(() => { $('#carregando').hidden = false; }, 150);
  try {
    const r = await processar(arquivos, dados, req, { aviso: (tipo, txt) => log(tipo, 'API', txt) });
    const meta = r.meta;
    let html = r.html;

    // guarda arquivos e sessão produzidos pelo PHP
    dados = r.dados;
    guardar('lab:dados:' + projeto.id, dados);

    for (const l of meta.log || []) log(l.tipo === 'Fatal' ? 'erro' : 'aviso', 'PHP', l.msg + (l.linha ? '  →  ' + l.arquivo + ', linha ' + l.linha : ''), l);
    for (const e of meta.mails || []) log('ok', 'MAIL', 'E-mail simulado para ' + e.para + ' | Assunto: ' + e.assunto + '\n' + e.mensagem);
    if (meta.codigo && meta.codigo !== 200 && meta.codigo !== 302) log('info', 'HTTP', 'Código de resposta: ' + meta.codigo);

    const cab = meta.cabecalhos;
    const location = cab.find((h) => h[0].toLowerCase() === 'location');
    if (location && (opcoes.saltos || 0) < 6) {
      log('info', 'HTTP', 'Redirecionado (header Location) para: ' + location[1]);
      const alvo = resolver(location[1], req.pagina);
      return requisitar({ metodo: 'GET', pagina: alvo.pagina, get: alvo.get, post: '' }, { redirecionado: true, recarga: true, saltos: (opcoes.saltos || 0) + 1 });
    }
    const ctype = cab.find((h) => h[0].toLowerCase() === 'content-type');
    if (ctype && /json|text\/plain/i.test(ctype[1])) html = '<pre style="font:13px/1.5 monospace;padding:16px;white-space:pre-wrap">' + R.esc(html) + '</pre>';
    mostrar(html);
  } catch (err) {
    log('erro', 'LAB', 'Não foi possível executar o PHP: ' + err.message);
    mostrar(paginaErro('Não foi possível executar', R.esc(err.message) + '<br><br>Verifique sua conexão com a internet: o PHP é baixado na primeira execução.'));
  } finally {
    clearTimeout(carregandoTimer);
    $('#carregando').hidden = true;
    desenharPainel();
  }
}

// Coloca o HTML no quadro, embutindo CSS/JS do projeto
function mostrar(html) {
  $('#preview').srcdoc = montarHTML(html, arquivos);
}
function paginaErro(titulo, texto) {
  return '<!doctype html><html><head><meta charset="utf-8"></head><body style="font:15px/1.6 system-ui,sans-serif;color:#333;padding:40px;max-width:640px"><h2 style="margin:0 0 8px">' + titulo + '</h2><p>' + texto + '</p></body></html>';
}

// =========================================================
// 5) Console, dados salvos e requisição
// =========================================================
let abaConsole = 'log';
const linhas = [];
function log(tipo, origem, texto, ref) {
  linhas.push({ tipo, origem, texto, ref });
  if (tipo === 'erro') erros++;
  if (abaConsole === 'log') desenharPainel();
}
function limparConsole() { linhas.length = 0; erros = 0; desenharPainel(); }
function desenharPainel() {
  $('#cont-erros').textContent = erros ? erros : '';
  const corpo = $('#console-corpo');
  document.querySelectorAll('.console-abas [data-aba]').forEach((b) => b.classList.toggle('ativa', b.dataset.aba === abaConsole));
  if (abaConsole === 'log') {
    corpo.innerHTML = linhas.length ? '' : '<div class="vazio">Mensagens do PHP (erros, avisos, e-mails simulados, APIs) e o console.log do JavaScript aparecem aqui.</div>';
    linhas.forEach((l) => {
      const d = document.createElement('div');
      d.className = 'linha-log ' + l.tipo;
      d.innerHTML = '<span class="origem">' + l.origem + '</span><span></span>';
      d.lastChild.textContent = l.texto;
      if (l.ref && l.ref.linha && arquivos[l.ref.arquivo] !== undefined) {
        d.style.cursor = 'pointer'; d.title = 'Clique para ir até a linha';
        d.onclick = () => { abrirArquivo(l.ref.arquivo); editor.setCursor({ line: l.ref.linha - 1, ch: 0 }); editor.scrollIntoView(null, 120); };
      }
      corpo.appendChild(d);
    });
    corpo.scrollTop = corpo.scrollHeight;
  } else if (abaConsole === 'dados') {
    const nomes = Object.keys(dados.arquivos || {});
    let h = '';
    if (dados.sessao_arr && Object.keys(dados.sessao_arr).length) h += '<div class="dados-arquivo"><b>$_SESSION</b> (sessão do usuário)<pre>' + R.esc(JSON.stringify(dados.sessao_arr, null, 2)) + '</pre></div>';
    nomes.forEach((n) => {
      let txt = b64dec(dados.arquivos[n]);
      try { if (/\.json$/i.test(n)) txt = JSON.stringify(JSON.parse(txt), null, 2); } catch (e) {}
      h += '<div class="dados-arquivo"><b>' + R.esc(n) + '</b> (arquivo criado pelo PHP)<pre>' + R.esc(txt) + '</pre></div>';
    });
    corpo.innerHTML = h || '<div class="vazio">Nenhum arquivo criado pelo PHP e nenhuma sessão ativa. Quando o PHP salvar algo (ex.: file_put_contents ou $_SESSION), aparecerá aqui.</div>';
  } else {
    const r = ultimaReq;
    if (!r) { corpo.innerHTML = '<div class="vazio">Nenhuma requisição ainda.</div>'; return; }
    const tab = (o) => Object.keys(o).length ? R.esc(JSON.stringify(o, null, 2)) : '(vazio)';
    const qs = (s) => Object.fromEntries(new URLSearchParams(s));
    corpo.innerHTML = '<div class="dados-arquivo"><b>Método</b>: ' + r.metodo + ' &nbsp; <b>Página</b>: ' + R.esc(r.pagina) + '</div>' +
      '<div class="dados-arquivo"><b>$_GET</b><pre>' + tab(qs(r.get)) + '</pre></div>' +
      '<div class="dados-arquivo"><b>$_POST</b><pre>' + tab(qs(r.post)) + '</pre></div>';
  }
}

// =========================================================
// 6) Botões e atalhos
// =========================================================
function executar() {
  guardar('lab:arquivos:' + projeto.id, arquivos);
  if (/\.(php|html?)$/.test(ativo) && (!ultimaReq || ultimaReq.pagina !== ativo)) {
    requisitar({ metodo: 'GET', pagina: ativo, get: '', post: '' });
  } else if (ultimaReq) {
    requisitar(ultimaReq, { recarga: true });
  } else requisitar({ metodo: 'GET', pagina: paginaInicial(), get: '', post: '' });
}

const seletor = $('#seletor');
const grupoEx = document.createElement('optgroup'); grupoEx.label = 'Exercícios: HTML pronto, você escreve o PHP';
const grupoAulas = document.createElement('optgroup'); grupoAulas.label = 'Modelos resolvidos das aulas';
const grupoOutros = document.createElement('optgroup'); grupoOutros.label = 'Outros';
projetos.forEach((p) => {
  const o = document.createElement('option'); o.value = p.id; o.textContent = p.nome;
  (p.exercicio ? grupoEx : p.aula ? grupoAulas : grupoOutros).appendChild(o);
});
seletor.append(grupoEx, grupoAulas, grupoOutros);
seletor.value = projeto.id;
seletor.onchange = () => abrirProjeto(projetos.find((p) => p.id === seletor.value));

$('#btn-executar').onclick = executar;
$('#btn-recarregar').onclick = () => ultimaReq && requisitar(ultimaReq, { recarga: true });
$('#btn-voltar').onclick = () => {
  if (historico.length < 2) return;
  historico.pop();
  const anterior = historico[historico.length - 1];
  requisitar(anterior, { recarga: true });
};
$('#btn-restaurar').onclick = () => {
  if (!confirm('Voltar todos os arquivos ao modelo original? Suas alterações neste projeto serão perdidas.')) return;
  try { localStorage.removeItem('lab:arquivos:' + projeto.id); } catch (e) {}
  abrirProjeto(projeto);
};
$('#btn-limpar-dados').onclick = () => {
  if (!confirm('Apagar os arquivos criados pelo PHP e a sessão deste projeto?')) return;
  dados = { arquivos: {}, sessao: null, sessao_arr: null };
  guardar('lab:dados:' + projeto.id, dados);
  log('info', 'LAB', 'Dados e sessão apagados.');
  desenharPainel();
};
$('#btn-recolher').onclick = (e) => {
  const c = $('#console'); c.classList.toggle('recolhido');
  e.target.textContent = c.classList.contains('recolhido') ? 'Expandir' : 'Recolher';
};
document.querySelectorAll('.console-abas [data-aba]').forEach((b) => b.onclick = () => {
  abaConsole = b.dataset.aba; $('#console').classList.remove('recolhido'); $('#btn-recolher').textContent = 'Recolher'; desenharPainel();
});
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.key === 's')) { e.preventDefault(); executar(); }
});
$('#btn-zip').onclick = async () => {
  const zip = new JSZip();
  const pasta = zip.folder(projeto.id);
  for (const [n, c] of Object.entries(arquivos)) pasta.file(n, c);
  for (const [n, b] of Object.entries(dados.arquivos || {})) pasta.file(n, b, { base64: true });
  pasta.file('LEIA-ME.txt', 'Projeto exportado do Laboratório PHP na Prática.\r\n\r\nPara rodar no seu computador:\r\n1. Instale o XAMPP (https://www.apachefriends.org).\r\n2. Copie esta pasta para C:\\xampp\\htdocs\\\r\n3. Inicie o Apache no painel do XAMPP.\r\n4. Acesse http://localhost/' + projeto.id + '/' + paginaInicial() + '\r\n');
  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = projeto.id + '.zip'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
};

// ---------- início ----------
const status = $('#status');
carregarPHP().then(() => { status.textContent = 'PHP 8.4 pronto'; status.classList.add('pronto'); })
  .catch((e) => { status.textContent = 'Falha ao carregar o PHP'; status.classList.add('erro'); log('erro', 'LAB', 'Falha ao carregar o PHP: ' + e.message); });
abrirProjeto(projeto);
})();
