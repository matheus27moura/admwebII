/* =========================================================
   PHP na Prática — renderizador compartilhado
   Usado pelas páginas de aula, apostila e slides.
   Transforma os "blocos" escritos em assets/js/aulas/*.js
   em HTML, com destaque de sintaxe próprio (sem dependências).
   ========================================================= */
window.AULAS = window.AULAS || [];

(function () {
  const R = {};
  window.R = R;

  // ---------- utilidades ----------
  R.esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // remove linhas em branco do início/fim e a indentação comum
  R.dedent = (s) => {
    let linhas = String(s).replace(/\r/g, '').split('\n');
    while (linhas.length && !linhas[0].trim()) linhas.shift();
    while (linhas.length && !linhas[linhas.length - 1].trim()) linhas.pop();
    const ind = Math.min(...linhas.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
    return linhas.map(l => l.slice(isFinite(ind) ? ind : 0)).join('\n');
  };

  R.aula = (n) => window.AULAS.find(a => a.n === Number(n));
  R.ordenar = () => window.AULAS.sort((a, b) => a.n - b.n);
  R.pad = (n) => String(n).padStart(2, '0');

  // ---------- destaque de sintaxe ----------
  function tokenizar(code, regras) {
    // regras: [[regex, classe], ...] -> combina tudo numa única regex
    const fonte = regras.map(r => '(' + r[0].source + ')').join('|');
    const re = new RegExp(fonte, 'g');
    let out = '', ultimo = 0, m;
    while ((m = re.exec(code))) {
      if (m[0] === '') { re.lastIndex++; continue; }
      out += R.esc(code.slice(ultimo, m.index));
      let idx = 1, grupo = 0;
      for (let i = 0; i < regras.length; i++) {
        if (m[idx] !== undefined) { grupo = i; break; }
        idx += 1 + (new RegExp(regras[i][0].source + '|').exec('').length - 1);
      }
      const cls = regras[grupo][1];
      out += typeof cls === 'function' ? cls(m[0]) : '<span class="tk-' + cls + '">' + R.esc(m[0]) + '</span>';
      ultimo = m.index + m[0].length;
    }
    return out + R.esc(code.slice(ultimo));
  }

  const PHP_KW = 'echo|print|if|else|elseif|endif|foreach|endforeach|as|for|endfor|while|do|function|return|array|true|false|null|TRUE|FALSE|NULL|include|include_once|require|require_once|new|class|public|private|protected|static|match|switch|case|break|continue|default|fn|use|try|catch|finally|throw|and|or|not|const|global|isset|empty|unset|list|exit|die';
  const JS_KW = 'const|let|var|function|return|if|else|for|while|do|of|in|new|true|false|null|undefined|async|await|try|catch|throw|class|this|switch|case|break|default|typeof';

  const regrasPHP = [
    [/\/\*[\s\S]*?\*\//, 'c'], [/\/\/[^\n]*|#(?!\[)[^\n]*/, 'c'],
    [/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/, 's'],
    [/<\?php|<\?=|\?>/, 'p'],
    [/\$[a-zA-Z_]\w*/, 'v'],
    [new RegExp('\\b(?:' + PHP_KW + ')\\b'), 'k'],
    [/\b\d+(?:\.\d+)?\b/, 'n'],
    [/\b[a-zA-Z_]\w*(?=\s*\()/, 'f']
  ];
  const regrasJS = [
    [/\/\*[\s\S]*?\*\//, 'c'], [/\/\/[^\n]*/, 'c'],
    [/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/, 's'],
    [new RegExp('\\b(?:' + JS_KW + ')\\b'), 'k'],
    [/\b\d+(?:\.\d+)?\b/, 'n'],
    [/\b[a-zA-Z_$][\w$]*(?=\s*\()/, 'f']
  ];
  const regrasCSS = [
    [/\/\*[\s\S]*?\*\//, 'c'],
    [/"[^"]*"|'[^']*'/, 's'],
    [/#[0-9a-fA-F]{3,8}\b/, 'n'],
    [/[a-z-]+(?=\s*:[^:{}]*;)/, 'a'],
    [/-?\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|fr|deg)?\b/, 'n'],
    [/@[a-z-]+/, 'k']
  ];
  function hlTag(tag) {
    // <tag atributo="valor"> -> colore partes
    return tokenizar(tag, [
      [/^<\/?[a-zA-Z][\w-]*|\/?>$/, 't'],
      [/"[^"]*"|'[^']*'/, 's'],
      [/[a-zA-Z_:@-][\w:.-]*(?==)/, 'a']
    ]);
  }
  const regrasHTML = [
    [/<!--[\s\S]*?-->/, 'c'],
    [/<!doctype[^>]*>/i, 't'],
    [/<\/?[a-zA-Z][\w-]*(?:\s+[^<>]*?)?\/?>/, hlTag]
  ];

  R.hl = function (code, lang) {
    lang = (lang || '').toLowerCase();
    if (lang === 'js' || lang === 'javascript') return tokenizar(code, regrasJS);
    if (lang === 'css') return tokenizar(code, regrasCSS);
    if (lang === 'html') return tokenizar(code, regrasHTML);
    if (lang === 'php') {
      // PHP misturado com HTML: separa os trechos <?php ... ?>
      if (!/<\?(php|=)/.test(code)) return tokenizar(code, regrasPHP);
      let out = '', i = 0;
      const re = /<\?(?:php|=)[\s\S]*?(?:\?>|$)/g; let m;
      while ((m = re.exec(code))) {
        out += tokenizar(code.slice(i, m.index), regrasHTML);
        out += tokenizar(m[0], regrasPHP);
        i = m.index + m[0].length;
        if (m[0] === '') re.lastIndex++;
      }
      return out + tokenizar(code.slice(i), regrasHTML);
    }
    return R.esc(code);
  };

  // ---------- blocos de conteúdo ----------
  R.trechos = [];
  const NOMES_LANG = { php: 'PHP', html: 'HTML', css: 'CSS', js: 'JavaScript', txt: 'Texto' };

  R.codigo = function (b) {
    const code = R.dedent(b.code);
    const lang = b.lang || 'php';
    let botoes = '<button type="button" data-copiar>Copiar</button>';
    if (b.run) {
      const id = R.trechos.push({ code, lang, arquivo: b.file }) - 1;
      botoes += ' <a class="rodar" href="#" data-trecho="' + id + '">Testar no laboratório</a>';
    }
    return '<div class="codigo"><div class="codigo-topo">' +
      (b.file ? '<span class="arquivo">' + R.esc(b.file) + '</span>' : '') +
      '<span class="lang">' + (NOMES_LANG[lang] || lang) + '</span>' + botoes +
      '</div><pre><code>' + R.hl(code, lang) + '</code></pre></div>';
  };

  R.bloco = function (b) {
    if (typeof b === 'string') return /^\s*<(ul|ol|table|div|h\d|p)\b/.test(b) ? b : '<p>' + b + '</p>';
    if (b.h) return '<h3' + (b.id ? ' id="' + b.id + '"' : '') + '>' + b.h + '</h3>';
    if (b.code !== undefined) return R.codigo(b);
    if (b.analogia) return '<div class="callout analogia"><span class="rotulo">' + (b.rotulo || 'Comparação') + '</span>' + R.paragrafos(b.analogia) + '</div>';
    if (b.dica) return '<div class="callout dica"><span class="rotulo">' + (b.rotulo || 'Dica') + '</span>' + R.paragrafos(b.dica) + '</div>';
    if (b.atencao) return '<div class="callout atencao"><span class="rotulo">' + (b.rotulo || 'Atenção') + '</span>' + R.paragrafos(b.atencao) + '</div>';
    if (b.nota) return '<div class="callout"><span class="rotulo">' + (b.rotulo || 'Observação') + '</span>' + R.paragrafos(b.nota) + '</div>';
    if (b.lista) return '<ul>' + b.lista.map(i => '<li>' + i + '</li>').join('') + '</ul>';
    if (b.passos) return '<ol class="passos">' + b.passos.map(i => '<li>' + i + '</li>').join('') + '</ol>';
    if (b.tabela) {
      const t = b.tabela;
      return '<div class="tabela-wrap"><table' + (t.classe ? ' class="' + t.classe + '"' : '') + '><thead><tr>' + t.cab.map(c => '<th>' + c + '</th>').join('') +
        '</tr></thead><tbody>' + t.linhas.map(l => '<tr>' + l.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
    }
    if (b.compara) {
      return '<div class="compara">' + b.compara.map(c =>
        '<div><div class="titulo-col">' + c.titulo + '</div>' + R.codigo(c) + '</div>').join('') + '</div>';
    }
    if (b.fluxo) {
      return '<div class="fluxo">' + b.fluxo.map((p, i) =>
        (i ? '<div class="seta" aria-hidden="true">&rarr;</div>' : '') +
        '<div class="passo"><b>' + p[0] + '</b><span>' + (p[1] || '') + '</span></div>').join('') + '</div>';
    }
    if (b.colunas) return '<div class="colunas">' + b.colunas.map(c => '<div>' + R.blocos(c) + '</div>').join('') + '</div>';
    if (b.html) return b.html;
    return '';
  };
  R.paragrafos = (t) => Array.isArray(t) ? t.map(x => '<p>' + x + '</p>').join('') : '<p>' + t + '</p>';
  R.blocos = (arr) => (arr || []).map(R.bloco).join('\n');

  // ---------- comportamento (copiar / testar) ----------
  R.toast = function (msg) {
    const d = document.createElement('div'); d.className = 'copiado'; d.textContent = msg;
    document.body.appendChild(d); setTimeout(() => d.remove(), 1600);
  };
  R.ativarCodigos = function (raiz, base) {
    (raiz || document).addEventListener('click', (e) => {
      const copiar = e.target.closest('[data-copiar]');
      if (copiar) {
        const txt = copiar.closest('.codigo').querySelector('pre').innerText;
        navigator.clipboard.writeText(txt).then(() => R.toast('Código copiado'));
      }
      const t = e.target.closest('[data-trecho]');
      if (t) {
        e.preventDefault();
        const tr = R.trechos[Number(t.dataset.trecho)];
        const nome = tr.arquivo || (tr.lang === 'php' ? 'index.php' : tr.lang === 'css' ? 'style.css' : tr.lang === 'js' ? 'script.js' : 'index.html');
        const arquivos = {}; arquivos[nome] = tr.code;
        try { localStorage.setItem('lab:trecho', JSON.stringify({ arquivos, inicial: nome })); } catch (err) {}
        window.open((base || '') + 'laboratorio.html?projeto=trecho', '_blank');
      }
    });
  };

  // ---------- tema claro/escuro ----------
  R.tema = {
    aplicar() { try { const t = localStorage.getItem('tema'); if (t) document.documentElement.dataset.theme = t; } catch (e) {} },
    alternar() {
      const escuroAtual = document.documentElement.dataset.theme
        ? document.documentElement.dataset.theme === 'dark'
        : matchMedia('(prefers-color-scheme: dark)').matches;
      const novo = escuroAtual ? 'light' : 'dark';
      document.documentElement.dataset.theme = novo;
      try { localStorage.setItem('tema', novo); } catch (e) {}
    }
  };
  R.tema.aplicar();

  // ---------- cabeçalho e rodapé comuns ----------
  const ICONE_TEMA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const ICONE_MENU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  R.cabecalho = function (ativo, base) {
    base = base || '';
    const link = (href, txt, id) => '<a href="' + base + href + '"' + (ativo === id ? ' class="ativo"' : '') + '>' + txt + '</a>';
    return '<header class="topbar"><div class="container">' +
      '<a class="brand" href="' + base + 'index.html"><span class="brand-mark">&lt;?php</span>PHP na Prática</a>' +
      '<button class="theme-btn menu-btn" type="button" aria-label="Menu" onclick="document.querySelector(\'.nav\').classList.toggle(\'aberto\')">' + ICONE_MENU + '</button>' +
      '<nav class="nav">' + link('index.html', 'Início', 'inicio') + link('index.html#aulas', 'Aulas', 'aulas') +
      link('ide.html?trilha=projeto', 'Projeto', 'projeto') + link('ide.html?trilha=pratica', 'Prática', 'pratica') +
      link('laboratorio.html', 'Laboratório', 'lab') + link('apostila.html', 'Apostila', 'apostila') +
      '<button class="theme-btn" type="button" aria-label="Alternar tema claro/escuro" onclick="R.tema.alternar()">' + ICONE_TEMA + '</button></nav>' +
      '</div></header>';
  };
  R.rodape = function (base) {
    base = base || '';
    return '<footer class="rodape"><div class="container"><span>PHP na Prática — Desenvolvimento de Sistemas · Programação Web II</span>' +
      '<span><a href="' + base + 'apostila.html">Apostila</a> · <a href="' + base + 'ide.html">IDE</a> · <a href="' + base + 'laboratorio.html">Laboratório</a> ·<a href="' + base + 'professor/index.html">Área do professor</a></span></div></footer>';
  };
})();
