/* AULA 10 — WhatsApp, chatbot e projeto final */
AULAS.push({
  n: 10,
  titulo: 'WhatsApp e chatbot: atendimento automático e projeto final',
  curto: 'WhatsApp e chatbot',
  resumo: 'Envie pedidos prontos para o WhatsApp, crie um chatbot de atendimento com menu e palavras-chave e entenda como ligá-lo ao WhatsApp de verdade. Fechamento com o projeto final.',
  conteudos: 'Links wa.me, rawurlencode, montagem de mensagens, lógica de chatbot, normalização de texto, conversa na sessão, webhooks e API oficial',
  objetivos: [
    'Criar links do WhatsApp com mensagem pronta usando <code>wa.me</code> e <code>rawurlencode()</code>.',
    'Montar automaticamente a mensagem de um pedido a partir de um formulário.',
    'Programar um chatbot com menu numérico, palavras-chave e resposta padrão.',
    'Normalizar textos (minúsculas, sem acentos) para o bot entender variações.',
    'Explicar o caminho de um chatbot real: webhook, API oficial e token.'
  ],
  cronograma: [
    ['0:00 – 0:10', 'Revisão geral: o que já sabemos fazer com PHP'],
    ['0:10 – 0:30', 'Três níveis de WhatsApp no site; link wa.me e mensagem do pedido'],
    ['0:30 – 0:55', 'Chatbot: menu, palavras-chave, normalização e conversa na sessão'],
    ['0:55 – 1:05', 'Intervalo'],
    ['1:05 – 1:20', 'Do simulador ao WhatsApp real: webhook e API oficial'],
    ['1:20 – 1:50', 'Projeto: Pizzaria Bella Massa + início do projeto final'],
    ['1:50 – 2:00', 'Apresentação dos critérios do projeto final e encerramento']
  ],
  secoes: [
    {
      titulo: 'Três níveis de WhatsApp no site',
      blocos: [
        'O WhatsApp é o principal canal de atendimento de pequenos negócios no Brasil. Um site pode se conectar a ele de três formas, da mais simples à mais completa:',
        { tabela: { cab: ['Nível', 'O que faz', 'Precisa de', 'Custo'], linhas: [
          ['1. Link de conversa', 'Botão que abre o WhatsApp da empresa', 'Só um link <code>wa.me</code>', 'Grátis'],
          ['2. Mensagem pronta', 'O PHP monta o texto (ex.: pedido completo) e o cliente só aperta "enviar"', 'Link <code>wa.me</code> + PHP', 'Grátis'],
          ['3. Chatbot automático', 'Um programa lê e responde mensagens sozinho, 24 horas', 'API oficial (Meta) ou provedor, servidor com HTTPS, token', 'Pode ter custo por conversa']
        ] } },
        'Nesta aula você vai construir os níveis 1 e 2 funcionando de verdade e o "cérebro" do nível 3 (a lógica do chatbot) num simulador. No final, vamos ver o que falta para ligar esse cérebro ao WhatsApp real.'
      ]
    },
    {
      titulo: 'Links wa.me com mensagem pronta',
      blocos: [
        'O formato do link é: <code>https://wa.me/NUMERO?text=MENSAGEM</code>. O número vai com código do país e DDD, só com dígitos (ex.: <code>5511999999999</code>). A mensagem precisa ser <strong>codificada</strong> para URL: espaços, acentos e quebras de linha viram códigos como <code>%20</code> e <code>%0A</code>.',
        { code: `<?php
$numero = "5511999999999";          // 55 (Brasil) + 11 (DDD) + número
$mensagem = "Olá! Vim pelo site e gostaria de um orçamento.";

// rawurlencode transforma espaços e acentos em códigos aceitos na URL
$link = "https://wa.me/$numero?text=" . rawurlencode($mensagem);

echo "<p>$link</p>";
echo "<a href='$link' target='_blank'>Falar no WhatsApp</a>";
?>`, lang: 'php', run: true },
        { analogia: 'Codificar a URL é como <strong>embalar um presente para o correio</strong>: o conteúdo é o mesmo, mas precisa ir num formato que a "transportadora" (a internet) aceite sem estragar nada no caminho.' },
        'O WhatsApp aceita formatação simples no texto: <code>*negrito*</code>, <code>_itálico_</code> e quebras de linha com <code>"\\n"</code> (lembre: só funciona entre <strong>aspas duplas</strong>).',
        { code: `<?php
$pizzas = [
    ["nome" => "Calabresa", "qtd" => 2, "preco" => 52.90],
    ["nome" => "Margherita", "qtd" => 1, "preco" => 49.90],
];

$texto = "*Novo pedido*\\n\\n";
$total = 0;
foreach ($pizzas as $p) {
    $subtotal = $p["qtd"] * $p["preco"];
    $total += $subtotal;
    $texto .= $p["qtd"] . "x " . $p["nome"] . " - R$ " . number_format($subtotal, 2, ",", ".") . "\\n";
}
$texto .= "\\n*Total: R$ " . number_format($total, 2, ",", ".") . "*";

echo "<pre>$texto</pre>";
echo "<a target='_blank' href='https://wa.me/5511999999999?text=" . rawurlencode($texto) . "'>Enviar pedido</a>";
?>`, lang: 'php', run: true },
        { dica: 'O operador <code>.=</code> significa "acrescente no final". <code>$texto .= "abc"</code> é o mesmo que <code>$texto = $texto . "abc"</code>. Perfeito para montar mensagens linha por linha.' }
      ]
    },
    {
      titulo: 'Como pensa um chatbot',
      blocos: [
        'Um chatbot simples não "entende" o idioma como uma pessoa: ele segue <strong>regras</strong>. Recebe um texto, compara com padrões conhecidos e devolve a resposta correspondente.',
        { analogia: 'Lembra do atendimento por telefone que diz "<strong>digite 1</strong> para segunda via, <strong>digite 2</strong> para falar com um atendente"? É um chatbot de menu. Os chatbots de texto fazem o mesmo, mas também reconhecem <strong>palavras-chave</strong>: se a frase tem "cardápio" ou "preço", ele já sabe do que se trata.' },
        { fluxo: [['Mensagem chega', '"Qual o HORÁRIO?"'], ['Normaliza', '"qual o horario?"'], ['Compara regras', 'contém "horario"?'], ['Responde', '"Abrimos às 18h..."']] },
        { code: `<?php
function responder($mensagem) {
    $t = strtolower(trim($mensagem));

    if ($t === "1" || str_contains($t, "cardapio")) {
        return "Nossas pizzas: Calabresa, Margherita, Portuguesa...";
    } elseif ($t === "2" || str_contains($t, "horario")) {
        return "Abrimos todos os dias das 18h às 23h.";
    } else {
        // resposta padrão: sempre tenha uma!
        return "Não entendi. Digite 1 para cardápio ou 2 para horário.";
    }
}

echo responder("1") . "<br>";
echo responder("qual o horario de vocês?") . "<br>";
echo responder("blablabla");
?>`, lang: 'php', run: true },
        { atencao: 'A ordem das regras importa: a primeira que combinar vence. Coloque as regras mais específicas antes das mais genéricas (como saudações).' }
      ]
    },
    {
      titulo: 'Normalizando o texto',
      blocos: [
        'Pessoas escrevem de mil jeitos: "Cardápio", "CARDAPIO", " cardápio ". Antes de comparar, deixamos tudo num formato padrão: <strong>minúsculas, sem acento e sem espaços nas pontas</strong>.',
        { code: `<?php
function normalizar($texto) {
    $texto = mb_strtolower(trim($texto));   // mb_ = funciona com acentos
    $trocas = ["á" => "a", "à" => "a", "ã" => "a", "â" => "a", "é" => "e", "ê" => "e",
               "í" => "i", "ó" => "o", "ô" => "o", "õ" => "o", "ú" => "u", "ç" => "c"];
    return strtr($texto, $trocas);          // troca cada letra acentuada
}

// Verifica se o texto contém QUALQUER palavra de uma lista
function contem($texto, $palavras) {
    foreach ($palavras as $palavra) {
        if (str_contains($texto, $palavra)) {
            return true;
        }
    }
    return false;
}

$msg = normalizar("  Qual o PREÇO da pizza?  ");
echo $msg . "<br>";                                            // qual o preco da pizza?
echo contem($msg, ["preco", "valor", "quanto custa"]) ? "Falar de preços" : "Outro assunto";
?>`, lang: 'php', run: true },
        { compara: [
          { titulo: 'JavaScript', lang: 'js', code: `texto.trim().toLowerCase()
texto.includes("preco")` },
          { titulo: 'PHP', lang: 'php', code: `mb_strtolower(trim($texto))
str_contains($texto, "preco")` }
        ] }
      ]
    },
    {
      titulo: 'Lembrando a conversa com a sessão',
      blocos: [
        'Para mostrar o histórico do chat, guardamos as mensagens num array dentro de <code>$_SESSION</code> (Aula 07). Cada mensagem é uma ficha com quem enviou, o texto e a hora.',
        { code: `<?php
session_start();
$_SESSION["conversa"] = $_SESSION["conversa"] ?? [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $texto = trim($_POST["mensagem"] ?? "");
    $_SESSION["conversa"][] = ["de" => "cliente", "texto" => $texto];
    $_SESSION["conversa"][] = ["de" => "bot", "texto" => "Você disse: " . $texto];
}
?>
<?php foreach ($_SESSION["conversa"] as $m): ?>
    <p><b><?= $m["de"] ?>:</b> <?= htmlspecialchars($m["texto"]) ?></p>
<?php endforeach; ?>
<form method="post"><input name="mensagem" autofocus><button>Enviar</button></form>`, lang: 'php', run: true }
      ]
    },
    {
      titulo: 'Do simulador ao WhatsApp de verdade',
      blocos: [
        'No WhatsApp real, as mensagens não chegam por um formulário: chegam por um <strong>webhook</strong>. Webhook é um endereço do seu site que o WhatsApp "chama" automaticamente toda vez que um cliente manda mensagem.',
        { analogia: 'Uma API comum é você <strong>ligar</strong> para perguntar algo. Um webhook é deixar seu número com alguém e dizer "<strong>me liga quando chegar</strong>". Você não fica perguntando de minuto em minuto; o aviso vem até você.' },
        { fluxo: [['Cliente envia', 'mensagem no WhatsApp'], ['Meta (WhatsApp)', 'POST com JSON para seu webhook.php'], ['Seu PHP', 'responder($texto) — a mesma função!'], ['API da Meta', 'PHP envia a resposta com o token'], ['Cliente recebe', 'resposta do bot']] },
        'A boa notícia: a função <code>responder()</code> que você escreveu hoje é exatamente o "cérebro" que seria usado. Só muda a forma de receber e enviar as mensagens. O arquivo <code>webhook-exemplo.php</code> do projeto mostra como ficaria:',
        { code: `<?php
// 1) A mensagem chega como JSON no corpo da requisição
$entrada = json_decode(file_get_contents("php://input"), true);
$msg = $entrada["entry"][0]["changes"][0]["value"]["messages"][0] ?? null;

$cliente = $msg["from"];                 // número de quem enviou
$texto   = $msg["text"]["body"] ?? "";   // o que a pessoa escreveu

// 2) O cérebro é o mesmo do simulador
$resposta = responder($texto);

// 3) Envia a resposta pela API oficial (cURL), com o token SECRETO no servidor
$ch = curl_init("https://graph.facebook.com/v21.0/SEU_ID/messages");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer SEU_TOKEN", "Content-Type: application/json"],
    CURLOPT_POSTFIELDS => json_encode([
        "messaging_product" => "whatsapp",
        "to" => $cliente,
        "text" => ["body" => $resposta],
    ]),
]);
curl_exec($ch);`, lang: 'php', file: 'webhook-exemplo.php' },
        { tabela: { cab: ['Para colocar no ar você precisa de...', 'Por quê'], linhas: [
          ['Hospedagem com PHP e <strong>HTTPS</strong>', 'O WhatsApp só chama endereços públicos e seguros (não funciona em localhost)'],
          ['Conta no Meta for Developers e um número de telefone para o bot', 'É a "identidade" do seu robô'],
          ['Token de acesso', 'A senha para enviar mensagens: fica só no servidor'],
          ['Alternativas', 'Provedores como Twilio, Z-API ou Evolution API simplificam a configuração (alguns são pagos)']
        ] } },
        { atencao: 'Siga as regras do WhatsApp: o bot só pode iniciar conversas com modelos aprovados, e o cliente precisa ter autorizado o contato. Bots que mandam mensagens em massa são bloqueados.' }
      ]
    },
    {
      titulo: 'Projeto final',
      blocos: [
        'Chegou a hora de juntar tudo. Escolha <strong>um</strong> dos projetos das aulas (ou crie um site novo para um negócio real do seu bairro) e adicione <strong>pelo menos três recursos de aulas diferentes</strong>.',
        { tabela: { cab: ['Recurso', 'Aula de referência'], linhas: [
          ['Conteúdo dinâmico (horário, promoções, saudação)', '01 e 02'],
          ['Listagens geradas por arrays e include de cabeçalho/rodapé', '03'],
          ['Formulário validado com mensagens de erro', '04 e 05'],
          ['Dados salvos em JSON (CRUD)', '06'],
          ['Área restrita com login', '07'],
          ['Integração com API', '08'],
          ['Agenda ou calendário', '09'],
          ['Pedido ou atendimento via WhatsApp / chatbot', '10']
        ] } },
        { h: 'Critérios de avaliação (10 pontos)' },
        { tabela: { cab: ['Critério', 'Pontos', 'O que será observado'], linhas: [
          ['Funcionamento', '3', 'Os três recursos funcionam sem erros no laboratório ou no XAMPP'],
          ['Segurança', '2', 'Validação no servidor, <code>htmlspecialchars</code> nas saídas, senhas com hash (se houver login)'],
          ['Organização e comentários', '2', 'Nomes claros, arquivos separados (funções, dados, include), comentários explicando a lógica'],
          ['Integração dos conteúdos', '2', 'Recursos de pelo menos três aulas diferentes trabalhando juntos'],
          ['Apresentação', '1', 'Explicar em 3 minutos o que o site faz e mostrar um trecho de PHP que você escreveu']
        ] } },
        { passos: [
          'Escolha o projeto e escreva em uma frase o problema que o site resolve.',
          'Liste os três (ou mais) recursos que vai adicionar.',
          'Desenvolva no laboratório, testando a cada passo e salvando com "Baixar .zip".',
          'Revise: comentários, nomes de variáveis e segurança.',
          'Entregue o .zip e apresente para a turma.'
        ] }
      ]
    }
  ],
  modelo: {
    nome: 'Pizzaria Bella Massa',
    descricao: 'Cardápio com formulário de pedido que gera a mensagem completa para o WhatsApp, botão de contato rápido e um chatbot de atendimento com menu e palavras-chave. Inclui um exemplo comentado de webhook para o WhatsApp real.',
    inicial: 'index.php',
    arquivos: {
      'index.php': `<?php
/* =========================================================
   AULA 10 — PIZZARIA BELLA MASSA
   Cardápio + formulário de pedido (envia para pedido.php)
   ========================================================= */
require_once "dados.php";

// NÍVEL 1: link simples de conversa com mensagem pronta
$linkContato = "https://wa.me/" . PIZZARIA["whatsapp"] . "?text=" . rawurlencode("Olá! Vim pelo site da " . PIZZARIA["nome"] . ".");
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= PIZZARIA["nome"] ?> | Pizzaria</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topo">
    <div class="logo"><?= PIZZARIA["nome"] ?></div>
    <p>Pizza artesanal de forno a lenha · <?= PIZZARIA["abre"] ?>h às <?= PIZZARIA["fecha"] ?>h</p>
</header>

<main class="conteudo">
    <!-- NÍVEL 2: o formulário vira uma mensagem completa no pedido.php -->
    <form action="pedido.php" method="post">
        <h2>Monte seu pedido</h2>
        <div class="cardapio">
            <?php foreach (PIZZAS as $chave => $pizza): ?>
                <div class="pizza">
                    <div>
                        <h3><?= $pizza["nome"] ?></h3>
                        <p><?= $pizza["descricao"] ?></p>
                        <strong>R$ <?= moeda($pizza["preco"]) ?></strong>
                    </div>
                    <!-- name="qtd[calabresa]" faz o PHP receber um array: chave => quantidade -->
                    <input type="number" name="qtd[<?= $chave ?>]" value="0" min="0" max="10" aria-label="Quantidade de <?= $pizza["nome"] ?>">
                </div>
            <?php endforeach; ?>
        </div>

        <h2>Entrega</h2>
        <div class="campos">
            <label>Nome <input name="nome"></label>
            <label>Endereço completo <input name="endereco"></label>
            <label>Pagamento
                <select name="pagamento">
                    <option>Pix</option>
                    <option>Cartão na entrega</option>
                    <option>Dinheiro</option>
                </select>
            </label>
        </div>
        <button class="botao">Revisar pedido</button>
    </form>
</main>

<footer class="rodape">
    <?= PIZZARIA["endereco"] ?> ·
    <a href="<?= $linkContato ?>" target="_blank">Fale conosco no WhatsApp</a>
</footer>

<!-- Botão flutuante para o chatbot -->
<a class="flutuante" href="chatbot.php">Atendimento</a>
</body>
</html>
`,
      'pedido.php': `<?php
/* =========================================================
   REVISÃO DO PEDIDO + LINK DO WHATSAPP COM A MENSAGEM PRONTA
   ========================================================= */
require_once "dados.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: index.php");
    exit;
}

$quantidades = $_POST["qtd"] ?? [];          // ex.: ["calabresa" => "2", "margherita" => "0"]
$nome        = trim($_POST["nome"] ?? "");
$endereco    = trim($_POST["endereco"] ?? "");
$pagamento   = $_POST["pagamento"] ?? "Pix";

// Monta a lista de itens escolhidos e o total
$itens = [];
$total = 0;
foreach ($quantidades as $chave => $qtd) {
    $qtd = (int) $qtd;
    if ($qtd > 0 && isset(PIZZAS[$chave])) {      // só pizzas que existem!
        $subtotal = $qtd * PIZZAS[$chave]["preco"];
        $itens[] = ["nome" => PIZZAS[$chave]["nome"], "qtd" => $qtd, "subtotal" => $subtotal];
        $total += $subtotal;
    }
}

// DESAFIO: some a taxa de entrega (PIZZARIA["taxa"]) ao total

// Validação simples
$erro = "";
if (empty($itens)) {
    $erro = "Escolha pelo menos uma pizza.";
} elseif ($nome === "" || $endereco === "") {
    $erro = "Informe seu nome e o endereço de entrega.";
}

// Monta a mensagem do WhatsApp (*texto* = negrito no WhatsApp)
$msg  = "*Novo pedido - " . PIZZARIA["nome"] . "*\\n\\n";
foreach ($itens as $item) {
    $msg .= $item["qtd"] . "x " . $item["nome"] . " - R$ " . moeda($item["subtotal"]) . "\\n";
}
$msg .= "\\n*Total: R$ " . moeda($total) . "*\\n";
$msg .= "Nome: $nome\\n";
$msg .= "Endereço: $endereco\\n";
$msg .= "Pagamento: $pagamento";

$linkWhats = "https://wa.me/" . PIZZARIA["whatsapp"] . "?text=" . rawurlencode($msg);
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
      'chatbot.php': `<?php
/* =========================================================
   SIMULADOR DE CHATBOT (estilo WhatsApp)
   A conversa fica guardada na SESSÃO.
   O "cérebro" do bot está em bot.php -> responder()
   ========================================================= */
session_start();
require_once "bot.php";

// Primeira visita: o bot dá as boas-vindas
if (!isset($_SESSION["conversa"])) {
    $_SESSION["conversa"] = [
        ["de" => "bot", "hora" => date("H:i"),
         "texto" => "Olá! Sou a assistente virtual da *" . PIZZARIA["nome"] . "*.\\n\\n" . menu()],
    ];
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST["recomecar"])) {
        unset($_SESSION["conversa"]);            // apaga o histórico
    } else {
        $texto = trim($_POST["mensagem"] ?? "");
        if ($texto !== "") {
            $_SESSION["conversa"][] = ["de" => "cliente", "texto" => $texto, "hora" => date("H:i")];
            $_SESSION["conversa"][] = ["de" => "bot", "texto" => responder($texto), "hora" => date("H:i")];
        }
    }
    header("Location: chatbot.php");   // Post/Redirect/Get
    exit;
}

// Formata o texto: protege contra XSS, *negrito*, links clicáveis e quebras de linha
function formatar($texto) {
    $t = e($texto);
    $t = preg_replace('/\\*(.+?)\\*/', '<b>$1</b>', $t);
    $t = preg_replace('#(https?://[^\\s<]+)#', '<a href="$1" target="_blank">$1</a>', $t);
    return nl2br($t);
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atendimento | <?= PIZZARIA["nome"] ?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="tela-chat">
<div class="celular">
    <header class="chat-topo">
        <a href="index.php" class="voltar">&larr;</a>
        <div class="avatar">BM</div>
        <div><strong><?= PIZZARIA["nome"] ?></strong><small>assistente virtual · online</small></div>
        <form method="post" class="recomecar"><button name="recomecar" value="1" title="Recomeçar conversa">Limpar</button></form>
    </header>

    <main class="mensagens" id="mensagens">
        <?php foreach ($_SESSION["conversa"] as $m): ?>
            <div class="balao <?= $m["de"] ?>">
                <?= formatar($m["texto"]) ?>
                <span class="hora"><?= $m["hora"] ?></span>
            </div>
        <?php endforeach; ?>
    </main>

    <!-- Respostas rápidas: cada botão envia um número -->
    <form method="post" class="rapidas">
        <button name="mensagem" value="1">Cardápio</button>
        <button name="mensagem" value="2">Horário</button>
        <button name="mensagem" value="3">Entrega</button>
        <button name="mensagem" value="5">Atendente</button>
    </form>

    <form method="post" class="digitar">
        <input name="mensagem" placeholder="Digite uma mensagem" autocomplete="off" autofocus>
        <button>Enviar</button>
    </form>
</div>
<script src="script.js"></script>
</body>
</html>
`,
      'bot.php': `<?php
/* =========================================================
   CÉREBRO DO CHATBOT
   Esta mesma função responder() poderia ser usada no
   WhatsApp de verdade (veja webhook-exemplo.php).
   ========================================================= */
require_once "dados.php";

// Padroniza o texto: minúsculo, sem acento, sem espaços nas pontas
function normalizar($texto) {
    $texto = mb_strtolower(trim($texto));
    $trocas = ["á" => "a", "à" => "a", "ã" => "a", "â" => "a", "é" => "e", "ê" => "e",
               "í" => "i", "ó" => "o", "ô" => "o", "õ" => "o", "ú" => "u", "ç" => "c"];
    return strtr($texto, $trocas);
}

// true se o texto contém QUALQUER uma das palavras
function contem($texto, $palavras) {
    foreach ($palavras as $palavra) {
        if (str_contains($texto, $palavra)) {
            return true;
        }
    }
    return false;
}

function menu() {
    return "Digite o número da opção:\\n"
         . "1 - Cardápio e preços\\n"
         . "2 - Horário de funcionamento\\n"
         . "3 - Entrega e endereço\\n"
         . "4 - Fazer um pedido\\n"
         . "5 - Falar com um atendente";
}

function estaAberto() {
    $hora = (int) date("G");
    return $hora >= PIZZARIA["abre"] && $hora < PIZZARIA["fecha"];
}

// Recebe a mensagem do cliente e devolve a resposta do bot
function responder($mensagem) {
    $t = normalizar($mensagem);

    // 1 - Cardápio
    if ($t === "1" || contem($t, ["cardapio", "sabores", "preco", "valor", "menu"])) {
        $resposta = "*Nosso cardápio:*\\n";
        foreach (PIZZAS as $pizza) {
            $resposta .= "- " . $pizza["nome"] . ": R$ " . moeda($pizza["preco"]) . "\\n";
        }
        return $resposta . "\\nDigite 4 para fazer seu pedido.";
    }

    // 2 - Horário (usa a mesma lógica da Aula 02)
    if ($t === "2" || contem($t, ["horario", "aberto", "abre", "fecha"])) {
        $status = estaAberto() ? "Estamos *abertos* agora!" : "No momento estamos *fechados*.";
        return "Funcionamos todos os dias das " . PIZZARIA["abre"] . "h às " . PIZZARIA["fecha"] . "h.\\n" . $status;
    }

    // 3 - Entrega
    if ($t === "3" || contem($t, ["entrega", "endereco", "taxa", "onde fica"])) {
        return "Entregamos em toda a cidade. Taxa: R$ " . moeda(PIZZARIA["taxa"]) . ".\\n"
             . "Retirada no balcão: " . PIZZARIA["endereco"];
    }

    // 4 - Pedido
    if ($t === "4" || contem($t, ["pedido", "pedir", "quero"])) {
        // DESAFIO: se estiver fechado, avise o horário em vez de mandar o link
        return "Faça seu pedido pelo nosso site, é rapidinho: monte no cardápio e envie direto para o nosso WhatsApp.";
    }

    // 5 - Atendente humano
    if ($t === "5" || contem($t, ["atendente", "humano", "pessoa", "reclamacao"])) {
        $link = "https://wa.me/" . PIZZARIA["whatsapp"] . "?text=" . rawurlencode("Olá! Quero falar com um atendente.");
        return "Claro! Toque no link para falar com nossa equipe:\\n" . $link;
    }

    // Saudações e agradecimentos (regras genéricas ficam por último)
    if (contem($t, ["oi", "ola", "bom dia", "boa tarde", "boa noite"])) {
        return "Olá! Como posso ajudar?\\n\\n" . menu();
    }
    if (contem($t, ["obrigad", "valeu"])) {
        return "Nós que agradecemos! Bom apetite.";
    }

    // Resposta padrão: nunca deixe o cliente sem resposta
    return "Desculpe, não entendi. \\n\\n" . menu();
}
`,
      'dados.php': `<?php
/* =========================================================
   DADOS DA PIZZARIA (const = valores fixos, acessíveis em
   qualquer função sem precisar passar por parâmetro)
   ========================================================= */
date_default_timezone_set("America/Sao_Paulo");

const PIZZARIA = [
    "nome"     => "Bella Massa",
    "whatsapp" => "5511999999999",     // 55 + DDD + número (só dígitos)
    "abre"     => 18,
    "fecha"    => 23,
    "taxa"     => 6.00,
    "endereco" => "Rua das Oliveiras, 250 - Centro",
];

const PIZZAS = [
    "margherita" => ["nome" => "Margherita",          "preco" => 49.90, "descricao" => "Molho de tomate, mussarela e manjericão"],
    "calabresa"  => ["nome" => "Calabresa",           "preco" => 52.90, "descricao" => "Calabresa fatiada e cebola roxa"],
    "frango"     => ["nome" => "Frango com catupiry", "preco" => 56.90, "descricao" => "Frango desfiado e catupiry"],
    "portuguesa" => ["nome" => "Portuguesa",          "preco" => 57.90, "descricao" => "Presunto, ovos, ervilha e azeitona"],
    "quatro"     => ["nome" => "Quatro queijos",      "preco" => 59.90, "descricao" => "Mussarela, provolone, parmesão e gorgonzola"],
    "chocolate"  => ["nome" => "Chocolate (doce)",    "preco" => 45.90, "descricao" => "Chocolate ao leite e granulado"],
];

function moeda($valor) {
    return number_format($valor, 2, ",", ".");
}

function e($texto) {
    return htmlspecialchars($texto, ENT_QUOTES, "UTF-8");
}
`,
      'webhook-exemplo.php': `<?php
/* =========================================================
   EXEMPLO PARA SERVIDOR REAL — WhatsApp Cloud API (Meta)
   NÃO funciona no laboratório: precisa de hospedagem com
   HTTPS, conta no Meta for Developers e um token de acesso.
   Consulte a documentação oficial para a versão atual da API.
   ========================================================= */
require_once "bot.php";

const TOKEN           = "COLOQUE_SEU_TOKEN_AQUI";   // segredo: só no servidor!
const PHONE_NUMBER_ID = "SEU_PHONE_NUMBER_ID";
const VERIFY_TOKEN    = "palavra-secreta-do-webhook";

// 1) VERIFICAÇÃO: ao cadastrar o webhook, a Meta faz um GET de teste.
//    (o PHP troca os pontos de "hub.mode" por "_": hub_mode)
if (($_GET["hub_mode"] ?? "") === "subscribe" && ($_GET["hub_verify_token"] ?? "") === VERIFY_TOKEN) {
    echo $_GET["hub_challenge"] ?? "";
    exit;
}

// 2) MENSAGEM RECEBIDA: chega um JSON no corpo da requisição (POST)
$entrada = json_decode(file_get_contents("php://input"), true);
$mensagem = $entrada["entry"][0]["changes"][0]["value"]["messages"][0] ?? null;

if ($mensagem === null) {
    echo "Webhook do chatbot. Este arquivo é um exemplo para servidor real (veja os comentários).";
    exit;
}

$cliente = $mensagem["from"];                 // número de quem escreveu
$texto   = $mensagem["text"]["body"] ?? "";   // texto da mensagem

// 3) O MESMO cérebro do simulador decide a resposta
$resposta = responder($texto);

// 4) ENVIA a resposta pela API oficial usando cURL
$ch = curl_init("https://graph.facebook.com/v21.0/" . PHONE_NUMBER_ID . "/messages");
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ["Authorization: Bearer " . TOKEN, "Content-Type: application/json"],
    CURLOPT_POSTFIELDS     => json_encode([
        "messaging_product" => "whatsapp",
        "to"   => $cliente,
        "type" => "text",
        "text" => ["body" => $resposta],
    ]),
]);
curl_exec($ch);
curl_close($ch);

http_response_code(200);   // avisa a Meta que recebemos
`,
      'script.js': `// Rola a conversa até a última mensagem quando a página carrega
const caixa = document.getElementById("mensagens");
if (caixa) {
    caixa.scrollTop = caixa.scrollHeight;
}
`,
      'style.css': `* { box-sizing: border-box; }
body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; background: #fbf7f2; color: #2a1d17; }
a { color: #b3261e; }
.topo { background: #b3261e; color: #fff; text-align: center; padding: 30px 16px; }
.logo { font-family: Georgia, serif; font-size: 34px; font-weight: bold; font-style: italic; }
.topo p { margin: 6px 0 0; opacity: .85; }
.conteudo { max-width: 860px; margin: 0 auto; padding: 24px 16px 60px; }
.estreito { max-width: 560px; }
.cardapio { display: grid; gap: 10px; }
.pizza { display: flex; justify-content: space-between; align-items: center; gap: 16px; background: #fff; padding: 14px 16px; border-radius: 12px; box-shadow: 0 1px 6px rgba(0,0,0,.05); }
.pizza h3 { margin: 0; font-size: 17px; }
.pizza p { margin: 2px 0 6px; color: #7a675c; font-size: 14px; }
.pizza strong { color: #b3261e; }
.pizza input { width: 64px; padding: 8px; font-size: 16px; text-align: center; border: 1px solid #e0d4c8; border-radius: 8px; }
.campos { display: grid; gap: 12px; margin-bottom: 18px; }
.campos label { display: grid; gap: 4px; font-size: 14px; font-weight: 600; color: #6b574c; }
.campos input, .campos select { font: inherit; padding: 10px 12px; border: 1px solid #e0d4c8; border-radius: 8px; }
.botao { display: inline-block; background: #b3261e; color: #fff; border: 0; padding: 13px 22px; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer; text-decoration: none; }
.botao.whats { background: #1fa855; }
.resumo { background: #fff; border-radius: 12px; padding: 8px 16px; }
.resumo p { display: flex; justify-content: space-between; border-bottom: 1px dashed #eadfd4; padding: 8px 0; margin: 0; }
.resumo .total { font-weight: 800; border: 0; font-size: 18px; }
.previa { background: #e7f8ec; border-radius: 10px; padding: 14px; white-space: pre-wrap; font-family: inherit; font-size: 14px; }
.erro { background: #fde7e6; color: #a1221b; padding: 10px 14px; border-radius: 8px; }
.rodape { text-align: center; padding: 20px; font-size: 14px; color: #7a675c; }
.flutuante { position: fixed; right: 18px; bottom: 18px; background: #1fa855; color: #fff; padding: 12px 18px; border-radius: 99px; text-decoration: none; font-weight: 700; box-shadow: 0 6px 18px rgba(0,0,0,.2); }

/* ---------- Chat (estilo aplicativo de mensagens) ---------- */
.tela-chat { background: #d9d4cc; min-height: 100vh; display: grid; place-items: center; padding: 12px; }
.celular { width: 100%; max-width: 420px; height: 92vh; max-height: 760px; background: #efe7dd; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,.25); }
.chat-topo { display: flex; align-items: center; gap: 10px; background: #075e54; color: #fff; padding: 10px 12px; }
.chat-topo small { display: block; font-size: 12px; opacity: .8; }
.voltar { color: #fff; text-decoration: none; font-size: 20px; }
.avatar { width: 38px; height: 38px; border-radius: 50%; background: #fff; color: #075e54; display: grid; place-items: center; font-weight: 800; font-size: 14px; }
.recomecar { margin-left: auto; }
.recomecar button { background: rgba(255,255,255,.15); color: #fff; border: 0; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
.mensagens { flex: 1; overflow-y: auto; padding: 14px 12px; display: flex; flex-direction: column; gap: 8px; }
.balao { max-width: 82%; padding: 8px 10px 18px; border-radius: 10px; font-size: 14.5px; line-height: 1.4; position: relative; word-break: break-word; box-shadow: 0 1px 1px rgba(0,0,0,.08); }
.balao.bot { background: #fff; align-self: flex-start; border-top-left-radius: 2px; }
.balao.cliente { background: #d9fdd3; align-self: flex-end; border-top-right-radius: 2px; }
.hora { position: absolute; right: 8px; bottom: 3px; font-size: 10.5px; color: #8a8a8a; }
.rapidas { display: flex; gap: 6px; padding: 6px 10px; overflow-x: auto; }
.rapidas button { background: #fff; border: 1px solid #cfc6b8; color: #075e54; border-radius: 99px; padding: 6px 12px; font-size: 13px; cursor: pointer; white-space: nowrap; }
.digitar { display: flex; gap: 8px; padding: 8px 10px 12px; }
.digitar input { flex: 1; border: 0; border-radius: 99px; padding: 11px 16px; font: inherit; }
.digitar button { background: #075e54; color: #fff; border: 0; border-radius: 99px; padding: 0 16px; cursor: pointer; font-weight: 600; }
`
    }
  },
  modeloTexto: [
    'Faça um pedido completo e confira a mensagem gerada antes de clicar em "Enviar pedido pelo WhatsApp" (o número do modelo é fictício: troque pelo seu em <code>dados.php</code> para testar no celular). Depois converse com o chatbot pelo botão <strong>Atendimento</strong>: teste números, palavras com e sem acento e frases que ele não entende.'
  ],
  desafios: [
    {
      nivel: 'Básico', titulo: 'Taxa de entrega',
      texto: 'Some a taxa de entrega (<code>PIZZARIA["taxa"]</code>) ao total do pedido. Mostre a taxa numa linha separada no resumo e na mensagem do WhatsApp.',
      solucao: `$total += PIZZARIA["taxa"];
// no resumo:
<p>Entrega <span>R$ <?= moeda(PIZZARIA["taxa"]) ?></span></p>
// na mensagem (antes do total):
$msg .= "Entrega - R$ " . moeda(PIZZARIA["taxa"]) . "\\n";`
    },
    {
      nivel: 'Básico', titulo: 'Nova opção no bot: promoções',
      texto: 'Adicione a opção "6 - Promoções do dia" no menu e uma regra em <code>responder()</code> que responda ao número 6 e às palavras "promocao" e "desconto". Bônus: promoção diferente conforme o dia da semana (Aula 02).',
      solucao: `// em menu():  . "\\n6 - Promoções do dia"
if ($t === "6" || contem($t, ["promocao", "desconto", "oferta"])) {
    return match ((int) date("N")) {
        2 => "Terça em dobro: segunda pizza com 50% de desconto!",
        4 => "Quinta doce: pizza de chocolate por R$ 35,00.",
        default => "Hoje: refrigerante 2L grátis em pedidos acima de R$ 100.",
    };
}`
    },
    {
      nivel: 'Intermediário', titulo: 'Troco para quanto?',
      texto: 'Quando o pagamento for "Dinheiro", o cliente deve informar "Troco para quanto?". Valide no servidor (o valor deve ser maior que o total) e inclua na mensagem: "Troco para R$ 100,00 (troco: R$ 47,10)".',
      solucao: `<!-- index.php -->
<label>Troco para (se pagar em dinheiro) <input name="troco" placeholder="Ex.: 100"></label>

<?php // pedido.php
$troco = (float) str_replace(",", ".", $_POST["troco"] ?? "0");
if ($pagamento === "Dinheiro") {
    if ($troco < $total) {
        $erro = "O valor para troco precisa ser maior que o total.";
    } else {
        $msg .= "\\nTroco para R$ " . moeda($troco) . " (troco: R$ " . moeda($troco - $total) . ")";
    }
}`
    },
    {
      nivel: 'Intermediário', titulo: 'Bot que sabe se está aberto',
      texto: 'Na opção 4 (pedido), se a pizzaria estiver fechada, o bot deve responder "Estamos fechados agora. Abrimos às 18h!" em vez de convidar para o pedido. Teste alterando temporariamente os horários em <code>dados.php</code>.',
      solucao: `if ($t === "4" || contem($t, ["pedido", "pedir", "quero"])) {
    if (!estaAberto()) {
        return "Estamos fechados agora. Abrimos às " . PIZZARIA["abre"] . "h!";
    }
    return "Faça seu pedido pelo nosso site...";
}`
    },
    {
      nivel: 'Avançado', titulo: 'Histórico de pedidos (Aula 06)',
      texto: 'Antes de mostrar o link do WhatsApp, salve cada pedido válido em <code>dados/pedidos.json</code> (com data, nome, itens e total). Crie <code>pedidos.php</code> para a pizzaria ver os pedidos do dia e o faturamento total. Bônus: proteja a página com login (Aula 07).',
      solucaoArquivo: 'pedidos.php',
      solucao: `<?php // no pedido.php, se não houver $erro:
$lista = file_exists("dados/pedidos.json") ? json_decode(file_get_contents("dados/pedidos.json"), true) : [];
$lista[] = ["data" => date("Y-m-d H:i"), "nome" => $nome, "itens" => $itens, "total" => $total];
if (!is_dir("dados")) mkdir("dados");
file_put_contents("dados/pedidos.json", json_encode($lista, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// pedidos.php
require_once "dados.php";
$lista = file_exists("dados/pedidos.json") ? json_decode(file_get_contents("dados/pedidos.json"), true) : [];
$hoje = date("Y-m-d");
$faturamento = 0;
foreach ($lista as $p) {
    if (str_starts_with($p["data"], $hoje)) {
        echo "<p>" . substr($p["data"], 11) . " - " . e($p["nome"]) . " - R$ " . moeda($p["total"]) . "</p>";
        $faturamento += $p["total"];
    }
}
echo "<h3>Faturamento de hoje: R$ " . moeda($faturamento) . "</h3>";`
    },
    {
      nivel: 'Avançado', titulo: 'Bot que entende quantidades',
      texto: 'Faça o bot entender frases como "quero 2 calabresa" ou "3 margherita": ele deve responder "2x Calabresa = R$ 105,80". Use <code>preg_match</code> para encontrar o número e percorra <code>PIZZAS</code> procurando o nome da pizza no texto. Coloque essa regra <strong>antes</strong> da regra do pedido.',
      dica: '<code>preg_match(\'/(\\d+)/\', $t, $achou)</code> guarda o primeiro número encontrado em <code>$achou[1]</code>.',
      solucao: `if (preg_match('/(\\d+)/', $t, $achou)) {
    $qtd = (int) $achou[1];
    foreach (PIZZAS as $chave => $pizza) {
        if (str_contains($t, normalizar($pizza["nome"])) || str_contains($t, $chave)) {
            return $qtd . "x " . $pizza["nome"] . " = R$ " . moeda($qtd * $pizza["preco"])
                 . "\\nPara finalizar, faça o pedido pelo site.";
        }
    }
}`
    }
  ],
  revisao: [
    'Link de conversa: <code>https://wa.me/55DDDNUMERO?text=</code> + <code>rawurlencode($mensagem)</code>.',
    'Monte mensagens com <code>.=</code> e <code>"\\n"</code>; no WhatsApp, <code>*texto*</code> fica em negrito.',
    'Chatbot por regras: normalizar → comparar (menu numérico e palavras-chave) → responder; sempre com resposta padrão.',
    'A conversa pode ser guardada em <code>$_SESSION</code>; o texto do usuário sempre passa por <code>htmlspecialchars</code>.',
    'WhatsApp real: webhook recebe o JSON, a mesma <code>responder()</code> decide e a API oficial envia (token só no servidor).'
  ],
  slides: [
    { capa: true, t: 'WhatsApp e chatbot', b: ['Atendimento automático e projeto final'], notas: 'Última aula: feche o ciclo mostrando como tudo o que aprenderam se junta num produto que qualquer pizzaria do bairro usaria.' },
    { t: 'Três níveis de WhatsApp', b: [{ tabela: { cab: ['Nível', 'O que faz', 'Custo'], linhas: [['1. Link wa.me', 'abre a conversa', 'grátis'], ['2. Mensagem pronta', 'PHP monta o pedido', 'grátis'], ['3. Chatbot', 'responde sozinho', 'API oficial']] } }],
      notas: 'Pergunte quem já pediu comida pelo WhatsApp e como foi o atendimento. Muitas pizzarias fazem tudo manualmente.' },
    { t: 'Link com mensagem pronta', b: [{ code: `$numero = "5511999999999";
$texto  = "Olá! Vim pelo site.";
$link   = "https://wa.me/$numero?text=" . rawurlencode($texto);`, lang: 'php' }, { analogia: 'rawurlencode = embalar o presente para o correio.' }],
      notas: 'Teste com o número de um voluntário (ou o seu) no celular. Abrir o WhatsApp com a mensagem pronta impressiona.' },
    { t: 'O pedido vira mensagem', b: [{ code: `$msg = "*Novo pedido*\\n\\n";
foreach ($itens as $i) {
    $msg .= $i["qtd"] . "x " . $i["nome"] . "\\n";
}
$msg .= "\\n*Total: R$ " . moeda($total) . "*";`, lang: 'php' }, '<code>.=</code> acrescenta; <code>*texto*</code> = negrito no WhatsApp.'],
      notas: 'Reforce que "\\n" só funciona entre aspas duplas. É um erro comum.' },
    { t: 'Como pensa um chatbot', b: [{ fluxo: [['Recebe', '"Qual o HORÁRIO?"'], ['Normaliza', '"qual o horario?"'], ['Compara', 'contém "horario"'], ['Responde', '"18h às 23h"']] }, { analogia: 'Atendimento telefônico: "digite 1 para..."' }],
      notas: 'Diferencie chatbot por regras (hoje) de chatbots com inteligência artificial. A lógica de regras continua muito usada por ser previsível e barata.' },
    { t: 'Normalizar o texto', b: [{ code: `function normalizar($t) {
    $t = mb_strtolower(trim($t));
    return strtr($t, ["á" => "a", "ã" => "a", "ç" => "c", ...]);
}
normalizar("  CARDÁPIO ");   // "cardapio"`, lang: 'php' }],
      notas: 'Peça que os alunos digitem variações no chatbot e observem o que funciona e o que não funciona.' },
    { t: 'As regras do bot', b: [{ code: `if ($t === "1" || contem($t, ["cardapio", "preco"])) {
    return "Nosso cardápio: ...";
}
if ($t === "2" || contem($t, ["horario", "abre"])) {
    return "Das 18h às 23h";
}
return "Não entendi.\\n" . menu();   // resposta padrão`, lang: 'php' }, { atencao: 'A primeira regra que combina vence: específicas antes de genéricas.' }],
      notas: 'Mostre o problema de colocar a regra "oi" primeiro: "boa noite" contém "oi"... e "noite" também. Discussão ótima sobre limites de regras.' },
    { t: 'Webhook: "me liga quando chegar"', b: [{ fluxo: [['Cliente', 'manda mensagem'], ['Meta', 'POST JSON → webhook.php'], ['PHP', 'responder($texto)'], ['API', 'envia com token']] }, 'A função <code>responder()</code> é a mesma do simulador.'],
      notas: 'Mostre o webhook-exemplo.php. Explique HTTPS, token secreto e as regras de uso do WhatsApp (sem spam).' },
    { t: 'Projeto final', b: [{ lista: ['Escolha um projeto das aulas (ou um negócio real)', 'Adicione <strong>3 recursos</strong> de aulas diferentes', 'Formulário validado, JSON, login, API, agenda, WhatsApp...'] }, { tabela: { cab: ['Critério', 'Pts'], linhas: [['Funcionamento', '3'], ['Segurança', '2'], ['Organização e comentários', '2'], ['Integração', '2'], ['Apresentação', '1']] } }],
      notas: 'Defina a data de entrega. Sugestão: uma aula extra ou tempo de casa, com apresentação de 3 minutos por aluno ou dupla.' },
    { t: 'Mão na massa: Bella Massa', b: [{ passos: ['Abra "Aula 10 — Pizzaria Bella Massa"', 'Faça um pedido e converse com o bot', 'Taxa de entrega e opção de promoções', 'Avançado: histórico de pedidos e bot com quantidades'] }, 'Depois: comece o seu projeto final.'],
      notas: 'Encerramento: relembre a jornada — do echo da Aula 01 ao chatbot. Parabenize a turma e indique próximos passos: banco de dados MySQL, frameworks (Laravel) e hospedagem.' }
  ]
});
