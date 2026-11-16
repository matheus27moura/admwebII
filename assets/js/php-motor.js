/* =========================================================
   Motor PHP compartilhado (Laboratório e IDE)
   ---------------------------------------------------------
   1. O PHP real (compilado para WebAssembly pelo projeto php-wasm)
      é baixado uma única vez e fica na memória do navegador.
   2. A cada "requisição" montamos um pequeno servidor de mentira:
      gravamos os arquivos do projeto numa pasta virtual /lab,
      preenchemos $_GET, $_POST, $_SERVER e a sessão, e executamos.
   3. Arquivos criados pelo PHP (ex.: dados/recados.json) e a sessão
      voltam para o JavaScript, que os guarda no localStorage.
   ========================================================= */

(function () {
'use strict';
const PHP_WASM = 'https://cdn.jsdelivr.net/npm/php-wasm@0.2.0/PhpWeb.mjs';

// ---------- Base64 com suporte a acentos (UTF-8) ----------
function b64enc(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
function b64dec(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// =========================================================
// "Servidor" PHP: código que roda antes/depois da página
// =========================================================
const RUNTIME = String.raw`<?php
$__S = json_decode(base64_decode('%%ESTADO%%'), true);
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('html_errors', '0');
date_default_timezone_set('America/Sao_Paulo');

chdir('/');
function __lab_rrm($d) { if (!is_dir($d)) return; foreach (scandir($d) as $f) { if ($f === '.' || $f === '..') continue; $p = $d . '/' . $f; is_dir($p) ? __lab_rrm($p) : unlink($p); } rmdir($d); }
__lab_rrm('/lab');
mkdir('/lab', 0777, true);
foreach ($__S['dados'] as $__p => $__b) { $__f = '/lab/' . $__p; if (!is_dir(dirname($__f))) mkdir(dirname($__f), 0777, true); file_put_contents($__f, base64_decode($__b)); }
foreach ($__S['arquivos'] as $__p => $__t) { $__f = '/lab/' . $__p; if (!is_dir(dirname($__f))) mkdir(dirname($__f), 0777, true); file_put_contents($__f, $__t); }

if (!is_dir('/tmp/labsess')) mkdir('/tmp/labsess', 0777, true);
foreach (glob('/tmp/labsess/*') as $__f) unlink($__f);
ini_set('session.save_path', '/tmp/labsess');
if ($__S['sessao'] !== null) file_put_contents('/tmp/labsess/sess_labsessao', base64_decode($__S['sessao']));
session_id('labsessao');

$_GET = []; $_POST = [];
parse_str($__S['get'], $_GET);
parse_str($__S['post'], $_POST);
$_REQUEST = array_merge($_GET, $_POST);
$_COOKIE = []; $_FILES = [];
$_SERVER['REQUEST_METHOD'] = $__S['metodo'];
$_SERVER['SCRIPT_NAME'] = '/' . $__S['pagina'];
$_SERVER['PHP_SELF'] = '/' . $__S['pagina'];
$_SERVER['QUERY_STRING'] = $__S['get'];
$_SERVER['REQUEST_URI'] = '/' . $__S['pagina'] . ($__S['get'] !== '' ? '?' . $__S['get'] : '');
$_SERVER['HTTP_HOST'] = 'localhost';
$_SERVER['SERVER_NAME'] = 'localhost';
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
$_SERVER['HTTP_USER_AGENT'] = 'Laboratorio PHP na Pratica';
$_SERVER['REQUEST_TIME'] = time();

$GLOBALS['__LAB'] = ['pendente' => null, 'mails' => [], 'log' => []];
class __LabSair extends Error {}
class __LabBuscar extends Error {}

function __lab_exit($m = null) { if (is_string($m)) echo $m; throw new __LabSair(); }
function __lab_fgc($arq, ...$resto) {
  if (is_string($arq) && preg_match('#^https?://#i', $arq)) {
    $cache = $GLOBALS['__S']['http'];
    if (array_key_exists($arq, $cache)) {
      if ($cache[$arq] === null) { trigger_error('file_get_contents(' . $arq . '): falha ao abrir (endereço inacessível ou bloqueado)', E_USER_WARNING); return false; }
      return $cache[$arq];
    }
    $GLOBALS['__LAB']['pendente'] = $arq;
    throw new __LabBuscar();
  }
  return file_get_contents($arq, ...$resto);
}
function __lab_mail($para, $assunto, $mensagem, $cab = '') { $GLOBALS['__LAB']['mails'][] = ['para' => $para, 'assunto' => $assunto, 'mensagem' => $mensagem]; return true; }
function __lab_erro($no, $msg, $arq, $linha) {
  if (!(error_reporting() & $no)) return false;
  $tipos = [E_WARNING => 'Warning', E_NOTICE => 'Notice', E_DEPRECATED => 'Deprecated', E_USER_WARNING => 'Warning', E_USER_NOTICE => 'Notice', E_USER_DEPRECATED => 'Deprecated', E_USER_ERROR => 'Error'];
  $t = $tipos[$no] ?? 'Aviso';
  $arq = str_replace('/lab/', '', $arq);
  $GLOBALS['__LAB']['log'][] = ['tipo' => $t, 'msg' => $msg, 'arquivo' => $arq, 'linha' => $linha];
  echo "\n<br><b>$t</b>: " . htmlspecialchars($msg) . " em <b>$arq</b> na linha <b>$linha</b><br>\n";
  return true;
}
set_error_handler('__lab_erro');

if (!function_exists('mb_strlen')) {
  define('MB_CASE_UPPER', 0); define('MB_CASE_LOWER', 1); define('MB_CASE_TITLE', 2);
  function __lab_mapa() { return ['À'=>'à','Á'=>'á','Â'=>'â','Ã'=>'ã','Ä'=>'ä','Ç'=>'ç','È'=>'è','É'=>'é','Ê'=>'ê','Ë'=>'ë','Ì'=>'ì','Í'=>'í','Î'=>'î','Ï'=>'ï','Ñ'=>'ñ','Ò'=>'ò','Ó'=>'ó','Ô'=>'ô','Õ'=>'õ','Ö'=>'ö','Ù'=>'ù','Ú'=>'ú','Û'=>'û','Ü'=>'ü']; }
  function mb_strlen($s, $e = null) { return preg_match_all('/./us', (string)$s); }
  function mb_str_split($s, $l = 1, $e = null) { return preg_split('//u', (string)$s, -1, PREG_SPLIT_NO_EMPTY); }
  function mb_substr($s, $ini, $tam = null, $e = null) { return implode('', array_slice(mb_str_split($s), $ini, $tam)); }
  function mb_strtolower($s, $e = null) { return strtr(strtolower((string)$s), __lab_mapa()); }
  function mb_strtoupper($s, $e = null) { return strtr(strtoupper((string)$s), array_flip(__lab_mapa())); }
  function mb_convert_case($s, $modo, $e = null) { if ($modo === MB_CASE_UPPER) return mb_strtoupper($s); if ($modo === MB_CASE_LOWER) return mb_strtolower($s); return implode(' ', array_map(fn($p) => mb_strtoupper(mb_substr($p, 0, 1)) . mb_substr($p, 1), explode(' ', mb_strtolower($s)))); }
  function mb_strpos($h, $n, $o = 0, $e = null) { $p = strpos($h, $n, strlen(mb_substr($h, 0, $o))); return $p === false ? false : mb_strlen(substr($h, 0, $p)); }
  function mb_internal_encoding($e = null) { return $e === null ? 'UTF-8' : true; }
}

chdir('/lab');
$__status = 'ok';
try {
  require '/lab/' . $__S['pagina'];
} catch (__LabSair $__e) {
} catch (__LabBuscar $__e) {
  $__status = 'buscar';
} catch (Throwable $__e) {
  $__status = 'erro';
  $__arq = str_replace('/lab/', '', $__e->getFile());
  $__tipo = $__e instanceof ParseError ? 'Parse error (erro de sintaxe)' : 'Fatal error: ' . get_class($__e);
  $GLOBALS['__LAB']['log'][] = ['tipo' => 'Fatal', 'msg' => $__tipo . ' — ' . $__e->getMessage(), 'arquivo' => $__arq, 'linha' => $__e->getLine()];
  echo "\n<div style=\"font:14px/1.5 monospace;background:#fbecec;color:#8a2a27;border:1px solid #e9b7b5;padding:12px 14px;margin:12px;border-radius:8px\"><b>" . htmlspecialchars($__tipo) . "</b><br>" . htmlspecialchars($__e->getMessage()) . "<br>em <b>" . htmlspecialchars($__arq) . "</b> na linha <b>" . $__e->getLine() . "</b></div>";
}

$__sessao = null; $__sessao_arr = null;
if (session_status() === PHP_SESSION_ACTIVE) { $__sessao_arr = $_SESSION; session_write_close(); }
$__arqs = glob('/tmp/labsess/sess_*');
if ($__arqs) { $__sessao = base64_encode(file_get_contents($__arqs[0])); if ($__sessao_arr === null) { $__sessao_arr = []; } }

$__dados = [];
function __lab_varrer($dir, $rel, &$saida, $proj) {
  foreach (scandir($dir) as $f) {
    if ($f === '.' || $f === '..') continue;
    $p = $dir . '/' . $f; $r = $rel === '' ? $f : $rel . '/' . $f;
    if (is_dir($p)) { __lab_varrer($p, $r, $saida, $proj); continue; }
    if (isset($proj[$r]) || filesize($p) > 300000) continue;
    $saida[$r] = base64_encode(file_get_contents($p));
  }
}
__lab_varrer('/lab', '', $__dados, $__S['arquivos']);

$__html = '';
while (ob_get_level() > 0) { $__html = ob_get_clean() . $__html; }
$__meta = ['status' => $__status, 'cabecalhos' => headers_list(), 'codigo' => http_response_code(), 'sessao' => $__sessao,
  'sessao_arr' => $__sessao_arr, 'dados' => $__dados, 'mails' => $GLOBALS['__LAB']['mails'], 'log' => $GLOBALS['__LAB']['log'], 'pendente' => $GLOBALS['__LAB']['pendente']];
echo '<!--__LABINI__-->' . $__html . '<!--__LABMETA__' . base64_encode(json_encode($__meta, JSON_PARTIAL_OUTPUT_ON_ERROR)) . '__LABMETA__-->';
`;

// Pequenos ajustes no código do aluno para o "servidor" simulado:
// - file_get_contents("https://...") passa a usar o fetch do navegador
// - mail() é simulado (aparece no console)
// - exit/die viram exceções para podermos terminar a requisição com segurança
function adaptarPHP(src) {
  return src
    .replace(/(?<![\w$>:\\])file_get_contents\s*\(/g, '__lab_fgc(')
    .replace(/(?<![\w$>:\\])mail\s*\(/g, '__lab_mail(')
    .replace(/(?<![\w$>:\\])(exit|die)\b(\s*\()?/g, (m, w, p) => (p ? '__lab_exit(' : '__lab_exit()'));
}

// ---------- Carregamento do PHP (uma vez) ----------
let php = null, saida = [], phpPronto = null;
function carregarPHP() {
  if (!phpPronto) {
    phpPronto = (async () => {
      const { PhpWeb } = await import(PHP_WASM);
      php = new PhpWeb();
      php.addEventListener('output', (e) => saida.push(...e.detail));
      php.addEventListener('error', (e) => saida.push(...e.detail));
      await new Promise((r) => php.addEventListener('ready', r, { once: true }));
    })();
  }
  return phpPronto;
}
let fila = Promise.resolve();
function executarPHP(codigo) {
  // garante que uma execução termine antes da próxima começar
  const tarefa = fila.then(async () => {
    await carregarPHP();
    await php.refresh();
    saida = [];
    await php.run(codigo);
    await new Promise((r) => setTimeout(r, 0));
    return saida.join('');
  });
  fila = tarefa.catch(() => {});
  return tarefa;
}

const extensao = (nome) => (nome.split('.').pop() || '').toLowerCase();

// Busca uma URL externa (APIs) pelo navegador. aviso(tipo, texto) é opcional.
const cacheHttp = {};
async function buscarURL(url, aviso) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10000);
  try {
    const r = await fetch(url, { signal: ctrl.signal, cache: 'no-store' });
    const txt = await r.text();
    if (aviso) aviso(r.ok ? 'ok' : 'aviso', 'GET ' + url + '  →  ' + r.status + ' (' + (txt.length / 1024).toFixed(1) + ' KB)');
    cacheHttp[url] = txt;
    return txt;
  } catch (e) {
    if (aviso) aviso('erro', 'GET ' + url + '  →  falhou (' + (e.name === 'AbortError' ? 'tempo esgotado' : 'sem internet ou API bloqueia acesso pelo navegador') + ')');
    return null;
  } finally { clearTimeout(t); }
}

/* Executa UMA requisição.
   arquivos: { nome: conteúdo }   dados: { arquivos, sessao }
   req: { metodo, pagina, get, post }
   opcoes.aviso(tipo, texto): recebe mensagens das APIs
   opcoes.cacheApi: true reaproveita respostas já buscadas (usado nas verificações)
   Retorna { html, meta, dados } — meta.cabecalhos já vem como pares [nome, valor]. */
async function processar(arquivos, dados, req, opcoes = {}) {
  const http = {};
  let meta, html;
  for (let tentativa = 0; tentativa < 8; tentativa++) {
    const proj = {};
    for (const [n, c] of Object.entries(arquivos)) proj[n] = extensao(n) === 'php' ? adaptarPHP(c) : c;
    const estado = { arquivos: proj, dados: dados.arquivos || {}, sessao: dados.sessao || null, metodo: req.metodo, pagina: req.pagina, get: req.get || '', post: req.post || '', http };
    const bruto = await executarPHP(RUNTIME.replace('%%ESTADO%%', b64enc(JSON.stringify(estado))));
    const ini = bruto.lastIndexOf('<!--__LABINI__-->');
    const m = bruto.match(/<!--__LABMETA__([A-Za-z0-9+/=]*)__LABMETA__-->/);
    if (!m) { // erro fatal que nem o servidor conseguiu tratar
      meta = { status: 'erro', log: [{ tipo: 'Fatal', msg: bruto.replace(/<[^>]+>/g, '').trim() || 'Erro desconhecido', arquivo: req.pagina, linha: 0 }], cabecalhos: [], mails: [], dados: dados.arquivos || {}, sessao: dados.sessao || null };
      html = '<pre style="font:14px monospace;padding:16px;color:#8a2a27;white-space:pre-wrap">' + bruto.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])) + '</pre>';
      break;
    }
    meta = JSON.parse(b64dec(m[1]));
    html = bruto.slice(ini >= 0 ? ini + 17 : 0, m.index);
    if (meta.status !== 'buscar' || !meta.pendente) break;
    const url = meta.pendente;
    http[url] = opcoes.cacheApi && url in cacheHttp ? cacheHttp[url] : await buscarURL(url, opcoes.aviso);
  }
  // "Location: pagina.php?hora=10:00" -> ["Location", "pagina.php?hora=10:00"] (divide só no primeiro ":")
  meta.cabecalhos = (meta.cabecalhos || []).map((h) => { const i = h.indexOf(':'); return [h.slice(0, i).trim(), h.slice(i + 1).trim()]; });
  return { html, meta, dados: { arquivos: meta.dados || {}, sessao: meta.sessao || null, sessao_arr: meta.sessao_arr || null } };
}

// ---------- Caminhos relativos ----------
function normalizar(caminho) {
  const partes = [];
  for (const p of caminho.split('/')) { if (!p || p === '.') continue; if (p === '..') partes.pop(); else partes.push(p); }
  return partes.join('/');
}
// transforma "contato.php?x=1" em { pagina, get } relativo à página atual
function resolver(destino, base) {
  let [caminho, query] = destino.split('#')[0].split('?');
  query = query || '';
  if (caminho === '') return { pagina: base, get: query };
  const pasta = base.includes('/') ? base.slice(0, base.lastIndexOf('/') + 1) : '';
  return { pagina: normalizar(caminho.startsWith('/') ? caminho : pasta + caminho), get: query };
}

// ---------- Monta o HTML para o iframe, embutindo CSS/JS do projeto ----------
const SCRIPT_PONTE = '<script>(function(){var P=parent;' +
  '["log","info","warn","error"].forEach(function(k){var o=console[k];console[k]=function(){try{P.__labConsole(k,[].slice.call(arguments))}catch(e){}o.apply(console,arguments)}});' +
  'window.addEventListener("error",function(e){try{P.__labConsole("error",[e.message+(e.lineno?" (linha "+e.lineno+")":"")])}catch(x){}});' +
  'document.addEventListener("click",function(e){if(e.defaultPrevented)return;var a=e.target.closest&&e.target.closest("a[href]");if(!a)return;var h=a.getAttribute("href");' +
  'if(/^javascript:/i.test(h))return;e.preventDefault();' +
  'if(h.charAt(0)==="#"){var el=document.getElementById(h.slice(1));if(el)el.scrollIntoView({behavior:"smooth"});return;}' +
  'if(/^([a-z]+:|\\/\\/)/i.test(h)||a.target==="_blank"&&/^([a-z]+:|\\/\\/)/i.test(h)){window.open(h,"_blank");return;}' +
  'P.__labNavegar("GET",h,null);});' +
  'document.addEventListener("submit",function(e){if(e.defaultPrevented)return;e.preventDefault();var f=e.target;var fd=new FormData(f,e.submitter);var d=[];' +
  'fd.forEach(function(v,k){d.push([k,typeof v==="string"?v:(v&&v.name)||""])});' +
  'P.__labNavegar((f.getAttribute("method")||"GET").toUpperCase(),f.getAttribute("action")||"",d);});' +
  '})();<\/script>';

function montarHTML(html, arquivos) {
  html = html.replace(/<link\b[^>]*?href=["']([^"':]+?\.css)["'][^>]*>/gi, (m, href) => {
    const n = normalizar(href.split('?')[0]);
    return arquivos[n] !== undefined ? '<style data-arquivo="' + n + '">\n' + arquivos[n] + '\n</style>' : m;
  });
  html = html.replace(/<script\b([^>]*?)\bsrc=["']([^"':]+?\.js)["']([^>]*)>\s*<\/script>/gi, (m, a, src, b) => {
    const n = normalizar(src.split('?')[0]);
    return arquivos[n] !== undefined ? '<script' + a + b + '>\n' + arquivos[n].replace(/<\/script/gi, '<\\/script') + '\n<\/script>' : m;
  });
  if (/<head[^>]*>/i.test(html)) html = html.replace(/<head[^>]*>/i, (h) => h + SCRIPT_PONTE);
  else if (/<!doctype[^>]*>/i.test(html)) html = html.replace(/<!doctype[^>]*>/i, (d) => d + SCRIPT_PONTE);
  else html = SCRIPT_PONTE + html;
  return html;
}

// Disponível para o laboratório e a IDE (script comum, funciona até abrindo o arquivo direto)
window.PHPMotor = { b64enc, b64dec, adaptarPHP, carregarPHP, extensao, buscarURL, processar, normalizar, resolver, montarHTML };
})();
