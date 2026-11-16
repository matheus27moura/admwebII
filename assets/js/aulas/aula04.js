/* AULA 04 — Formulários: GET e POST */
AULAS.push({
  n: 4,
  titulo: 'Formulários de verdade: recebendo dados com GET e POST',
  curto: 'Formulários GET e POST',
  resumo: 'Faça os formulários do site finalmente funcionarem: o PHP recebe o que o visitante digitou, calcula e responde.',
  conteudos: 'Atributos action/method/name, $_GET, $_POST, $_SERVER["REQUEST_METHOD"], isset, empty, ??, select, radio, checkbox[]',
  objetivos: [
    'Entender o caminho dos dados: do formulário HTML até o PHP.',
    'Diferenciar os métodos <strong>GET</strong> e <strong>POST</strong> e saber quando usar cada um.',
    'Ler os dados com <code>$_GET</code> e <code>$_POST</code>.',
    'Processar o formulário na mesma página verificando se ele foi enviado.',
    'Receber valores de <code>select</code>, <code>radio</code>, <code>checkbox</code> e <code>textarea</code>.'
  ],
  cronograma: [
    ['0:00 – 0:10', 'Revisão: arrays e foreach (os dados do formulário chegam num array!)'],
    ['0:10 – 0:30', 'Como o formulário envia dados: action, method e name'],
    ['0:30 – 0:55', 'GET x POST, $_GET e $_POST (exemplos no laboratório)'],
    ['0:55 – 1:05', 'Intervalo'],
    ['1:05 – 1:25', 'Formulário e resultado na mesma página; isset, empty e ??; checkbox[]'],
    ['1:25 – 1:55', 'Projeto: Academia Força Total + desafios'],
    ['1:55 – 2:00', 'Fechamento']
  ],
  secoes: [
    {
      titulo: 'O caminho dos dados',
      blocos: [
        'Você já sabe criar formulários em HTML. Mas até agora, ao clicar em "Enviar", nada acontecia de útil. O segredo está em três atributos:',
        { tabela: { cab: ['Atributo', 'Onde fica', 'Para que serve'], linhas: [
          ['<code>action</code>', '<code>&lt;form&gt;</code>', 'Para <strong>qual arquivo PHP</strong> os dados vão. Vazio = a própria página.'],
          ['<code>method</code>', '<code>&lt;form&gt;</code>', '<strong>Como</strong> os dados viajam: <code>get</code> ou <code>post</code>.'],
          ['<code>name</code>', 'Cada campo', 'O <strong>nome da etiqueta</strong> que o PHP vai usar para encontrar o valor.']
        ] } },
        { fluxo: [['1. Visitante preenche', 'nome = "Ana"'], ['2. Clica em Enviar', 'navegador junta os campos'], ['3. Vai para o action', 'ex.: obrigado.php'], ['4. PHP lê', '$_POST["nome"] vale "Ana"']] },
        { code: `<form action="obrigado.php" method="post">
    <label>Seu nome:</label>
    <input type="text" name="nome">      <!-- o PHP vai procurar por "nome" -->

    <label>Seu e-mail:</label>
    <input type="email" name="email">

    <button type="submit">Enviar</button>
</form>`, lang: 'html', file: 'contato.html' },
        { atencao: 'Campo <strong>sem</strong> o atributo <code>name</code> não é enviado. É o erro número 1 em formulários: o <code>id</code> serve para o CSS e o JS; o <code>name</code> serve para o PHP.' }
      ]
    },
    {
      titulo: 'GET ou POST?',
      blocos: [
        { analogia: '<strong>GET</strong> é como um <strong>cartão-postal</strong>: a mensagem vai escrita do lado de fora, qualquer um no caminho consegue ler. Os dados aparecem na barra de endereço: <code>busca.php?termo=tenis&amp;cor=azul</code>.<br><br><strong>POST</strong> é como uma <strong>carta dentro do envelope</strong>: os dados vão no "corpo" da requisição e não aparecem no endereço.' },
        { tabela: { cab: ['', 'GET', 'POST'], linhas: [
          ['Dados aparecem na URL?', 'Sim', 'Não'],
          ['Dá para salvar nos favoritos / compartilhar?', 'Sim', 'Não'],
          ['Use para', 'Buscas, filtros, paginação, calculadoras', 'Cadastros, login, mensagens, pedidos'],
          ['No PHP, leia com', '<code>$_GET["campo"]</code>', '<code>$_POST["campo"]</code>']
        ] } },
        { dica: 'Regra prática: se o formulário <strong>só consulta</strong> algo, use GET. Se ele <strong>envia, grava ou altera</strong> algo (ou tem senha), use POST.' }
      ]
    },
    {
      titulo: 'Lendo os dados com $_GET e $_POST',
      blocos: [
        '<code>$_GET</code> e <code>$_POST</code> são <strong>arrays associativos</strong> que o PHP preenche sozinho. A chave é o <code>name</code> do campo; o valor é o que foi digitado.',
        { code: `<!-- O formulário envia para a própria página (action vazio) por GET -->
<form method="get">
    <input type="text" name="cidade" placeholder="Digite uma cidade">
    <button>Buscar</button>
</form>

<?php
// Se o campo "cidade" veio na URL, mostramos a busca
if (isset($_GET["cidade"])) {
    $cidade = $_GET["cidade"];
    echo "<p>Você buscou por: <strong>$cidade</strong></p>";
}
?>`, lang: 'php', run: true },
        'No laboratório, depois de buscar, olhe a barra de endereço acima do resultado: os dados aparecem depois do <code>?</code>. Abra também a aba <strong>Requisição</strong> do console para ver o conteúdo de <code>$_GET</code> e <code>$_POST</code>.',
        { compara: [
          { titulo: 'JavaScript (no navegador)', lang: 'js', code: `form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.nome.value;
    // ...mas o dado continua só no
    // navegador do visitante
});` },
          { titulo: 'PHP (no servidor)', lang: 'php', code: `<?php
// o dado chegou ao servidor:
// pode ser salvo, enviado por e-mail,
// comparado com o banco de dados...
$nome = $_POST["nome"];` }
        ] }
      ]
    },
    {
      titulo: 'Formulário e resposta na mesma página',
      blocos: [
        'É muito comum o formulário enviar para a própria página. Aí precisamos saber: <strong>a pessoa acabou de chegar</strong> (ainda não enviou nada) ou <strong>clicou em Enviar</strong>? Para POST, a forma mais clara é perguntar o método da requisição:',
        { code: `<?php
$mensagem = "";

// Só processa se o formulário foi ENVIADO por POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome = $_POST["nome"];
    $mensagem = "Obrigado, $nome! Recebemos seu cadastro.";
}
?>
<form method="post">
    <input name="nome" placeholder="Seu nome">
    <button>Cadastrar</button>
</form>

<?php if ($mensagem): ?>
    <p style="color: green"><?= $mensagem ?></p>
<?php endif; ?>`, lang: 'php', run: true },
        { analogia: 'É como uma <strong>caixa de sugestões</strong>: o funcionário só abre e lê quando alguém colocou um papel. Se ninguém colocou nada (primeira visita), não há o que processar.' }
      ]
    },
    {
      titulo: 'isset, empty e ??: evitando avisos',
      blocos: [
        'Se você tentar ler <code>$_GET["cidade"]</code> e o campo não veio, o PHP mostra o aviso <em>Undefined array key "cidade"</em>. Três ferramentas resolvem isso:',
        { tabela: { cab: ['Ferramenta', 'Pergunta', 'Exemplo'], linhas: [
          ['<code>isset($x)</code>', 'Existe (e não é nulo)?', '<code>isset($_GET["pag"])</code>'],
          ['<code>empty($x)</code>', 'Está vazio? ("", 0, null, inexistente)', '<code>empty($_POST["nome"])</code>'],
          ['<code>$x ?? padrão</code>', 'Se não existir, use o padrão', '<code>$_GET["pag"] ?? 1</code>']
        ] } },
        { code: `<?php
// Página atual: se não vier na URL, assume 1
$pagina = $_GET["pagina"] ?? 1;
echo "Você está na página $pagina.<br>";

// Nome obrigatório
$nome = $_POST["nome"] ?? "";
if (empty($nome)) {
    echo "Preencha o nome.";
}
?>`, lang: 'php', run: true },
        { dica: 'Crie o hábito: <strong>todo</strong> valor vindo de formulário entra com <code>?? ""</code>. Seu código fica livre de avisos e mais fácil de testar.' }
      ]
    },
    {
      titulo: 'select, radio, checkbox e textarea',
      blocos: [
        'Todos os tipos de campo chegam do mesmo jeito: pelo <code>name</code>. O que muda é o <strong>valor</strong> enviado: em <code>select</code> e <code>radio</code>, vai o atributo <code>value</code> da opção escolhida.',
        'O <strong>checkbox</strong> tem um detalhe: como a pessoa pode marcar várias opções, colocamos <code>[]</code> no final do name. Assim o PHP recebe um <strong>array</strong>.',
        { code: `<form method="post">
    <select name="plano">
        <option value="mensal">Mensal</option>
        <option value="anual">Anual</option>
    </select>

    <label><input type="radio" name="turno" value="Manhã"> Manhã</label>
    <label><input type="radio" name="turno" value="Noite"> Noite</label>

    <label><input type="checkbox" name="objetivos[]" value="Emagrecer"> Emagrecer</label>
    <label><input type="checkbox" name="objetivos[]" value="Ganhar força"> Ganhar força</label>

    <textarea name="obs"></textarea>
    <button>Enviar</button>
</form>

<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $plano     = $_POST["plano"] ?? "";
    $turno     = $_POST["turno"] ?? "não informado";
    $objetivos = $_POST["objetivos"] ?? [];   // array (pode vir vazio)

    echo "<p>Plano: $plano | Turno: $turno</p>";
    echo "<p>Objetivos: " . implode(", ", $objetivos) . "</p>";
}
?>`, lang: 'php', run: true },
        { atencao: 'Se nenhum checkbox ou radio for marcado, o campo <strong>nem é enviado</strong>. Por isso o <code>?? []</code> e o <code>?? "não informado"</code> são essenciais.' }
      ]
    }
  ],
  modelo: {
    nome: 'Academia Força Total',
    descricao: 'Site de uma academia com página inicial, calculadora de IMC (formulário GET na mesma página) e formulário de matrícula (POST para obrigado.php). Algumas partes ainda não usam todos os dados recebidos.',
    inicial: 'index.php',
    arquivos: {
      'index.php': `<?php
/* =========================================================
   AULA 04 — ACADEMIA FORÇA TOTAL
   Página inicial: lista os planos a partir de um array.
   ========================================================= */
$planos = [
    ["id" => "mensal",     "nome" => "Mensal",     "preco" => 119.90, "detalhe" => "Sem fidelidade"],
    ["id" => "trimestral", "nome" => "Trimestral", "preco" => 99.90,  "detalhe" => "Cobrado a cada 3 meses"],
    ["id" => "anual",      "nome" => "Anual",      "preco" => 79.90,  "detalhe" => "Melhor custo-benefício"],
];
$titulo = "Início";
include "menu.php";
?>
<section class="hero">
    <h1>Seu treino começa hoje.</h1>
    <p>Musculação, funcional e aulas coletivas das 6h às 23h.</p>
    <a class="botao" href="matricula.php">Quero me matricular</a>
    <a class="botao claro" href="imc.php">Calcular meu IMC</a>
</section>

<main class="conteudo">
    <h2>Planos</h2>
    <div class="planos">
        <?php foreach ($planos as $plano): ?>
            <div class="plano">
                <h3><?= $plano["nome"] ?></h3>
                <p class="preco">R$ <?= number_format($plano["preco"], 2, ",", ".") ?><small>/mês</small></p>
                <p><?= $plano["detalhe"] ?></p>
                <!-- o link leva o plano escolhido pela URL (GET) -->
                <a href="matricula.php?plano=<?= $plano["id"] ?>">Escolher</a>
            </div>
        <?php endforeach; ?>
    </div>
</main>
<?php include "rodape.php"; ?>
`,
      'imc.php': `<?php
/* =========================================================
   CALCULADORA DE IMC — formulário GET na MESMA página
   IMC = peso / (altura x altura)
   ========================================================= */
$resultado = "";
$classificacao = "";

// Só calcula se os campos vieram na URL
if (isset($_GET["peso"]) && isset($_GET["altura"])) {
    // troca vírgula por ponto: "1,75" vira "1.75"
    $peso   = (float) str_replace(",", ".", $_GET["peso"]);
    $altura = (float) str_replace(",", ".", $_GET["altura"]);

    // DESAFIO: e se a altura vier vazia ou zero?
    $imc = $peso / ($altura * $altura);
    $resultado = number_format($imc, 1, ",", ".");

    if ($imc < 18.5) {
        $classificacao = "Abaixo do peso";
    } elseif ($imc < 25) {
        $classificacao = "Peso normal";
    } elseif ($imc < 30) {
        $classificacao = "Sobrepeso";
    } else {
        $classificacao = "Obesidade";
    }
}
$titulo = "Calculadora de IMC";
include "menu.php";
?>
<main class="conteudo estreito">
    <h1>Calculadora de IMC</h1>
    <p>O Índice de Massa Corporal é uma referência simples. Converse sempre com um profissional.</p>

    <!-- method="get": os dados aparecem no endereço -->
    <form method="get" class="formulario">
        <label>Peso (kg)
            <input type="text" name="peso" placeholder="Ex.: 70,5">
        </label>
        <label>Altura (m)
            <input type="text" name="altura" placeholder="Ex.: 1,75">
        </label>
        <button class="botao">Calcular</button>
    </form>

    <?php if ($resultado): ?>
        <div class="resultado">
            <span>Seu IMC</span>
            <strong><?= $resultado ?></strong>
            <p><?= $classificacao ?></p>
        </div>
    <?php endif; ?>
</main>
<?php include "rodape.php"; ?>
`,
      'matricula.php': `<?php
/* =========================================================
   FORMULÁRIO DE MATRÍCULA — envia por POST para obrigado.php
   ========================================================= */
// Se veio da página inicial com ?plano=anual, já deixa selecionado
$planoEscolhido = $_GET["plano"] ?? "mensal";
$titulo = "Matrícula";
include "menu.php";
?>
<main class="conteudo estreito">
    <h1>Pré-matrícula</h1>
    <p>Preencha e nossa equipe entrará em contato.</p>

    <form action="obrigado.php" method="post" class="formulario">
        <label>Nome completo
            <input type="text" name="nome" required>
        </label>
        <label>E-mail
            <input type="email" name="email" required>
        </label>
        <label>Telefone
            <input type="tel" name="telefone">
        </label>

        <label>Plano
            <select name="plano">
                <option value="mensal" <?= $planoEscolhido == "mensal" ? "selected" : "" ?>>Mensal</option>
                <option value="trimestral" <?= $planoEscolhido == "trimestral" ? "selected" : "" ?>>Trimestral</option>
                <option value="anual" <?= $planoEscolhido == "anual" ? "selected" : "" ?>>Anual</option>
            </select>
        </label>

        <fieldset>
            <legend>Turno preferido</legend>
            <label class="opcao"><input type="radio" name="turno" value="Manhã"> Manhã</label>
            <label class="opcao"><input type="radio" name="turno" value="Tarde"> Tarde</label>
            <label class="opcao"><input type="radio" name="turno" value="Noite"> Noite</label>
        </fieldset>

        <fieldset>
            <legend>Objetivos (marque quantos quiser)</legend>
            <!-- os colchetes [] fazem o PHP receber um ARRAY -->
            <label class="opcao"><input type="checkbox" name="objetivos[]" value="Emagrecer"> Emagrecer</label>
            <label class="opcao"><input type="checkbox" name="objetivos[]" value="Ganhar massa"> Ganhar massa</label>
            <label class="opcao"><input type="checkbox" name="objetivos[]" value="Condicionamento"> Condicionamento</label>
            <label class="opcao"><input type="checkbox" name="objetivos[]" value="Saúde"> Saúde</label>
        </fieldset>

        <label>Observações
            <textarea name="obs" rows="3"></textarea>
        </label>

        <button class="botao">Enviar pré-matrícula</button>
    </form>
</main>
<?php include "rodape.php"; ?>
`,
      'obrigado.php': `<?php
/* =========================================================
   RECEBE OS DADOS DA MATRÍCULA (POST)
   htmlspecialchars() protege a página contra código
   malicioso digitado no formulário (detalhes na Aula 05).
   ========================================================= */

// Se alguém abrir esta página direto, sem enviar o formulário
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: matricula.php");   // manda de volta
    exit;
}

$nome = htmlspecialchars($_POST["nome"] ?? "");

// DESAFIO: leia também email, telefone, plano, turno e objetivos

$titulo = "Obrigado";
include "menu.php";
?>
<main class="conteudo estreito">
    <div class="resultado">
        <h1>Obrigado, <?= $nome ?>!</h1>
        <p>Recebemos sua pré-matrícula. Em breve entraremos em contato.</p>
    </div>
    <!-- DESAFIO: mostre aqui um resumo com todos os dados enviados -->
    <p><a href="index.php">Voltar ao início</a></p>
</main>
<?php include "rodape.php"; ?>
`,
      'menu.php': `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $titulo ?> | Força Total</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topo">
    <a class="logo" href="index.php">FORÇA<span>TOTAL</span></a>
    <nav>
        <a href="index.php">Início</a>
        <a href="imc.php">IMC</a>
        <a href="matricula.php">Matrícula</a>
    </nav>
</header>
`,
      'rodape.php': `<footer class="rodape">
    <p>Academia Força Total · Rua das Palmeiras, 100 · &copy; <?= date("Y") ?></p>
</footer>
</body>
</html>
`,
      'style.css': `* { box-sizing: border-box; }
body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; background: #0f1115; color: #e8e8ea; }
a { color: #f5c400; }
.topo { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #262a33; }
.logo { font-weight: 900; font-size: 22px; color: #fff; text-decoration: none; letter-spacing: 1px; }
.logo span { color: #f5c400; }
.topo nav a { color: #c9cbd1; text-decoration: none; margin-left: 18px; }
.hero { padding: 72px 24px; text-align: center; background: linear-gradient(180deg, #1a1d24, #0f1115); }
.hero h1 { font-size: 40px; margin: 0 0 8px; }
.hero p { color: #a6a9b2; margin-bottom: 24px; }
.botao { display: inline-block; background: #f5c400; color: #111; border: 0; padding: 12px 20px; border-radius: 8px; font-weight: 700; text-decoration: none; cursor: pointer; font-size: 15px; margin: 4px; }
.botao.claro { background: transparent; color: #f5c400; border: 1px solid #f5c400; }
.conteudo { max-width: 960px; margin: 0 auto; padding: 32px 16px; }
.estreito { max-width: 560px; }
.planos { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.plano { background: #1a1d24; border: 1px solid #262a33; border-radius: 12px; padding: 20px; }
.plano h3 { margin: 0; }
.preco { font-size: 28px; font-weight: 800; color: #f5c400; margin: 8px 0; }
.preco small { font-size: 14px; color: #a6a9b2; font-weight: 400; }
.formulario { display: grid; gap: 14px; }
.formulario label { display: grid; gap: 6px; font-size: 14px; color: #c9cbd1; }
.formulario input, .formulario select, .formulario textarea { padding: 10px 12px; border-radius: 8px; border: 1px solid #333844; background: #1a1d24; color: #fff; font: inherit; }
fieldset { border: 1px solid #333844; border-radius: 8px; padding: 10px 14px; }
legend { padding: 0 6px; color: #a6a9b2; font-size: 14px; }
.opcao { display: inline-flex !important; align-items: center; gap: 6px; margin-right: 14px; }
.resultado { background: #1a1d24; border: 1px solid #f5c400; border-radius: 12px; padding: 20px; text-align: center; margin-top: 20px; }
.resultado span { color: #a6a9b2; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
.resultado strong { display: block; font-size: 44px; color: #f5c400; }
.erro { background: #3a1717; color: #ffb4b4; padding: 10px 14px; border-radius: 8px; }
.rodape { text-align: center; color: #6c707a; font-size: 13px; padding: 28px; border-top: 1px solid #262a33; }
`
    }
  },
  modeloTexto: [
    'Teste os dois tipos de envio: na calculadora de IMC (GET) os valores aparecem no endereço; na matrícula (POST) não. Abra a aba <strong>Requisição</strong> do console para ver exatamente o que chegou em <code>$_GET</code> e <code>$_POST</code>.'
  ],
  desafios: [
    {
      nivel: 'Básico', titulo: 'Resumo completo da matrícula',
      texto: 'Em <code>obrigado.php</code>, leia também e-mail, telefone, plano e turno (sempre com <code>?? ""</code> e <code>htmlspecialchars</code>) e mostre um resumo em lista.',
      solucao: `<?php
$email    = htmlspecialchars($_POST["email"] ?? "");
$telefone = htmlspecialchars($_POST["telefone"] ?? "");
$plano    = htmlspecialchars($_POST["plano"] ?? "");
$turno    = htmlspecialchars($_POST["turno"] ?? "não informado");
?>
<ul>
    <li>E-mail: <?= $email ?></li>
    <li>Telefone: <?= $telefone ?></li>
    <li>Plano: <?= $plano ?></li>
    <li>Turno: <?= $turno ?></li>
</ul>`
    },
    {
      nivel: 'Básico', titulo: 'Novo campo: idade',
      texto: 'Adicione um campo <code>idade</code> (type="number") no formulário de matrícula e mostre a idade no resumo. Se a pessoa tiver menos de 16 anos, mostre o aviso "Menores de 16 anos precisam de autorização dos responsáveis".',
      solucao: `<!-- matricula.php -->
<label>Idade <input type="number" name="idade" min="10" max="100"></label>

<?php // obrigado.php
$idade = (int) ($_POST["idade"] ?? 0);
if ($idade > 0 && $idade < 16) {
    echo "<p class='erro'>Menores de 16 anos precisam de autorização dos responsáveis.</p>";
}
?>`
    },
    {
      nivel: 'Intermediário', titulo: 'Objetivos marcados',
      texto: 'Mostre os objetivos marcados no checkbox separados por vírgula. Se nenhum foi marcado, mostre "Nenhum objetivo informado".',
      dica: '<code>$_POST["objetivos"] ?? []</code> e depois <code>implode(", ", ...)</code>. Para contar, <code>count()</code>.',
      solucao: `<?php
$objetivos = $_POST["objetivos"] ?? [];
if (count($objetivos) > 0) {
    echo "<p>Objetivos: " . htmlspecialchars(implode(", ", $objetivos)) . "</p>";
} else {
    echo "<p>Nenhum objetivo informado</p>";
}
?>`
    },
    {
      nivel: 'Intermediário', titulo: 'IMC à prova de erros',
      texto: 'Se a altura vier vazia ou zero, a divisão dá erro. Antes de calcular, verifique: se peso ou altura forem menores ou iguais a zero, mostre "Informe peso e altura válidos" com a classe <code>erro</code>. Bônus: mantenha os valores digitados nos campos após calcular (atributo <code>value</code>).',
      solucao: `<?php
$erro = "";
if (isset($_GET["peso"]) && isset($_GET["altura"])) {
    $peso   = (float) str_replace(",", ".", $_GET["peso"]);
    $altura = (float) str_replace(",", ".", $_GET["altura"]);
    if ($peso <= 0 || $altura <= 0) {
        $erro = "Informe peso e altura válidos";
    } else {
        $imc = $peso / ($altura * $altura);
        // ... classificação ...
    }
}
?>
<input type="text" name="peso" value="<?= htmlspecialchars($_GET["peso"] ?? "") ?>">
<?php if ($erro): ?><p class="erro"><?= $erro ?></p><?php endif; ?>`
    },
    {
      nivel: 'Avançado', titulo: 'Simulador de plano',
      texto: 'Crie <code>simulador.php</code> com um formulário (GET) com o plano (select) e a duração em meses (radio: 1, 6 ou 12). Mostre o total a pagar: 6 meses têm 10% de desconto e 12 meses, 20%. Adicione o link no <code>menu.php</code>.',
      solucaoArquivo: 'simulador.php',
      solucao: `<?php
$precos = ["mensal" => 119.90, "trimestral" => 99.90, "anual" => 79.90];
$plano = $_GET["plano"] ?? "";
$meses = (int) ($_GET["meses"] ?? 0);
$total = null;

if (isset($precos[$plano]) && $meses > 0) {
    $total = $precos[$plano] * $meses;
    $desconto = match ($meses) { 6 => 0.10, 12 => 0.20, default => 0 };
    $total = $total - $total * $desconto;
}
$titulo = "Simulador";
include "menu.php";
?>
<main class="conteudo estreito">
  <form method="get" class="formulario">
    <select name="plano">
      <option value="mensal">Mensal</option>
      <option value="trimestral">Trimestral</option>
      <option value="anual">Anual</option>
    </select>
    <label class="opcao"><input type="radio" name="meses" value="1"> 1 mês</label>
    <label class="opcao"><input type="radio" name="meses" value="6"> 6 meses</label>
    <label class="opcao"><input type="radio" name="meses" value="12"> 12 meses</label>
    <button class="botao">Simular</button>
  </form>
  <?php if ($total !== null): ?>
    <div class="resultado"><span>Total</span><strong>R$ <?= number_format($total, 2, ",", ".") ?></strong></div>
  <?php endif; ?>
</main>
<?php include "rodape.php"; ?>`
    },
    {
      nivel: 'Avançado', titulo: 'Busca de planos',
      texto: 'Na <code>index.php</code>, crie um campo de busca (GET, <code>name="busca"</code>). Mostre apenas os planos cujo nome contém o termo digitado, sem diferenciar maiúsculas de minúsculas.',
      dica: 'Use <code>str_contains(strtolower($plano["nome"]), strtolower($busca))</code> dentro do <code>foreach</code>.',
      solucao: `<?php $busca = trim($_GET["busca"] ?? ""); ?>
<form method="get"><input name="busca" value="<?= htmlspecialchars($busca) ?>"><button>Buscar</button></form>

<?php foreach ($planos as $plano): ?>
    <?php if ($busca !== "" && !str_contains(strtolower($plano["nome"]), strtolower($busca))) continue; ?>
    <!-- ... cartão do plano ... -->
<?php endforeach; ?>`
    }
  ],
  revisao: [
    'O <code>action</code> diz para onde os dados vão, o <code>method</code> diz como e o <code>name</code> de cada campo vira a chave no PHP.',
    'GET: dados na URL (buscas, filtros). POST: dados no corpo (cadastros, senhas, pedidos).',
    '<code>$_GET</code> e <code>$_POST</code> são arrays associativos preenchidos automaticamente.',
    'Para processar na mesma página: <code>if ($_SERVER["REQUEST_METHOD"] === "POST")</code>.',
    'Use <code>?? ""</code> em todo dado de formulário. Checkbox com <code>name="x[]"</code> chega como array.'
  ],
  slides: [
    { capa: true, t: 'Formulários de verdade', b: ['Recebendo dados com GET e POST'], notas: 'Momento marcante da disciplina: o formulário finalmente "vai para algum lugar". Gere expectativa.' },
    { t: 'Até hoje...', b: ['Você clicava em Enviar e...', { lista: ['a página recarregava', 'os dados sumiam', 'ninguém recebia nada'] }, 'Hoje o PHP vai <strong>receber</strong>, <strong>calcular</strong> e <strong>responder</strong>.'],
      notas: 'Pergunte quais formulários eles usam na internet (login, busca do Google, compra). Todos enviam dados para um servidor.' },
    { t: 'Os três atributos mágicos', b: [{ code: `<form action="obrigado.php" method="post">
    <input type="text" name="nome">
    <button>Enviar</button>
</form>`, lang: 'html' }, { tabela: { cab: ['Atributo', 'Responde'], linhas: [['action', 'Para onde?'], ['method', 'Como?'], ['name', 'Com qual etiqueta?']] } }],
      notas: 'Ênfase no name: sem ele o campo não é enviado. O id é para CSS/JS.' },
    { t: 'Cartão-postal x carta', b: [{ colunas: [[{ h: 'GET' }, { lista: ['Dados na URL', 'Pode compartilhar o link', 'Buscas e filtros'] }, { code: 'imc.php?peso=70&altura=1.75', lang: 'txt' }], [{ h: 'POST' }, { lista: ['Dados no corpo', 'Não aparece no endereço', 'Cadastros, senhas, pedidos'] }]] }],
      notas: 'Mostre a busca do Google: a URL tem ?q=... (GET). Pergunte: e um login, deveria ser GET? Por quê não?' },
    { t: '$_GET e $_POST são arrays', b: [{ code: `<form method="get">
    <input name="cidade">
    <button>Buscar</button>
</form>
<?php
if (isset($_GET["cidade"])) {
    echo "Você buscou: " . $_GET["cidade"];
}`, lang: 'php' }, 'A chave do array é o <code>name</code> do campo.'],
      notas: 'Rode no laboratório e mostre a aba Requisição do console com o conteúdo de $_GET.' },
    { t: 'Enviou ou acabou de chegar?', b: [{ code: `if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome = $_POST["nome"];
    $msg = "Obrigado, $nome!";
}`, lang: 'php' }, { analogia: 'Caixa de sugestões: só abre se alguém colocou um papel.' }],
      notas: 'Explique que a mesma página é aberta duas vezes: primeiro por GET (formulário vazio), depois por POST (com dados).' },
    { t: 'Fuja dos avisos', b: [{ tabela: { cab: ['Use', 'Para'], linhas: [['isset($x)', 'existe?'], ['empty($x)', 'está vazio?'], ['$x ?? "padrão"', 'valor reserva']] } }, { code: `$pagina = $_GET["pagina"] ?? 1;`, lang: 'php' }],
      notas: 'Mostre o aviso "Undefined array key" acontecendo e depois corrija com ??.' },
    { t: 'Checkbox chega como array', b: [{ code: `<input type="checkbox" name="objetivos[]" value="Emagrecer">
<input type="checkbox" name="objetivos[]" value="Força">

<?php
$objetivos = $_POST["objetivos"] ?? [];
echo implode(", ", $objetivos);`, lang: 'php' }, 'Os colchetes <code>[]</code> no name fazem a mágica.'],
      notas: 'Lembre: se nada for marcado, o campo nem é enviado. Daí o ?? [].' },
    { t: 'JS valida, PHP recebe', b: [{ tabela: { cab: ['', 'JavaScript', 'PHP'], linhas: [['Onde', 'Navegador', 'Servidor'], ['O dado fica', 'Só no navegador', 'Pode ser salvo/enviado'], ['Pode ser burlado?', 'Sim', 'Não pelo visitante']] } }],
      notas: 'Prepare o terreno para a próxima aula (validação e segurança): validação em JS é conforto, validação em PHP é obrigação.' },
    { t: 'Mão na massa: Academia Força Total', b: [{ passos: ['Abra "Aula 04 — Academia Força Total"', 'Teste o IMC (GET) e a matrícula (POST)', 'Complete o resumo em obrigado.php', 'Avançado: simulador de planos e busca'] }],
      notas: 'Os alunos tendem a esquecer o name dos novos campos. Circule e pergunte: "o que aparece na aba Requisição?"' }
  ]
});
