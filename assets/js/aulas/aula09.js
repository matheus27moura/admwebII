/* AULA 09 — Datas, calendário e agendamento */
AULAS.push({
  n: 9,
  titulo: 'Calendário e agenda: sistema de agendamento online',
  curto: 'Calendário e agenda',
  resumo: 'Trabalhe com datas no PHP, monte um calendário mensal navegável e crie um sistema de agendamento que impede horários duplicados.',
  conteudos: 'timestamp, date, mktime, strtotime, checkdate, DateTime, calendário mensal, geração de horários, regras de negócio, usort',
  objetivos: [
    'Entender o que é um <em>timestamp</em> e formatar datas com <code>date()</code>.',
    'Criar e calcular datas com <code>mktime()</code>, <code>strtotime()</code> e <code>DateTime</code>.',
    'Montar um calendário mensal com navegação entre meses.',
    'Gerar a lista de horários de um dia e remover os já ocupados.',
    'Aplicar regras de negócio no servidor: sem passado, sem domingo, sem conflito de horário.'
  ],
  cronograma: [
    ['0:00 – 0:10', 'Revisão: APIs e JSON'],
    ['0:10 – 0:35', 'Datas no PHP: timestamp, date, mktime, strtotime e DateTime'],
    ['0:35 – 0:55', 'Montando o calendário mensal passo a passo'],
    ['0:55 – 1:05', 'Intervalo'],
    ['1:05 – 1:25', 'Horários livres, conflitos e regras de negócio'],
    ['1:25 – 1:55', 'Projeto: Barbearia Navalha de Ouro + desafios'],
    ['1:55 – 2:00', 'Fechamento']
  ],
  secoes: [
    {
      titulo: 'Como o computador enxerga as datas',
      blocos: [
        'Para o computador, uma data é um número: a quantidade de <strong>segundos</strong> passados desde 1º de janeiro de 1970 (meia-noite, horário de Londres). Esse número se chama <strong>timestamp</strong>. Fazer contas com datas fica fácil: um dia a mais são 86.400 segundos a mais.',
        { analogia: 'É como um <strong>cronômetro gigante</strong> que foi ligado em 1970 e nunca parou. Toda data é "o que o cronômetro marcava naquele momento". A função <code>date()</code> é a tradutora que transforma esse número enorme em "13/11/2026 14:07".' },
        { code: `<?php
date_default_timezone_set("America/Sao_Paulo");   // sempre defina o fuso

echo time() . "<br>";                  // timestamp de agora, ex.: 1794590000
echo date("d/m/Y H:i") . "<br>";       // agora, formatado
echo date("d/m/Y", 0) . "<br>";        // o "marco zero": 31/12/1969 no Brasil (fuso -3h)
echo date('l, d \\d\\e F', time());     // em inglês: Friday, 13 de November ("\\" protege letras)
?>`, lang: 'php', run: true },
        { tabela: { cab: ['Letra', 'Resultado', 'Letra', 'Resultado'], linhas: [
          ['<code>d</code>', 'dia 01–31', '<code>j</code>', 'dia 1–31 (sem zero)'],
          ['<code>m</code>', 'mês 01–12', '<code>n</code>', 'mês 1–12 (sem zero)'],
          ['<code>Y</code>', 'ano 2026', '<code>t</code>', 'quantos dias tem o mês'],
          ['<code>w</code>', 'dia da semana 0 (dom) a 6 (sáb)', '<code>N</code>', '1 (seg) a 7 (dom)'],
          ['<code>H:i</code>', 'hora e minuto 14:07', '<code>D</code> / <code>F</code>', 'nome em inglês']
        ] } },
        { dica: 'Os nomes de dias e meses do <code>date()</code> saem em inglês. Para português, a forma mais simples é um array: <code>$meses = [1 =&gt; "janeiro", 2 =&gt; "fevereiro", ...]</code> e usar <code>$meses[date("n")]</code>.' }
      ]
    },
    {
      titulo: 'Criando e calculando datas',
      blocos: [
        { tabela: { cab: ['Função', 'Para que serve', 'Exemplo'], linhas: [
          ['<code>mktime(h, i, s, mês, dia, ano)</code>', 'Cria o timestamp de uma data específica', '<code>mktime(0, 0, 0, 12, 25, 2026)</code> → Natal'],
          ['<code>strtotime("texto")</code>', 'Entende datas escritas em inglês', '<code>strtotime("+7 days")</code>, <code>strtotime("2026-12-25")</code>'],
          ['<code>checkdate(mês, dia, ano)</code>', 'A data existe?', '<code>checkdate(2, 30, 2026)</code> → false'],
          ['<code>new DateTime("2026-12-25")</code>', 'Data como objeto, com métodos úteis', '<code>-&gt;format("d/m/Y")</code>, <code>-&gt;modify("+1 month")</code>']
        ] } },
        { code: `<?php
date_default_timezone_set("America/Sao_Paulo");

// Quantos dias faltam para o Natal?
$natal = mktime(0, 0, 0, 12, 25, date("Y"));
$faltam = ceil(($natal - time()) / 86400);    // 86400 = segundos de um dia
echo "Faltam $faltam dias para o Natal.<br>";

// Daqui a uma semana
echo "Daqui a 7 dias: " . date("d/m/Y", strtotime("+7 days")) . "<br>";

// Truque: mktime corrige datas "impossíveis"
// mês 13 de 2026 = janeiro de 2027
echo date("d/m/Y", mktime(0, 0, 0, 13, 1, 2026)) . "<br>";

// DateTime: o jeito moderno
$consulta = new DateTime("2026-12-01 14:30");
$consulta->modify("+1 month");
echo "Retorno: " . $consulta->format('d/m/Y \\à\\s H:i');
?>`, lang: 'php', run: true },
        { atencao: 'Guarde datas no formato <strong>AAAA-MM-DD</strong> (ex.: 2026-11-20) e mostre ao usuário no formato brasileiro. Nesse formato a ordem alfabética é a mesma da ordem cronológica, então dá para comparar e ordenar como texto: <code>"2026-11-20" &lt; "2026-12-01"</code>.' }
      ]
    },
    {
      titulo: 'Montando um calendário mensal',
      blocos: [
        'Um calendário é uma tabela de 7 colunas. Para desenhá-lo, o PHP precisa de apenas duas informações sobre o mês:',
        { lista: [
          '<strong>Quantos dias</strong> ele tem: <code>date("t", $primeiroDia)</code>.',
          '<strong>Em que dia da semana</strong> ele começa: <code>date("w", $primeiroDia)</code>, de 0 (domingo) a 6 (sábado). Esse número diz quantas casinhas vazias deixar antes do dia 1.'
        ] },
        { analogia: 'Pense numa <strong>cartela de bingo</strong> com 7 colunas (Dom a Sáb). Se o mês começa numa quarta (w = 3), você pula 3 casas e escreve "1" na quarta casa. Depois é só ir preenchendo; a cada 7 casas, a linha quebra sozinha.' },
        { code: `<?php
date_default_timezone_set("America/Sao_Paulo");
$mes = (int) date("n");
$ano = (int) date("Y");

$primeiroDia = mktime(0, 0, 0, $mes, 1, $ano);
$diasNoMes   = (int) date("t", $primeiroDia);   // ex.: 30
$inicio      = (int) date("w", $primeiroDia);   // ex.: 0 = domingo
?>
<style>
  .cal { display: grid; grid-template-columns: repeat(7, 40px); gap: 4px; font-family: sans-serif; }
  .cal div { height: 40px; display: grid; place-items: center; background: #eef; border-radius: 6px; }
  .cal .vazio { background: none; }
</style>
<h3><?= date("m/Y") ?></h3>
<div class="cal">
    <?php foreach (["D", "S", "T", "Q", "Q", "S", "S"] as $letra): ?>
        <b style="text-align:center"><?= $letra ?></b>
    <?php endforeach; ?>

    <?php for ($i = 0; $i < $inicio; $i++): ?>
        <div class="vazio"></div>          <!-- casinhas antes do dia 1 -->
    <?php endfor; ?>

    <?php for ($dia = 1; $dia <= $diasNoMes; $dia++): ?>
        <div><?= $dia ?></div>
    <?php endfor; ?>
</div>`, lang: 'php', run: true },
        'Para navegar entre meses, basta criar links que mandam o mês e o ano pela URL: <code>?mes=12&amp;ano=2026</code>. E não se preocupe com o mês 13 ou 0: o <code>mktime</code> corrige sozinho para o ano seguinte ou anterior.'
      ]
    },
    {
      titulo: 'Horários livres e conflitos',
      blocos: [
        'Num sistema de agendamento, para cada dia geramos todos os horários possíveis e removemos os que já estão ocupados:',
        { code: `<?php
// 1) todos os horários do dia (das 9h às 17h)
$todos = [];
for ($h = 9; $h <= 17; $h++) {
    $todos[] = sprintf("%02d:00", $h);   // sprintf completa com zero: 9 -> "09:00"
}

// 2) horários já ocupados (viriam do arquivo JSON)
$ocupados = ["10:00", "14:00", "15:00"];

// 3) livres = todos que NÃO estão em ocupados
$livres = [];
foreach ($todos as $hora) {
    if (!in_array($hora, $ocupados)) {
        $livres[] = $hora;
    }
}
echo "Livres: " . implode(", ", $livres);
?>`, lang: 'php', run: true },
        { atencao: 'Mesmo que a página mostre só os horários livres, <strong>confira de novo no servidor</strong> na hora de salvar. Duas pessoas podem abrir a página ao mesmo tempo e escolher o mesmo horário; quem enviar por último deve receber "horário já ocupado".' }
      ]
    },
    {
      titulo: 'Regras de negócio',
      blocos: [
        '<strong>Regras de negócio</strong> são as regras do mundo real que o sistema precisa respeitar. Elas variam de empresa para empresa e sempre ficam no servidor:',
        { tabela: { cab: ['Regra', 'Como verificar no PHP'], linhas: [
          ['Não agendar no passado', '<code>$data &lt; date("Y-m-d")</code>'],
          ['Fechado aos domingos', '<code>date("w", strtotime($data)) == 0</code>'],
          ['Data precisa existir', '<code>checkdate($mes, $dia, $ano)</code>'],
          ['Sem dois clientes no mesmo horário', '<code>in_array($horario, $ocupados)</code>'],
          ['Serviço precisa existir', '<code>isset($servicos[$servico])</code>']
        ] } },
        { analogia: 'A recepcionista de um consultório segue regras sem pensar: "domingo não abre", "não marco no horário do almoço", "esse horário já é do seu João". O sistema faz o papel dela e precisa conhecer as mesmas regras.' },
        'Para ordenar uma lista de agendamentos por data e hora, usamos <code>usort</code>, que ordena com base numa comparação que nós definimos:',
        { code: `<?php
$agenda = [
    ["cliente" => "Rui", "data" => "2026-11-21", "horario" => "15:00"],
    ["cliente" => "Léo", "data" => "2026-11-20", "horario" => "10:00"],
    ["cliente" => "Gil", "data" => "2026-11-21", "horario" => "09:00"],
];

// compara "data horario" como texto: funciona porque o formato é AAAA-MM-DD HH:MM
usort($agenda, function ($a, $b) {
    return strcmp($a["data"] . $a["horario"], $b["data"] . $b["horario"]);
});

foreach ($agenda as $item) {
    echo date("d/m", strtotime($item["data"])) . " " . $item["horario"] . " - " . $item["cliente"] . "<br>";
}
?>`, lang: 'php', run: true }
      ]
    }
  ],
  modelo: {
    nome: 'Barbearia Navalha de Ouro',
    descricao: 'Sistema de agendamento: calendário mensal navegável, escolha de horário livre, cadastro do agendamento em JSON e uma agenda do dono da barbearia com opção de cancelar.',
    inicial: 'index.php',
    arquivos: {
      'index.php': `<?php
/* =========================================================
   AULA 09 — BARBEARIA NAVALHA DE OURO
   Calendário mensal: escolha o dia para ver os horários.
   ========================================================= */
require_once "funcoes.php";

// Mês e ano vindos da URL (?mes=11&ano=2026) ou o mês atual
$mes = (int) ($_GET["mes"] ?? date("n"));
$ano = (int) ($_GET["ano"] ?? date("Y"));

// mktime corrige mês 0 ou 13 (vira dezembro/janeiro do ano vizinho)
$primeiroDia = mktime(0, 0, 0, $mes, 1, $ano);
$mes = (int) date("n", $primeiroDia);
$ano = (int) date("Y", $primeiroDia);

$diasNoMes = (int) date("t", $primeiroDia);  // 28 a 31
$inicio    = (int) date("w", $primeiroDia);  // 0 = domingo ... 6 = sábado
$hoje      = date("Y-m-d");

// Quantos agendamentos existem em cada data (para mostrar no calendário)
$porData = [];
foreach (lerAgendamentos() as $a) {
    $porData[$a["data"]] = ($porData[$a["data"]] ?? 0) + 1;
}

$titulo = "Agende seu horário";
include "topo.php";
?>
<main class="conteudo">
    <div class="cabecalho-cal">
        <a class="seta" href="?mes=<?= $mes - 1 ?>&ano=<?= $ano ?>">&larr;</a>
        <h1><?= nomeMes($mes) ?> de <?= $ano ?></h1>
        <a class="seta" href="?mes=<?= $mes + 1 ?>&ano=<?= $ano ?>">&rarr;</a>
    </div>

    <div class="calendario">
        <?php foreach (["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as $nome): ?>
            <div class="semana"><?= $nome ?></div>
        <?php endforeach; ?>

        <!-- casinhas vazias antes do dia 1 -->
        <?php for ($i = 0; $i < $inicio; $i++): ?>
            <div class="dia vazio"></div>
        <?php endfor; ?>

        <?php for ($dia = 1; $dia <= $diasNoMes; $dia++): ?>
            <?php
                $data    = sprintf("%04d-%02d-%02d", $ano, $mes, $dia);  // formato AAAA-MM-DD
                $passado = $data < $hoje;
                $domingo = date("w", strtotime($data)) == 0;
                $total   = $porData[$data] ?? 0;
            ?>
            <?php if ($passado || $domingo): ?>
                <div class="dia fechado"><?= $dia ?></div>
            <?php else: ?>
                <a class="dia <?= $data === $hoje ? "hoje" : "" ?>" href="horarios.php?data=<?= $data ?>">
                    <?= $dia ?>
                    <?php if ($total > 0): ?><small><?= $total ?> agend.</small><?php endif; ?>
                </a>
            <?php endif; ?>
        <?php endfor; ?>
    </div>
    <p class="legenda">Atendemos de segunda a sábado. Dias em cinza não estão disponíveis.</p>
</main>
<?php include "rodape.php"; ?>
`,
      'horarios.php': `<?php
/* =========================================================
   HORÁRIOS DO DIA + FORMULÁRIO DE AGENDAMENTO
   Recebe ?data=AAAA-MM-DD
   ========================================================= */
require_once "funcoes.php";

$data = $_GET["data"] ?? ($_POST["data"] ?? "");

// A data existe e não está no passado? Senão, volta ao calendário.
if (!dataValida($data) || $data < date("Y-m-d") || date("w", strtotime($data)) == 0) {
    header("Location: index.php");
    exit;
}

$todos    = gerarHorarios();          // ["09:00", "10:00", ...]
$ocupados = horariosOcupados($data);  // já agendados neste dia
$erros    = [];
$nome = $telefone = $servico = $horario = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome     = trim($_POST["nome"] ?? "");
    $telefone = trim($_POST["telefone"] ?? "");
    $servico  = $_POST["servico"] ?? "";
    $horario  = $_POST["horario"] ?? "";

    // ---------- REGRAS DE NEGÓCIO (sempre no servidor) ----------
    if ($nome === "")                     $erros[] = "Informe seu nome.";
    if (!isset(SERVICOS[$servico]))       $erros[] = "Escolha um serviço.";
    if (!in_array($horario, $todos))      $erros[] = "Escolha um horário da lista.";
    if (in_array($horario, $ocupados))    $erros[] = "Que pena! Este horário acabou de ser ocupado.";

    if (empty($erros)) {
        $agendamentos = lerAgendamentos();
        $agendamentos[] = [
            "id"       => uniqid(),
            "data"     => $data,
            "horario"  => $horario,
            "nome"     => $nome,
            "telefone" => $telefone,
            "servico"  => $servico,
            "criado"   => date("d/m/Y H:i"),
        ];
        salvarAgendamentos($agendamentos);
        header("Location: horarios.php?data=$data&ok=$horario");  // Post/Redirect/Get
        exit;
    }
}

$titulo = "Horários de " . dataBR($data);
include "topo.php";
?>
<main class="conteudo estreito">
    <a href="index.php?mes=<?= date("n", strtotime($data)) ?>&ano=<?= date("Y", strtotime($data)) ?>">&larr; Voltar ao calendário</a>
    <h1><?= dataBR($data) ?></h1>
    <!-- DESAFIO: mostre o dia da semana por extenso, ex.: "Sexta-feira, 20/11/2026" -->

    <?php if (isset($_GET["ok"])): ?>
        <p class="sucesso">Agendamento confirmado para as <?= e($_GET["ok"]) ?>. Até lá!</p>
    <?php endif; ?>

    <?php foreach ($erros as $erro): ?>
        <p class="erro"><?= $erro ?></p>
    <?php endforeach; ?>

    <form method="post" class="formulario">
        <input type="hidden" name="data" value="<?= $data ?>">

        <fieldset>
            <legend>Escolha o horário</legend>
            <div class="horarios">
                <?php foreach ($todos as $h): ?>
                    <?php if (in_array($h, $ocupados)): ?>
                        <span class="horario ocupado"><?= $h ?></span>
                    <?php else: ?>
                        <label class="horario">
                            <input type="radio" name="horario" value="<?= $h ?>" <?= $horario === $h ? "checked" : "" ?>>
                            <span><?= $h ?></span>
                        </label>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
        </fieldset>

        <label>Serviço
            <select name="servico">
                <?php foreach (SERVICOS as $chave => $s): ?>
                    <option value="<?= $chave ?>" <?= $servico === $chave ? "selected" : "" ?>>
                        <?= $s["nome"] ?> — R$ <?= number_format($s["preco"], 2, ",", ".") ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </label>
        <label>Seu nome <input name="nome" value="<?= e($nome) ?>"></label>
        <label>WhatsApp <input name="telefone" value="<?= e($telefone) ?>"></label>
        <button class="botao">Confirmar agendamento</button>
    </form>
</main>
<?php include "rodape.php"; ?>
`,
      'agenda.php': `<?php
/* =========================================================
   AGENDA DO BARBEIRO: próximos agendamentos + cancelar
   ========================================================= */
require_once "funcoes.php";

$hoje = date("Y-m-d");
$proximos = [];
foreach (lerAgendamentos() as $a) {
    if ($a["data"] >= $hoje) {
        $proximos[] = $a;          // só de hoje em diante
    }
}

// Ordena por data e horário (o formato AAAA-MM-DD HH:MM permite comparar como texto)
usort($proximos, function ($a, $b) {
    return strcmp($a["data"] . $a["horario"], $b["data"] . $b["horario"]);
});

$titulo = "Agenda do barbeiro";
include "topo.php";
?>
<main class="conteudo estreito">
    <h1>Próximos atendimentos</h1>
    <?php if (empty($proximos)): ?>
        <p class="legenda">Nenhum agendamento. Que tal marcar um pelo calendário?</p>
    <?php endif; ?>

    <?php foreach ($proximos as $a): ?>
        <div class="agendamento">
            <div class="quando">
                <strong><?= date("d/m", strtotime($a["data"])) ?></strong>
                <span><?= $a["horario"] ?></span>
            </div>
            <div class="quem">
                <strong><?= e($a["nome"]) ?></strong>
                <span><?= SERVICOS[$a["servico"]]["nome"] ?? $a["servico"] ?> · <?= e($a["telefone"]) ?></span>
            </div>
            <form action="cancelar.php" method="post">
                <input type="hidden" name="id" value="<?= $a["id"] ?>">
                <button class="cancelar">Cancelar</button>
            </form>
        </div>
    <?php endforeach; ?>
</main>
<?php include "rodape.php"; ?>
`,
      'cancelar.php': `<?php
/* Cancela (exclui) um agendamento pelo id — mesma lógica do mural da Aula 06 */
require_once "funcoes.php";

$id = $_POST["id"] ?? "";
$restantes = [];
foreach (lerAgendamentos() as $a) {
    if ($a["id"] !== $id) {
        $restantes[] = $a;
    }
}
salvarAgendamentos($restantes);
header("Location: agenda.php");
exit;
`,
      'funcoes.php': `<?php
/* =========================================================
   FUNÇÕES E CONFIGURAÇÕES DA BARBEARIA
   ========================================================= */
date_default_timezone_set("America/Sao_Paulo");

// Serviços oferecidos (const = valor que não muda)
const SERVICOS = [
    "corte" => ["nome" => "Corte",          "preco" => 45],
    "barba" => ["nome" => "Barba",          "preco" => 35],
    "combo" => ["nome" => "Corte + barba",  "preco" => 70],
];

// Gera os horários de atendimento de um dia
function gerarHorarios() {
    $lista = [];
    for ($h = 9; $h <= 17; $h++) {          // das 9h às 17h (último atendimento)
        // DESAFIO: pule o horário de almoço (12h)
        $lista[] = sprintf("%02d:00", $h);  // 9 -> "09:00"
    }
    return $lista;
}

// --------- Arquivo JSON (mesma ideia da Aula 06) ---------
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

// Horários já ocupados numa data
function horariosOcupados($data) {
    $ocupados = [];
    foreach (lerAgendamentos() as $a) {
        if ($a["data"] === $data) {
            $ocupados[] = $a["horario"];
        }
    }
    return $ocupados;
}

// --------- Datas ---------
function dataValida($data) {
    $p = explode("-", $data);              // "2026-11-20" -> ["2026", "11", "20"]
    return count($p) === 3 && checkdate((int) $p[1], (int) $p[2], (int) $p[0]);
}

function dataBR($data) {
    return date("d/m/Y", strtotime($data));
}

function nomeMes($numero) {
    $meses = [1 => "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
              "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return $meses[$numero];
}

function e($texto) {
    return htmlspecialchars($texto, ENT_QUOTES, "UTF-8");
}
`,
      'topo.php': `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $titulo ?> | Navalha de Ouro</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topo">
    <a class="logo" href="index.php">Navalha <span>de Ouro</span></a>
    <nav><a href="index.php">Agendar</a> <a href="agenda.php">Agenda do barbeiro</a></nav>
</header>
`,
      'rodape.php': `<footer class="rodape">Navalha de Ouro · Seg a Sáb, 9h às 18h · &copy; <?= date("Y") ?></footer>
</body>
</html>
`,
      'style.css': `* { box-sizing: border-box; }
body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; background: #f4f1ec; color: #1f1a17; }
a { color: #8a6d3b; }
.topo { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #1f1a17; }
.logo { color: #fff; font-weight: 800; font-size: 21px; text-decoration: none; letter-spacing: .5px; }
.logo span { color: #d4a85a; }
.topo nav a { color: #e8dccb; margin-left: 16px; text-decoration: none; font-size: 15px; }
.conteudo { max-width: 720px; margin: 0 auto; padding: 28px 16px; }
.estreito { max-width: 560px; }
.cabecalho-cal { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.cabecalho-cal h1 { margin: 0; font-size: 26px; }
.seta { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%; background: #fff; text-decoration: none; font-size: 20px; color: #1f1a17; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
.calendario { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.semana { text-align: center; font-size: 12px; font-weight: 700; color: #8b8178; text-transform: uppercase; padding: 4px 0; }
.dia { min-height: 64px; background: #fff; border-radius: 10px; padding: 8px; text-decoration: none; color: #1f1a17; font-weight: 600; display: flex; flex-direction: column; justify-content: space-between; border: 2px solid transparent; }
a.dia:hover { border-color: #d4a85a; }
.dia small { font-size: 11px; font-weight: 500; color: #8a6d3b; }
.dia.vazio { background: transparent; }
.dia.fechado { background: #e7e1d8; color: #b0a698; }
.dia.hoje { border-color: #1f1a17; }
.legenda { color: #8b8178; font-size: 14px; }
.formulario { display: grid; gap: 14px; margin-top: 12px; }
.formulario label { display: grid; gap: 4px; font-size: 14px; color: #5c534b; font-weight: 600; }
input, select { font: inherit; padding: 10px 12px; border: 1px solid #d9d0c3; border-radius: 8px; background: #fff; }
fieldset { border: 1px solid #d9d0c3; border-radius: 10px; padding: 12px; }
legend { font-weight: 600; color: #5c534b; padding: 0 6px; }
.horarios { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px; }
.horario input { display: none; }
.horario span, .horario.ocupado { display: block; text-align: center; padding: 9px 0; border-radius: 8px; background: #fff; border: 1px solid #d9d0c3; cursor: pointer; font-weight: 600; }
.horario input:checked + span { background: #1f1a17; color: #fff; border-color: #1f1a17; }
.horario.ocupado { background: #eee8df; color: #b0a698; text-decoration: line-through; cursor: not-allowed; }
.botao { background: #d4a85a; color: #1f1a17; border: 0; padding: 12px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; }
.sucesso { background: #e6f4ea; color: #1e6b37; padding: 10px 14px; border-radius: 8px; }
.erro { background: #fbe9e7; color: #a33a2a; padding: 10px 14px; border-radius: 8px; margin: 6px 0; }
.agendamento { display: grid; grid-template-columns: 70px 1fr auto; gap: 14px; align-items: center; background: #fff; padding: 12px 14px; border-radius: 12px; margin-bottom: 10px; }
.quando { text-align: center; border-right: 1px solid #eee5d8; }
.quando strong, .quem strong { display: block; }
.quando span, .quem span { font-size: 13px; color: #8b8178; }
.cancelar { background: none; border: 1px solid #d9b2ab; color: #a33a2a; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
.rodape { text-align: center; color: #8b8178; font-size: 13px; padding: 24px; }
`
    }
  },
  modeloTexto: [
    'Faça alguns agendamentos em dias diferentes e depois abra a <strong>Agenda do barbeiro</strong>. Tente agendar duas vezes o mesmo horário: o horário ocupado aparece riscado. Para "zerar" a barbearia, use <strong>Limpar dados</strong> no console.'
  ],
  desafios: [
    {
      nivel: 'Básico', titulo: 'Dia da semana por extenso',
      texto: 'Na página de horários, troque o título para algo como "Sexta-feira, 20/11/2026". Crie a função <code>diaSemana($data)</code> em <code>funcoes.php</code> usando um array com os nomes em português.',
      solucao: `function diaSemana($data) {
    $nomes = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
              "Quinta-feira", "Sexta-feira", "Sábado"];
    return $nomes[date("w", strtotime($data))];
}
// horarios.php
<h1><?= diaSemana($data) ?>, <?= dataBR($data) ?></h1>`
    },
    {
      nivel: 'Básico', titulo: 'Horário de almoço',
      texto: 'O barbeiro almoça ao meio-dia. Faça a função <code>gerarHorarios()</code> pular o horário das 12:00.',
      solucao: `for ($h = 9; $h <= 17; $h++) {
    if ($h == 12) {
        continue;   // pula para a próxima volta do laço
    }
    $lista[] = sprintf("%02d:00", $h);
}`
    },
    {
      nivel: 'Intermediário', titulo: 'Sábado só até 13h',
      texto: 'Aos sábados a barbearia atende só das 9h às 12h (último atendimento). Altere <code>gerarHorarios()</code> para receber a data como parâmetro e gerar menos horários no sábado. Lembre de atualizar a chamada em <code>horarios.php</code>.',
      solucao: `function gerarHorarios($data) {
    $ultimo = date("w", strtotime($data)) == 6 ? 12 : 17;   // 6 = sábado
    $lista = [];
    for ($h = 9; $h <= $ultimo; $h++) {
        if ($h == 12 && $ultimo != 12) continue;            // almoço nos dias de semana
        $lista[] = sprintf("%02d:00", $h);
    }
    return $lista;
}
// horarios.php
$todos = gerarHorarios($data);`
    },
    {
      nivel: 'Intermediário', titulo: 'Intervalos de 30 minutos',
      texto: 'Gere horários de meia em meia hora (09:00, 09:30, 10:00...). Dica: um laço externo para as horas e outro interno para os minutos 0 e 30.',
      solucao: `for ($h = 9; $h <= 17; $h++) {
    foreach ([0, 30] as $min) {
        $lista[] = sprintf("%02d:%02d", $h, $min);
    }
}`
    },
    {
      nivel: 'Avançado', titulo: 'Horários que já passaram',
      texto: 'Se a data escolhida for <strong>hoje</strong>, os horários que já passaram não podem ser escolhidos: mostre-os como ocupados. E garanta isso também na validação do POST.',
      dica: 'Compare texto com texto: <code>$h &lt;= date("H:i")</code>.',
      solucao: `// depois de calcular $ocupados em horarios.php:
if ($data === date("Y-m-d")) {
    foreach ($todos as $h) {
        if ($h <= date("H:i")) {
            $ocupados[] = $h;   // tratado como indisponível (vale para a tela e para a validação)
        }
    }
}`
    },
    {
      nivel: 'Avançado', titulo: 'Contagem regressiva na agenda',
      texto: 'Na agenda do barbeiro, mostre ao lado de cada agendamento quanto falta: "hoje", "amanhã" ou "em X dias". Use <code>DateTime</code> e o método <code>diff()</code>.',
      solucao: `<?php
$hojeObj = new DateTime(date("Y-m-d"));
$diaObj  = new DateTime($a["data"]);
$dias    = $hojeObj->diff($diaObj)->days;   // diferença em dias
$texto   = match (true) {
    $dias === 0 => "hoje",
    $dias === 1 => "amanhã",
    default     => "em $dias dias",
};
?>
<span><?= $texto ?></span>`
    }
  ],
  revisao: [
    'Timestamp = segundos desde 1970. <code>date("formato", $timestamp)</code> transforma em texto.',
    '<code>mktime</code> cria datas (e corrige mês 13/0); <code>strtotime</code> entende textos como "+7 days" e "2026-12-25".',
    'Guarde datas como AAAA-MM-DD (dá para comparar e ordenar como texto) e mostre como DD/MM/AAAA.',
    'Calendário: <code>date("t")</code> dá os dias do mês e <code>date("w")</code> do dia 1 dá as casas vazias.',
    'Regras de negócio (passado, domingo, conflito) são sempre conferidas no servidor ao salvar.'
  ],
  slides: [
    { capa: true, t: 'Calendário e agenda', b: ['Sistema de agendamento online'], notas: 'Projeto com cara de produto real: muitos pequenos negócios pagam por sistemas assim. Bom gancho de empreendedorismo.' },
    { t: 'Para o computador, data é número', b: [{ code: `echo time();                 // 1794590000
echo date("d/m/Y H:i");      // 13/11/2026 14:07`, lang: 'php' }, { analogia: 'Um cronômetro ligado em 1970 que nunca parou.' }],
      notas: 'Mostre que 1 dia = 86400 segundos. Pergunte quantos segundos tem uma semana.' },
    { t: 'Formatando com date()', b: [{ tabela: { cab: ['Letra', 'Resultado'], linhas: [['d / m / Y', '13 / 11 / 2026'], ['H:i', '14:07'], ['t', 'dias no mês (30)'], ['w', 'dia da semana (0 = dom)']] } }, 'Nomes em português? Use um array.'],
      notas: 'Os alunos sempre perguntam por que sai em inglês. Mostre o array de meses.' },
    { t: 'Criando e calculando datas', b: [{ code: `mktime(0, 0, 0, 12, 25, 2026);      // Natal
strtotime("+7 days");                // daqui a uma semana
checkdate(2, 30, 2026);              // false: não existe

$d = new DateTime("2026-12-01");
$d->modify("+1 month");
echo $d->format("d/m/Y");            // 01/01/2027`, lang: 'php' }],
      notas: 'Mostre o "truque" do mktime com mês 13 virando janeiro do ano seguinte: será usado na navegação do calendário.' },
    { t: 'Guarde AAAA-MM-DD', b: [{ compara: [{ titulo: 'Guardar', lang: 'txt', code: `2026-11-20
2026-12-01
2027-01-05` }, { titulo: 'Mostrar', lang: 'txt', code: `20/11/2026
01/12/2026
05/01/2027` }] }, 'Assim dá para comparar e ordenar como texto.'],
      notas: 'Pergunte: "20/11/2026" < "05/01/2027" como texto? Não! Por isso o formato ISO.' },
    { t: 'O calendário é uma cartela de bingo', b: [{ code: `$diasNoMes = date("t", $primeiroDia);  // 30
$inicio    = date("w", $primeiroDia);  // 3 = quarta

for ($i = 0; $i < $inicio; $i++)   // casas vazias
for ($dia = 1; $dia <= $diasNoMes; $dia++)  // dias`, lang: 'php' }, 'CSS Grid com 7 colunas quebra a linha sozinho.'],
      notas: 'Desenhe no quadro um mês começando na quarta. Mostre que são necessárias 3 casas vazias.' },
    { t: 'Navegando entre meses', b: [{ code: `<a href="?mes=<?= $mes - 1 ?>&ano=<?= $ano ?>">&larr;</a>
<a href="?mes=<?= $mes + 1 ?>&ano=<?= $ano ?>">&rarr;</a>

$primeiroDia = mktime(0, 0, 0, $mes, 1, $ano);  // corrige 0 e 13`, lang: 'php' }],
      notas: 'É a mesma ideia de paginação: o estado vai na URL com GET.' },
    { t: 'Horários livres', b: [{ code: `$todos    = ["09:00", "10:00", "11:00", "14:00"];
$ocupados = ["10:00"];
foreach ($todos as $h) {
    if (!in_array($h, $ocupados)) $livres[] = $h;
}`, lang: 'php' }, { atencao: 'Confira de novo ao salvar: duas pessoas podem escolher o mesmo horário.' }],
      notas: 'Simule com dois alunos abrindo a mesma data em computadores diferentes (no laboratório não dá, pois cada um tem seus dados, mas a discussão vale).' },
    { t: 'Regras de negócio', b: [{ tabela: { cab: ['Regra', 'Verificação'], linhas: [['Não no passado', '$data < date("Y-m-d")'], ['Domingo fechado', 'date("w", ...) == 0'], ['Data existe', 'checkdate()'], ['Sem conflito', 'in_array($h, $ocupados)']] } }],
      notas: 'Peça para os alunos inventarem uma regra nova (ex.: no máximo 2 agendamentos por cliente). Isso alimenta o projeto final.' },
    { t: 'Mão na massa: Navalha de Ouro', b: [{ passos: ['Abra "Aula 09 — Barbearia Navalha de Ouro"', 'Agende, veja a agenda e cancele', 'Dia por extenso e horário de almoço', 'Avançado: sábado reduzido, 30 min, horários passados'] }],
      notas: 'Bom momento para anunciar o projeto final da próxima aula: eles vão escolher um projeto e adicionar recursos.' }
  ]
});
