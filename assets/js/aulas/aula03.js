/* AULA 03 — Arrays, funções e include */
AULAS.push({
  n: 3,
  titulo: 'Arrays, funções e include: uma loja montada por PHP',
  curto: 'Arrays e funções',
  resumo: 'Guarde vários produtos numa lista, gere a vitrine com foreach, crie suas próprias funções e reaproveite cabeçalho e rodapé com include.',
  conteudos: 'Arrays indexados e associativos, foreach, funções prontas, criação de funções, include/require',
  objetivos: [
    'Criar arrays (listas) e arrays associativos (fichas com campos nomeados).',
    'Percorrer uma lista com <code>foreach</code> para gerar HTML automaticamente.',
    'Usar funções prontas do PHP como <code>count()</code>, <code>array_sum()</code> e <code>number_format()</code>.',
    'Criar funções próprias com parâmetros e <code>return</code>.',
    'Dividir o site em partes reutilizáveis com <code>include</code> e <code>require</code>.'
  ],
  cronograma: [
    ['0:00 – 0:10', 'Revisão: if, match e for'],
    ['0:10 – 0:35', 'Arrays indexados e associativos (comparação com arrays e objetos do JS)'],
    ['0:35 – 0:55', 'foreach gerando a vitrine de produtos'],
    ['0:55 – 1:05', 'Intervalo'],
    ['1:05 – 1:25', 'Funções prontas e funções próprias; include e require'],
    ['1:25 – 1:55', 'Projeto: TechStore + desafios'],
    ['1:55 – 2:00', 'Fechamento']
  ],
  secoes: [
    {
      titulo: 'Arrays: várias informações numa variável só',
      blocos: [
        'Imagine uma loja com 50 produtos. Criar <code>$produto1</code>, <code>$produto2</code>... até <code>$produto50</code> seria impraticável. Um <strong>array</strong> guarda vários valores numa única variável.',
        { analogia: 'Um array é como um <strong>porta-comprimidos semanal</strong>: uma caixa só, com divisórias numeradas. Cada divisória (posição) guarda um item. Assim como no JavaScript, a numeração começa em <strong>zero</strong>.' },
        { compara: [
          { titulo: 'JavaScript', lang: 'js', code: `let frutas = ["maçã", "banana", "uva"];
console.log(frutas[0]);      // maçã
frutas.push("manga");        // adiciona
console.log(frutas.length);  // 4` },
          { titulo: 'PHP', lang: 'php', code: `<?php
$frutas = ["maçã", "banana", "uva"];
echo $frutas[0];          // maçã
$frutas[] = "manga";      // adiciona no fim
echo count($frutas);      // 4` }
        ] },
        'Para "espiar" um array inteiro use <code>print_r()</code> (dica: coloque dentro de <code>&lt;pre&gt;</code> para ficar organizado):',
        { code: `<?php
$cores = ["azul", "verde", "vermelho"];
$cores[] = "preto";

echo "<pre>";
print_r($cores);
echo "</pre>";

echo "Primeira cor: " . $cores[0] . "<br>";
echo "Total de cores: " . count($cores);
?>`, lang: 'php', run: true }
      ]
    },
    {
      titulo: 'Arrays associativos: fichas com etiquetas',
      blocos: [
        'Às vezes não queremos posições numeradas, e sim <strong>nomes</strong>: "nome", "preço", "estoque". Para isso existe o <strong>array associativo</strong>, que funciona como o <strong>objeto</strong> do JavaScript.',
        { analogia: 'É como a <strong>ficha de cadastro</strong> de um cliente: cada campo tem um rótulo (Nome, Telefone, Cidade) e um valor preenchido. O rótulo é a <strong>chave</strong>; o que está escrito é o <strong>valor</strong>.' },
        { compara: [
          { titulo: 'JavaScript (objeto)', lang: 'js', code: `let produto = {
    nome: "Fone Bluetooth",
    preco: 149.90,
    estoque: 12
};
console.log(produto.nome);` },
          { titulo: 'PHP (array associativo)', lang: 'php', code: `<?php
$produto = [
    "nome"    => "Fone Bluetooth",
    "preco"   => 149.90,
    "estoque" => 12,
];
echo $produto["nome"];` }
        ] },
        { dica: 'A seta <code>=&gt;</code> liga a chave ao valor. Leia em voz alta: "nome <em>vale</em> Fone Bluetooth".' },
        'O mais comum é ter uma <strong>lista de fichas</strong>: um array onde cada item é um array associativo. É exatamente o formato de um catálogo de produtos (e o mesmo formato de um JSON, que veremos nas próximas aulas).',
        { code: `<?php
$produtos = [
    ["nome" => "Mouse sem fio", "preco" => 89.90],
    ["nome" => "Teclado mecânico", "preco" => 299.00],
    ["nome" => "Webcam HD", "preco" => 179.50],
];

// segundo produto (posição 1), campo "nome"
echo $produtos[1]["nome"];   // Teclado mecânico
?>`, lang: 'php', run: true }
      ]
    },
    {
      titulo: 'foreach: percorrendo listas',
      blocos: [
        'O <code>foreach</code> ("para cada") passa por todos os itens de um array, um de cada vez. É o laço mais usado em PHP.',
        { compara: [
          { titulo: 'JavaScript', lang: 'js', code: `for (let fruta of frutas) {
    console.log(fruta);
}
// ou
frutas.forEach(function (fruta) {
    console.log(fruta);
});` },
          { titulo: 'PHP', lang: 'php', code: `<?php
foreach ($frutas as $fruta) {
    echo $fruta . "<br>";
}` }
        ] },
        { analogia: 'Pense numa <strong>fila de pacotes numa esteira</strong>. O <code>foreach</code> pega um pacote por vez e o coloca na sua mão com o nome que você escolheu (<code>$fruta</code>). Quando você termina, a esteira traz o próximo.' },
        'Com a sintaxe alternativa, o <code>foreach</code> monta HTML repetido de forma limpa:',
        { code: `<?php
$produtos = [
    ["nome" => "Mouse sem fio", "preco" => 89.90],
    ["nome" => "Teclado mecânico", "preco" => 299.00],
    ["nome" => "Webcam HD", "preco" => 179.50],
];
?>
<ul>
<?php foreach ($produtos as $p): ?>
    <li><?= $p["nome"] ?> — R$ <?= number_format($p["preco"], 2, ",", ".") ?></li>
<?php endforeach; ?>
</ul>`, lang: 'php', run: true },
        'Se você precisar também da <strong>chave</strong> (posição ou rótulo), use <code>chave =&gt; valor</code>:',
        { code: `<?php
$aluno = ["nome" => "Bruno", "turma" => "2DS", "cidade" => "Sorocaba"];

foreach ($aluno as $campo => $valor) {
    echo "$campo: $valor <br>";
}
?>`, lang: 'php', run: true }
      ]
    },
    {
      titulo: 'Funções prontas do PHP',
      blocos: [
        'O PHP vem com centenas de funções prontas. Você não precisa decorar: precisa saber que existem e consultar quando necessário (o site <a href="https://www.php.net/manual/pt_BR/" target="_blank" rel="noopener">php.net</a> tem tudo em português).',
        { tabela: { cab: ['Função', 'O que faz', 'Exemplo → resultado'], linhas: [
          ['<code>count($a)</code>', 'Quantidade de itens', '<code>count([5, 8, 2])</code> → 3'],
          ['<code>array_sum($a)</code>', 'Soma os números', '<code>array_sum([5, 8, 2])</code> → 15'],
          ['<code>in_array($x, $a)</code>', 'O valor existe na lista?', '<code>in_array(8, [5, 8])</code> → true'],
          ['<code>sort($a)</code>', 'Ordena a lista', '[2, 5, 8]'],
          ['<code>implode(", ", $a)</code>', 'Junta a lista num texto', '"5, 8, 2"'],
          ['<code>explode(",", $t)</code>', 'Quebra um texto em lista', '<code>explode(",", "a,b")</code> → ["a","b"]'],
          ['<code>strtoupper($t)</code>', 'Texto em maiúsculas', '"php" → "PHP"'],
          ['<code>str_replace($de, $para, $t)</code>', 'Troca trechos do texto', '"Olá Ana" → "Olá Bia"'],
          ['<code>round($n, 2)</code>', 'Arredonda', '<code>round(3.14159, 2)</code> → 3.14']
        ] } },
        { code: `<?php
$notas = [7.5, 8.0, 6.5, 9.0];

$media = array_sum($notas) / count($notas);
echo "Notas: " . implode(" | ", $notas) . "<br>";
echo "Média: " . round($media, 1) . "<br>";
echo in_array(10, $notas) ? "Tirou 10!" : "Nenhum 10 ainda.";
?>`, lang: 'php', run: true }
      ]
    },
    {
      titulo: 'Criando suas próprias funções',
      blocos: [
        'Quando um mesmo cálculo aparece em vários lugares, crie uma <strong>função</strong>: escreva uma vez, use quantas vezes quiser. A estrutura é igual à do JavaScript.',
        { compara: [
          { titulo: 'JavaScript', lang: 'js', code: `function dobro(numero) {
    return numero * 2;
}
console.log(dobro(5)); // 10` },
          { titulo: 'PHP', lang: 'php', code: `<?php
function dobro($numero) {
    return $numero * 2;
}
echo dobro(5); // 10` }
        ] },
        { analogia: 'Uma função é como uma <strong>máquina de suco</strong>: você coloca as frutas (parâmetros), ela faz o trabalho e devolve o suco (<code>return</code>). Você não precisa saber como ela funciona por dentro toda vez que usa.' },
        { code: `<?php
// Formata qualquer número como dinheiro brasileiro
function formatarPreco($valor) {
    return "R$ " . number_format($valor, 2, ",", ".");
}

// Parâmetro com valor padrão: se não informar, usa 10 vezes
function parcelar($valor, $vezes = 10) {
    $parcela = $valor / $vezes;
    return $vezes . "x de " . formatarPreco($parcela);
}

echo formatarPreco(1499.9) . "<br>";      // R$ 1.499,90
echo parcelar(1499.9) . "<br>";           // 10x de R$ 149,99
echo parcelar(1499.9, 3);                 // 3x de R$ 499,97
?>`, lang: 'php', run: true },
        { atencao: 'Variáveis criadas fora da função <strong>não</strong> são vistas dentro dela (e vice-versa). Se a função precisa de uma informação, passe como parâmetro.' }
      ]
    },
    {
      titulo: 'include e require: montando o site com peças',
      blocos: [
        'Todo site tem partes que se repetem em todas as páginas: o cabeçalho com o menu e o rodapé. Copiar e colar isso em cada página é perigoso: se o menu mudar, você precisa alterar todos os arquivos. Com <code>include</code>, você escreve a peça uma vez e "encaixa" onde quiser.',
        { analogia: 'É como <strong>peças de LEGO</strong>: o cabeçalho é uma peça, o rodapé é outra. Cada página encaixa as mesmas peças e só muda o miolo. Alterou a peça, todas as páginas mudam juntas.' },
        { code: `<?php
// index.php
$titulo = "Página inicial";
include "cabecalho.php";   // encaixa o topo (usa $titulo)
?>
    <h1>Bem-vindo!</h1>
    <p>Conteúdo exclusivo desta página.</p>
<?php include "rodape.php"; ?>`, lang: 'php', file: 'index.php' },
        { tabela: { cab: ['Comando', 'Se o arquivo não existir...', 'Use para'], linhas: [
          ['<code>include</code>', 'Mostra um aviso e continua', 'Partes visuais (cabeçalho, rodapé)'],
          ['<code>require</code>', 'Para tudo com erro fatal', 'Partes essenciais (dados, funções)'],
          ['<code>require_once</code>', 'Igual ao require, mas não inclui duas vezes', 'Arquivos de funções']
        ] } },
        { dica: 'O projeto desta aula já está dividido assim: <code>dados.php</code> (lista de produtos), <code>funcoes.php</code> (funções), <code>cabecalho.php</code> e <code>rodape.php</code>. Abra cada aba no laboratório e veja como a <code>index.php</code> junta tudo.' }
      ]
    }
  ],
  modelo: {
    nome: 'TechStore (loja virtual)',
    descricao: 'Vitrine de uma loja de eletrônicos. Os produtos estão num array em dados.php, as funções de formatação em funcoes.php e o cabeçalho e o rodapé são reaproveitados com include.',
    inicial: 'index.php',
    arquivos: {
      'index.php': `<?php
/* =========================================================
   AULA 03 — TECHSTORE
   Esta página quase não tem HTML repetido: o foreach
   gera um cartão para cada produto do array.
   ========================================================= */
require_once "dados.php";    // traz $loja e $produtos
require_once "funcoes.php";  // traz formatarPreco() e parcelar()

$titulo = "Ofertas da semana";   // usado dentro do cabecalho.php
include "cabecalho.php";
?>

<main class="conteudo">
    <h1><?= $titulo ?></h1>
    <p class="contagem"><?= count($produtos) ?> produtos encontrados</p>

    <div class="grade">
        <?php foreach ($produtos as $produto): ?>
            <article class="produto">
                <div class="foto" style="background: <?= $produto["cor"] ?>">
                    <?= $produto["categoria"] ?>
                </div>
                <h2><?= $produto["nome"] ?></h2>
                <p class="preco"><?= formatarPreco($produto["preco"]) ?></p>
                <p class="parcelas">ou <?= parcelar($produto["preco"]) ?> sem juros</p>
                <!-- DESAFIO: se o estoque for 0, mostre "Esgotado" -->
                <button class="comprar">Adicionar ao carrinho</button>
            </article>
        <?php endforeach; ?>
    </div>
</main>

<?php include "rodape.php"; ?>
`,
      'dados.php': `<?php
/* =========================================================
   DADOS DA LOJA
   Na vida real estes dados viriam de um banco de dados.
   Por enquanto, ficam num array (uma "lista de fichas").
   ========================================================= */
$loja = [
    "nome"     => "TechStore",
    "slogan"   => "Tecnologia com preço justo",
    "whatsapp" => "(11) 99999-0000",
];

$produtos = [
    ["nome" => "Fone Bluetooth",       "categoria" => "Áudio",      "preco" => 149.90,  "estoque" => 12, "cor" => "#dfe6ff"],
    ["nome" => "Caixa de Som Portátil","categoria" => "Áudio",      "preco" => 229.00,  "estoque" => 0,  "cor" => "#dfe6ff"],
    ["nome" => "Mouse sem Fio",        "categoria" => "Periféricos","preco" => 89.90,   "estoque" => 30, "cor" => "#e3f4ea"],
    ["nome" => "Teclado Mecânico",     "categoria" => "Periféricos","preco" => 299.00,  "estoque" => 5,  "cor" => "#e3f4ea"],
    ["nome" => "Smartwatch Fit",       "categoria" => "Vestíveis",  "preco" => 399.90,  "estoque" => 8,  "cor" => "#fdebd9"],
    ["nome" => "Notebook 15 polegadas","categoria" => "Computadores","preco" => 3499.00,"estoque" => 3,  "cor" => "#efe3fb"],
];
`,
      'funcoes.php': `<?php
/* =========================================================
   FUNÇÕES DA LOJA
   Escreva uma vez, use em todas as páginas.
   ========================================================= */

// Recebe um número e devolve no formato "R$ 1.234,56"
function formatarPreco($valor) {
    return "R$ " . number_format($valor, 2, ",", ".");
}

// Divide o valor em parcelas. Se não informar, usa 10 vezes.
function parcelar($valor, $vezes = 10) {
    $parcela = $valor / $vezes;
    return $vezes . "x de " . formatarPreco($parcela);
}

// DESAFIO: crie aqui a função calcularDesconto($preco, $percentual)
`,
      'cabecalho.php': `<?php
/* Cabeçalho reaproveitado por todas as páginas.
   Ele usa as variáveis $loja e $titulo, que precisam
   existir ANTES do include. */
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $titulo ?> | <?= $loja["nome"] ?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topo">
    <a class="logo" href="index.php"><?= $loja["nome"] ?></a>
    <span class="slogan"><?= $loja["slogan"] ?></span>
    <nav>
        <a href="index.php">Ofertas</a>
        <!-- DESAFIO: link para sobre.php -->
    </nav>
</header>
`,
      'rodape.php': `<footer class="rodape">
    <p><?= $loja["nome"] ?> · Atendimento pelo WhatsApp <?= $loja["whatsapp"] ?></p>
    <p>&copy; <?= date("Y") ?> · Todos os direitos reservados</p>
</footer>
</body>
</html>
`,
      'style.css': `* { box-sizing: border-box; }
body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; background: #f5f6f8; color: #1f2329; }
.topo { display: flex; align-items: center; gap: 16px; padding: 14px 24px; background: #111827; color: #fff; flex-wrap: wrap; }
.logo { color: #fff; font-weight: 800; font-size: 22px; text-decoration: none; }
.slogan { color: #9ca3af; font-size: 14px; }
.topo nav { margin-left: auto; }
.topo nav a { color: #e5e7eb; text-decoration: none; margin-left: 16px; font-size: 15px; }
.conteudo { max-width: 1040px; margin: 0 auto; padding: 24px 16px; }
.conteudo h1 { margin-bottom: 4px; }
.contagem { color: #6b7280; margin-top: 0; }
.grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.produto { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.06); display: flex; flex-direction: column; }
.foto { height: 120px; border-radius: 8px; display: grid; place-items: center; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
.produto h2 { font-size: 17px; margin: 0 0 8px; }
.preco { font-size: 22px; font-weight: 800; margin: 0; color: #111827; }
.antigo { text-decoration: line-through; color: #9ca3af; font-size: 14px; margin: 0; }
.parcelas { font-size: 13px; color: #6b7280; margin: 4px 0 14px; }
.comprar { margin-top: auto; background: #2563eb; color: #fff; border: 0; border-radius: 8px; padding: 10px; font-size: 14px; cursor: pointer; }
.comprar:disabled { background: #d1d5db; color: #6b7280; cursor: not-allowed; }
.esgotado { color: #b91c1c; font-weight: 700; font-size: 13px; }
.rodape { text-align: center; color: #6b7280; font-size: 14px; padding: 28px 16px; }
`
    }
  },
  modeloTexto: [
    'Repare como a <code>index.php</code> ficou curta: ela só junta as peças. Para adicionar um produto, você mexe <strong>apenas</strong> no <code>dados.php</code> e a vitrine se atualiza sozinha.'
  ],
  desafios: [
    {
      nivel: 'Básico', titulo: 'Novos produtos na vitrine',
      texto: 'Adicione dois produtos novos no <code>dados.php</code> (por exemplo, um carregador e um monitor). Execute: a contagem "X produtos encontrados" mudou sozinha?',
      solucao: `["nome" => "Carregador Turbo",  "categoria" => "Acessórios", "preco" => 79.90,  "estoque" => 20, "cor" => "#fff4cc"],
["nome" => "Monitor 24 polegadas", "categoria" => "Computadores", "preco" => 899.00, "estoque" => 4, "cor" => "#efe3fb"],`
    },
    {
      nivel: 'Básico', titulo: 'Produto esgotado',
      texto: 'Quando o estoque for 0, mostre a frase "Esgotado" e desative o botão (atributo <code>disabled</code>). A Caixa de Som já está com estoque zero para você testar.',
      solucao: `<?php if ($produto["estoque"] == 0): ?>
    <p class="esgotado">Esgotado</p>
    <button class="comprar" disabled>Indisponível</button>
<?php else: ?>
    <button class="comprar">Adicionar ao carrinho</button>
<?php endif; ?>`
    },
    {
      nivel: 'Intermediário', titulo: 'Função de desconto',
      texto: 'No <code>funcoes.php</code>, crie <code>calcularDesconto($preco, $percentual)</code> que devolve o preço com desconto. Adicione o campo <code>"desconto" =&gt; 10</code> em alguns produtos e, na vitrine, mostre o preço antigo riscado (classe <code>antigo</code>) e o novo preço.',
      dica: 'Use <code>$produto["desconto"] ?? 0</code> para os produtos que não têm o campo.',
      solucao: `// funcoes.php
function calcularDesconto($preco, $percentual) {
    return $preco - ($preco * $percentual / 100);
}

// index.php, dentro do foreach
<?php $desc = $produto["desconto"] ?? 0; ?>
<?php if ($desc > 0): ?>
    <p class="antigo"><?= formatarPreco($produto["preco"]) ?></p>
    <p class="preco"><?= formatarPreco(calcularDesconto($produto["preco"], $desc)) ?></p>
<?php else: ?>
    <p class="preco"><?= formatarPreco($produto["preco"]) ?></p>
<?php endif; ?>`
    },
    {
      nivel: 'Intermediário', titulo: 'Resumo do estoque',
      texto: 'Abaixo do título, mostre quantas unidades existem no total (soma dos estoques) e quantos produtos estão disponíveis (estoque maior que zero). Use um <code>foreach</code> com variáveis acumuladoras.',
      solucao: `<?php
$unidades = 0;
$disponiveis = 0;
foreach ($produtos as $p) {
    $unidades += $p["estoque"];
    if ($p["estoque"] > 0) {
        $disponiveis++;
    }
}
?>
<p><?= $disponiveis ?> disponíveis · <?= $unidades ?> unidades em estoque</p>`
    },
    {
      nivel: 'Avançado', titulo: 'Página "Sobre nós"',
      texto: 'Crie o arquivo <code>sobre.php</code> (botão + no laboratório) que reaproveita <code>cabecalho.php</code> e <code>rodape.php</code>, com um texto sobre a loja. Adicione o link no menu do cabeçalho e navegue entre as páginas.',
      dica: 'Não esqueça do <code>require_once "dados.php";</code> e de definir <code>$titulo</code> antes do include do cabeçalho.',
      solucao: `<?php
require_once "dados.php";
$titulo = "Sobre nós";
include "cabecalho.php";
?>
<main class="conteudo">
    <h1>Sobre a <?= $loja["nome"] ?></h1>
    <p>Somos uma loja de tecnologia que nasceu em 2020...</p>
</main>
<?php include "rodape.php"; ?>`,
      solucaoArquivo: 'sobre.php'
    },
    {
      nivel: 'Avançado', titulo: 'Vitrine "Até R$ 200"',
      texto: 'Antes da grade principal, crie uma seção "Até R$ 200" que mostra apenas os produtos com preço até 200 reais. Depois crie uma função <code>produtosAte($lista, $limite)</code> que devolve um novo array só com esses produtos.',
      solucao: `function produtosAte($lista, $limite) {
    $resultado = [];
    foreach ($lista as $p) {
        if ($p["preco"] <= $limite) {
            $resultado[] = $p;   // adiciona no novo array
        }
    }
    return $resultado;
}

// na index.php
<?php foreach (produtosAte($produtos, 200) as $p): ?>
    <span class="tag"><?= $p["nome"] ?> — <?= formatarPreco($p["preco"]) ?></span>
<?php endforeach; ?>`
    }
  ],
  revisao: [
    'Array indexado: <code>$lista = ["a", "b"]</code>, posições começam em 0. Adicione com <code>$lista[] = "c"</code>.',
    'Array associativo: <code>["nome" =&gt; "Ana"]</code>, acessado com <code>$ficha["nome"]</code> (como objeto no JS).',
    '<code>foreach ($lista as $item)</code> percorre todos os itens; use <code>foreach ... : endforeach;</code> no HTML.',
    'Funções: <code>function nome($param) { return ...; }</code>. Parâmetros podem ter valor padrão.',
    '<code>include</code> encaixa partes do site; <code>require</code> é para partes essenciais.'
  ],
  slides: [
    { capa: true, t: 'Arrays, funções e include', b: ['Uma loja montada por PHP'], notas: 'Hoje o objetivo é parar de repetir código: listas, funções e peças reutilizáveis.' },
    { t: 'O problema', b: ['Uma loja com 50 produtos:', { code: `$produto1 = "Fone";
$produto2 = "Mouse";
$produto3 = "Teclado";
// ... até $produto50 ???`, lang: 'php' }, 'E se o layout do cartão mudar? 50 alterações.'],
      notas: 'Provoque: como vocês resolveriam isso no JavaScript? (arrays). Em PHP é igual.' },
    { t: 'Array = porta-comprimidos', b: [{ compara: [{ titulo: 'JavaScript', lang: 'js', code: `let frutas = ["maçã", "uva"];
frutas.push("manga");
frutas.length;` }, { titulo: 'PHP', lang: 'php', code: `$frutas = ["maçã", "uva"];
$frutas[] = "manga";
count($frutas);` }] }, 'Posições começam em <strong>0</strong>.'],
      notas: 'Mostre print_r dentro de pre no laboratório.' },
    { t: 'Array associativo = ficha', b: [{ compara: [{ titulo: 'JS (objeto)', lang: 'js', code: `let p = {
  nome: "Fone",
  preco: 149.9
};
p.nome;` }, { titulo: 'PHP', lang: 'php', code: `$p = [
  "nome" => "Fone",
  "preco" => 149.9,
];
$p["nome"];` }] }, 'Leia <code>=&gt;</code> como "vale".'],
      notas: 'Analogia da ficha de cadastro. Chave = rótulo do campo, valor = o que está preenchido.' },
    { t: 'Lista de fichas = catálogo', b: [{ code: `$produtos = [
    ["nome" => "Mouse",   "preco" => 89.90],
    ["nome" => "Teclado", "preco" => 299.00],
];
echo $produtos[1]["nome"];  // Teclado`, lang: 'php' }, 'Mesmo formato de um JSON (vamos usar muito!).'],
      notas: 'Desenhe no quadro uma tabela: cada linha é uma ficha, cada coluna uma chave.' },
    { t: 'foreach: a esteira', b: [{ code: `<?php foreach ($produtos as $p): ?>
    <div class="card">
        <h2><?= $p["nome"] ?></h2>
        <p>R$ <?= $p["preco"] ?></p>
    </div>
<?php endforeach; ?>`, lang: 'php' }, 'Um cartão para cada produto. Escreve uma vez, repete sozinho.'],
      notas: 'Compare com for...of e forEach do JS. Mostre no laboratório que adicionar um item no array gera mais um cartão.' },
    { t: 'Funções prontas', b: [{ tabela: { cab: ['Função', 'Faz'], linhas: [['count()', 'conta itens'], ['array_sum()', 'soma'], ['in_array()', 'existe na lista?'], ['implode() / explode()', 'lista ↔ texto'], ['number_format()', 'formata número']] } }],
      notas: 'Mostre o php.net em português. Ensinar a consultar a documentação é tão importante quanto o conteúdo.' },
    { t: 'Suas funções: máquina de suco', b: [{ code: `function parcelar($valor, $vezes = 10) {
    $parcela = $valor / $vezes;
    return $vezes . "x de R$ " . number_format($parcela, 2, ",", ".");
}
echo parcelar(1500);     // 10x de R$ 150,00
echo parcelar(1500, 3);  // 3x de R$ 500,00`, lang: 'php' }],
      notas: 'Destaque parâmetro com valor padrão. Explique que variáveis de fora não entram na função: tudo por parâmetro.' },
    { t: 'include: peças de LEGO', b: [{ code: `<?php
$titulo = "Ofertas";
include "cabecalho.php";
?>
    <h1>Conteúdo da página</h1>
<?php include "rodape.php"; ?>`, lang: 'php' }, 'Mudou o menu? Altere só o <code>cabecalho.php</code>.'],
      notas: 'Diferença include x require: o require para tudo se o arquivo faltar. Use require para dados e funções.' },
    { t: 'Mão na massa: TechStore', b: [{ passos: ['Abra "Aula 03 — TechStore" e explore as abas', 'Adicione produtos e trate o "Esgotado"', 'Crie a função de desconto', 'Avançado: página sobre.php e vitrine até R$ 200'] }],
      notas: 'Peça para os alunos navegarem entre os arquivos antes de alterar. Um bom fechamento: "onde vocês mexeriam para mudar a cor do botão? E o nome da loja?"' }
  ]
});
