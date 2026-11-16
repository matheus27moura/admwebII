/* AULA 02 — Decisões e repetições */
AULAS.push({
  n: 2,
  titulo: 'Decisões e repetições: o site que reage ao horário',
  curto: 'Decisões e repetições',
  resumo: 'Use if, else, match e laços de repetição para que o site decida sozinho o que mostrar: saudação, aberto ou fechado, promoção do dia.',
  conteudos: 'if/elseif/else, operadores de comparação e lógicos, sintaxe alternativa no HTML, match, ternário, ??, for e while',
  objetivos: [
    'Tomar decisões com <code>if</code>, <code>elseif</code> e <code>else</code>.',
    'Combinar condições com <code>&amp;&amp;</code> (E) e <code>||</code> (OU).',
    'Escolher entre várias opções com <code>match</code>.',
    'Mostrar ou esconder partes do HTML com <code>if</code> dentro da página.',
    'Gerar HTML repetido com <code>for</code> e <code>while</code>.'
  ],
  cronograma: [
    ['0:00 – 0:10', 'Revisão da Aula 01: variáveis, echo e date()'],
    ['0:10 – 0:35', 'Decisões: if/else, operadores e a sintaxe alternativa no HTML'],
    ['0:35 – 0:55', 'match, ternário e operador ??'],
    ['0:55 – 1:05', 'Intervalo'],
    ['1:05 – 1:25', 'Repetições: for e while gerando HTML'],
    ['1:25 – 1:55', 'Projeto: Cafeteria Grão Dourado + desafios'],
    ['1:55 – 2:00', 'Fechamento']
  ],
  secoes: [
    {
      titulo: 'Programas que tomam decisões',
      blocos: [
        'Até agora nosso PHP fazia sempre a mesma coisa. Sites de verdade <strong>decidem</strong>: mostram "Bom dia" de manhã e "Boa noite" à noite, avisam se a loja está aberta, exibem o botão "Sair" só para quem está logado.',
        { analogia: 'Pense no <strong>porteiro de um prédio</strong>. Ele segue regras: "SE a pessoa for moradora, ENTÃO libera a entrada. SENÃO, interfona para o apartamento". O <code>if</code> é exatamente essa regra escrita em código.' },
        'A boa notícia: a sintaxe do <code>if</code> no PHP é praticamente igual à do JavaScript. A única diferença visível é o <code>$</code> das variáveis e o <code>elseif</code> (junto).',
        { compara: [
          { titulo: 'JavaScript', lang: 'js', code: `let hora = 15;

if (hora < 12) {
    msg = "Bom dia";
} else if (hora < 18) {
    msg = "Boa tarde";
} else {
    msg = "Boa noite";
}` },
          { titulo: 'PHP', lang: 'php', code: `<?php
$hora = 15;

if ($hora < 12) {
    $msg = "Bom dia";
} elseif ($hora < 18) {
    $msg = "Boa tarde";
} else {
    $msg = "Boa noite";
}` }
        ] },
        { code: `<?php
$hora = (int) date("G");   // hora atual de 0 a 23

if ($hora < 12) {
    echo "Bom dia!";
} elseif ($hora < 18) {
    echo "Boa tarde!";
} else {
    echo "Boa noite!";
}
?>`, lang: 'php', run: true },
        { dica: 'O <code>(int)</code> antes de <code>date("G")</code> transforma o texto "15" no número 15. Fazer a conversão evita surpresas nas comparações.' }
      ]
    },
    {
      titulo: 'Operadores de comparação e lógicos',
      blocos: [
        { tabela: { cab: ['Operador', 'Pergunta', 'Exemplo verdadeiro'], linhas: [
          ['<code>==</code>', 'É igual (valor)?', '<code>5 == "5"</code>'],
          ['<code>===</code>', 'É idêntico (valor e tipo)?', '<code>5 === 5</code>'],
          ['<code>!=</code> / <code>!==</code>', 'É diferente?', '<code>3 != 4</code>'],
          ['<code>&gt;</code> <code>&lt;</code>', 'Maior / menor?', '<code>10 &gt; 2</code>'],
          ['<code>&gt;=</code> <code>&lt;=</code>', 'Maior ou igual / menor ou igual?', '<code>18 &gt;= 18</code>']
        ] } },
        'Para juntar condições usamos os operadores lógicos, iguais aos do JavaScript:',
        { tabela: { cab: ['Operador', 'Significa', 'Quando é verdadeiro'], linhas: [
          ['<code>&amp;&amp;</code>', 'E', 'As duas condições são verdadeiras'],
          ['<code>||</code>', 'OU', 'Pelo menos uma é verdadeira'],
          ['<code>!</code>', 'NÃO', 'Inverte: verdadeiro vira falso']
        ] } },
        { code: `<?php
$hora = 10;
$diaSemana = 6;   // 1 = segunda ... 6 = sábado, 7 = domingo

// E: precisa estar no horário E não ser domingo
$aberto = ($hora >= 8 && $hora < 18) && $diaSemana != 7;

// OU: fim de semana é sábado OU domingo
$fimDeSemana = ($diaSemana == 6 || $diaSemana == 7);

if ($aberto) {
    echo "Estamos abertos!";
}
if ($fimDeSemana) {
    echo " Bom fim de semana!";
}
?>`, lang: 'php', run: true },
        { analogia: 'Um brinquedo do parque diz: "altura mínima 1,40 m <strong>E</strong> acompanhado de adulto". As duas regras precisam valer (<code>&amp;&amp;</code>). Já a promoção "estudante <strong>OU</strong> idoso paga meia" aceita qualquer uma das duas (<code>||</code>).' },
        { atencao: 'Um <code>=</code> <strong>guarda</strong> um valor; dois <code>==</code> <strong>comparam</strong>. Escrever <code>if ($idade = 18)</code> é um erro comum: em vez de perguntar, você está mudando a idade para 18!' }
      ]
    },
    {
      titulo: 'if dentro do HTML',
      blocos: [
        'Quando o <code>if</code> decide qual <strong>pedaço de HTML</strong> aparece, existe uma forma mais legível chamada <strong>sintaxe alternativa</strong>: troca-se a chave <code>{</code> por dois-pontos <code>:</code> e fecha-se com <code>endif;</code>.',
        { code: `<?php $aberto = true; $horaFecha = 18; ?>

<?php if ($aberto): ?>
    <p class="status verde">Aberto agora · fecha às <?= $horaFecha ?>h</p>
<?php else: ?>
    <p class="status vermelho">Fechado no momento</p>
<?php endif; ?>`, lang: 'php', run: true },
        { analogia: 'É como um interruptor: dependendo da condição, uma lâmpada (um trecho de HTML) acende e a outra fica apagada. O navegador só recebe o trecho "aceso".' },
        { dica: 'Use chaves <code>{ }</code> em blocos só de PHP e a sintaxe com <code>:</code> e <code>endif;</code> quando estiver no meio do HTML. Fica muito mais fácil de ler.' }
      ]
    },
    {
      titulo: 'match: muitas opções sem bagunça',
      blocos: [
        'Quando uma variável pode ter vários valores e cada um leva a um resultado, uma fila de <code>elseif</code> fica cansativa. O PHP 8 tem o <code>match</code>, uma versão moderna e enxuta do <code>switch</code> que você viu no JavaScript.',
        { compara: [
          { titulo: 'switch (JS e PHP)', lang: 'php', code: `<?php
switch ($dia) {
    case 1:
        $promo = "Expresso em dobro";
        break;
    case 5:
        $promo = "Bolo grátis";
        break;
    default:
        $promo = "Café do dia";
}` },
          { titulo: 'match (PHP 8)', lang: 'php', code: `<?php
$promo = match ($dia) {
    1 => "Expresso em dobro",
    5 => "Bolo grátis",
    default => "Café do dia",
};` }
        ] },
        { code: `<?php
$diaSemana = (int) date("N");  // 1 = segunda ... 7 = domingo

$nomeDia = match ($diaSemana) {
    1 => "segunda-feira",
    2 => "terça-feira",
    3 => "quarta-feira",
    4 => "quinta-feira",
    5 => "sexta-feira",
    6, 7 => "fim de semana",   // vários valores com o mesmo resultado
};

echo "Hoje é $nomeDia.";
?>`, lang: 'php', run: true },
        { analogia: 'O <code>match</code> funciona como uma <strong>tabela de preços do estacionamento</strong>: você procura sua linha (o valor) e lê a resposta ao lado. Nada de "break" esquecido.' }
      ]
    },
    {
      titulo: 'Atalhos: ternário e ??',
      blocos: [
        'Para decisões curtas, de uma linha, use o <strong>operador ternário</strong> (igual ao JS): <code>condição ? valorSeVerdadeiro : valorSeFalso</code>.',
        { code: `<?php
$estoque = 0;
$texto = $estoque > 0 ? "Disponível" : "Esgotado";
echo $texto;   // Esgotado

$itens = 1;
echo "<br>Você tem $itens " . ($itens == 1 ? "item" : "itens") . " no carrinho.";
?>`, lang: 'php', run: true },
        'O operador <code>??</code> (chamado de "coalescência nula") dá um <strong>valor padrão</strong> quando a variável não existe. Ele vai ser muito usado a partir da aula de formulários.',
        { code: `<?php
$apelido = null;
echo $apelido ?? "Visitante";   // Visitante
?>`, lang: 'php', run: true }
      ]
    },
    {
      titulo: 'Repetições: for e while',
      blocos: [
        'Laços de repetição executam o mesmo bloco várias vezes. No PHP eles servem muito para <strong>gerar HTML repetido</strong>: linhas de tabela, opções de um <code>&lt;select&gt;</code>, cartões, estrelas de avaliação...',
        { compara: [
          { titulo: 'JavaScript', lang: 'js', code: `for (let i = 1; i <= 5; i++) {
    console.log("Linha " + i);
}` },
          { titulo: 'PHP', lang: 'php', code: `<?php
for ($i = 1; $i <= 5; $i++) {
    echo "Linha $i <br>";
}` }
        ] },
        { code: `<!-- Gerando opções de um select com for -->
<label>Quantidade:</label>
<select>
<?php for ($q = 1; $q <= 10; $q++): ?>
    <option value="<?= $q ?>"><?= $q ?> unidade(s)</option>
<?php endfor; ?>
</select>

<!-- Estrelas de avaliação -->
<?php
$nota = 4;
for ($i = 1; $i <= 5; $i++) {
    // estrela cheia até a nota, vazia depois
    echo $i <= $nota ? "&#9733;" : "&#9734;";
}
?>`, lang: 'php', run: true },
        'O <code>while</code> repete <strong>enquanto</strong> a condição for verdadeira. Use quando você não sabe de antemão quantas voltas serão:',
        { code: `<?php
$saldo = 100;
$meses = 0;

// Quantos meses até o saldo dobrar, rendendo 10% ao mês?
while ($saldo < 200) {
    $saldo = $saldo * 1.10;
    $meses++;
}
echo "Leva $meses meses para dobrar.";
?>`, lang: 'php', run: true },
        { atencao: 'Cuidado com o <strong>laço infinito</strong>: se a condição nunca ficar falsa (por exemplo, esquecer o <code>$i++</code>), a página trava. No laboratório, recarregue a aba do navegador se isso acontecer.' }
      ]
    }
  ],
  modelo: {
    nome: 'Cafeteria Grão Dourado',
    descricao: 'Página de uma cafeteria que já sabe a hora atual. Ela decide a saudação, mostra se a loja está aberta, escolhe a promoção do dia e desenha o cartão fidelidade com um laço for.',
    inicial: 'index.php',
    arquivos: {
      'index.php': `<?php
/* =========================================================
   AULA 02 — CAFETERIA GRÃO DOURADO
   Decisões (if, match) e repetições (for)
   ========================================================= */
date_default_timezone_set("America/Sao_Paulo"); // fuso horário de Brasília

// ---------- DADOS DA LOJA ----------
$nomeLoja  = "Grão Dourado";
$horaAbre  = 8;    // abre às 8h
$horaFecha = 18;   // fecha às 18h

// ---------- HORA E DIA ATUAIS ----------
$hora      = (int) date("G");  // 0 a 23
$diaSemana = (int) date("N");  // 1 = segunda ... 7 = domingo

// Para TESTAR outros horários/dias, tire as barras das linhas abaixo:
// $hora = 20;
// $diaSemana = 5;

// ---------- DECISÃO 1: saudação de acordo com a hora ----------
if ($hora < 12) {
    $saudacao = "Bom dia";
} elseif ($hora < 18) {
    $saudacao = "Boa tarde";
} else {
    $saudacao = "Boa noite";
}

// ---------- DECISÃO 2: está aberto? ----------
// && = "E": precisa já ter aberto E ainda não ter fechado
$aberto = ($hora >= $horaAbre && $hora < $horaFecha);

// ---------- DECISÃO 3: promoção do dia com match ----------
$promocao = match ($diaSemana) {
    1 => "Segunda do Expresso: 2 por R$ 9,00",
    3 => "Quarta do Cappuccino: 20% de desconto",
    5 => "Sexta Doce: fatia de bolo grátis no combo",
    default => "Experimente o café coado do dia!",
};

// ---------- CARTÃO FIDELIDADE ----------
$carimbos = 6;          // cafés que o cliente já comprou (0 a 10)
$totalCarimbos = 10;    // com 10 carimbos, ganha um café
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
        <h1><?= $saudacao ?>! Que tal um café?</h1>

        <!-- if dentro do HTML (sintaxe alternativa) -->
        <?php if ($aberto): ?>
            <p class="status aberto">Aberto agora · fechamos às <?= $horaFecha ?>h</p>
        <?php else: ?>
            <p class="status fechado">Fechado no momento · abrimos às <?= $horaAbre ?>h</p>
        <?php endif; ?>

        <div class="promo">
            <span>Promoção de hoje</span>
            <strong><?= $promocao ?></strong>
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
            <?php for ($i = 1; $i <= $totalCarimbos; $i++): ?>
                <!-- se $i já foi carimbado, recebe a classe "cheio" -->
                <div class="carimbo <?= $i <= $carimbos ? 'cheio' : '' ?>"><?= $i ?></div>
            <?php endfor; ?>
        </div>
        <!-- DESAFIO: mostre "Faltam X cafés" ou "Parabéns, café grátis!" -->
    </main>

    <footer class="rodape">
        <p><?= $nomeLoja ?> · Aberto de segunda a sábado, das <?= $horaAbre ?>h às <?= $horaFecha ?>h</p>
    </footer>
</body>
</html>
`,
      'style.css': `* { box-sizing: border-box; }
body { margin: 0; font-family: Georgia, "Times New Roman", serif; background: #faf6f1; color: #3b2a1e; }
.topo { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #3b2a1e; color: #f3e3cf; }
.logo { font-size: 22px; font-weight: bold; letter-spacing: 1px; }
.topo nav a { color: #f3e3cf; margin-left: 16px; text-decoration: none; font-family: system-ui, sans-serif; font-size: 14px; }
.destaque { text-align: center; padding: 56px 16px; background: #efe2d2; }
.destaque h1 { margin: 0 0 16px; font-size: 34px; }
.status { display: inline-block; padding: 6px 14px; border-radius: 99px; font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
.aberto { background: #dcefdf; color: #24663a; }
.fechado { background: #f6dcdc; color: #9b2c2c; }
.promo { max-width: 420px; margin: 24px auto 0; background: #fff; border: 2px dashed #b9894f; border-radius: 12px; padding: 14px; }
.promo span { display: block; font-family: system-ui, sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9a6b35; }
.conteudo { max-width: 860px; margin: 0 auto; padding: 24px 16px; }
.cardapio { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
.item { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(59,42,30,.08); }
.item h3 { margin: 0 0 4px; }
.item p { margin: 0 0 10px; font-size: 14px; color: #7a6354; }
.item span { font-weight: bold; color: #9a6b35; }
.cartao { display: grid; grid-template-columns: repeat(5, 48px); gap: 10px; }
.carimbo { width: 48px; height: 48px; border-radius: 50%; border: 2px dashed #b9894f; display: grid; place-items: center; color: #b9894f; font-family: system-ui, sans-serif; }
.carimbo.cheio { background: #3b2a1e; border-style: solid; border-color: #3b2a1e; color: #f3e3cf; }
.rodape { text-align: center; padding: 24px; font-size: 14px; color: #7a6354; }
`
    }
  },
  modeloTexto: [
    'Para testar como o site se comporta em outros horários sem esperar o relógio, use as linhas comentadas logo abaixo de "HORA E DIA ATUAIS": tire as barras <code>//</code>, mude o valor e execute.'
  ],
  desafios: [
    {
      nivel: 'Básico', titulo: 'Novo horário de funcionamento',
      texto: 'A cafeteria passou a abrir às 7h e fechar às 20h. Altere as variáveis e teste com <code>$hora = 6</code>, <code>$hora = 7</code> e <code>$hora = 20</code>. O resultado é o esperado nos três casos?',
      solucaoTexto: 'Basta trocar <code>$horaAbre = 7</code> e <code>$horaFecha = 20</code>. Com 6 → fechado; 7 → aberto; 20 → fechado (pois a condição é <code>$hora &lt; $horaFecha</code>). Bom momento para discutir <code>&lt;</code> versus <code>&lt;=</code>.'
    },
    {
      nivel: 'Básico', titulo: 'Domingo fechado',
      texto: 'Aos domingos (<code>$diaSemana == 7</code>) a loja não abre, em nenhum horário. Ajuste a variável <code>$aberto</code> para considerar isso.',
      dica: 'Junte mais uma condição com <code>&amp;&amp;</code>.',
      solucao: `$aberto = ($hora >= $horaAbre && $hora < $horaFecha) && $diaSemana != 7;`
    },
    {
      nivel: 'Intermediário', titulo: 'Quanto falta para o café grátis?',
      texto: 'Abaixo do cartão fidelidade, mostre "Faltam X cafés para o próximo grátis". Se o cliente tiver 10 carimbos, mostre "Parabéns! Seu próximo café é grátis." Teste com <code>$carimbos</code> igual a 3, 9 e 10.',
      solucao: `<?php $faltam = $totalCarimbos - $carimbos; ?>
<?php if ($faltam <= 0): ?>
    <p class="status aberto">Parabéns! Seu próximo café é grátis.</p>
<?php else: ?>
    <p>Faltam <?= $faltam ?> <?= $faltam == 1 ? "café" : "cafés" ?> para o próximo grátis.</p>
<?php endif; ?>`
    },
    {
      nivel: 'Intermediário', titulo: 'Promoção para todos os dias',
      texto: 'Complete o <code>match</code> com uma promoção diferente para terça, quinta e sábado. Para domingo, mostre "Hoje estamos fechados. Até segunda!".',
      solucao: `$promocao = match ($diaSemana) {
    1 => "Segunda do Expresso: 2 por R$ 9,00",
    2 => "Terça do Pão de Queijo: porção dupla",
    3 => "Quarta do Cappuccino: 20% de desconto",
    4 => "Quinta do Café com Leite: R$ 5,00",
    5 => "Sexta Doce: fatia de bolo grátis no combo",
    6 => "Sábado em Família: 10% para 3 pessoas ou mais",
    7 => "Hoje estamos fechados. Até segunda!",
};`
    },
    {
      nivel: 'Avançado', titulo: 'Horário de pico',
      texto: 'Entre 7h e 9h e entre 12h e 14h a fila é grande. Nesses horários, mostre um aviso "Horário de movimento: peça pelo balcão rápido". Use <code>||</code> e <code>&amp;&amp;</code> na mesma condição.',
      solucao: `<?php $pico = ($hora >= 7 && $hora < 9) || ($hora >= 12 && $hora < 14); ?>
<?php if ($aberto && $pico): ?>
    <p class="status fechado">Horário de movimento: peça pelo balcão rápido</p>
<?php endif; ?>`
    },
    {
      nivel: 'Avançado', titulo: 'Tabela de preços com laço',
      texto: 'Crie uma tabela "Leve mais, pague menos" para o expresso (R$ 5,50): de 1 a 6 unidades, mostre a quantidade e o total. A partir de 3 unidades há 10% de desconto. Gere as linhas com <code>for</code>.',
      dica: 'Total com desconto = total * 0.9. Formate com <code>number_format($total, 2, ",", ".")</code>.',
      solucao: `<table>
    <tr><th>Qtd.</th><th>Total</th></tr>
    <?php for ($q = 1; $q <= 6; $q++): ?>
        <?php
            $total = 5.50 * $q;
            if ($q >= 3) {
                $total = $total * 0.9;   // 10% de desconto
            }
        ?>
        <tr><td><?= $q ?></td><td>R$ <?= number_format($total, 2, ",", ".") ?></td></tr>
    <?php endfor; ?>
</table>`
    }
  ],
  revisao: [
    '<code>if / elseif / else</code> funcionam como no JavaScript; em PHP o <code>elseif</code> é junto.',
    '<code>&amp;&amp;</code> exige as duas condições; <code>||</code> aceita qualquer uma; <code>!</code> inverte.',
    '<code>=</code> guarda valor, <code>==</code> compara valor, <code>===</code> compara valor e tipo.',
    'No meio do HTML, prefira <code>if (...):</code> ... <code>endif;</code> e <code>for (...):</code> ... <code>endfor;</code>.',
    '<code>match</code> escolhe um resultado entre várias opções; <code>??</code> define um valor padrão.'
  ],
  slides: [
    { capa: true, t: 'Decisões e repetições', b: ['O site que reage ao horário'],
      notas: 'Retome a aula anterior: o PHP já sabe mostrar variáveis e a data. Hoje ele vai decidir sozinho o que mostrar.' },
    { t: 'Sites que decidem', b: [{ lista: ['"Bom dia" ou "Boa noite"?', 'Loja aberta ou fechada?', 'Mostrar o botão "Entrar" ou "Sair"?', 'Produto disponível ou esgotado?'] }, { analogia: 'O porteiro: SE for morador, libera. SENÃO, interfona.' }],
      notas: 'Peça exemplos de sites que mudam de acordo com uma condição (Netflix mostrando "Continuar assistindo", app de banco escondendo saldo etc.).' },
    { t: 'if em PHP é quase igual ao JS', b: [{ code: `$hora = (int) date("G");

if ($hora < 12) {
    $msg = "Bom dia";
} elseif ($hora < 18) {
    $msg = "Boa tarde";
} else {
    $msg = "Boa noite";
}`, lang: 'php' }, 'Diferenças: o <code>$</code> e o <code>elseif</code> junto.'],
      notas: 'Destaque o (int): date() devolve texto. Converter evita surpresas. Rode no laboratório trocando $hora manualmente.' },
    { t: 'Comparar e combinar', b: [{ colunas: [[{ tabela: { cab: ['Op.', 'Pergunta'], linhas: [['==', 'igual?'], ['!=', 'diferente?'], ['> <', 'maior/menor?'], ['>= <=', 'ou igual?']] } }], [{ tabela: { cab: ['Op.', 'Significa'], linhas: [['&&', 'E (as duas)'], ['||', 'OU (uma basta)'], ['!', 'NÃO']] } }]] },
      { atencao: '<code>=</code> guarda. <code>==</code> compara.' }],
      notas: 'Exemplo do parque: altura mínima E acompanhado (&&). Meia-entrada: estudante OU idoso (||).' },
    { t: 'if no meio do HTML', b: [{ code: `<?php if ($aberto): ?>
    <p class="verde">Aberto agora</p>
<?php else: ?>
    <p class="vermelho">Fechado</p>
<?php endif; ?>`, lang: 'php' }, 'O navegador recebe só o trecho "aceso".'],
      notas: 'Mostre o código-fonte do resultado no navegador para provar que só um dos parágrafos foi enviado.' },
    { t: 'match: a tabela de respostas', b: [{ code: `$promo = match ($diaSemana) {
    1 => "Expresso em dobro",
    5 => "Bolo grátis",
    6, 7 => "Fim de semana!",
    default => "Café do dia",
};`, lang: 'php' }, 'Mais curto que o <code>switch</code> e sem <code>break</code>.'],
      notas: 'Compare com o switch que eles viram no JS. Ressalte que match devolve um valor que guardamos numa variável.' },
    { t: 'Atalhos de uma linha', b: [{ code: `// ternário
$texto = $estoque > 0 ? "Disponível" : "Esgotado";

// ?? = valor padrão
$nome = $apelido ?? "Visitante";`, lang: 'php' }],
      notas: 'O ?? será essencial na aula de formulários. Plante a semente agora.' },
    { t: 'Repetições geram HTML', b: [{ code: `<select>
<?php for ($q = 1; $q <= 10; $q++): ?>
    <option><?= $q ?></option>
<?php endfor; ?>
</select>`, lang: 'php' }, 'Em vez de escrever 10 opções à mão, o PHP escreve por você.'],
      notas: 'Pergunte quanto tempo levariam para escrever 100 options. Com for, é a mesma linha.' },
    { t: 'while e o laço infinito', b: [{ code: `$saldo = 100; $meses = 0;
while ($saldo < 200) {
    $saldo = $saldo * 1.10;
    $meses++;   // sem isto, nunca termina
}`, lang: 'php' }, { atencao: 'Se a condição nunca ficar falsa, a página trava.' }],
      notas: 'Explique quando usar for (sei quantas vezes) e while (repito até algo acontecer).' },
    { t: 'Mão na massa: Cafeteria Grão Dourado', b: [{ passos: ['Abra "Aula 02 — Cafeteria Grão Dourado"', 'Teste horários com <code>$hora = 20;</code>', 'Feche aos domingos e mostre quanto falta no fidelidade', 'Avançado: horário de pico e tabela de preços'] }],
      notas: 'Lembre de mostrar como testar outros horários usando as linhas comentadas. No fim, peça para alguém explicar a condição do horário de pico.' }
  ]
});
