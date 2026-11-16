/* AULA 08 — Consumindo APIs */
AULAS.push({
  n: 8,
  titulo: 'Integração com APIs: dados ao vivo no seu site',
  curto: 'APIs',
  resumo: 'Conecte o site a serviços externos: endereço pelo CEP, cotação do dólar e do euro e previsão do tempo, tudo em tempo real.',
  conteudos: 'O que é API, JSON aninhado, file_get_contents com URL, json_decode, urlencode, tratamento de falhas, match(true)',
  objetivos: [
    'Explicar o que é uma API e por que os sites usam APIs.',
    'Buscar dados de uma API com <code>file_get_contents()</code> e convertê-los com <code>json_decode()</code>.',
    'Navegar em respostas JSON com vários níveis (arrays dentro de arrays).',
    'Montar URLs com dados do usuário de forma segura e validar antes de chamar a API.',
    'Tratar falhas: API fora do ar, CEP inexistente, resposta vazia.'
  ],
  cronograma: [
    ['0:00 – 0:10', 'Revisão: sessões e login'],
    ['0:10 – 0:30', 'O que é API? Analogia do balcão de informações e APIs públicas brasileiras'],
    ['0:30 – 0:55', 'ViaCEP passo a passo: URL → JSON → array → página'],
    ['0:55 – 1:05', 'Intervalo'],
    ['1:05 – 1:25', 'Explorando respostas com print_r; tratando falhas; chaves de API'],
    ['1:25 – 1:55', 'Projeto: Agência Rota Certa + desafios'],
    ['1:55 – 2:00', 'Fechamento']
  ],
  secoes: [
    {
      titulo: 'O que é uma API?',
      blocos: [
        '<strong>API</strong> (Interface de Programação de Aplicações) é uma "porta de serviço" que um sistema oferece para outros sistemas conversarem com ele. Em vez de uma página bonita para pessoas, a API devolve <strong>dados puros</strong>, geralmente em JSON, para programas.',
        { analogia: 'Pense no <strong>balcão de informações de um aeroporto</strong>. Você não entra na sala de controle para descobrir o horário do voo: você faz uma pergunta no formato certo ("Voo 1234?") e recebe a resposta pronta. A API é o balcão: você não precisa saber como o sistema funciona por dentro, só como perguntar.' },
        'Exemplos que você usa sem perceber: o site da loja que preenche o endereço quando você digita o CEP, o app que mostra a previsão do tempo, o botão "Entrar com Google", o mapa dentro do site de um restaurante.',
        { tabela: { cab: ['API gratuita', 'O que fornece', 'Exemplo de endereço'], linhas: [
          ['ViaCEP', 'Endereço a partir do CEP', '<code>viacep.com.br/ws/01001000/json/</code>'],
          ['AwesomeAPI', 'Cotação de moedas', '<code>economia.awesomeapi.com.br/json/last/USD-BRL</code>'],
          ['Open-Meteo', 'Clima e previsão do tempo', '<code>api.open-meteo.com/v1/forecast?latitude=...</code>'],
          ['BrasilAPI', 'Feriados, bancos, CNPJ, DDD', '<code>brasilapi.com.br/api/feriados/v1/2026</code>']
        ] } },
        { dica: 'Cole um desses endereços (com <code>https://</code>) no navegador: você verá o JSON cru, exatamente o que o PHP vai receber.' }
      ]
    },
    {
      titulo: 'Buscando dados: file_get_contents + json_decode',
      blocos: [
        'Você já usou <code>file_get_contents()</code> para ler arquivos. A mesma função aceita um <strong>endereço da internet</strong>: o PHP faz a requisição e devolve a resposta como texto. Aí é só converter o JSON em array.',
        { fluxo: [['1. Montar a URL', 'com o CEP digitado'], ['2. file_get_contents', 'texto JSON'], ['3. json_decode', 'array PHP'], ['4. Usar', '$dados["localidade"]']] },
        { code: `<?php
$cep = "01001000";

// 1) monta a URL   2) busca   3) converte
$url  = "https://viacep.com.br/ws/$cep/json/";
$json = file_get_contents($url);
$dados = json_decode($json, true);

// 4) usa como um array comum
echo "Rua: " . $dados["logradouro"] . "<br>";
echo "Bairro: " . $dados["bairro"] . "<br>";
echo "Cidade: " . $dados["localidade"] . " - " . $dados["uf"];
?>`, lang: 'php', run: true },
        { compara: [
          { titulo: 'JavaScript (navegador)', lang: 'js', code: `fetch("https://viacep.com.br/ws/01001000/json/")
    .then(resposta => resposta.json())
    .then(dados => {
        console.log(dados.localidade);
    });` },
          { titulo: 'PHP (servidor)', lang: 'php', code: `<?php
$json = file_get_contents("https://viacep.com.br/ws/01001000/json/");
$dados = json_decode($json, true);
echo $dados["localidade"];` }
        ] },
        'Repare na diferença: no JavaScript a resposta chega "depois" (por isso o <code>.then</code>). No PHP, a linha <code>file_get_contents</code> <strong>espera</strong> a resposta antes de continuar. É mais simples de ler.',
        { nota: 'No laboratório, quando o PHP chama uma URL, o próprio navegador busca o dado e entrega ao PHP. O console mostra cada chamada com a origem <strong>API</strong>. Em servidores reais isso é feito pelo próprio PHP (às vezes com a extensão cURL).', rotulo: 'No laboratório' }
      ]
    },
    {
      titulo: 'Explorando respostas com vários níveis',
      blocos: [
        'Muitas APIs devolvem JSON com "caixas dentro de caixas". Antes de usar, <strong>explore</strong> a resposta com <code>print_r</code> para descobrir o caminho até o dado que você quer.',
        { code: `<?php
$json = file_get_contents("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL");
$moedas = json_decode($json, true);

// 1º passo: espiar a estrutura
echo "<pre>";
print_r($moedas);
echo "</pre>";

// 2º passo: seguir o caminho  [USDBRL] -> [bid]
$dolar = (float) $moedas["USDBRL"]["bid"];
echo "Dólar hoje: R$ " . number_format($dolar, 2, ",", ".");
?>`, lang: 'php', run: true },
        { analogia: 'É como um <strong>endereço postal</strong>: país → estado → cidade → rua → número. No JSON: <code>$moedas["USDBRL"]["bid"]</code> é "na caixa USDBRL, pegue o campo bid".' },
        { code: `<?php
// Clima atual no Rio de Janeiro (latitude e longitude)
$url = "https://api.open-meteo.com/v1/forecast?latitude=-22.91&longitude=-43.17"
     . "&current=temperature_2m,relative_humidity_2m&timezone=America%2FSao_Paulo";
$clima = json_decode(file_get_contents($url), true);

$temp = $clima["current"]["temperature_2m"];
$umidade = $clima["current"]["relative_humidity_2m"];
echo "Rio de Janeiro agora: {$temp} °C, umidade de {$umidade}%";
?>`, lang: 'php', run: true }
      ]
    },
    {
      titulo: 'Dados do usuário na URL: valide antes',
      blocos: [
        'Quando a URL é montada com algo que o usuário digitou, valide primeiro. Além de evitar chamadas inúteis, você impede que alguém "monte" endereços estranhos.',
        { code: `<?php
$cepDigitado = $_GET["cep"] ?? "01001-000";

// Mantém só os números e confere se são 8
$cep = preg_replace('/\\D/', '', $cepDigitado);

if (strlen($cep) !== 8) {
    echo "CEP inválido: precisa ter 8 números.";
} else {
    $dados = json_decode(file_get_contents("https://viacep.com.br/ws/$cep/json/"), true);

    // A ViaCEP responde {"erro": true} quando o CEP não existe
    if (!$dados || isset($dados["erro"])) {
        echo "CEP não encontrado.";
    } else {
        echo "Encontrado: " . $dados["logradouro"] . ", " . $dados["localidade"];
    }
}
?>`, lang: 'php', run: true },
        { dica: 'Para textos com espaços e acentos na URL (nome de cidade, por exemplo), use <code>urlencode($texto)</code>: "São Paulo" vira <code>S%C3%A3o+Paulo</code>, um formato que a URL aceita.' }
      ]
    },
    {
      titulo: 'Quando a API falha',
      blocos: [
        'APIs são serviços de terceiros: podem ficar fora do ar, demorar ou mudar. Um site profissional <strong>não quebra</strong> por causa disso; ele mostra uma mensagem amigável e segue funcionando.',
        { code: `<?php
// Função reutilizável: devolve o array ou null se algo der errado
function buscarJson($url) {
    $json = @file_get_contents($url);   // @ = não mostrar o aviso padrão
    if ($json === false) {
        return null;                    // sem resposta (fora do ar / sem internet)
    }
    return json_decode($json, true);    // pode ser null se o texto não for JSON
}

$dados = buscarJson("https://api-que-nao-existe.exemplo/dados");
if ($dados === null) {
    echo "Serviço indisponível no momento. Tente mais tarde.";
}
?>`, lang: 'php', run: true },
        { analogia: 'É o <strong>plano B</strong> de um evento ao ar livre: se chover, ninguém cancela a festa; leva-se tudo para o salão coberto. Se a API falhar, o site mostra um aviso e o resto da página continua.' }
      ]
    },
    {
      titulo: 'Chaves de API e segurança',
      blocos: [
        'Muitas APIs (mapas, pagamentos, WhatsApp, inteligência artificial) exigem uma <strong>chave</strong> (<em>API key</em>), que funciona como uma senha da sua conta naquele serviço, e às vezes é cobrada por uso.',
        { tabela: { cab: ['Chamar a API pelo...', 'A chave fica...', 'Risco'], linhas: [
          ['JavaScript (navegador)', 'Visível no código da página', 'Qualquer um copia e usa na sua conta'],
          ['PHP (servidor)', 'Escondida no servidor', 'Seguro: o visitante só vê o resultado']
        ] } },
        { atencao: 'Nunca coloque chaves secretas em arquivos <code>.js</code> nem envie para repositórios públicos do GitHub. Em projetos reais elas ficam num arquivo de configuração fora da pasta pública ou em variáveis de ambiente.' }
      ]
    }
  ],
  modelo: {
    nome: 'Agência de Viagens Rota Certa',
    descricao: 'Site de uma agência de viagens que usa três APIs: cotação de moedas (preços convertidos para reais), clima atual de cada destino e preenchimento de endereço pelo CEP no cadastro.',
    inicial: 'index.php',
    arquivos: {
      'index.php': `<?php
/* =========================================================
   AULA 08 — AGÊNCIA ROTA CERTA
   Preços em dólar/euro convertidos com cotação AO VIVO.
   ========================================================= */
require_once "api.php";       // funções que conversam com as APIs
require_once "destinos.php";  // lista de destinos

// Uma única chamada traz dólar e euro
$cotacoes = buscarCotacoes();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rota Certa | Viagens</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topo">
    <a class="logo" href="index.php">Rota<span>Certa</span></a>
    <nav><a href="index.php">Destinos</a> <a href="cadastro.php">Cadastro</a></nav>
</header>

<div class="faixa-cotacao">
    <?php if ($cotacoes): ?>
        Dólar hoje: <strong>R$ <?= numero($cotacoes["USD"]) ?></strong>
        <!-- DESAFIO: mostre também o euro -->
    <?php else: ?>
        Cotação indisponível no momento.
    <?php endif; ?>
</div>

<main class="conteudo">
    <h1>Para onde vamos?</h1>
    <div class="grade">
        <?php foreach ($destinos as $id => $d): ?>
            <a class="destino" href="destino.php?id=<?= $id ?>">
                <div class="capa" style="background: <?= $d["cor"] ?>"><?= $d["pais"] ?></div>
                <h2><?= $d["cidade"] ?></h2>
                <p class="original"><?= $d["moeda"] ?> <?= numero($d["preco"]) ?> por pessoa</p>
                <?php $emReais = converterParaReais($d["preco"], $d["moeda"], $cotacoes); ?>
                <?php if ($emReais !== null): ?>
                    <p class="preco">R$ <?= numero($emReais) ?></p>
                <?php endif; ?>
            </a>
        <?php endforeach; ?>
    </div>
</main>
<footer class="rodape">Cotações: AwesomeAPI · Clima: Open-Meteo · CEP: ViaCEP</footer>
</body>
</html>
`,
      'destino.php': `<?php
/* =========================================================
   DETALHES DO DESTINO + CLIMA AGORA (Open-Meteo)
   Recebe ?id=... pela URL
   ========================================================= */
require_once "api.php";
require_once "destinos.php";

$id = $_GET["id"] ?? "";

// id inválido? volta para a lista
if (!isset($destinos[$id])) {
    header("Location: index.php");
    exit;
}

$d = $destinos[$id];
$clima = buscarClima($d["lat"], $d["lon"]);
$cotacoes = buscarCotacoes();
$emReais = converterParaReais($d["preco"], $d["moeda"], $cotacoes);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $d["cidade"] ?> | Rota Certa</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topo">
    <a class="logo" href="index.php">Rota<span>Certa</span></a>
    <nav><a href="index.php">Destinos</a> <a href="cadastro.php">Cadastro</a></nav>
</header>
<main class="conteudo estreito">
    <a href="index.php">&larr; Todos os destinos</a>
    <h1><?= $d["cidade"] ?> <small><?= $d["pais"] ?></small></h1>
    <p><?= $d["descricao"] ?></p>

    <section class="painel">
        <h2>Clima agora</h2>
        <?php if ($clima): ?>
            <p class="temperatura"><?= round($clima["temperature_2m"]) ?> °C</p>
            <p><?= descricaoClima($clima["weather_code"]) ?></p>
            <!-- DESAFIO: mostre umidade (relative_humidity_2m) e vento (wind_speed_10m) -->
        <?php else: ?>
            <p>Não foi possível consultar o clima agora.</p>
        <?php endif; ?>
    </section>

    <section class="painel">
        <h2>Pacote</h2>
        <p><?= $d["moeda"] ?> <?= numero($d["preco"]) ?> por pessoa
            <?php if ($emReais !== null): ?>· aproximadamente <strong>R$ <?= numero($emReais) ?></strong><?php endif; ?>
        </p>
        <a class="botao" href="cadastro.php?destino=<?= $id ?>">Quero este pacote</a>
    </section>
</main>
</body>
</html>
`,
      'cadastro.php': `<?php
/* =========================================================
   CADASTRO DO CLIENTE COM BUSCA DE CEP (ViaCEP)
   Botão "Buscar CEP" -> GET com ?cep=...  (preenche o endereço)
   ========================================================= */
require_once "api.php";

$cep = $_GET["cep"] ?? "";
$endereco = ["logradouro" => "", "bairro" => "", "localidade" => "", "uf" => ""];
$mensagem = "";

if ($cep !== "") {
    // DESAFIO: valide o CEP (8 números) ANTES de chamar a API
    $resposta = buscarJson("https://viacep.com.br/ws/$cep/json/");

    if ($resposta && !isset($resposta["erro"])) {
        $endereco = $resposta;
        $mensagem = "Endereço encontrado! Confira e complete o número.";
    } else {
        $mensagem = "Não encontramos este CEP.";
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro | Rota Certa</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topo">
    <a class="logo" href="index.php">Rota<span>Certa</span></a>
    <nav><a href="index.php">Destinos</a> <a href="cadastro.php">Cadastro</a></nav>
</header>
<main class="conteudo estreito">
    <h1>Cadastro do viajante</h1>

    <!-- Formulário 1: só para buscar o CEP (GET) -->
    <form method="get" class="linha-cep">
        <input type="text" name="cep" placeholder="Digite seu CEP" value="<?= htmlspecialchars($cep) ?>">
        <button class="botao">Buscar CEP</button>
    </form>
    <?php if ($mensagem): ?><p class="aviso"><?= $mensagem ?></p><?php endif; ?>

    <!-- Formulário 2: dados completos (os campos vêm preenchidos pela API) -->
    <form method="post" class="formulario">
        <label>Nome <input name="nome"></label>
        <label>Rua <input name="rua" value="<?= htmlspecialchars($endereco["logradouro"]) ?>"></label>
        <label>Número <input name="numero"></label>
        <label>Bairro <input name="bairro" value="<?= htmlspecialchars($endereco["bairro"]) ?>"></label>
        <label>Cidade <input name="cidade" value="<?= htmlspecialchars($endereco["localidade"]) ?>"></label>
        <label>UF <input name="uf" maxlength="2" value="<?= htmlspecialchars($endereco["uf"]) ?>"></label>
        <button class="botao">Finalizar cadastro</button>
    </form>
</main>
</body>
</html>
`,
      'api.php': `<?php
/* =========================================================
   FUNÇÕES DE INTEGRAÇÃO COM APIs
   Toda conversa com serviços externos fica aqui.
   ========================================================= */

// Busca uma URL e devolve o JSON como array (ou null se falhar)
function buscarJson($url) {
    $json = @file_get_contents($url);
    if ($json === false) {
        return null;
    }
    return json_decode($json, true);
}

// Cotação do dólar e do euro em reais (AwesomeAPI)
function buscarCotacoes() {
    $dados = buscarJson("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL");
    if (!$dados || !isset($dados["USDBRL"])) {
        return null;
    }
    return [
        "USD" => (float) $dados["USDBRL"]["bid"],   // "bid" = valor de compra
        "EUR" => (float) $dados["EURBRL"]["bid"],
        "BRL" => 1.0,
    ];
}

// Converte um valor para reais usando as cotações
function converterParaReais($valor, $moeda, $cotacoes) {
    if (!$cotacoes || !isset($cotacoes[$moeda])) {
        return null;
    }
    return $valor * $cotacoes[$moeda];
}

// Clima atual numa latitude/longitude (Open-Meteo)
function buscarClima($lat, $lon) {
    $url = "https://api.open-meteo.com/v1/forecast?latitude=$lat&longitude=$lon"
         . "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto";
    $dados = buscarJson($url);
    return $dados["current"] ?? null;
}

// Traduz o código numérico do tempo para texto
function descricaoClima($codigo) {
    return match (true) {
        $codigo === 0  => "Céu limpo",
        $codigo <= 3   => "Parcialmente nublado",
        $codigo <= 48  => "Neblina",
        $codigo <= 57  => "Garoa",
        $codigo <= 67  => "Chuva",
        $codigo <= 77  => "Neve",
        $codigo <= 82  => "Pancadas de chuva",
        default        => "Tempestade",
    };
}

// Formata número no padrão brasileiro: 1.234,56
function numero($valor) {
    return number_format($valor, 2, ",", ".");
}
`,
      'destinos.php': `<?php
/* Lista de destinos. A chave (ex.: "lisboa") é o id usado na URL. */
$destinos = [
    "lisboa" => ["cidade" => "Lisboa", "pais" => "Portugal", "moeda" => "EUR", "preco" => 890,
                 "lat" => 38.72, "lon" => -9.14, "cor" => "#fde7c8",
                 "descricao" => "Bondinhos, pastéis de nata e mirantes sobre o rio Tejo."],
    "buenos-aires" => ["cidade" => "Buenos Aires", "pais" => "Argentina", "moeda" => "USD", "preco" => 450,
                 "lat" => -34.61, "lon" => -58.38, "cor" => "#d6ecfb",
                 "descricao" => "Tango, livrarias históricas e a melhor parrilla."],
    "orlando" => ["cidade" => "Orlando", "pais" => "Estados Unidos", "moeda" => "USD", "preco" => 1200,
                 "lat" => 28.54, "lon" => -81.38, "cor" => "#e4e0fb",
                 "descricao" => "Parques temáticos para todas as idades."],
    "gramado" => ["cidade" => "Gramado", "pais" => "Brasil", "moeda" => "BRL", "preco" => 1350,
                 "lat" => -29.38, "lon" => -50.87, "cor" => "#dff3e3",
                 "descricao" => "Clima de serra, chocolate quente e arquitetura europeia."],
];
`,
      'style.css': `* { box-sizing: border-box; }
body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; background: #f6f7fb; color: #1c2230; }
a { color: #0e7490; }
.topo { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #fff; border-bottom: 1px solid #e6e8ef; }
.logo { font-size: 22px; font-weight: 800; color: #1c2230; text-decoration: none; }
.logo span { color: #0e7490; }
.topo nav a { margin-left: 16px; text-decoration: none; color: #4a5268; }
.faixa-cotacao { background: #0e7490; color: #e8fbff; text-align: center; padding: 8px; font-size: 14px; }
.conteudo { max-width: 1000px; margin: 0 auto; padding: 28px 16px; }
.estreito { max-width: 620px; }
.grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.destino { background: #fff; border-radius: 14px; overflow: hidden; text-decoration: none; color: inherit; box-shadow: 0 2px 10px rgba(0,0,0,.05); padding-bottom: 14px; }
.capa { height: 110px; display: grid; place-items: center; font-weight: 700; color: #3b4357; letter-spacing: 1px; text-transform: uppercase; font-size: 13px; }
.destino h2 { margin: 12px 16px 2px; font-size: 19px; }
.original { margin: 0 16px; color: #6b7387; font-size: 13px; }
.preco { margin: 6px 16px 0; font-size: 22px; font-weight: 800; color: #0e7490; }
h1 small { font-size: 16px; color: #6b7387; font-weight: 400; }
.painel { background: #fff; border-radius: 14px; padding: 18px 20px; margin: 16px 0; box-shadow: 0 2px 10px rgba(0,0,0,.05); }
.painel h2 { margin: 0 0 8px; font-size: 16px; color: #6b7387; text-transform: uppercase; letter-spacing: 1px; }
.temperatura { font-size: 44px; font-weight: 800; margin: 0; }
.botao { display: inline-block; background: #0e7490; color: #fff; border: 0; padding: 11px 18px; border-radius: 8px; text-decoration: none; cursor: pointer; font-size: 15px; }
.linha-cep { display: flex; gap: 8px; }
.linha-cep input { flex: 1; }
input { font: inherit; padding: 10px 12px; border: 1px solid #d3d7e2; border-radius: 8px; }
.formulario { display: grid; gap: 12px; margin-top: 18px; }
.formulario label { display: grid; gap: 4px; font-size: 14px; color: #4a5268; }
.aviso { background: #e7f6f9; color: #0b5566; padding: 10px 12px; border-radius: 8px; }
.erro { background: #fdecec; color: #b42318; padding: 10px 12px; border-radius: 8px; }
.rodape { text-align: center; padding: 24px; font-size: 13px; color: #8a91a3; }
`
    }
  },
  modeloTexto: [
    'Abra o console do laboratório enquanto navega: cada chamada às APIs aparece com a origem <strong>API</strong>, o endereço e o tempo. Teste o cadastro com o CEP <code>01001000</code> (Praça da Sé, São Paulo) e com um CEP inexistente como <code>99999999</code>.'
  ],
  desafios: [
    {
      nivel: 'Básico', titulo: 'Euro na faixa de cotação',
      texto: 'Na faixa do topo da <code>index.php</code>, mostre também o euro: "Dólar hoje: R$ 5,64 · Euro hoje: R$ 6,12".',
      solucao: `Dólar hoje: <strong>R$ <?= numero($cotacoes["USD"]) ?></strong>
· Euro hoje: <strong>R$ <?= numero($cotacoes["EUR"]) ?></strong>`
    },
    {
      nivel: 'Básico', titulo: 'Umidade e vento',
      texto: 'Na página do destino, mostre a umidade (<code>relative_humidity_2m</code>, em %) e o vento (<code>wind_speed_10m</code>, em km/h). Dica: use <code>print_r($clima)</code> primeiro para ver os campos.',
      solucao: `<p>Umidade: <?= $clima["relative_humidity_2m"] ?>% · Vento: <?= $clima["wind_speed_10m"] ?> km/h</p>`
    },
    {
      nivel: 'Intermediário', titulo: 'CEP validado antes da chamada',
      texto: 'Em <code>cadastro.php</code>, aceite CEPs com ou sem traço, mas só chame a API se houver exatamente 8 números. Caso contrário, mostre "CEP inválido: digite 8 números." com a classe <code>erro</code>.',
      solucao: `$cepNumeros = preg_replace('/\\D/', '', $cep);
if (strlen($cepNumeros) !== 8) {
    $mensagem = "CEP inválido: digite 8 números.";
} else {
    $resposta = buscarJson("https://viacep.com.br/ws/$cepNumeros/json/");
    // ... resto igual ...
}`
    },
    {
      nivel: 'Intermediário', titulo: 'Novo destino',
      texto: 'Adicione um destino nacional e um internacional em <code>destinos.php</code>. Descubra a latitude e a longitude pesquisando "latitude longitude NOME DA CIDADE". Confira se o clima aparece.',
      solucao: `"salvador" => ["cidade" => "Salvador", "pais" => "Brasil", "moeda" => "BRL", "preco" => 980,
               "lat" => -12.97, "lon" => -38.50, "cor" => "#fff1c9",
               "descricao" => "Pelourinho, praias e acarajé."],`
    },
    {
      nivel: 'Avançado', titulo: 'Conversor de moedas',
      texto: 'Crie <code>conversor.php</code> com um formulário (GET): valor em reais e moeda de destino (USD ou EUR). Mostre quanto a pessoa recebe na outra moeda, usando <code>buscarCotacoes()</code>.',
      solucaoArquivo: 'conversor.php',
      solucao: `<?php
require_once "api.php";
$valor = (float) str_replace(",", ".", $_GET["valor"] ?? "0");
$moeda = $_GET["moeda"] ?? "USD";
$cot = buscarCotacoes();
$resultado = null;
if ($valor > 0 && $cot && isset($cot[$moeda])) {
    $resultado = $valor / $cot[$moeda];
}
?>
<link rel="stylesheet" href="style.css">
<main class="conteudo estreito">
  <form method="get" class="linha-cep">
    <input name="valor" placeholder="Valor em R$">
    <select name="moeda"><option>USD</option><option>EUR</option></select>
    <button class="botao">Converter</button>
  </form>
  <?php if ($resultado !== null): ?>
    <p class="aviso">R$ <?= numero($valor) ?> = <?= $moeda ?> <?= numero($resultado) ?></p>
  <?php endif; ?>
</main>`
    },
    {
      nivel: 'Avançado', titulo: 'Feriados do ano (BrasilAPI)',
      texto: 'Crie <code>feriados.php</code> que lista os feriados nacionais do ano atual usando <code>https://brasilapi.com.br/api/feriados/v1/ANO</code>. Mostre a data no formato brasileiro e destaque o próximo feriado. Viagem em feriado prolongado é ótima propaganda!',
      dica: 'Cada item tem <code>date</code> (ex.: "2026-04-21") e <code>name</code>. Converta a data com <code>date("d/m", strtotime($f["date"]))</code>.',
      solucaoArquivo: 'feriados.php',
      solucao: `<?php
require_once "api.php";
$ano = date("Y");
$feriados = buscarJson("https://brasilapi.com.br/api/feriados/v1/$ano") ?? [];
$hoje = date("Y-m-d");
$proximoMarcado = false;
?>
<link rel="stylesheet" href="style.css">
<main class="conteudo estreito">
  <h1>Feriados de <?= $ano ?></h1>
  <ul>
  <?php foreach ($feriados as $f): ?>
    <?php $destaque = !$proximoMarcado && $f["date"] >= $hoje; ?>
    <?php if ($destaque) $proximoMarcado = true; ?>
    <li <?= $destaque ? 'class="aviso"' : '' ?>>
      <?= date("d/m", strtotime($f["date"])) ?> — <?= $f["name"] ?><?= $destaque ? " (próximo!)" : "" ?>
    </li>
  <?php endforeach; ?>
  </ul>
</main>`,
      solucaoTexto: 'Comparar datas no formato "AAAA-MM-DD" como texto funciona porque a ordem alfabética coincide com a ordem cronológica.'
    }
  ],
  revisao: [
    'API é uma porta de serviço que devolve dados (normalmente JSON) para outros programas.',
    'Receita: montar a URL → <code>file_get_contents($url)</code> → <code>json_decode($json, true)</code> → usar o array.',
    'Use <code>print_r</code> dentro de <code>&lt;pre&gt;</code> para explorar respostas com vários níveis.',
    'Valide os dados do usuário antes de colocá-los na URL; trate falhas e mostre mensagens amigáveis.',
    'Chaves de API ficam no servidor (PHP), nunca no JavaScript nem em repositórios públicos.'
  ],
  slides: [
    { capa: true, t: 'Integração com APIs', b: ['Dados ao vivo no seu site'], notas: 'Aula muito visual: os alunos veem dados reais (dólar de hoje, clima de agora). Aproveite o "uau".' },
    { t: 'Você usa APIs todo dia', b: [{ lista: ['Digitou o CEP e o endereço apareceu sozinho', 'Botão "Entrar com Google"', 'Previsão do tempo no app', 'Mapa dentro do site do restaurante', 'Pagamento com Pix na loja online'] }],
      notas: 'Peça mais exemplos. Mostre o endereço da ViaCEP no navegador para verem o JSON cru.' },
    { t: 'O balcão de informações', b: [{ analogia: 'Você não entra na sala de controle do aeroporto. Pergunta no balcão, no formato certo, e recebe a resposta pronta.' }, { code: `Pergunta:  viacep.com.br/ws/01001000/json/
Resposta:  { "logradouro": "Praça da Sé", "localidade": "São Paulo", ... }`, lang: 'txt' }],
      notas: 'Destaque que a API devolve dados, não páginas. Quem decide como mostrar é o nosso site.' },
    { t: 'A receita em 4 passos', b: [{ code: `$url   = "https://viacep.com.br/ws/$cep/json/";   // 1. montar
$json  = file_get_contents($url);                 // 2. buscar
$dados = json_decode($json, true);                // 3. converter
echo $dados["localidade"];                         // 4. usar`, lang: 'php' }],
      notas: 'Rode no laboratório e mostre a linha API no console.' },
    { t: 'fetch (JS) x file_get_contents (PHP)', b: [{ compara: [{ titulo: 'JavaScript', lang: 'js', code: `fetch(url)
  .then(r => r.json())
  .then(d => console.log(d.localidade));` }, { titulo: 'PHP', lang: 'php', code: `$d = json_decode(
  file_get_contents($url), true);
echo $d["localidade"];` }] }, 'No PHP a linha espera a resposta: mais simples de ler.'],
      notas: 'Comente que no servidor real a extensão cURL é outra opção comum.' },
    { t: 'Caixas dentro de caixas', b: [{ code: `print_r($moedas);
// [USDBRL] => [ [bid] => 5.64, [name] => Dólar... ]

$dolar = $moedas["USDBRL"]["bid"];`, lang: 'php' }, { analogia: 'Endereço postal: país → cidade → rua → número.' }],
      notas: 'Ensine o hábito: sempre print_r antes de acessar campos. Evita muito "Undefined array key".' },
    { t: 'Valide antes de perguntar', b: [{ code: `$cep = preg_replace('/\\D/', '', $_GET["cep"] ?? "");
if (strlen($cep) !== 8) {
    echo "CEP inválido";
} else {
    $dados = json_decode(file_get_contents(".../$cep/json/"), true);
    if (isset($dados["erro"])) echo "CEP não encontrado";
}`, lang: 'php' }],
      notas: 'Dois tipos de erro: o do usuário (CEP mal digitado) e o da API (CEP inexistente).' },
    { t: 'E se a API cair?', b: [{ code: `function buscarJson($url) {
    $json = @file_get_contents($url);
    if ($json === false) return null;
    return json_decode($json, true);
}`, lang: 'php' }, { analogia: 'Plano B: choveu, a festa vai para o salão. Não cancela.' }],
      notas: 'Simule desligando o Wi-Fi (ou usando uma URL inválida) e mostre a mensagem amigável.' },
    { t: 'Chaves de API: segredo do servidor', b: [{ tabela: { cab: ['Chamando pelo', 'A chave fica', 'Risco'], linhas: [['JavaScript', 'visível', 'alto'], ['PHP', 'escondida', 'baixo']] } }, { atencao: 'Nunca suba chaves para o GitHub.' }],
      notas: 'Conecte com a próxima aula: a API oficial do WhatsApp exige token, e ele precisa ficar no servidor.' },
    { t: 'Mão na massa: Rota Certa', b: [{ passos: ['Abra "Aula 08 — Agência de Viagens Rota Certa"', 'Navegue e observe as chamadas no console', 'Euro, umidade/vento e validação do CEP', 'Avançado: conversor de moedas e feriados'] }],
      notas: 'Se a internet da escola bloquear alguma API, use o desafio do CEP com mensagens de erro para demonstrar tratamento de falhas.' }
  ]
});
