/* AULA 05 — Validação e segurança */
AULAS.push({
  n: 5,
  titulo: 'Validação e segurança: nunca confie no formulário',
  curto: 'Validação e segurança',
  resumo: 'Confira os dados antes de usar, mostre mensagens de erro em cada campo, mantenha o que foi digitado e proteja a página contra códigos maliciosos.',
  conteudos: 'trim, validação no servidor, filter_var, preg_replace, array de erros, formulário "pegajoso", XSS e htmlspecialchars, mail()',
  objetivos: [
    'Entender por que a validação no servidor é obrigatória, mesmo com validação em HTML/JS.',
    'Limpar e validar campos com <code>trim()</code>, <code>mb_strlen()</code> e <code>filter_var()</code>.',
    'Guardar os erros num array e mostrar cada mensagem ao lado do seu campo.',
    'Manter os valores digitados quando o formulário volta com erro.',
    'Proteger a página contra XSS usando <code>htmlspecialchars()</code>.'
  ],
  cronograma: [
    ['0:00 – 0:10', 'Revisão: $_POST, isset e ??'],
    ['0:10 – 0:30', 'Por que validar no servidor? Demonstração burlando o "required" pelo navegador'],
    ['0:30 – 0:55', 'Limpar, validar e acumular erros num array'],
    ['0:55 – 1:05', 'Intervalo'],
    ['1:05 – 1:25', 'Formulário pegajoso, XSS ao vivo e htmlspecialchars; mail()'],
    ['1:25 – 1:55', 'Projeto: inscrições da Semana Tech + desafios'],
    ['1:55 – 2:00', 'Fechamento']
  ],
  secoes: [
    {
      titulo: 'Por que validar no servidor?',
      blocos: [
        'Na disciplina anterior você usou <code>required</code>, <code>type="email"</code> e validações em JavaScript. Elas são ótimas para a <strong>experiência</strong> do usuário, mas <strong>não protegem nada</strong>: qualquer pessoa pode abrir as ferramentas do navegador (F12), apagar o <code>required</code> e enviar o que quiser. Também é possível enviar dados para o PHP sem usar o formulário.',
        { analogia: 'A validação em HTML/JS é a <strong>placa</strong> na porta do prédio: "Entrada somente de moradores". Ajuda quem é honesto, mas não impede ninguém. A validação em PHP é o <strong>porteiro</strong>: confere o documento de cada pessoa, sempre.' },
        { tabela: { cab: ['', 'Validação no navegador (HTML/JS)', 'Validação no servidor (PHP)'], linhas: [
          ['Objetivo', 'Avisar rápido, sem recarregar', 'Garantir que o dado é confiável'],
          ['Pode ser burlada?', 'Sim, facilmente', 'Não pelo visitante'],
          ['É obrigatória?', 'Recomendada', '<strong>Sempre</strong>']
        ] } },
        { dica: 'No projeto desta aula o formulário tem o atributo <code>novalidate</code>, que desliga a validação do navegador. Assim você consegue testar a validação do PHP sem que o navegador barre antes.' }
      ]
    },
    {
      titulo: 'Limpar, depois validar',
      blocos: [
        'O primeiro passo é <strong>limpar</strong>: tirar espaços extras que o usuário digitou sem querer. Depois, <strong>validar</strong> cada regra.',
        { tabela: { cab: ['Função', 'Para que serve', 'Exemplo'], linhas: [
          ['<code>trim($t)</code>', 'Remove espaços do início e do fim', '"  Ana  " → "Ana"'],
          ['<code>mb_strlen($t)</code>', 'Conta caracteres (funciona com acentos)', '<code>mb_strlen("João")</code> → 4'],
          ['<code>filter_var($e, FILTER_VALIDATE_EMAIL)</code>', 'Confere se é um e-mail válido', 'false para "ana@"'],
          ['<code>filter_var($n, FILTER_VALIDATE_INT)</code>', 'Confere se é um número inteiro', 'false para "12abc"'],
          ['<code>is_numeric($t)</code>', 'É um número (inteiro ou decimal)?', 'true para "3.5"'],
          ['<code>preg_replace(\'/\\D/\', \'\', $t)</code>', 'Remove tudo que não é dígito', '"(11) 9999-0000" → "1199990000"'],
          ['<code>in_array($v, $lista)</code>', 'O valor está na lista permitida?', 'Proteção para select e radio']
        ] } },
        { code: `<?php
$email = "  ana@email.com ";
$email = trim($email);                     // limpa

if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "E-mail válido: $email";
} else {
    echo "E-mail inválido!";
}

$telefone = "(11) 98888-7777";
$soNumeros = preg_replace('/\\D/', '', $telefone);   // \\D = "não dígito"
echo "<br>Telefone limpo: $soNumeros (" . strlen($soNumeros) . " dígitos)";
?>`, lang: 'php', run: true },
        { atencao: 'Um <code>&lt;select&gt;</code> também pode ser alterado pelo navegador. Se as opções são "web", "games" e "dados", confira se o valor recebido está mesmo nessa lista com <code>in_array()</code> ou <code>isset($lista[$valor])</code>.' }
      ]
    },
    {
      titulo: 'Juntando os erros num array',
      blocos: [
        'Em vez de parar no primeiro erro, a melhor experiência é mostrar <strong>todos os problemas de uma vez</strong>, cada um ao lado do seu campo. Para isso guardamos os erros num array associativo: a chave é o nome do campo, o valor é a mensagem.',
        { code: `<?php
$erros = [];
$nome = trim($_POST["nome"] ?? "");
$idade = $_POST["idade"] ?? "";

if ($nome === "") {
    $erros["nome"] = "Informe seu nome.";
} elseif (mb_strlen($nome) < 3) {
    $erros["nome"] = "Nome muito curto.";
}

if (!filter_var($idade, FILTER_VALIDATE_INT) || $idade < 14) {
    $erros["idade"] = "Idade mínima: 14 anos.";
}

// Nenhum erro? Então está tudo certo!
if (empty($erros)) {
    echo "Inscrição aceita!";
} else {
    foreach ($erros as $campo => $msg) {
        echo "<p style='color:#b00'>$msg</p>";
    }
}
?>`, lang: 'php', run: true },
        { analogia: 'É como a <strong>correção de uma prova</strong>: o professor não devolve a prova no primeiro erro; ele marca todas as questões erradas e você vê tudo o que precisa corrigir.' }
      ]
    },
    {
      titulo: 'Formulário que lembra o que foi digitado',
      blocos: [
        'Nada mais irritante do que preencher 10 campos, errar um e ter que digitar tudo de novo. O PHP resolve devolvendo os valores no atributo <code>value</code>. Chamamos isso de formulário "pegajoso" (<em>sticky form</em>).',
        { code: `<?php
$nome = $_POST["nome"] ?? "";
$curso = $_POST["curso"] ?? "";
$aceite = isset($_POST["aceite"]);
?>
<form method="post">
    <!-- input: devolve no value -->
    <input name="nome" value="<?= htmlspecialchars($nome) ?>">

    <!-- select: marca a opção com selected -->
    <select name="curso">
        <option value="ds" <?= $curso === "ds" ? "selected" : "" ?>>DS</option>
        <option value="adm" <?= $curso === "adm" ? "selected" : "" ?>>ADM</option>
    </select>

    <!-- checkbox: marca com checked -->
    <label><input type="checkbox" name="aceite" <?= $aceite ? "checked" : "" ?>> Aceito</label>
    <button>Enviar</button>
</form>`, lang: 'php', run: true }
      ]
    },
    {
      titulo: 'XSS: quando o usuário digita código',
      blocos: [
        'Imagine um mural de comentários. Alguém escreve no campo de mensagem: <code>&lt;script&gt;alert("invadido")&lt;/script&gt;</code>. Se o PHP mostrar esse texto na página sem tratamento, o navegador de <strong>todos os visitantes</strong> vai executar o script. Esse ataque se chama <strong>XSS</strong> (<em>Cross-Site Scripting</em>) e pode roubar contas, redirecionar para sites falsos e muito mais.',
        'A defesa é transformar os caracteres especiais do HTML em "texto inofensivo" com <code>htmlspecialchars()</code>:',
        { tabela: { cab: ['Caractere digitado', 'Vira', 'Resultado na tela'], linhas: [
          ['<code>&lt;</code>', '<code>&amp;lt;</code>', 'Aparece o símbolo &lt;, mas não abre tag'],
          ['<code>&gt;</code>', '<code>&amp;gt;</code>', 'Aparece o símbolo &gt;'],
          ['<code>"</code>', '<code>&amp;quot;</code>', 'Não fecha atributos'],
          ['<code>&amp;</code>', '<code>&amp;amp;</code>', 'Aparece o &amp;']
        ] } },
        { compara: [
          { titulo: 'Vulnerável', lang: 'php', code: `<?php
$msg = $_POST["mensagem"] ?? "";
// PERIGO: mostra o que veio do usuário
echo "<p>$msg</p>";` },
          { titulo: 'Protegido', lang: 'php', code: `<?php
$msg = $_POST["mensagem"] ?? "";
// SEGURO: neutraliza tags
echo "<p>" . htmlspecialchars($msg) . "</p>";` }
        ] },
        { analogia: 'É como colocar um <strong>texto entre aspas numa reportagem</strong>: o jornal reproduz exatamente o que a pessoa disse, mas deixa claro que é uma citação, e não uma ordem do jornal. O <code>htmlspecialchars</code> faz o navegador mostrar o código como texto, sem obedecê-lo.' },
        { dica: 'Regra de ouro: <strong>todo dado que veio do usuário e vai aparecer no HTML passa por <code>htmlspecialchars()</code></strong>. Como o nome é longo, é comum criar um atalho: <code>function e($t) { return htmlspecialchars($t, ENT_QUOTES, "UTF-8"); }</code>.' }
      ]
    },
    {
      titulo: 'Enviando e-mail com mail()',
      blocos: [
        'Depois de validar, é comum avisar alguém por e-mail. O PHP tem a função <code>mail(para, assunto, mensagem)</code>.',
        { code: `<?php
$para = "aluno@email.com";
$assunto = "Inscrição confirmada";
$mensagem = "Olá! Sua vaga na oficina está garantida.";

if (mail($para, $assunto, $mensagem)) {
    echo "E-mail enviado!";
}
?>`, lang: 'php', run: true },
        { nota: 'No laboratório o e-mail é <strong>simulado</strong>: ele aparece no Console (origem MAIL). Em um servidor real, o <code>mail()</code> depende de configuração da hospedagem. Em projetos profissionais usa-se a biblioteca <strong>PHPMailer</strong> com uma conta SMTP (Gmail, Outlook etc.).', rotulo: 'No laboratório' }
      ]
    }
  ],
  modelo: {
    nome: 'Inscrições da Semana Tech',
    descricao: 'Página de um evento escolar com formulário de inscrição em oficinas. Nome e e-mail já são validados; outros campos ainda não. E existe uma falha de segurança escondida para você encontrar.',
    inicial: 'index.php',
    arquivos: {
      'index.php': `<?php
/* =========================================================
   AULA 05 — SEMANA TECH: inscrição com validação
   Fluxo: LIMPAR -> VALIDAR -> (sem erros?) PROCESSAR
   ========================================================= */
require_once "funcoes.php";

// Oficinas disponíveis: chave (value do select) => nome
$oficinas = [
    "web"      => "Criando sites com PHP",
    "games"    => "Introdução a jogos 2D",
    "dados"    => "Planilhas e análise de dados",
    "robotica" => "Robótica com Arduino",
];

// Valores iniciais: formulário vazio, sem erros
$nome = $email = $telefone = $oficina = $mensagem = "";
$erros = [];
$sucesso = false;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 1) LIMPAR
    $nome     = trim($_POST["nome"] ?? "");
    $email    = trim($_POST["email"] ?? "");
    $telefone = trim($_POST["telefone"] ?? "");
    $oficina  = $_POST["oficina"] ?? "";
    $mensagem = trim($_POST["mensagem"] ?? "");

    // 2) VALIDAR (cada regra quebrada vira uma mensagem)
    if ($nome === "") {
        $erros["nome"] = "Informe seu nome.";
    } elseif (mb_strlen($nome) < 3) {
        $erros["nome"] = "O nome precisa ter pelo menos 3 letras.";
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erros["email"] = "Informe um e-mail válido.";
    }

    // DESAFIO: validar telefone (somente números, 10 ou 11 dígitos)
    // DESAFIO: validar se a oficina escolhida existe em $oficinas

    // 3) PROCESSAR (só se não houve nenhum erro)
    if (empty($erros)) {
        $sucesso = true;
        $nomeOficina = $oficinas[$oficina] ?? "a definir";
        mail($email, "Inscrição confirmada - Semana Tech",
             "Olá, $nome! Sua vaga em '$nomeOficina' está garantida.");
    }
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
    <!-- ========== TELA DE SUCESSO ========== -->
    <section class="cartao sucesso">
        <h2>Inscrição confirmada!</h2>
        <p>Obrigado, <strong><?= e($nome) ?></strong>. Enviamos os detalhes para <?= e($email) ?>.</p>
        <p>Oficina: <strong><?= e($nomeOficina) ?></strong></p>
        <!-- DESAFIO DE SEGURANÇA: esta linha tem uma falha. Qual? -->
        <p>Sua mensagem: <?= $mensagem ?></p>
        <a href="index.php">Fazer outra inscrição</a>
    </section>

<?php else: ?>
    <!-- ========== FORMULÁRIO ========== -->
    <section class="cartao">
        <h2>Faça sua inscrição</h2>

        <?php if (!empty($erros)): ?>
            <p class="alerta">Corrija os campos destacados (<?= count($erros) ?> erro(s)).</p>
        <?php endif; ?>

        <!-- novalidate: desliga a validação do navegador para testarmos a do PHP -->
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
                <!-- DESAFIO: este campo ainda não "lembra" o valor -->
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
`,
      'funcoes.php': `<?php
/* =========================================================
   FUNÇÕES DE APOIO À VALIDAÇÃO
   ========================================================= */

// "e" de escape: protege contra XSS ao mostrar dados do usuário
function e($texto) {
    return htmlspecialchars($texto, ENT_QUOTES, "UTF-8");
}

// Devolve o HTML da mensagem de erro de um campo (ou nada)
function erro($erros, $campo) {
    if (isset($erros[$campo])) {
        return '<span class="msg-erro">' . $erros[$campo] . '</span>';
    }
    return "";
}

// Remove tudo que não for número: "(11) 9999-0000" -> "1199990000"
function somenteNumeros($texto) {
    return preg_replace('/\\D/', '', $texto);
}
`,
      'style.css': `* { box-sizing: border-box; }
body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; background: #f2f4f8; color: #1d2433; }
.hero { background: #14213d; color: #fff; text-align: center; padding: 56px 16px 72px; }
.hero h1 { font-size: 44px; margin: 10px 0 6px; }
.hero p { color: #c8d0e0; margin: 0; }
.selo { display: inline-block; background: #fca311; color: #14213d; font-weight: 700; font-size: 13px; padding: 4px 12px; border-radius: 99px; }
.conteudo { max-width: 560px; margin: -40px auto 40px; padding: 0 16px; }
.cartao { background: #fff; border-radius: 14px; padding: 24px; box-shadow: 0 6px 24px rgba(20,33,61,.08); }
.cartao h2 { margin-top: 0; }
form { display: grid; gap: 14px; }
label { display: grid; gap: 6px; font-size: 14px; font-weight: 600; color: #3a4357; }
input, select, textarea { font: inherit; font-weight: 400; padding: 10px 12px; border: 1px solid #ccd3e0; border-radius: 8px; }
input:focus, select:focus, textarea:focus { outline: 2px solid #fca311; border-color: transparent; }
.invalido { border-color: #d64545; background: #fff6f6; }
.msg-erro { color: #c53030; font-size: 13px; font-weight: 500; }
.alerta { background: #fff1f1; color: #c53030; padding: 10px 14px; border-radius: 8px; font-size: 14px; }
button { background: #fca311; color: #14213d; border: 0; padding: 12px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; }
.sucesso { border-top: 6px solid #2f9e44; }
.sucesso h2 { color: #2f9e44; }
`
    }
  },
  modeloTexto: [
    'Experimente enviar o formulário vazio, com e-mail errado e com um nome de 2 letras. Depois preencha corretamente e veja o e-mail simulado aparecer no Console.',
    { atencao: 'Antes de corrigir a falha de segurança, provoque-a: na mensagem, digite <code>&lt;b style="color:red"&gt;Olá&lt;/b&gt;</code> e envie. O texto aparece vermelho e em negrito na confirmação, ou seja, o navegador obedeceu ao código digitado. Com um <code>&lt;script&gt;</code> seria muito pior.' }
  ],
  desafios: [
    {
      nivel: 'Básico', titulo: 'Corrija a falha de segurança',
      texto: 'Na tela de sucesso, a mensagem é mostrada sem proteção. Teste o ataque descrito acima e depois corrija usando a função <code>e()</code>.',
      solucao: `<p>Sua mensagem: <?= e($mensagem) ?></p>`
    },
    {
      nivel: 'Básico', titulo: 'Telefone e oficina "pegajosos"',
      texto: 'Faça o campo telefone manter o valor digitado (atributo <code>value</code>) e o select manter a oficina escolhida (atributo <code>selected</code>).',
      solucao: `<input type="tel" name="telefone" value="<?= e($telefone) ?>">

<?php foreach ($oficinas as $chave => $titulo): ?>
    <option value="<?= $chave ?>" <?= $oficina === $chave ? "selected" : "" ?>><?= $titulo ?></option>
<?php endforeach; ?>`
    },
    {
      nivel: 'Intermediário', titulo: 'Validar o telefone',
      texto: 'Use a função <code>somenteNumeros()</code> e aceite apenas telefones com 10 ou 11 dígitos. Caso contrário, registre <code>$erros["telefone"]</code>. Destaque o campo com a classe <code>invalido</code> como nos outros.',
      solucao: `$numeros = somenteNumeros($telefone);
if (strlen($numeros) < 10 || strlen($numeros) > 11) {
    $erros["telefone"] = "Informe DDD + número (10 ou 11 dígitos).";
}`
    },
    {
      nivel: 'Intermediário', titulo: 'Oficina obrigatória e real',
      texto: 'Garanta que a oficina foi escolhida <strong>e</strong> que ela existe no array <code>$oficinas</code> (alguém poderia alterar o value pelo F12).',
      dica: '<code>isset($oficinas[$oficina])</code> responde as duas perguntas de uma vez.',
      solucao: `if (!isset($oficinas[$oficina])) {
    $erros["oficina"] = "Escolha uma oficina da lista.";
}`
    },
    {
      nivel: 'Avançado', titulo: 'Aceite do regulamento',
      texto: 'Adicione um checkbox "Li e aceito o regulamento" obrigatório. Se não for marcado, mostre o erro. Ele também deve continuar marcado quando o formulário voltar com erro em outro campo.',
      solucao: `<?php // no processamento
$aceite = isset($_POST["aceite"]);
if (!$aceite) {
    $erros["aceite"] = "É preciso aceitar o regulamento.";
}
?>
<label><input type="checkbox" name="aceite" <?= !empty($aceite) ? "checked" : "" ?>> Li e aceito o regulamento</label>
<?= erro($erros, "aceite") ?>`,
      solucaoTexto: 'Lembre de declarar <code>$aceite = false;</code> junto com os valores iniciais, para não gerar aviso na primeira visita.'
    },
    {
      nivel: 'Avançado', titulo: 'Oficinas lotadas',
      texto: 'Crie o array <code>$vagas = ["web" =&gt; 3, "games" =&gt; 0, ...]</code>. No select, mostre "(esgotada)" e desative (<code>disabled</code>) as oficinas sem vaga. No PHP, recuse a inscrição numa oficina lotada, mesmo que alguém reative a opção pelo navegador.',
      solucao: `$vagas = ["web" => 3, "games" => 0, "dados" => 5, "robotica" => 1];

// validação
if (isset($oficinas[$oficina]) && $vagas[$oficina] <= 0) {
    $erros["oficina"] = "Esta oficina está lotada.";
}

// no select
<?php foreach ($oficinas as $chave => $titulo): ?>
    <?php $lotada = $vagas[$chave] <= 0; ?>
    <option value="<?= $chave ?>" <?= $lotada ? "disabled" : "" ?>>
        <?= $titulo ?><?= $lotada ? " (esgotada)" : "" ?>
    </option>
<?php endforeach; ?>`
    }
  ],
  revisao: [
    'Validação em HTML/JS é conforto; validação em PHP é <strong>obrigatória</strong>.',
    'Fluxo: <strong>limpar</strong> (<code>trim</code>) → <strong>validar</strong> (regras) → <strong>processar</strong> (só se <code>empty($erros)</code>).',
    'Guarde os erros em <code>$erros["campo"] = "mensagem"</code> e mostre cada um ao lado do campo.',
    'Formulário pegajoso: devolva valores com <code>value</code>, <code>selected</code> e <code>checked</code>.',
    'Todo dado do usuário mostrado no HTML passa por <code>htmlspecialchars()</code> (proteção contra XSS).'
  ],
  slides: [
    { capa: true, t: 'Validação e segurança', b: ['Nunca confie no formulário'], notas: 'Comece com uma pergunta provocativa: "Se eu tirar o required do campo pelo F12, o formulário ainda é obrigatório?"' },
    { t: 'Demonstração: burlando o required', b: [{ passos: ['Abra um formulário com <code>required</code>', 'F12 → selecione o campo → apague o atributo', 'Envie vazio: o navegador deixa passar'] }, 'Conclusão: quem decide é o <strong>servidor</strong>.'],
      notas: 'Faça a demonstração ao vivo. É marcante para os alunos perceberem que o navegador é "território do usuário".' },
    { t: 'Placa x porteiro', b: [{ tabela: { cab: ['', 'HTML/JS', 'PHP'], linhas: [['Papel', 'Placa na porta', 'Porteiro'], ['Ajuda', 'Usuário honesto', 'Todos'], ['Pode burlar?', 'Sim', 'Não'], ['Obrigatória?', 'Recomendada', 'Sempre']] } }],
      notas: 'Use os dois: JS para avisar rápido, PHP para garantir.' },
    { t: 'Limpar → validar → processar', b: [{ code: `$nome = trim($_POST["nome"] ?? "");        // limpar

if (mb_strlen($nome) < 3) {                  // validar
    $erros["nome"] = "Nome muito curto.";
}

if (empty($erros)) {                         // processar
    // salvar, enviar e-mail...
}`, lang: 'php' }],
      notas: 'Esse fluxo vai aparecer em todos os formulários daqui para frente. Vale escrever no quadro.' },
    { t: 'Ferramentas de validação', b: [{ tabela: { cab: ['Função', 'Verifica'], linhas: [['trim()', 'tira espaços'], ['mb_strlen()', 'tamanho do texto'], ['filter_var(..., FILTER_VALIDATE_EMAIL)', 'e-mail'], ['filter_var(..., FILTER_VALIDATE_INT)', 'número inteiro'], ['in_array() / isset($lista[$v])', 'valor permitido']] } }],
      notas: 'Mostre filter_var com alguns e-mails inválidos: "ana@", "ana.com", "ana @email.com".' },
    { t: 'Todos os erros de uma vez', b: [{ code: `$erros = [];
if ($nome === "")  $erros["nome"]  = "Informe o nome.";
if (!filter_var($email, FILTER_VALIDATE_EMAIL))
                   $erros["email"] = "E-mail inválido.";

// no HTML, ao lado do campo:
<?= $erros["nome"] ?? "" ?>`, lang: 'php' }, { analogia: 'Correção de prova: marca todas as questões erradas.' }],
      notas: 'Destaque o array associativo como "lista de pendências" do formulário.' },
    { t: 'Formulário que lembra', b: [{ code: `<input name="nome" value="<?= htmlspecialchars($nome) ?>">

<option value="ds" <?= $curso === "ds" ? "selected" : "" ?>>DS</option>

<input type="checkbox" name="aceite" <?= $aceite ? "checked" : "" ?>>`, lang: 'php' }],
      notas: 'Pergunte quem já perdeu um formulário inteiro por causa de um erro. Isso é respeito ao usuário.' },
    { t: 'XSS: o ataque', b: ['Um visitante digita no comentário:', { code: `<script>alert("invadido")</script>`, lang: 'html' }, 'Se o PHP fizer <code>echo $comentario;</code>, o script roda no navegador de <strong>todos</strong> que abrirem a página.'],
      notas: 'Demonstre no projeto da aula com <b style="color:red">. Explique que com script dá para roubar sessões de login.' },
    { t: 'A defesa: htmlspecialchars', b: [{ compara: [{ titulo: 'Vulnerável', lang: 'php', code: `echo "<p>$msg</p>";` }, { titulo: 'Protegido', lang: 'php', code: `echo "<p>" . htmlspecialchars($msg) . "</p>";` }] },
      { dica: 'Regra de ouro: veio do usuário e vai para o HTML? <code>htmlspecialchars()</code>.' }],
      notas: 'Mostre o código-fonte do resultado: &lt;script&gt; aparece como texto. Apresente o atalho e().' },
    { t: 'Mão na massa: Semana Tech', b: [{ passos: ['Abra "Aula 05 — Inscrições da Semana Tech"', 'Provoque e corrija a falha de XSS', 'Valide telefone e oficina', 'Avançado: regulamento e oficinas lotadas'] }],
      notas: 'Peça que façam primeiro o desafio de segurança. Feche perguntando: "quais dados do seu portfólio/projeto precisariam de htmlspecialchars?"' }
  ]
});
