/* AULA 01 — Como a web funciona e o primeiro PHP */
AULAS.push({
  n: 1,
  titulo: 'Como a web funciona e o seu primeiro PHP',
  curto: 'Primeiro PHP',
  resumo: 'Entenda a diferença entre cliente e servidor, escreva seus primeiros comandos em PHP e transforme um portfólio estático em dinâmico.',
  conteudos: 'Cliente x servidor, tags PHP, echo, comentários, variáveis, tipos, concatenação, date()',
  objetivos: [
    'Explicar com suas palavras a diferença entre o que roda no navegador (cliente) e no servidor.',
    'Escrever código PHP dentro de uma página HTML usando <code>&lt;?php ?&gt;</code> e <code>&lt;?= ?&gt;</code>.',
    'Criar variáveis dos tipos texto, número e verdadeiro/falso.',
    'Juntar textos com o operador ponto (<code>.</code>) e com aspas duplas.',
    'Usar a função <code>date()</code> para mostrar data e hora automaticamente.'
  ],
  cronograma: [
    ['0:00 – 0:15', 'Boas-vindas, revisão de HTML/CSS/JS e apresentação da disciplina'],
    ['0:15 – 0:35', 'Cliente x servidor: a analogia do restaurante'],
    ['0:35 – 1:00', 'Primeiros comandos: echo, comentários e variáveis (com exemplos no laboratório)'],
    ['1:00 – 1:10', 'Intervalo'],
    ['1:10 – 1:25', 'Concatenação, aspas e date()'],
    ['1:25 – 1:55', 'Projeto: Portfólio pessoal dinâmico + desafios'],
    ['1:55 – 2:00', 'Fechamento e revisão']
  ],
  secoes: [
    {
      titulo: 'O que você já sabe (e o que falta)',
      blocos: [
        'Na disciplina anterior você aprendeu três linguagens que trabalham juntas no navegador:',
        { tabela: { cab: ['Linguagem', 'Papel', 'Exemplo'], linhas: [
          ['HTML', 'Estrutura: o que existe na página', 'Títulos, parágrafos, imagens, formulários'],
          ['CSS', 'Aparência: como a página se parece', 'Cores, fontes, espaçamentos, layout'],
          ['JavaScript', 'Comportamento: reage ao usuário', 'Abrir um menu, validar um campo, mostrar um alerta']
        ] } },
        'Com essas três você monta sites bonitos e interativos. Mas tente responder: quando alguém preenche o formulário de contato do seu site, <strong>para onde vai a mensagem?</strong> Se você atualizar a página, o que foi digitado some. Falta um lugar que <strong>guarde</strong> e <strong>processe</strong> informações. Esse lugar é o <strong>servidor</strong>, e a linguagem que vamos usar nele é o <strong>PHP</strong>.',
        { analogia: 'Pense num <strong>restaurante</strong>. O salão é o navegador: é lá que o cliente vê o prato (HTML), percebe a decoração (CSS) e conversa com o garçom (JavaScript). A <strong>cozinha</strong> é o servidor: o cliente não vê, mas é ali que os pedidos são recebidos, os ingredientes ficam guardados e os pratos são preparados. O PHP é o <strong>cozinheiro</strong>.' }
      ]
    },
    {
      titulo: 'Cliente e servidor',
      blocos: [
        'Toda vez que você abre um site acontece uma conversa chamada <strong>requisição e resposta</strong>:',
        { fluxo: [['1. Navegador pede', 'Você digita o endereço ou clica num link'], ['2. Servidor executa o PHP', 'Busca dados, faz contas, decide o que mostrar'], ['3. PHP gera HTML', 'O resultado é uma página HTML comum'], ['4. Navegador mostra', 'Aplica o CSS e roda o JavaScript']] },
        'Um detalhe importante: o navegador <strong>nunca recebe o código PHP</strong>, só o HTML que ele produziu. Se você clicar com o botão direito e escolher "Exibir código-fonte" num site em PHP, não verá nenhuma linha de PHP. Isso é ótimo para a segurança: senhas e regras do sistema ficam escondidas no servidor.',
        { tabela: { cab: ['', 'JavaScript', 'PHP'], linhas: [
          ['Onde roda', 'No navegador (computador do visitante)', 'No servidor (computador da empresa/hospedagem)'],
          ['Quando roda', 'Depois que a página chegou', 'Antes de a página ser enviada'],
          ['O visitante vê o código?', 'Sim (pode abrir e ler)', 'Não, só vê o resultado'],
          ['Bom para', 'Interação, animações, validação rápida', 'Guardar dados, login, e-mails, regras de negócio']
        ] } },
        { dica: 'PHP e JavaScript não são rivais. Em quase todo site profissional os dois trabalham juntos: o PHP prepara a página e o JavaScript deixa ela interativa.' }
      ]
    },
    {
      titulo: 'Seu primeiro código PHP',
      blocos: [
        'Arquivos PHP terminam em <code>.php</code> e podem ter HTML normal. O código PHP fica entre a tag de abertura <code>&lt;?php</code> e a de fechamento <code>?&gt;</code>. O comando <code>echo</code> "escreve" algo na página.',
        { code: `<!DOCTYPE html>
<html lang="pt-BR">
<body>
    <h1>Minha primeira página PHP</h1>

    <?php
        // Tudo aqui dentro roda no servidor
        echo "<p>Olá, mundo! Este parágrafo foi escrito pelo PHP.</p>";
    ?>
</body>
</html>`, lang: 'php', file: 'index.php', run: true },
        'Repare em três regras que valem para todo o curso:',
        { lista: [
          'Todo comando PHP termina com <strong>ponto e vírgula</strong> <code>;</code> (igual ao JavaScript, mas aqui é obrigatório).',
          'O <code>echo</code> pode escrever texto <strong>e também tags HTML</strong>: o navegador vai interpretar o resultado.',
          'Comentários servem para explicar o código e são ignorados pelo PHP.'
        ] },
        { code: `<?php
// Comentário de uma linha (igual ao JavaScript)
# Também é comentário de uma linha

/*
   Comentário de várias linhas.
   Use para explicar blocos maiores.
*/
echo "Os comentários não aparecem na página.";
?>`, lang: 'php', run: true },
        { compara: [
          { titulo: 'JavaScript', lang: 'js', code: `// mostra no console do navegador
console.log("Olá!");

// escreve na página
document.body.innerHTML += "<p>Olá!</p>";` },
          { titulo: 'PHP', lang: 'php', code: `<?php
// escreve direto no HTML
// que será enviado ao navegador
echo "<p>Olá!</p>";
?>` }
        ] }
      ]
    },
    {
      titulo: 'Variáveis: caixinhas com etiqueta',
      blocos: [
        'Uma variável guarda uma informação para usar depois. Em PHP, <strong>toda variável começa com cifrão</strong> <code>$</code>. Não existe <code>let</code> nem <code>const</code>: basta escrever o nome e atribuir um valor com <code>=</code>.',
        { analogia: 'Imagine caixas de mudança com etiquetas. A etiqueta é o nome (<code>$nome</code>) e o que está dentro é o valor (<code>"Ana"</code>). O cifrão é como o adesivo que diz "isto é uma caixa".' },
        { compara: [
          { titulo: 'JavaScript', lang: 'js', code: `let nome = "Ana";
let idade = 17;
let altura = 1.65;
let estudante = true;` },
          { titulo: 'PHP', lang: 'php', code: `<?php
$nome = "Ana";      // string (texto)
$idade = 17;        // int (inteiro)
$altura = 1.65;     // float (decimal)
$estudante = true;  // bool (verdadeiro/falso)` }
        ] },
        { tabela: { cab: ['Tipo', 'O que guarda', 'Exemplo'], linhas: [
          ['<code>string</code>', 'Texto, sempre entre aspas', '<code>"Campinas"</code>'],
          ['<code>int</code>', 'Número inteiro', '<code>2025</code>'],
          ['<code>float</code>', 'Número com casas decimais (use ponto)', '<code>19.90</code>'],
          ['<code>bool</code>', 'Verdadeiro ou falso', '<code>true</code> / <code>false</code>']
        ] } },
        { atencao: 'Nomes de variáveis diferenciam maiúsculas de minúsculas: <code>$nome</code> e <code>$Nome</code> são caixas diferentes. Não use espaços nem acentos: prefira <code>$anoNascimento</code> ou <code>$ano_nascimento</code>.' },
        'Quando quiser "espiar" o que está dentro de uma variável, use <code>var_dump()</code>. Ele mostra o tipo e o valor, muito útil para encontrar erros:',
        { code: `<?php
$preco = 19.90;
$quantidade = 3;
var_dump($preco);       // float(19.9)
var_dump($quantidade);  // int(3)
?>`, lang: 'php', run: true }
      ]
    },
    {
      titulo: 'Juntando textos: ponto e aspas',
      blocos: [
        'Em JavaScript você junta textos com <code>+</code>. Em PHP o <code>+</code> é <strong>só para contas</strong>; para juntar textos usamos o <strong>ponto</strong> <code>.</code> (chamado de concatenação).',
        { compara: [
          { titulo: 'JavaScript', lang: 'js', code: `let nome = "Ana";
let msg = "Olá, " + nome + "!";` },
          { titulo: 'PHP', lang: 'php', code: `<?php
$nome = "Ana";
$msg = "Olá, " . $nome . "!";` }
        ] },
        'Existe um atalho: dentro de <strong>aspas duplas</strong> o PHP troca a variável pelo valor automaticamente. Dentro de <strong>aspas simples</strong>, não.',
        { code: `<?php
$nome = "Ana";
$cidade = "Campinas";

echo "Olá, $nome de $cidade!";      // Olá, Ana de Campinas!
echo '<br>';
echo 'Olá, $nome!';                  // Olá, $nome!  (aspas simples não trocam)
echo '<br>';
echo "Olá, {$nome}zinha!";           // use chaves quando a variável encosta em outro texto
?>`, lang: 'php', run: true },
        { analogia: 'Aspas duplas são como um formulário com campos em branco que o PHP preenche sozinho. Aspas simples são uma fotocópia: o que está escrito sai exatamente igual.', rotulo: 'Comparação' }
      ]
    },
    {
      titulo: 'Contas e datas automáticas',
      blocos: [
        'O PHP faz contas com os mesmos operadores do JavaScript: <code>+</code> <code>-</code> <code>*</code> <code>/</code> e <code>%</code> (resto da divisão).',
        { code: `<?php
$preco = 25.50;
$quantidade = 4;
$total = $preco * $quantidade;

echo "Total: R$ " . $total;                          // Total: R$ 102
echo "<br>";
echo "Total formatado: R$ " . number_format($total, 2, ",", ".");   // R$ 102,00
?>`, lang: 'php', run: true },
        'A função <code>date()</code> devolve a data e a hora do servidor no formato que você pedir. Cada letra representa uma parte da data:',
        { tabela: { cab: ['Letra', 'Significa', 'Exemplo'], linhas: [
          ['<code>d</code>', 'Dia com dois dígitos', '05'], ['<code>m</code>', 'Mês com dois dígitos', '03'],
          ['<code>Y</code>', 'Ano com quatro dígitos', '2026'], ['<code>H</code>', 'Hora (00 a 23)', '14'],
          ['<code>i</code>', 'Minutos', '07'], ['<code>s</code>', 'Segundos', '45']
        ] } },
        { code: `<?php
echo "Hoje é " . date("d/m/Y");          // Hoje é 13/11/2026
echo "<br>Agora são " . date("H:i");     // Agora são 14:07

$anoNascimento = 2009;
$idade = date("Y") - $anoNascimento;
echo "<br>Quem nasceu em $anoNascimento tem (ou fará) $idade anos este ano.";
?>`, lang: 'php', run: true },
        { dica: 'No rodapé de sites é comum ver "© 2024". Com <code>&lt;?= date("Y") ?&gt;</code> o ano se atualiza sozinho e você nunca mais precisa editar.' }
      ]
    },
    {
      titulo: 'PHP dentro do HTML',
      blocos: [
        'O jeito mais comum de usar PHP é <strong>misturar com o HTML</strong>: preparamos as variáveis no topo do arquivo e depois "encaixamos" os valores nos lugares certos da página.',
        'Para só mostrar um valor existe um atalho: <code>&lt;?= $variavel ?&gt;</code> é o mesmo que <code>&lt;?php echo $variavel; ?&gt;</code>.',
        { code: `<?php
// 1) Preparação: dados no topo do arquivo
$produto = "Fone Bluetooth";
$preco   = 149.90;
?>
<!-- 2) Apresentação: HTML com "buracos" preenchidos pelo PHP -->
<div class="card">
    <h2><?= $produto ?></h2>
    <p>Por apenas R$ <?= number_format($preco, 2, ",", ".") ?></p>
    <small>Oferta válida em <?= date("d/m/Y") ?></small>
</div>`, lang: 'php', run: true },
        { analogia: 'É como uma carta de modelo com lacunas: "Prezado(a) ______, seu pedido nº ______ foi enviado." O HTML é a carta; o PHP preenche as lacunas antes de enviar.' }
      ]
    },
    {
      titulo: 'Como usar o laboratório',
      blocos: [
        'O <a href="laboratorio.html">laboratório</a> deste site roda um PHP de verdade dentro do seu navegador. Não precisa instalar nada.',
        { passos: [
          'Escolha o projeto da aula na lista do topo (ex.: "Aula 01 — Portfólio pessoal").',
          'À esquerda ficam os arquivos (<code>index.php</code>, <code>style.css</code>, <code>script.js</code>). Clique numa aba para editar.',
          'Clique em <strong>Executar</strong> (ou <kbd>Ctrl</kbd> + <kbd>Enter</kbd>) para ver o resultado à direita.',
          'Erros do PHP aparecem no <strong>Console</strong>, com o arquivo e a linha. Clique na mensagem para ir até a linha.',
          'Seu código fica salvo no navegador. Use <strong>Baixar .zip</strong> para levar o projeto para casa ou para o XAMPP.'
        ] },
        { atencao: 'O código é salvo no navegador do computador que você está usando. Se trocar de computador, baixe o .zip antes.' }
      ]
    }
  ],
  modelo: {
    nome: 'Portfólio pessoal',
    descricao: 'Página de apresentação de um estudante. Parte dos dados já vem de variáveis PHP; outra parte ainda está "fixa" no HTML esperando você automatizar.',
    inicial: 'index.php',
    arquivos: {
      'index.php': `<?php
/* =========================================================
   AULA 01 — PORTFÓLIO PESSOAL
   Tudo que está entre <?php e ?> roda NO SERVIDOR.
   O navegador só recebe o HTML que sobrar no final.
   ========================================================= */

// 1) VARIÁVEIS: "caixinhas" com os dados da pessoa
$nome      = "Ana Souza";
$profissao = "Estudante de Desenvolvimento de Sistemas";
$cidade    = "Campinas - SP";
$anoInicio = 2025;      // ano em que começou a programar (int)

// 2) CÁLCULOS: o PHP faz contas antes de montar a página
$anoAtual   = date("Y");               // ano do servidor, ex.: 2026
$anosEstudo = $anoAtual - $anoInicio;  // quantos anos de estudo
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- até o título da aba pode vir de uma variável -->
    <title><?= $nome ?> | Portfólio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <header class="topo">
        <div class="avatar">A</div>
        <h1><?= $nome ?></h1>
        <p class="cargo"><?= $profissao ?></p>
        <p class="local"><?= $cidade ?></p>
    </header>

    <main class="conteudo">
        <section class="cartao">
            <h2>Sobre mim</h2>
            <!-- echo + concatenação com o ponto (.) -->
            <p><?php echo "Olá! Sou " . $nome . " e estudo programação há " . $anosEstudo . " ano(s)."; ?></p>
            <p>Gosto de criar sites e estou aprendendo PHP para deixá-los mais inteligentes.</p>
        </section>

        <section class="cartao">
            <h2>Habilidades</h2>
            <!-- DESAFIO: estes níveis ainda estão fixos no HTML -->
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
            <!-- DESAFIO: crie a variável $email e use aqui -->
            <p>E-mail: ana@email.com</p>
            <button id="btn-saudacao" class="botao">Dizer olá</button>
        </section>
    </main>

    <footer class="rodape">
        <!-- DESAFIO: o ano está fixo. Deixe automático com date("Y") -->
        <p>&copy; 2024 <?= $nome ?>. Feito com HTML, CSS, JS e PHP.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
`,
      'style.css': `/* Estilo do portfólio — você já conhece tudo isto da disciplina anterior */
* { box-sizing: border-box; }
body {
    margin: 0;
    font-family: "Segoe UI", system-ui, sans-serif;
    background: #f4f5f7;
    color: #22252b;
}
.topo {
    background: #4f5b93;
    color: #fff;
    text-align: center;
    padding: 48px 16px 40px;
}
.avatar {
    width: 84px; height: 84px; margin: 0 auto 14px;
    border-radius: 50%;
    background: #fff; color: #4f5b93;
    display: grid; place-items: center;
    font-size: 36px; font-weight: 700;
}
.topo h1 { margin: 0; font-size: 30px; }
.cargo { margin: 6px 0 0; opacity: .9; }
.local { margin: 4px 0 0; opacity: .7; font-size: 14px; }
.conteudo { max-width: 720px; margin: -20px auto 0; padding: 0 16px; }
.cartao {
    background: #fff;
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 16px;
    box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.cartao h2 { margin-top: 0; font-size: 18px; color: #4f5b93; }
.habilidade { display: grid; grid-template-columns: 100px 1fr; align-items: center; gap: 12px; margin-bottom: 10px; }
.barra { background: #e7e8ee; height: 10px; border-radius: 99px; overflow: hidden; }
.nivel { background: #4f5b93; height: 100%; }
.botao {
    background: #4f5b93; color: #fff; border: 0;
    padding: 10px 18px; border-radius: 8px; cursor: pointer; font-size: 15px;
}
.rodape { text-align: center; color: #777; font-size: 14px; padding: 24px; }
`,
      'script.js': `// JavaScript: roda no NAVEGADOR, depois que o PHP já terminou o trabalho.
// O PHP montou o HTML; o JS só reage aos cliques do visitante.
const botao = document.getElementById("btn-saudacao");

botao.addEventListener("click", function () {
    alert("Olá! Obrigado por visitar meu portfólio.");
});
`
    }
  },
  modeloTexto: [
    'Procure no código os comentários com a palavra <strong>DESAFIO</strong>: eles marcam os lugares que ainda estão fixos e que você vai deixar automáticos.'
  ],
  desafios: [
    {
      nivel: 'Básico', titulo: 'Seus dados',
      texto: 'Troque os valores das variáveis <code>$nome</code>, <code>$profissao</code>, <code>$cidade</code> e <code>$anoInicio</code> pelos seus. A letra do avatar também deve mudar: troque o "A" fixo por <code>&lt;?= $nome[0] ?&gt;</code> (a primeira letra do nome).',
      dica: '<code>$nome[0]</code> pega o primeiro caractere do texto, como no JavaScript.',
      solucaoTexto: 'Basta alterar os valores no topo do arquivo. No avatar: <code>&lt;div class="avatar"&gt;&lt;?= $nome[0] ?&gt;&lt;/div&gt;</code>. Observação: se o nome começar com letra acentuada, <code>$nome[0]</code> mostra um caractere estranho; use <code>mb_substr($nome, 0, 1)</code>.'
    },
    {
      nivel: 'Básico', titulo: 'Rodapé que nunca envelhece',
      texto: 'O ano no rodapé está fixo em 2024. Faça ele aparecer sempre atualizado.',
      dica: 'Você já tem a variável <code>$anoAtual</code> pronta no topo do arquivo.',
      solucao: `<p>&copy; <?= $anoAtual ?> <?= $nome ?>. Feito com HTML, CSS, JS e PHP.</p>`
    },
    {
      nivel: 'Básico', titulo: 'E-mail em variável',
      texto: 'Crie a variável <code>$email</code> no topo do arquivo e use ela na seção Contato. Depois transforme o texto num link clicável: <code>&lt;a href="mailto:..."&gt;</code>.',
      solucao: `<?php $email = "ana@email.com"; ?>
<p>E-mail: <a href="mailto:<?= $email ?>"><?= $email ?></a></p>`
    },
    {
      nivel: 'Intermediário', titulo: 'Idade automática',
      texto: 'Crie <code>$anoNascimento</code> e calcule a idade. Mostre no "Sobre mim" a frase: "Tenho X anos e moro em CIDADE." usando <strong>aspas duplas</strong> (sem o ponto).',
      solucao: `<?php
$anoNascimento = 2009;
$idade = $anoAtual - $anoNascimento;
?>
<p><?= "Tenho $idade anos e moro em $cidade." ?></p>`
    },
    {
      nivel: 'Intermediário', titulo: 'Carimbo de data e hora',
      texto: 'Abaixo do rodapé, mostre: "Página gerada em 13/11/2026 às 14:07". Execute duas vezes com um minuto de diferença e veja a hora mudar sozinha.',
      solucao: `<p class="gerado">Página gerada em <?= date("d/m/Y") ?> às <?= date("H:i") ?></p>`
    },
    {
      nivel: 'Avançado', titulo: 'Barras de habilidade com variáveis',
      texto: 'Crie as variáveis <code>$nivelHtml</code>, <code>$nivelCss</code>, <code>$nivelJs</code> e <code>$nivelPhp</code> (números de 0 a 100) e use cada uma no <code>style="width: ...%"</code> da barra. Mostre também o número ao lado do nome, ex.: "HTML (80%)". Por fim, calcule e mostre a <strong>média</strong> das quatro habilidades.',
      dica: 'Média = soma dividida pela quantidade. Para arredondar use <code>round($media)</code>.',
      solucao: `<?php
$nivelHtml = 80; $nivelCss = 70; $nivelJs = 50; $nivelPhp = 15;
$media = round(($nivelHtml + $nivelCss + $nivelJs + $nivelPhp) / 4);
?>
<div class="habilidade">
    <span>HTML (<?= $nivelHtml ?>%)</span>
    <div class="barra"><div class="nivel" style="width: <?= $nivelHtml ?>%"></div></div>
</div>
<!-- ...repita para CSS, JS e PHP... -->
<p>Média geral: <?= $media ?>%</p>`
    }
  ],
  revisao: [
    'O <strong>PHP roda no servidor</strong> e entrega ao navegador apenas HTML. O JavaScript roda no navegador.',
    'Código PHP fica entre <code>&lt;?php</code> e <code>?&gt;</code>; para só mostrar um valor use <code>&lt;?= $valor ?&gt;</code>.',
    'Toda variável começa com <code>$</code> e todo comando termina com <code>;</code>.',
    'Junte textos com o ponto <code>.</code>; aspas duplas trocam variáveis pelo valor, aspas simples não.',
    '<code>date("d/m/Y H:i")</code> mostra a data e hora atuais; <code>number_format()</code> formata dinheiro.'
  ],
  slides: [
    { capa: true, t: 'Como a web funciona e o seu primeiro PHP', b: ['Do site estático ao site que pensa sozinho'],
      notas: 'Apresente-se e apresente a disciplina: 10 aulas, cada uma com um site pronto que os alunos vão melhorar com PHP. Mostre rapidamente o site da disciplina e o laboratório.' },
    { t: 'O que vocês já sabem', b: [{ tabela: { cab: ['Linguagem', 'Papel'], linhas: [['HTML', 'Estrutura (o esqueleto)'], ['CSS', 'Aparência (a roupa)'], ['JavaScript', 'Comportamento (os movimentos)']] } },
      'Pergunta: quando alguém envia o formulário de contato do seu site, <strong>para onde vai a mensagem?</strong>'],
      notas: 'Deixe os alunos responderem. A ideia é chegar na conclusão de que, só com HTML/CSS/JS, os dados se perdem ao recarregar a página. Falta um "lugar" para guardar e processar: o servidor.' },
    { t: 'A analogia do restaurante', b: [{ colunas: [[{ h: 'Salão = navegador' }, { lista: ['Prato servido = HTML', 'Decoração = CSS', 'Garçom = JavaScript'] }], [{ h: 'Cozinha = servidor' }, { lista: ['Cozinheiro = PHP', 'Despensa = dados/arquivos', 'O cliente não vê a cozinha'] }]] }],
      notas: 'Reforce que o cliente nunca entra na cozinha: ele só recebe o prato pronto. Assim como o navegador nunca recebe o código PHP, só o HTML pronto.' },
    { t: 'Requisição e resposta', b: [{ fluxo: [['Navegador pede', 'clica no link'], ['Servidor executa PHP', 'busca, calcula, decide'], ['PHP gera HTML', 'página pronta'], ['Navegador mostra', 'aplica CSS e JS']] },
      { dica: 'Faça o teste: "Exibir código-fonte" num site PHP. Nenhuma linha de PHP aparece.' }],
      notas: 'Se possível, mostre o código-fonte de um site real feito em PHP (ex.: um site WordPress) e mostre que só há HTML.' },
    { t: 'Onde cada linguagem roda', b: [{ tabela: { cab: ['', 'JavaScript', 'PHP'], linhas: [['Roda em', 'Navegador', 'Servidor'], ['Quando', 'Depois que a página chega', 'Antes de enviar a página'], ['Visitante vê o código?', 'Sim', 'Não'], ['Bom para', 'Interação', 'Dados, login, regras']] } }],
      notas: 'Pergunte: onde vocês colocariam a verificação de senha de um banco? No JS (que o usuário pode ler e alterar) ou no PHP? Leve-os a concluir: no servidor.' },
    { t: 'Primeiro código PHP', b: [{ code: `<h1>Minha página</h1>
<?php
    // roda no servidor
    echo "<p>Olá, mundo!</p>";
?>`, lang: 'php' }, { lista: ['Arquivo termina em <code>.php</code>', 'Código entre <code>&lt;?php</code> e <code>?&gt;</code>', 'Todo comando termina com <code>;</code>'] }],
      notas: 'Abra o laboratório (Projeto em branco) e digite este exemplo ao vivo. Mostre o erro que aparece ao esquecer o ponto e vírgula: o console indica a linha.' },
    { t: 'Variáveis: JS x PHP', b: [{ compara: [{ titulo: 'JavaScript', lang: 'js', code: `let nome = "Ana";
let idade = 17;
let ativo = true;` }, { titulo: 'PHP', lang: 'php', code: `$nome = "Ana";
$idade = 17;
$ativo = true;` }] }, 'Sem <code>let</code>: o <strong>cifrão</strong> já diz "isto é uma variável".'],
      notas: 'Use a analogia das caixas com etiqueta. Mostre var_dump() para ver o tipo. Comente que $nome e $Nome são diferentes.' },
    { t: 'Juntando textos', b: [{ compara: [{ titulo: 'JavaScript', lang: 'js', code: `"Olá, " + nome + "!"` }, { titulo: 'PHP', lang: 'php', code: `"Olá, " . $nome . "!"
"Olá, $nome!"   // aspas duplas` }] },
      { analogia: 'Aspas duplas = formulário que o PHP preenche. Aspas simples = fotocópia, sai igual.' }],
      notas: 'Erro clássico de quem vem do JS: usar + para juntar texto em PHP. O PHP tenta somar e gera aviso/erro. Mostre isso ao vivo.' },
    { t: 'PHP dentro do HTML', b: [{ code: `<?php $produto = "Fone"; $preco = 149.9; ?>
<h2><?= $produto ?></h2>
<p>R$ <?= number_format($preco, 2, ",", ".") ?></p>
<small>Hoje: <?= date("d/m/Y") ?></small>`, lang: 'php' }, '<code>&lt;?= ?&gt;</code> é o atalho para <code>echo</code>.'],
      notas: 'Explique a ideia de "carta com lacunas": dados no topo, HTML embaixo com os buracos preenchidos. É o padrão que usaremos em todas as aulas.' },
    { t: 'Mão na massa: Portfólio pessoal', b: [{ passos: ['Abra o laboratório e escolha "Aula 01 — Portfólio pessoal"', 'Procure os comentários <strong>DESAFIO</strong> no código', 'Coloque seus dados, ano automático e e-mail em variável', 'Avançado: barras de habilidade com variáveis e média'] }],
      notas: 'Circule pela sala. O desafio avançado é bom para os alunos mais rápidos. No fechamento, peça para dois alunos mostrarem o portfólio e explicarem uma linha de PHP.' }
  ]
});
