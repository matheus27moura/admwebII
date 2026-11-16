/* =========================================================
   Prática das aulas — o modelo de cada aula com HTML, CSS e JS
   prontos. Os arquivos em "editaveis" começam sem o PHP: o aluno
   escreve a lógica guiado pelos comentários "PRÁTICA".
   Todos os outros arquivos do modelo ficam travados.
   O gabarito de cada prática é o próprio modelo da aula.
   ========================================================= */
(function () {
  const PHP_ECHO = '<\\?(?:=|php\\s+echo)\\s*';
  const usa = (re, ...arqs) => (t) => arqs.some((a) => re.test(t.codigo(a)));

  window.PRATICAS = [
  // ================================================================ 01
  {
    n: 1, aula: 1, titulo: 'Portfólio com variáveis', arquivo: 'index.php', editaveis: ['index.php'],
    conceitos: 'variáveis, echo, <?= ?>, concatenação, date()',
    contexto: ['O portfólio da Ana está todo escrito à mão no HTML. Se ela mudar de cidade ou de curso, precisa caçar o texto em vários lugares. Vamos guardar os dados em **variáveis** e deixar o PHP preencher a página.'],
    tarefas: [
      'No bloco PHP do topo, crie `$nome`, `$profissao`, `$cidade` e `$anoInicio` (2025).',
      'Calcule `$anosEstudo`: o ano atual (`date("Y")`) menos `$anoInicio`.',
      'Use `<?= ?>` para mostrar `$nome` no `<title>` e no `<h1>`, `$profissao` no parágrafo "cargo" e `$cidade` no parágrafo "local".',
      'No "Sobre mim", troque a frase fixa por um `echo` que junta textos e variáveis com o ponto (`.`): "Olá! Sou NOME e estudo programação há N ano(s)."'
    ],
    exemplo: { titulo: 'Exemplo parecido (cartão de um time)', codigo: '<?php\n  $time = "Leões FC";\n  $fundacao = 1990;\n  $idade = date("Y") - $fundacao;\n?>\n<h1><?= $time ?></h1>\n<p><?php echo "O " . $time . " tem " . $idade . " anos."; ?></p>' },
    arquivos: {
'index.php': String.raw`<?php
/* =========================================================
   PRÁTICA — AULA 01 · PORTFÓLIO PESSOAL
   O HTML está pronto, mas tudo está escrito "à mão".
   Siga os comentários PRÁTICA para o PHP preencher a página.
   ========================================================= */

// PRÁTICA 1: crie as variáveis $nome, $profissao, $cidade e $anoInicio (2025)


// PRÁTICA 2: calcule $anosEstudo = ano atual - $anoInicio  (dica: date("Y"))


?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- PRÁTICA 3: troque o nome fixo pela variável $nome -->
    <title>Ana Souza | Portfólio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <header class="topo">
        <div class="avatar">A</div>
        <!-- PRÁTICA 3: use $nome, $profissao e $cidade -->
        <h1>Ana Souza</h1>
        <p class="cargo">Estudante de Desenvolvimento de Sistemas</p>
        <p class="local">Campinas - SP</p>
    </header>

    <main class="conteudo">
        <section class="cartao">
            <h2>Sobre mim</h2>
            <!-- PRÁTICA 4: monte esta frase com echo e concatenação (.) -->
            <p>Olá! Sou Ana Souza e estudo programação há 0 ano(s).</p>
            <p>Gosto de criar sites e estou aprendendo PHP para deixá-los mais inteligentes.</p>
        </section>

        <section class="cartao">
            <h2>Habilidades</h2>
            <div class="habilidade">
                <span>HTML</span>
                <div class="barra"><div class="nivel" style="width: 80%"></div></div>
            </div>
            <div class="habilidade">
                <span>CSS</span>
                <div class="barra"><div class="nivel" style="width: 70%"></div></div>
            </div>
            <div class="habilidade">
                <span>JavaScript</span>
                <div class="barra"><div class="nivel" style="width: 50%"></div></div>
            </div>
            <div class="habilidade">
                <span>PHP</span>
                <div class="barra"><div class="nivel" style="width: 10%"></div></div>
            </div>
        </section>

        <section class="cartao">
            <h2>Contato</h2>
            <p>E-mail: ana@email.com</p>
            <button id="btn-saudacao" class="botao">Dizer olá</button>
        </section>
    </main>

    <footer class="rodape">
        <p>&copy; 2024 Ana Souza. Feito com HTML, CSS, JS e PHP.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
`
    },
    requisitos: [
      { texto: 'Variáveis $nome, $profissao, $cidade e $anoInicio criadas', teste: (t) => ['nome', 'profissao', 'cidade', 'anoInicio'].every((v) => new RegExp('\\$' + v + '\\s*=[^=]').test(t.codigo('index.php'))) },
      { texto: 'O cabeçalho (h1, cargo e local) mostra as variáveis', teste: (t) => { const c = t.codigo('index.php'); return new RegExp('<h1>\\s*' + PHP_ECHO + '\\$nome').test(c) && new RegExp('class="cargo">\\s*' + PHP_ECHO + '\\$profissao').test(c) && new RegExp('class="local">\\s*' + PHP_ECHO + '\\$cidade').test(c); } },
      { texto: 'O título da aba usa $nome', teste: (t) => new RegExp('<title>\\s*' + PHP_ECHO + '\\$nome').test(t.codigo('index.php')) },
      { texto: 'Os anos de estudo são calculados com date("Y")', teste: async (t) => /date\s*\(\s*["']Y["']\s*\)/.test(t.codigo('index.php')) && (await t.get('index.php')).texto.includes('há ' + (t.ano - 2025) + ' ano') },
      { texto: 'A frase "Sobre mim" usa echo com concatenação (.)', teste: (t) => /echo\s+["'][^;]*["']\s*\.\s*\$nome/.test(t.codigo('index.php')) },
      { texto: 'A página abre sem erros', teste: async (t) => (await t.get('index.php')).semErros }
    ],
    dicas: [
      'Variável é uma caixinha com etiqueta: `$cidade = "Campinas - SP";` guarda o texto na caixa chamada cidade.',
      'O ponto (`.`) cola textos: `"Olá, " . $nome . "!"`. Números também podem ser colados.',
      'Esqueleto:\n$anoInicio = ____;\n$anosEstudo = date("_") - __________;\n...\n<h1><?= _____ ?></h1>'
    ]
  },

  // ================================================================ 02
  {
    n: 2, aula: 2, titulo: 'Cafeteria que sabe as horas', arquivo: 'index.php', editaveis: ['index.php'],
    conceitos: 'if / elseif / else, &&, match, for',
    contexto: ['A cafeteria Grão Dourado quer que o site mude sozinho: a saudação, o aviso de aberto ou fechado, a promoção de cada dia da semana e o cartão fidelidade.'],
    tarefas: [
      'Descubra a hora (`date("G")`, de 0 a 23) e o dia da semana (`date("N")`: 1 = segunda ... 7 = domingo).',
      'Saudação: antes das 12h "Bom dia", antes das 18h "Boa tarde", senão "Boa noite". Mostre no `<h1>`.',
      'A loja está aberta se a hora for maior ou igual a `$horaAbre` **e** menor que `$horaFecha`. Mostre o parágrafo com a classe `aberto` ou `fechado` (os dois textos estão no HTML).',
      'Com `match`, escolha a promoção: 1 → "Segunda do Expresso: 2 por R$ 9,00"; 3 → "Quarta do Cappuccino: 20% de desconto"; 5 → "Sexta Doce: fatia de bolo grátis no combo"; outros dias → "Experimente o café coado do dia!".',
      'Troque os 10 carimbos fixos por um laço `for` de 1 até `$totalCarimbos`. Os carimbos até `$carimbos` recebem a classe `cheio`.'
    ],
    exemplo: { titulo: 'Exemplo parecido (academia)', codigo: '<?php\n  $treino = match ((int) date("N")) {\n    1, 4 => "Peito",\n    2, 5 => "Costas",\n    default => "Descanso",\n  };\n?>\n<?php for ($serie = 1; $serie <= 4; $serie++): ?>\n  <li class="<?= $serie <= 2 ? "feita" : "" ?>">Série <?= $serie ?></li>\n<?php endfor; ?>' },
    arquivos: {
'index.php': String.raw`<?php
/* =========================================================
   PRÁTICA — AULA 02 · CAFETERIA GRÃO DOURADO
   Decisões (if, match) e repetições (for)
   ========================================================= */
date_default_timezone_set("America/Sao_Paulo");

// ---------- DADOS DA LOJA (prontos) ----------
$nomeLoja  = "Grão Dourado";
$horaAbre  = 8;
$horaFecha = 18;
$carimbos = 6;          // cafés que o cliente já comprou
$totalCarimbos = 10;    // com 10 carimbos, ganha um café

// PRÁTICA 1: $hora (date("G")) e $diaSemana (date("N"))

// PRÁTICA 2: $saudacao com if / elseif / else

// PRÁTICA 3: $aberto (true ou false) usando && e as variáveis $horaAbre e $horaFecha

// PRÁTICA 4: $promocao com match ($diaSemana) — os textos estão no roteiro

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $nomeLoja ?> | Cafeteria</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="topo">
        <div class="logo"><?= $nomeLoja ?></div>
        <nav><a href="#cardapio">Cardápio</a> <a href="#fidelidade">Fidelidade</a></nav>
    </header>

    <section class="destaque">
        <!-- PRÁTICA 2: use $saudacao -->
        <h1>Bom dia! Que tal um café?</h1>

        <!-- PRÁTICA 3: mostre só UM destes parágrafos, conforme $aberto -->
        <p class="status aberto">Aberto agora · fechamos às <?= $horaFecha ?>h</p>
        <p class="status fechado">Fechado no momento · abrimos às <?= $horaAbre ?>h</p>

        <div class="promo">
            <span>Promoção de hoje</span>
            <!-- PRÁTICA 4: use $promocao -->
            <strong>Promoção do dia aqui</strong>
        </div>
    </section>

    <main class="conteudo">
        <h2 id="cardapio">Cardápio</h2>
        <div class="cardapio">
            <div class="item"><h3>Expresso</h3><p>Café curto e encorpado</p><span>R$ 5,50</span></div>
            <div class="item"><h3>Cappuccino</h3><p>Café, leite vaporizado e canela</p><span>R$ 8,90</span></div>
            <div class="item"><h3>Café com leite</h3><p>Clássico da casa</p><span>R$ 6,50</span></div>
            <div class="item"><h3>Pão de queijo</h3><p>Porção com 4 unidades</p><span>R$ 7,00</span></div>
        </div>

        <h2 id="fidelidade">Cartão fidelidade</h2>
        <p>A cada <?= $totalCarimbos ?> cafés, o próximo é por nossa conta.</p>
        <div class="cartao">
            <!-- PRÁTICA 5: troque estes carimbos fixos por um laço for -->
            <div class="carimbo cheio">1</div>
            <div class="carimbo cheio">2</div>
            <div class="carimbo">3</div>
        </div>
    </main>

    <footer class="rodape">
        <p><?= $nomeLoja ?> · Aberto de segunda a sábado, das <?= $horaAbre ?>h às <?= $horaFecha ?>h</p>
    </footer>
</body>
</html>
`
    },
    requisitos: [
      { texto: 'A saudação está certa para a hora atual', teste: async (t) => { const s = t.hora < 12 ? 'Bom dia' : t.hora < 18 ? 'Boa tarde' : 'Boa noite'; const h = (await t.get('index.php')).$('h1'); return !!h && h.textContent.trim().startsWith(s); } },
      { texto: 'Aparece só um aviso: aberto ou fechado, conforme a hora', teste: async (t) => { const p = (await t.get('index.php')).$$('.status'); const ab = t.hora >= 8 && t.hora < 18; return p.length === 1 && p[0].classList.contains(ab ? 'aberto' : 'fechado'); } },
      { texto: 'A promoção de hoje está certa (match)', teste: async (t) => { const n = t.dow === 0 ? 7 : t.dow; const esp = { 1: 'Segunda do Expresso: 2 por R$ 9,00', 3: 'Quarta do Cappuccino: 20% de desconto', 5: 'Sexta Doce: fatia de bolo grátis no combo' }[n] || 'Experimente o café coado do dia!'; const s = (await t.get('index.php')).$('.promo strong'); return !!s && s.textContent.trim() === esp && /\bmatch\s*\(/.test(t.codigo('index.php')); } },
      { texto: 'O cartão tem 10 carimbos, 6 cheios, gerados com for', teste: async (t) => { const p = await t.get('index.php'); return p.$$('.carimbo').length === 10 && p.$$('.carimbo.cheio').length === 6 && /\bfor\s*\(/.test(t.codigo('index.php')) && (t.fonte('index.php').match(/class="carimbo/g) || []).length <= 1; } },
      { texto: 'A página abre sem erros', teste: async (t) => (await t.get('index.php')).semErros }
    ],
    dicas: [
      'O `if` testa de cima para baixo e para no primeiro verdadeiro. Por isso basta `$hora < 12`, depois `$hora < 18`.',
      'No HTML, use a forma com dois-pontos: `<?php if ($aberto): ?> ... <?php else: ?> ... <?php endif; ?>`. Para a classe do carimbo: `<?= $i <= $carimbos ? "cheio" : "" ?>`.',
      'Esqueleto:\n$promocao = match ($diaSemana) {\n  1 => "...",\n  3 => "...",\n  5 => "...",\n  _______ => "Experimente o café coado do dia!",\n};'
    ]
  },

  // ================================================================ 03
  {
    n: 3, aula: 3, titulo: 'Vitrine montada por PHP', arquivo: 'index.php', editaveis: ['index.php', 'funcoes.php'],
    conceitos: 'require/include, foreach, arrays associativos, funções com parâmetro padrão',
    contexto: ['A TechStore já tem os produtos no `dados.php` e o cabeçalho e o rodapé prontos. Falta a vitrine (index.php) **usar** tudo isso e as funções de preço existirem.'],
    tarefas: [
      'Em `funcoes.php`, crie `formatarPreco($valor)` (149.9 vira "R$ 149,90") e `parcelar($valor, $vezes = 10)` (devolve "10x de R$ 14,99").',
      'No topo do `index.php`, traga `dados.php` e `funcoes.php` com `require_once`, crie `$titulo = "Ofertas da semana"` e inclua `cabecalho.php`.',
      'Mostre a quantidade de produtos com `count($produtos)`.',
      'Troque o cartão fixo por um `foreach ($produtos as $produto)`, usando `formatarPreco` e `parcelar`.',
      'No fim, inclua `rodape.php`.'
    ],
    exemplo: { titulo: 'Exemplo parecido (cardápio)', codigo: '<?php\n  require_once "pratos.php";\n  function reais($v) { return "R$ " . number_format($v, 2, ",", "."); }\n?>\n<?php foreach ($pratos as $p): ?>\n  <li><?= $p["nome"] ?> — <?= reais($p["preco"]) ?></li>\n<?php endforeach; ?>' },
    arquivos: {
'index.php': String.raw`<?php
/* =========================================================
   PRÁTICA — AULA 03 · TECHSTORE
   ========================================================= */
// PRÁTICA 1: traga dados.php e funcoes.php com require_once

// PRÁTICA 2: crie $titulo = "Ofertas da semana" e inclua "cabecalho.php"

?>

<main class="conteudo">
    <h1>Ofertas da semana</h1>
    <!-- PRÁTICA 3: use count($produtos) -->
    <p class="contagem">0 produtos encontrados</p>

    <div class="grade">
        <!-- PRÁTICA 4: este cartão deve se repetir para CADA produto (foreach) -->
        <article class="produto">
            <div class="foto" style="background: #dfe6ff">Áudio</div>
            <h2>Fone Bluetooth</h2>
            <p class="preco">R$ 149,90</p>
            <p class="parcelas">ou 10x de R$ 14,99 sem juros</p>
            <button class="comprar">Adicionar ao carrinho</button>
        </article>
    </div>
</main>

<!-- PRÁTICA 5: inclua "rodape.php" -->
`,
'funcoes.php': String.raw`<?php
/* =========================================================
   FUNÇÕES DA LOJA
   ========================================================= */

// PRÁTICA A: formatarPreco($valor) -> "R$ 1.234,56"
// (dica: number_format com 2 casas, vírgula e ponto)


// PRÁTICA B: parcelar($valor, $vezes = 10) -> "10x de R$ 14,99"
// (use a formatarPreco dentro dela)

`
    },
    requisitos: [
      { texto: 'index.php traz dados, funções, cabeçalho e rodapé', teste: (t) => ['dados', 'funcoes', 'cabecalho', 'rodape'].every((a) => new RegExp('(require|include)(_once)?\\s*\\(?\\s*["\']' + a + '\\.php').test(t.codigo('index.php'))) },
      { texto: 'O cabeçalho mostra o nome da loja', teste: async (t) => { const l = (await t.get('index.php')).$('.logo'); return !!l && l.textContent.includes('TechStore'); } },
      { texto: 'Os 6 produtos aparecem, gerados com foreach', teste: async (t) => (await t.get('index.php')).$$('.produto').length === 6 && /foreach\s*\(/.test(t.codigo('index.php')) && (t.fonte('index.php').match(/class="produto"/g) || []).length <= 1 },
      { texto: 'formatarPreco: o notebook custa R$ 3.499,00', teste: async (t) => /function\s+formatarPreco\s*\(/.test(t.codigo('funcoes.php')) && (await t.get('index.php')).texto.includes('R$ 3.499,00') },
      { texto: 'parcelar com 10 vezes por padrão: 10x de R$ 349,90', teste: async (t) => /function\s+parcelar\s*\(\s*\$\w+\s*,\s*\$\w+\s*=\s*10\s*\)/.test(t.codigo('funcoes.php')) && (await t.get('index.php')).texto.includes('10x de R$ 349,90') },
      { texto: 'A contagem mostra 6 produtos (count)', teste: async (t) => { const c = (await t.get('index.php')).$('.contagem'); return !!c && c.textContent.trim().startsWith('6') && /count\s*\(/.test(t.codigo('index.php')); } },
      { texto: 'A página abre sem erros', teste: async (t) => (await t.get('index.php')).semErros }
    ],
    dicas: [
      '`include` é como "colar aqui o conteúdo daquele arquivo". O cabeçalho usa `$titulo` e `$loja`, então eles precisam existir **antes** do include.',
      'Parâmetro com valor padrão: `function parcelar($valor, $vezes = 10)`. Quem chama `parcelar(100)` recebe 10 vezes; `parcelar(100, 5)` recebe 5.',
      'Esqueleto:\nfunction formatarPreco($valor) {\n  return "R$ " . number_format(______, _, ",", ".");\n}\nfunction parcelar($valor, $vezes = 10) {\n  return $vezes . "x de " . formatarPreco(______ / ______);\n}'
    ]
  },

  // ================================================================ 04
  {
    n: 4, aula: 4, titulo: 'Academia: IMC e matrícula', arquivo: 'imc.php', editaveis: ['imc.php', 'obrigado.php'], pagina: 'imc.php',
    conceitos: '$_GET, $_POST, isset, ??, REQUEST_METHOD, header Location',
    contexto: ['Os formulários da Academia Força Total estão prontos, mas ninguém recebe os dados. Você vai fazer a calculadora de IMC (GET) e a página de agradecimento da matrícula (POST).'],
    tarefas: [
      'Em `imc.php`: se `peso` e `altura` vieram na URL (`isset`), troque vírgula por ponto, calcule `IMC = peso / (altura × altura)` e formate com 1 casa decimal.',
      'Classifique: menor que 18,5 "Abaixo do peso"; menor que 25 "Peso normal"; menor que 30 "Sobrepeso"; senão "Obesidade".',
      'Mostre a caixa `resultado` só quando houver cálculo.',
      'Em `obrigado.php`: se a página for aberta sem POST, redirecione para `matricula.php`. Senão, mostre "Obrigado, NOME!" usando `htmlspecialchars`.'
    ],
    exemplo: { titulo: 'Exemplo parecido (conversor de temperatura)', codigo: '<?php\n  $resultado = "";\n  if (isset($_GET["celsius"])) {\n    $c = (float) str_replace(",", ".", $_GET["celsius"]);\n    $resultado = number_format($c * 1.8 + 32, 1, ",", ".");\n  }\n?>\n<?php if ($resultado): ?><p><?= $resultado ?> °F</p><?php endif; ?>' },
    arquivos: {
'imc.php': String.raw`<?php
/* =========================================================
   PRÁTICA — CALCULADORA DE IMC (GET na mesma página)
   IMC = peso / (altura x altura)
   ========================================================= */
$resultado = "";
$classificacao = "";

// PRÁTICA 1: se vieram "peso" e "altura" na URL (isset)...
//   - troque "," por "." (str_replace) e converta para número (float)
//   - calcule o IMC e guarde em $resultado com 1 casa decimal (number_format)
//   - PRÁTICA 2: preencha $classificacao com if / elseif / else

$titulo = "Calculadora de IMC";
include "menu.php";
?>
<main class="conteudo estreito">
    <h1>Calculadora de IMC</h1>
    <p>O Índice de Massa Corporal é uma referência simples. Converse sempre com um profissional.</p>

    <form method="get" class="formulario">
        <label>Peso (kg)
            <input type="text" name="peso" placeholder="Ex.: 70,5">
        </label>
        <label>Altura (m)
            <input type="text" name="altura" placeholder="Ex.: 1,75">
        </label>
        <button class="botao">Calcular</button>
    </form>

    <!-- PRÁTICA 3: mostre esta caixa SÓ quando houver $resultado -->
    <div class="resultado">
        <span>Seu IMC</span>
        <strong>00,0</strong>
        <p>Classificação</p>
    </div>
</main>
<?php include "rodape.php"; ?>
`,
'obrigado.php': String.raw`<?php
/* =========================================================
   PRÁTICA — RECEBE OS DADOS DA MATRÍCULA (POST)
   ========================================================= */

// PRÁTICA 4: se a página NÃO foi aberta por POST, mande de volta para matricula.php
//            (header("Location: ...") e depois exit)

// PRÁTICA 5: pegue o nome enviado ($_POST) e proteja com htmlspecialchars

$titulo = "Obrigado";
include "menu.php";
?>
<main class="conteudo estreito">
    <div class="resultado">
        <!-- PRÁTICA 5: mostre o nome recebido -->
        <h1>Obrigado, NOME!</h1>
        <p>Recebemos sua pré-matrícula. Em breve entraremos em contato.</p>
    </div>
    <p><a href="index.php">Voltar ao início</a></p>
</main>
<?php include "rodape.php"; ?>
`
    },
    requisitos: [
      { texto: 'Peso 70 e altura 1,75 dá IMC 22,9 — Peso normal', teste: async (t) => { const p = await t.get('imc.php', { peso: '70', altura: '1,75' }); const r = p.$('.resultado'); return !!r && r.querySelector('strong').textContent.trim() === '22,9' && /Peso normal/.test(r.textContent); } },
      { texto: 'Peso 95 e altura 1.70 dá 32,9 — Obesidade', teste: async (t) => { const r = (await t.get('imc.php', { peso: '95', altura: '1.70' })).$('.resultado'); return !!r && r.textContent.includes('32,9') && /Obesidade/.test(r.textContent); } },
      { texto: 'Peso 50 e altura 1,80 dá Abaixo do peso', teste: async (t) => { const r = (await t.get('imc.php', { peso: '50', altura: '1,80' })).$('.resultado'); return !!r && /Abaixo do peso/.test(r.textContent); } },
      { texto: 'Sem enviar o formulário, a caixa de resultado não aparece', teste: async (t) => !(await t.get('imc.php')).$('.resultado') },
      { texto: 'obrigado.php agradece pelo nome enviado', teste: async (t) => { const h = (await t.post('obrigado.php', { nome: 'Carla', email: 'carla@email.com', plano: 'anual' })).$('h1'); return !!h && h.textContent.includes('Obrigado, Carla'); } },
      { texto: 'Abrir obrigado.php direto leva para matricula.php', teste: async (t) => (await t.get('obrigado.php')).pagina === 'matricula.php' },
      { texto: 'O nome é protegido com htmlspecialchars', teste: async (t) => !(await t.post('obrigado.php', { nome: '<b>Carla</b>' })).html.includes('<b>Carla</b>') }
    ],
    dicas: [
      'GET leva os dados no endereço (`imc.php?peso=70&altura=1,75`). No PHP eles chegam em `$_GET["peso"]` e `$_GET["altura"]`, sempre como **texto**.',
      'O brasileiro digita "1,75", mas o PHP só entende "1.75": use `str_replace(",", ".", ...)`. Para saber se a página veio de um formulário POST: `$_SERVER["REQUEST_METHOD"] === "POST"`.',
      'Esqueleto:\nif (isset($_GET["peso"]) && isset($_GET["______"])) {\n  $peso = (float) str_replace(",", ".", $_GET["peso"]);\n  ...\n  $imc = $peso / (______ * ______);\n  $resultado = number_format($imc, _, ",", ".");\n}'
    ]
  },

  // ================================================================ 05
  {
    n: 5, aula: 5, titulo: 'Inscrição com validação', arquivo: 'index.php', editaveis: ['index.php'],
    conceitos: 'trim, array de erros, filter_var, mb_strlen, formulário pegajoso',
    contexto: ['O formulário de inscrição da Semana Tech aceita qualquer coisa. As funções `e()` e `erro()` já estão prontas em funcoes.php: falta a **validação**.'],
    tarefas: [
      'Dentro do `if` do POST, leia nome, e-mail, telefone, oficina e mensagem com `trim`.',
      'Nome: vazio → `$erros["nome"] = "Informe seu nome."`; menos de 3 letras → "O nome precisa ter pelo menos 3 letras.".',
      'E-mail: se `filter_var(..., FILTER_VALIDATE_EMAIL)` falhar → `$erros["email"] = "Informe um e-mail válido."`.',
      'Se não houver erros, `$sucesso = true` e guarde em `$nomeOficina` o nome da oficina escolhida.',
      'O HTML já mostra os erros e mantém os valores (formulário pegajoso).'
    ],
    exemplo: { titulo: 'Exemplo parecido (cadastro de pet)', codigo: '<?php\n  $erros = [];\n  $pet = trim($_POST["pet"] ?? "");\n  if ($pet === "") {\n    $erros["pet"] = "Informe o nome do pet.";\n  } elseif (mb_strlen($pet) < 2) {\n    $erros["pet"] = "Nome muito curto.";\n  }\n  if (empty($erros)) { $ok = true; }' },
    arquivos: {
'index.php': String.raw`<?php
/* =========================================================
   PRÁTICA — AULA 05 · SEMANA TECH: inscrição com validação
   Fluxo: LIMPAR -> VALIDAR -> (sem erros?) PROCESSAR
   ========================================================= */
require_once "funcoes.php";

$oficinas = [
    "web"      => "Criando sites com PHP",
    "games"    => "Introdução a jogos 2D",
    "dados"    => "Planilhas e análise de dados",
    "robotica" => "Robótica com Arduino",
];

$nome = $email = $telefone = $oficina = $mensagem = "";
$erros = [];
$sucesso = false;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // PRÁTICA 1: LIMPAR — leia os 5 campos do $_POST com trim (oficina não precisa de trim)

    // PRÁTICA 2: VALIDAR o nome (vazio? menos de 3 letras?)

    // PRÁTICA 3: VALIDAR o e-mail com filter_var

    // PRÁTICA 4: PROCESSAR — se não houver erros: $sucesso = true e $nomeOficina = nome da oficina

}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Semana Tech | Inscrições</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="hero">
    <span class="selo">Evento gratuito · Escola Técnica</span>
    <h1>Semana Tech</h1>
    <p>Quatro oficinas práticas de tecnologia. Vagas limitadas!</p>
</header>

<main class="conteudo">
<?php if ($sucesso): ?>
    <section class="cartao sucesso">
        <h2>Inscrição confirmada!</h2>
        <p>Obrigado, <strong><?= e($nome) ?></strong>. Enviamos os detalhes para <?= e($email) ?>.</p>
        <p>Oficina: <strong><?= e($nomeOficina) ?></strong></p>
        <p>Sua mensagem: <?= e($mensagem) ?></p>
        <a href="index.php">Fazer outra inscrição</a>
    </section>

<?php else: ?>
    <section class="cartao">
        <h2>Faça sua inscrição</h2>

        <?php if (!empty($erros)): ?>
            <p class="alerta">Corrija os campos destacados (<?= count($erros) ?> erro(s)).</p>
        <?php endif; ?>

        <form method="post" novalidate>
            <label>Nome completo
                <input type="text" name="nome" value="<?= e($nome) ?>"
                       class="<?= isset($erros["nome"]) ? "invalido" : "" ?>">
                <?= erro($erros, "nome") ?>
            </label>

            <label>E-mail
                <input type="email" name="email" value="<?= e($email) ?>"
                       class="<?= isset($erros["email"]) ? "invalido" : "" ?>">
                <?= erro($erros, "email") ?>
            </label>

            <label>Telefone (WhatsApp)
                <input type="tel" name="telefone" placeholder="(11) 99999-9999">
                <?= erro($erros, "telefone") ?>
            </label>

            <label>Oficina
                <select name="oficina">
                    <option value="">Escolha...</option>
                    <?php foreach ($oficinas as $chave => $titulo): ?>
                        <option value="<?= $chave ?>"><?= $titulo ?></option>
                    <?php endforeach; ?>
                </select>
                <?= erro($erros, "oficina") ?>
            </label>

            <label>Mensagem para a organização (opcional)
                <textarea name="mensagem" rows="3"><?= e($mensagem) ?></textarea>
            </label>

            <button type="submit">Confirmar inscrição</button>
        </form>
    </section>
<?php endif; ?>
</main>
</body>
</html>
`
    },
    requisitos: [
      { texto: 'Nome vazio mostra "Informe seu nome."', teste: async (t) => { const p = await t.post('index.php', { nome: '', email: 'a@b.com', oficina: 'web' }); return /Informe seu nome/.test(p.texto) && !p.$('.sucesso'); } },
      { texto: 'Nome com 2 letras é recusado', teste: async (t) => /pelo menos 3 letras/.test((await t.post('index.php', { nome: 'Al', email: 'a@b.com', oficina: 'web' })).texto) },
      { texto: 'E-mail inválido é recusado', teste: async (t) => { const p = await t.post('index.php', { nome: 'Marina', email: 'marina.com', oficina: 'web' }); return /e-mail válido/i.test(p.texto) && !p.$('.sucesso'); } },
      { texto: 'Com erro, o nome digitado continua no campo', teste: async (t) => { const i = (await t.post('index.php', { nome: 'Marina', email: 'x', oficina: 'web' })).$('input[name="nome"]'); return !!i && i.value === 'Marina'; } },
      { texto: 'Dados válidos confirmam a inscrição com o nome da oficina', teste: async (t) => { const s = (await t.post('index.php', { nome: 'Marina', email: 'marina@email.com', oficina: 'games' })).$('.sucesso'); return !!s && s.textContent.includes('Marina') && s.textContent.includes('Introdução a jogos 2D'); } },
      { texto: 'Espaços sobrando são removidos (trim)', teste: async (t) => { const s = (await t.post('index.php', { nome: '   Ana Paula   ', email: ' ana@email.com ', oficina: 'web' })).$('.sucesso strong'); return !!s && s.textContent === 'Ana Paula'; } },
      { texto: 'Usa filter_var e mb_strlen (ou strlen)', teste: usa(/filter_var\s*\([\s\S]*(mb_)?strlen\s*\(|(mb_)?strlen\s*\([\s\S]*filter_var\s*\(/, 'index.php') }
    ],
    dicas: [
      'Pense num **porteiro com uma prancheta**: cada regra quebrada é anotada na prancheta (`$erros["campo"] = "mensagem"`). Se a prancheta terminar vazia, a pessoa entra.',
      '`filter_var($email, FILTER_VALIDATE_EMAIL)` devolve o e-mail se for válido ou `false`. Use `!` para "se NÃO for válido". Para o nome da oficina: `$oficinas[$oficina] ?? "a definir"`.',
      'Esqueleto:\n$nome = trim($_POST["nome"] ?? "");\nif ($nome === "") {\n  $erros["____"] = "Informe seu nome.";\n} elseif (mb_strlen($nome) < _) {\n  $erros["nome"] = "...";\n}\nif (empty(______)) { $sucesso = true; ... }'
    ]
  },

  // ================================================================ 06
  {
    n: 6, aula: 6, titulo: 'Mural com arquivo JSON', arquivo: 'index.php', editaveis: ['index.php', 'excluir.php'],
    conceitos: 'ler → alterar → salvar, json, uniqid, in_array, Post/Redirect/Get',
    contexto: ['As funções `lerRecados()` e `salvarRecados()` já estão prontas em funcoes.php. Você vai usá-las para **criar**, **listar** e **excluir** recados do mural.'],
    tarefas: [
      'No `index.php`, ao receber POST: leia autor, mensagem e cor. Se a cor não estiver em `$cores`, use "amarelo".',
      'Leia a lista, acrescente o recado (`id` com `uniqid()`, autor, mensagem, cor e data `d/m/Y H:i`) e salve. Depois redirecione para `index.php` e use `exit`.',
      'Fora do POST, leia os recados e mostre um post-it para cada um (`foreach`). Mostre o aviso `vazio` quando não houver nenhum.',
      'Use `e()` (htmlspecialchars) ao mostrar autor e mensagem.',
      'Em `excluir.php`, receba o `id`, monte uma nova lista **sem** aquele recado, salve e volte para o mural.'
    ],
    exemplo: { titulo: 'Exemplo parecido (lista de compras)', codigo: '<?php\n  $itens = lerItens();                 // 1) ler\n  $itens[] = ["id" => uniqid(), "nome" => "Arroz"];  // 2) alterar\n  salvarItens($itens);                 // 3) salvar\n  header("Location: lista.php");       // PRG\n  exit;' },
    arquivos: {
'index.php': String.raw`<?php
/* =========================================================
   PRÁTICA — AULA 06 · MURAL DE RECADOS (JSON)
   C (criar)  R (listar)  D (excluir em excluir.php)
   ========================================================= */
require_once "funcoes.php";   // lerRecados(), salvarRecados() e e() já existem

$cores = ["amarelo", "azul", "verde", "rosa"];

// PRÁTICA 1 (C): se veio POST...
//   - leia autor, mensagem (trim) e cor; cor fora da lista vira "amarelo"
//   - 1) ler  2) acrescentar o recado  3) salvar
//   - redirecione para index.php e use exit

// PRÁTICA 2 (R): leia os recados para mostrar
$recados = [];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mural da Turma</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topo">
    <h1>Mural da Turma</h1>
    <p>Deixe um recado, um aviso ou um elogio para a turma.</p>
</header>

<main class="conteudo">
    <form method="post" class="novo">
        <input type="text" name="autor" placeholder="Seu nome" maxlength="40">
        <textarea name="mensagem" placeholder="Escreva seu recado..." rows="3"></textarea>
        <div class="linha">
            <div class="cores">
                <?php foreach ($cores as $c): ?>
                    <label class="cor <?= $c ?>">
                        <input type="radio" name="cor" value="<?= $c ?>" <?= $c === "amarelo" ? "checked" : "" ?>>
                    </label>
                <?php endforeach; ?>
            </div>
            <button>Publicar recado</button>
        </div>
    </form>

    <!-- PRÁTICA 3: mostre este aviso SÓ quando não houver recados -->
    <p class="vazio">Nenhum recado ainda. Seja o primeiro!</p>

    <section class="mural">
        <!-- PRÁTICA 3: um post-it para CADA recado (foreach). Use e() no autor e na mensagem -->
        <article class="postit amarelo">
            <p class="mensagem">Exemplo de recado</p>
            <footer>
                <strong>Autor</strong>
                <span>01/01/2026 10:00</span>
            </footer>
            <form action="excluir.php" method="post" class="excluir">
                <input type="hidden" name="id" value="ID-DO-RECADO">
                <button title="Excluir recado">&times;</button>
            </form>
        </article>
    </section>
</main>
</body>
</html>
`,
'excluir.php': String.raw`<?php
/* =========================================================
   PRÁTICA — D: EXCLUIR um recado pelo id (POST)
   ========================================================= */
require_once "funcoes.php";

// PRÁTICA 4: receba o id, monte $restantes com todos os recados MENOS o do id,
//            salve e redirecione para index.php

`
    },
    requisitos: [
      { texto: 'Publicar salva o recado em dados/recados.json', teste: async (t) => { await t.post('index.php', { autor: 'Leo', mensagem: 'Prova sexta!', cor: 'azul' }); const l = t.json('dados/recados.json'); return Array.isArray(l) && l.length === 1 && l[0].autor === 'Leo' && l[0].cor === 'azul' && !!l[0].id; } },
      { texto: 'Depois de publicar, redireciona e o recado aparece no mural', teste: async (t) => { const p = await t.post('index.php', { autor: 'Leo', mensagem: 'Prova sexta!', cor: 'azul' }); return p.redirecionou && p.$$('.postit').length === 1 && p.$('.postit').textContent.includes('Prova sexta!'); } },
      { texto: 'Vários recados viram vários post-its (foreach)', teste: async (t) => { await t.post('index.php', { autor: 'A', mensagem: 'Um', cor: 'azul' }); const p = await t.post('index.php', { autor: 'B', mensagem: 'Dois', cor: 'verde' }); return p.$$('.postit').length === 2 && (t.fonte('index.php').match(/class="postit/g) || []).length <= 1; } },
      { texto: 'Cor fora da lista vira amarelo', teste: async (t) => { await t.post('index.php', { autor: 'A', mensagem: 'Oi', cor: 'roxo' }); const l = t.json('dados/recados.json'); return !!l && l[0].cor === 'amarelo'; } },
      { texto: 'Mural vazio mostra o aviso; com recados, não', teste: async (t) => { const v = !!(await t.get('index.php')).$('.vazio'); await t.post('index.php', { autor: 'A', mensagem: 'Oi', cor: 'azul' }); return v && !(await t.get('index.php')).$('.vazio'); } },
      { texto: 'Excluir remove só o recado escolhido', teste: async (t) => { await t.post('index.php', { autor: 'A', mensagem: 'Um', cor: 'azul' }); await t.post('index.php', { autor: 'B', mensagem: 'Dois', cor: 'azul' }); const id = t.json('dados/recados.json')[0].id; const p = await t.post('excluir.php', { id }); const l = t.json('dados/recados.json'); return p.pagina === 'index.php' && l.length === 1 && l[0].mensagem === 'Dois'; } },
      { texto: 'HTML digitado no recado aparece como texto (XSS)', teste: async (t) => !(await t.post('index.php', { autor: 'X', mensagem: '<b>oi</b>', cor: 'azul' })).html.includes('<b>oi</b>') }
    ],
    dicas: [
      'O JSON é um **caderno**: para escrever um recado novo você precisa abrir o caderno (ler), escrever (acrescentar com `[] =`) e guardar (salvar). Se pular o "ler", apaga tudo!',
      'Excluir = copiar o caderno inteiro **menos** uma página: percorra com `foreach` e só guarde em `$restantes` os recados cujo `id` é diferente (`!==`) do recebido.',
      'Esqueleto:\n$recados = lerRecados();\n$recados[] = [\n  "id" => ______(),\n  "autor" => $autor,\n  ...\n];\nsalvarRecados(______);\nheader("Location: index.php");\n____;'
    ]
  },

  // ================================================================ 07
  {
    n: 7, aula: 7, titulo: 'Login com sessão', arquivo: 'index.php', editaveis: ['index.php', 'protecao.php', 'sair.php'],
    conceitos: 'session_start, $_SESSION, password_verify, proteção de páginas, logout',
    contexto: ['O Portal do Aluno tem o painel e os usuários prontos (as senhas já estão como hash em usuarios.php). Falta a **porta de entrada**, a **tranca** das páginas e a **saída**.'],
    tarefas: [
      'No `index.php`: `session_start()`, traga `usuarios.php` e, se já houver `$_SESSION["usuario"]`, vá para `painel.php`.',
      'Ao receber POST: se o login existir em `$usuarios` e `password_verify` confirmar a senha, guarde o login em `$_SESSION["usuario"]` e a hora em `$_SESSION["entrou_em"]`, depois redirecione para o painel. Senão, `$erro = "Usuário ou senha incorretos."`.',
      'Em `protecao.php`: inicie a sessão e, sem usuário na sessão, mande para `index.php` com `exit`.',
      'Em `sair.php`: destrua a sessão e volte para `index.php`.',
      'Teste com **ana / 123456** e **bruno / senha123**.'
    ],
    exemplo: { titulo: 'Exemplo parecido (área do sócio de um clube)', codigo: '<?php\n  session_start();\n  if (isset($socios[$cpf]) && password_verify($senha, $socios[$cpf]["hash"])) {\n    $_SESSION["socio"] = $cpf;\n    header("Location: area.php");\n    exit;\n  }' },
    arquivos: {
'index.php': String.raw`<?php
/* =========================================================
   PRÁTICA — AULA 07 · PORTAL DO ALUNO: tela de login
   Usuários de teste:  ana / 123456   ·   bruno / senha123
   ========================================================= */

// PRÁTICA 1: inicie a sessão e traga usuarios.php

// PRÁTICA 2: se já estiver logado ($_SESSION["usuario"]), vá para painel.php

$erro = "";

// PRÁTICA 3: ao receber POST, confira login e senha com password_verify
//   - deu certo: $_SESSION["usuario"] = login, $_SESSION["entrou_em"] = date("H:i"), vai para painel.php
//   - deu errado: $erro = "Usuário ou senha incorretos."

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal do Aluno | Entrar</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="tela-login">
    <form method="post" class="caixa-login">
        <div class="marca">Portal do Aluno</div>
        <h1>Entrar</h1>

        <?php if ($erro): ?>
            <p class="erro"><?= $erro ?></p>
        <?php endif; ?>

        <label>Usuário
            <input type="text" name="login" autocomplete="username">
        </label>
        <label>Senha
            <input type="password" name="senha" autocomplete="current-password">
        </label>
        <button>Entrar</button>
        <p class="dica">Teste com <b>ana</b> / <b>123456</b></p>
    </form>
</body>
</html>
`,
'protecao.php': String.raw`<?php
/* =========================================================
   PRÁTICA — PROTEÇÃO: incluída na primeira linha do painel.
   Sem login na sessão = volta para a tela de entrada.
   ========================================================= */

// PRÁTICA 4: inicie a sessão; se não houver $_SESSION["usuario"], redirecione para index.php e use exit

`,
'sair.php': String.raw`<?php
/* PRÁTICA 5 — LOGOUT: destrua a sessão e volte para index.php */

`
    },
    requisitos: [
      { texto: 'Login ana / 123456 abre o painel da Ana Souza', teste: async (t) => { const p = await t.post('index.php', { login: 'ana', senha: '123456' }); return p.pagina === 'painel.php' && p.texto.includes('Ana Souza'); } },
      { texto: 'Senha errada mostra o erro e não entra', teste: async (t) => { const p = await t.post('index.php', { login: 'ana', senha: '000' }); return p.pagina === 'index.php' && !!p.$('.erro'); } },
      { texto: 'Usuário que não existe mostra o erro', teste: async (t) => !!(await t.post('index.php', { login: 'zeca', senha: '123456' })).$('.erro') },
      { texto: 'Sem login, o painel manda de volta para a entrada', teste: async (t) => (await t.get('painel.php')).pagina === 'index.php' },
      { texto: 'Logado, abrir a tela de entrada vai direto ao painel', teste: async (t) => { await t.post('index.php', { login: 'bruno', senha: 'senha123' }); return (await t.get('index.php')).pagina === 'painel.php'; } },
      { texto: 'Sair encerra a sessão', teste: async (t) => { await t.post('index.php', { login: 'ana', senha: '123456' }); await t.get('sair.php'); return (await t.get('painel.php')).pagina === 'index.php'; } },
      { texto: 'Usa password_verify', teste: usa(/password_verify\s*\(/, 'index.php') }
    ],
    dicas: [
      'A sessão é a **pulseira do evento**: você mostra o ingresso uma vez (login) e depois cada página só confere a pulseira (`$_SESSION`).',
      'Primeiro confira se o usuário existe (`isset($usuarios[$login])`), depois a senha: `password_verify($senha, $usuarios[$login]["senha"])`. Depois de `header("Location: ...")` sempre vem `exit`.',
      'Esqueleto (protecao.php):\nsession_start();\nif (!isset($_SESSION["_______"])) {\n  header("Location: _________");\n  exit;\n}'
    ]
  },

  // ================================================================ 08
  {
    n: 8, aula: 8, titulo: 'Funções que conversam com APIs', arquivo: 'api.php', editaveis: ['api.php'],
    conceitos: 'file_get_contents com URL, json_decode, arrays aninhados, match(true), tratamento de falhas',
    contexto: ['As páginas da agência Rota Certa já chamam as funções de `api.php`, mas elas ainda devolvem `null`. Faça cada função buscar os dados de verdade.'],
    tarefas: [
      '`buscarJson($url)`: busque com `@file_get_contents`; se der `false`, devolva `null`; senão, devolva `json_decode(..., true)`.',
      '`buscarCotacoes()`: chame `https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL` e devolva `["USD" => ..., "EUR" => ..., "BRL" => 1.0]` usando o campo `bid` (converta com `(float)`).',
      '`converterParaReais($valor, $moeda, $cotacoes)`: valor × cotação da moeda (ou `null` se não houver cotação).',
      '`buscarClima($lat, $lon)`: chame a Open-Meteo (a URL está no comentário) e devolva só a parte `["current"]`.',
      '`descricaoClima($codigo)` com `match (true)` e `numero($valor)` no formato 1.234,56.'
    ],
    exemplo: { titulo: 'Exemplo parecido (API de feriados)', codigo: '<?php\n  function feriados($ano) {\n    $json = @file_get_contents("https://brasilapi.com.br/api/feriados/v1/$ano");\n    if ($json === false) { return null; }\n    return json_decode($json, true);\n  }\n  $f = feriados(2026);\n  echo $f[0]["name"] ?? "sem dados";' },
    arquivos: {
'api.php': String.raw`<?php
/* =========================================================
   PRÁTICA — FUNÇÕES DE INTEGRAÇÃO COM APIs
   As páginas já chamam estas funções. Hoje elas devolvem
   null ("sem dados"). Faça cada uma funcionar de verdade.
   ========================================================= */

// PRÁTICA 1: busca a URL e devolve o JSON como array (ou null se falhar)
function buscarJson($url) {
    return null;
}

// PRÁTICA 2: cotações do dólar e do euro (AwesomeAPI)
// URL: https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL
// Devolva ["USD" => ..., "EUR" => ..., "BRL" => 1.0]  (campo "bid")
function buscarCotacoes() {
    return null;
}

// PRÁTICA 3: valor x cotação da moeda (ou null)
function converterParaReais($valor, $moeda, $cotacoes) {
    return null;
}

// PRÁTICA 4: clima atual (Open-Meteo) — devolva só a parte ["current"]
// URL: https://api.open-meteo.com/v1/forecast?latitude=LAT&longitude=LON&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto
function buscarClima($lat, $lon) {
    return null;
}

// PRÁTICA 5: traduza o código com match (true):
// 0 Céu limpo · até 3 Parcialmente nublado · até 48 Neblina · até 57 Garoa
// até 67 Chuva · até 77 Neve · até 82 Pancadas de chuva · senão Tempestade
function descricaoClima($codigo) {
    return "";
}

// PRÁTICA 6: 1234.5 -> "1.234,50"
function numero($valor) {
    return $valor;
}
`
    },
    requisitos: [
      { texto: 'buscarJson funciona: o CEP 01001000 preenche a rua no cadastro', teste: async (t) => { const r = (await t.get('cadastro.php', { cep: '01001000' })).$('input[name="rua"]'); return !!r && /Praça da Sé/.test(r.value); } },
      { texto: 'CEP inexistente mostra "Não encontramos este CEP."', teste: async (t) => /Não encontramos/.test((await t.get('cadastro.php', { cep: '00000000' })).texto) },
      { texto: 'A faixa mostra a cotação do dólar', teste: async (t) => { const s = (await t.get('index.php')).$('.faixa-cotacao strong'); return !!s && /R\$\s*\d+,\d{2}/.test(s.textContent); } },
      { texto: 'Os 4 destinos mostram o preço convertido em reais', teste: async (t) => (await t.get('index.php')).$$('.destino .preco').length === 4 },
      { texto: 'numero() formata no padrão brasileiro (BRL 1.350,00)', teste: async (t) => (await t.get('index.php')).texto.includes('BRL 1.350,00') },
      { texto: 'A página do destino mostra a temperatura e a descrição do clima', teste: async (t) => { const p = await t.get('destino.php', { id: 'lisboa' }); const temp = p.$('.temperatura'); return !!temp && /-?\d+\s*°C/.test(temp.textContent) && /(Céu limpo|nublado|Neblina|Garoa|Chuva|Neve|Pancadas|Tempestade)/.test(p.texto); } },
      { texto: 'descricaoClima usa match (true)', teste: usa(/match\s*\(\s*true\s*\)/, 'api.php') }
    ],
    dicas: [
      'A API é um **garçom**: você entrega o pedido (URL) e ele volta com um prato embrulhado (texto JSON). O `json_decode(..., true)` desembrulha em array.',
      'Abra a URL da AwesomeAPI no navegador e veja o caminho: `$dados["USDBRL"]["bid"]`. O valor vem como texto, por isso o `(float)`.',
      'Esqueleto:\nfunction buscarJson($url) {\n  $json = @file_get_contents(____);\n  if ($json === _____) { return null; }\n  return json_decode($json, ____);\n}'
    ]
  },

  // ================================================================ 09
  {
    n: 9, aula: 9, titulo: 'Funções de data da barbearia', arquivo: 'funcoes.php', editaveis: ['funcoes.php'],
    conceitos: 'for, sprintf, checkdate, explode, strtotime, date',
    contexto: ['O calendário, a escolha de horário e a agenda da barbearia estão prontos, mas dependem de funções de data que ainda não funcionam. Elas estão em `funcoes.php`.'],
    tarefas: [
      '`gerarHorarios()`: devolve a lista "09:00", "10:00" ... "17:00" (use `for` e `sprintf("%02d:00", $h)`).',
      '`horariosOcupados($data)`: percorre `lerAgendamentos()` e devolve os horários dos agendamentos daquela data.',
      '`dataValida($data)`: separa "AAAA-MM-DD" com `explode` e confere com `checkdate(mes, dia, ano)`.',
      '`dataBR($data)`: "2026-11-20" vira "20/11/2026".',
      '`nomeMes($numero)`: 1 vira "Janeiro" ... 12 vira "Dezembro" (use um array).'
    ],
    exemplo: { titulo: 'Exemplo parecido (turnos de uma escola)', codigo: '<?php\n  function aulasDoDia() {\n    $lista = [];\n    for ($a = 7; $a <= 11; $a++) {\n      $lista[] = sprintf("%02d:30", $a);   // 7 -> "07:30"\n    }\n    return $lista;\n  }\n  $p = explode("/", "20/11/2026");   // ["20", "11", "2026"]' },
    arquivos: {
'funcoes.php': String.raw`<?php
/* =========================================================
   PRÁTICA — FUNÇÕES E CONFIGURAÇÕES DA BARBEARIA
   ========================================================= */
date_default_timezone_set("America/Sao_Paulo");

// Serviços oferecidos (pronto)
const SERVICOS = [
    "corte" => ["nome" => "Corte",          "preco" => 45],
    "barba" => ["nome" => "Barba",          "preco" => 35],
    "combo" => ["nome" => "Corte + barba",  "preco" => 70],
];

// --------- Arquivo JSON (pronto, igual à Aula 06) ---------
function lerAgendamentos() {
    if (!file_exists("dados/agendamentos.json")) {
        return [];
    }
    return json_decode(file_get_contents("dados/agendamentos.json"), true) ?? [];
}
function salvarAgendamentos($lista) {
    if (!is_dir("dados")) {
        mkdir("dados");
    }
    file_put_contents("dados/agendamentos.json", json_encode($lista, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}
function e($texto) {
    return htmlspecialchars($texto, ENT_QUOTES, "UTF-8");
}

// PRÁTICA 1: horários das 9h às 17h -> ["09:00", "10:00", ..., "17:00"]
function gerarHorarios() {
    return [];
}

// PRÁTICA 2: horários já ocupados numa data (ex.: ["10:00", "15:00"])
function horariosOcupados($data) {
    return [];
}

// PRÁTICA 3: "2026-11-20" é uma data que existe? (explode + checkdate)
function dataValida($data) {
    return true;
}

// PRÁTICA 4: "2026-11-20" -> "20/11/2026"
function dataBR($data) {
    return $data;
}

// PRÁTICA 5: 1 -> "Janeiro" ... 12 -> "Dezembro"
function nomeMes($numero) {
    return "Mês";
}
`
    },
    requisitos: [
      { texto: 'O calendário mostra o mês atual por extenso', teste: async (t) => { const nomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']; const h = (await t.get('index.php')).$('h1'); return !!h && h.textContent.trim() === nomes[t.mes - 1] + ' de ' + t.ano; } },
      { texto: 'O dia escolhido oferece 9 horários, das 09:00 às 17:00', teste: async (t) => { const v = (await t.get('horarios.php', { data: t.diaUtil(2) })).$$('input[name="horario"]').map((i) => i.value); return v.length === 9 && v[0] === '09:00' && v[8] === '17:00'; } },
      { texto: 'dataBR: o título mostra a data no formato dd/mm/aaaa', teste: async (t) => { const h = (await t.get('horarios.php', { data: t.diaUtil(2) })).$('h1'); return !!h && h.textContent.trim() === t.br(t.diaUtil(2)); } },
      { texto: 'Horário agendado aparece como ocupado', teste: async (t) => { const d = t.diaUtil(2); await t.post('horarios.php', { data: d, horario: '10:00', nome: 'Caio', telefone: '11999990000', servico: 'corte' }); const p = await t.get('horarios.php', { data: d }); return p.$$('.horario.ocupado').some((s) => s.textContent.includes('10:00')) && p.$$('input[name="horario"]').length === 8; } },
      { texto: 'dataValida: 30 de fevereiro volta para o calendário', teste: async (t) => (await t.get('horarios.php', { data: (t.ano + 1) + '-02-30' })).pagina === 'index.php' && /checkdate\s*\(/.test(t.codigo('funcoes.php')) },
      { texto: 'gerarHorarios usa for e sprintf (ou str_pad)', teste: usa(/for\s*\([\s\S]*(sprintf|str_pad)\s*\(/, 'funcoes.php') },
      { texto: 'As páginas abrem sem erros', teste: async (t) => (await t.get('index.php')).semErros && (await t.get('horarios.php', { data: t.diaUtil(2) })).semErros }
    ],
    dicas: [
      'Datas guardadas como "AAAA-MM-DD" são fáceis de comparar e de separar: `explode("-", $data)` devolve `["2026", "11", "20"]`.',
      '`checkdate` recebe na ordem **mês, dia, ano**, todos como números: `checkdate((int) $p[1], (int) $p[2], (int) $p[0])`. Para o nome do mês, um array começando em 1: `[1 => "Janeiro", "Fevereiro", ...]`.',
      'Esqueleto:\nfunction horariosOcupados($data) {\n  $ocupados = [];\n  foreach (lerAgendamentos() as $a) {\n    if ($a["____"] === $data) { $ocupados[] = $a["_______"]; }\n  }\n  return _________;\n}'
    ]
  },

  // ================================================================ 10
  {
    n: 10, aula: 10, titulo: 'Pedido no WhatsApp e chatbot', arquivo: 'pedido.php', editaveis: ['pedido.php', 'bot.php'],
    conceitos: 'arrays do formulário (qtd[...]), rawurlencode, wa.me, normalização de texto, regras do bot',
    contexto: ['A Pizzaria Bella Massa já tem cardápio, chat e dados prontos. Faltam dois "motores": montar o pedido com a mensagem do WhatsApp e o cérebro do chatbot.'],
    tarefas: [
      'Em `pedido.php`: sem POST, volte para `index.php`. Leia `qtd` (array), nome, endereço e pagamento.',
      'Monte `$itens` só com pizzas que existem em `PIZZAS` e quantidade maior que zero; some o `$total`.',
      'Erros: nenhum item → "Escolha pelo menos uma pizza."; nome ou endereço vazio → "Informe seu nome e o endereço de entrega.".',
      'Monte a mensagem ("2x Calabresa - R$ 105,80" por linha e "*Total: R$ ...*") e o `$linkWhats` com `rawurlencode`.',
      'Em `bot.php`, faça `normalizar()` (minúsculas, sem acentos), `contem()` e `responder()` com as opções 1 a 5 (veja os comentários).'
    ],
    exemplo: { titulo: 'Exemplo parecido (lanchonete)', codigo: '<?php\n  $total = 0;\n  foreach ($_POST["qtd"] ?? [] as $chave => $qtd) {\n    if ((int) $qtd > 0 && isset(LANCHES[$chave])) {\n      $total += $qtd * LANCHES[$chave]["preco"];\n    }\n  }\n  $link = "https://wa.me/55119... ?text=" . rawurlencode("Total: R$ " . $total);' },
    arquivos: {
'pedido.php': String.raw`<?php
/* =========================================================
   PRÁTICA — REVISÃO DO PEDIDO + LINK DO WHATSAPP
   ========================================================= */
require_once "dados.php";   // PIZZARIA, PIZZAS, moeda() e e() já existem

// PRÁTICA 1: se não veio por POST, volte para index.php

// PRÁTICA 2: leia $_POST["qtd"] (array), nome, endereço e pagamento
$itens = [];
$total = 0;

// PRÁTICA 3: para cada pizza com quantidade > 0 que EXISTE em PIZZAS,
//            acrescente ["nome" => ..., "qtd" => ..., "subtotal" => ...] em $itens e some no $total

// PRÁTICA 4: validação -> $erro
$erro = "";

// PRÁTICA 5: monte $msg (uma linha por item + total + nome + endereço + pagamento)
//            e $linkWhats = "https://wa.me/" . PIZZARIA["whatsapp"] . "?text=" . rawurlencode($msg)
$msg = "";
$linkWhats = "#";
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seu pedido | <?= PIZZARIA["nome"] ?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topo"><div class="logo"><?= PIZZARIA["nome"] ?></div></header>
<main class="conteudo estreito">
    <?php if ($erro): ?>
        <p class="erro"><?= $erro ?></p>
        <a href="index.php">&larr; Voltar ao cardápio</a>
    <?php else: ?>
        <h2>Confira seu pedido</h2>
        <div class="resumo">
            <?php foreach ($itens as $item): ?>
                <p><?= $item["qtd"] ?>x <?= $item["nome"] ?> <span>R$ <?= moeda($item["subtotal"]) ?></span></p>
            <?php endforeach; ?>
            <p class="total">Total <span>R$ <?= moeda($total) ?></span></p>
        </div>

        <h3>Mensagem que será enviada</h3>
        <pre class="previa"><?= e($msg) ?></pre>

        <a class="botao whats" href="<?= $linkWhats ?>" target="_blank">Enviar pedido pelo WhatsApp</a>
        <p><a href="index.php">Alterar pedido</a></p>
    <?php endif; ?>
</main>
</body>
</html>
`,
'bot.php': String.raw`<?php
/* =========================================================
   PRÁTICA — CÉREBRO DO CHATBOT
   ========================================================= */
require_once "dados.php";

// PRÁTICA A: minúsculas (mb_strtolower), sem espaços nas pontas (trim) e sem acentos (strtr)
function normalizar($texto) {
    return $texto;
}

// PRÁTICA B: true se o texto contém QUALQUER uma das palavras (str_contains)
function contem($texto, $palavras) {
    return false;
}

// Pronto: menu de opções
function menu() {
    return "Digite o número da opção:\n"
         . "1 - Cardápio e preços\n"
         . "2 - Horário de funcionamento\n"
         . "3 - Entrega e endereço\n"
         . "4 - Fazer um pedido\n"
         . "5 - Falar com um atendente";
}

// Pronto: está aberto agora?
function estaAberto() {
    $hora = (int) date("G");
    return $hora >= PIZZARIA["abre"] && $hora < PIZZARIA["fecha"];
}

// PRÁTICA C: devolva a resposta certa (normalize a mensagem primeiro)
//   1 ou cardapio/sabores/preco/valor/menu -> "*Nosso cardápio:*" + "- NOME: R$ PREÇO" de cada pizza
//   2 ou horario/aberto/abre/fecha        -> "Funcionamos todos os dias das 18h às 23h." + aberto/fechado
//   3 ou entrega/endereco/taxa            -> taxa de entrega e endereço
//   4 ou pedido/pedir/quero               -> convite para pedir pelo site
//   5 ou atendente/humano/pessoa          -> link wa.me para falar com a equipe
//   oi/ola/bom dia...                     -> "Olá! Como posso ajudar?" + menu()
//   qualquer outra coisa                  -> "Desculpe, não entendi." + menu()
function responder($mensagem) {
    return "Desculpe, não entendi.\n\n" . menu();
}
`
    },
    requisitos: [
      { texto: '2 Calabresas + 1 Margherita somam R$ 155,70', teste: async (t) => { const p = await t.post('pedido.php', { 'qtd[calabresa]': '2', 'qtd[margherita]': '1', 'qtd[frango]': '0', nome: 'Rui', endereco: 'Rua A, 10', pagamento: 'Pix' }); const tot = p.$('.total'); return !!tot && tot.textContent.includes('155,70') && p.$$('.resumo p').length === 3; } },
      { texto: 'O link do WhatsApp leva a mensagem do pedido (rawurlencode)', teste: async (t) => { const a = (await t.post('pedido.php', { 'qtd[calabresa]': '2', nome: 'Rui', endereco: 'Rua A, 10', pagamento: 'Pix' })).$('a.whats'); if (!a) return false; const h = a.getAttribute('href'); if (!/^https:\/\/wa\.me\/\d+\?text=/.test(h) || !/%20/.test(h)) return false; const m = decodeURIComponent(h.split('text=')[1]); return m.includes('2x Calabresa') && m.includes('105,80') && m.includes('Rui'); } },
      { texto: 'Sem pizzas (ou pizza que não existe) mostra o erro', teste: async (t) => { const a = await t.post('pedido.php', { 'qtd[margherita]': '0', nome: 'Rui', endereco: 'Rua A' }); const b = await t.post('pedido.php', { 'qtd[lasanha]': '3', nome: 'Rui', endereco: 'Rua A' }); return /pelo menos uma pizza/.test(a.texto) && /pelo menos uma pizza/.test(b.texto); } },
      { texto: 'Abrir pedido.php direto volta ao cardápio', teste: async (t) => (await t.get('pedido.php')).pagina === 'index.php' },
      { texto: 'Bot: "1" e "CARDÁPIO" mostram as pizzas com preço', teste: async (t) => { await t.post('chatbot.php', { mensagem: '1' }); const p = await t.post('chatbot.php', { mensagem: 'Qual o CARDÁPIO?' }); const b = p.$$('.balao.bot').map((x) => x.textContent); return b.length >= 3 && b[b.length - 2].includes('Margherita: R$ 49,90') && b[b.length - 1].includes('Margherita: R$ 49,90'); } },
      { texto: 'Bot: "horário" e "5" funcionam', teste: async (t) => { await t.post('chatbot.php', { mensagem: 'que horário vocês abrem?' }); const p = await t.post('chatbot.php', { mensagem: '5' }); const b = p.$$('.balao.bot').map((x) => x.textContent); return /Funcionamos/.test(b[b.length - 2]) && /wa\.me/.test(b[b.length - 1]); } },
      { texto: 'Bot: mensagem desconhecida recebe "não entendi"', teste: async (t) => { const b = (await t.post('chatbot.php', { mensagem: 'abacaxi' })).$$('.balao.bot'); return /não entendi/i.test(b[b.length - 1].textContent); } }
    ],
    dicas: [
      '`name="qtd[calabresa]"` no formulário faz o PHP receber um **array**: `$_POST["qtd"]["calabresa"]`. Percorra com `foreach ($quantidades as $chave => $qtd)`.',
      'Normalizar é **deixar tudo no mesmo formato** antes de comparar: "CARDÁPIO", "cardápio" e "cardapio" viram "cardapio". Use `strtr($texto, ["á" => "a", ...])`.',
      'Esqueleto (contem):\nfunction contem($texto, $palavras) {\n  foreach ($palavras as $palavra) {\n    if (str_contains(______, ______)) { return ____; }\n  }\n  return _____;\n}'
    ]
  }
  ];
})();
