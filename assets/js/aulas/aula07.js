/* AULA 07 — Sessões e login */
AULAS.push({
  n: 7,
  titulo: 'Sessões e login: áreas restritas do site',
  curto: 'Sessões e login',
  resumo: 'Faça o site reconhecer quem está navegando: login com senha segura, páginas protegidas, contador de acessos e botão sair.',
  conteudos: 'HTTP sem estado, session_start, $_SESSION, cookies, password_hash, password_verify, proteção de páginas, logout',
  objetivos: [
    'Entender por que o servidor "esquece" o usuário entre uma página e outra.',
    'Guardar informações do visitante com <code>session_start()</code> e <code>$_SESSION</code>.',
    'Diferenciar sessão de cookie.',
    'Armazenar e conferir senhas com <code>password_hash()</code> e <code>password_verify()</code>.',
    'Proteger páginas restritas e implementar o "sair" (logout).'
  ],
  cronograma: [
    ['0:00 – 0:10', 'Revisão: arquivos JSON e CRUD'],
    ['0:10 – 0:30', 'O HTTP não tem memória: sessões e cookies (analogia da pulseira)'],
    ['0:30 – 0:50', 'Senhas seguras: password_hash e password_verify'],
    ['0:50 – 1:00', 'Intervalo'],
    ['1:00 – 1:25', 'Fluxo completo: login, página protegida e logout'],
    ['1:25 – 1:55', 'Projeto: Portal do Aluno + desafios'],
    ['1:55 – 2:00', 'Fechamento']
  ],
  secoes: [
    {
      titulo: 'O servidor tem memória curta',
      blocos: [
        'O protocolo da web (HTTP) é <strong>sem estado</strong>: cada requisição é independente. Quando você faz login e depois clica em "Minhas notas", para o servidor é como se fosse uma pessoa totalmente nova pedindo uma página.',
        { analogia: 'Imagine uma <strong>festa com pulseirinhas</strong>. Na entrada, a recepção confere seu convite <strong>uma vez</strong> e coloca uma pulseira com um número. Depois disso, os seguranças só olham a pulseira para saber que você pode circular. A recepção guarda numa lista: "pulseira 4821 = Ana, área VIP". <br><br>Na web, a pulseira é um <strong>cookie</strong> com um código (o ID da sessão) e a lista da recepção é a <strong>sessão</strong>, guardada no servidor.' },
        { fluxo: [['Login certo', 'PHP cria a sessão'], ['Navegador recebe', 'cookie PHPSESSID=4821...'], ['Próximas páginas', 'navegador mostra o cookie'], ['PHP consulta', '$_SESSION da pulseira 4821']] }
      ]
    },
    {
      titulo: 'Usando sessões',
      blocos: [
        'Toda página que usa sessão precisa chamar <code>session_start()</code> <strong>no topo</strong>, antes de qualquer HTML. Depois disso, o array <code>$_SESSION</code> funciona como um array comum que <strong>não é apagado</strong> entre as páginas.',
        { code: `<?php
session_start();   // sempre na primeira linha

// soma 1 a cada visita (se não existir, começa do 0)
$_SESSION["visitas"] = ($_SESSION["visitas"] ?? 0) + 1;

echo "Você abriu esta página " . $_SESSION["visitas"] . " vez(es) nesta sessão.";
?>`, lang: 'php', run: true },
        'Execute várias vezes: o número aumenta. Abra a aba <strong>Dados salvos</strong> do console no laboratório para ver o conteúdo de <code>$_SESSION</code>.',
        { tabela: { cab: ['Comando', 'O que faz'], linhas: [
          ['<code>session_start()</code>', 'Abre (ou retoma) a sessão do visitante'],
          ['<code>$_SESSION["chave"] = valor</code>', 'Guarda uma informação'],
          ['<code>isset($_SESSION["chave"])</code>', 'Confere se a informação existe (ex.: está logado?)'],
          ['<code>unset($_SESSION["chave"])</code>', 'Remove uma informação específica'],
          ['<code>session_destroy()</code>', 'Apaga a sessão inteira (usado no logout)']
        ] } },
        { atencao: 'Se aparecer o aviso <em>"headers already sent"</em>, é porque algum HTML, espaço ou linha em branco saiu antes do <code>session_start()</code> ou do <code>header()</code>. Eles precisam vir antes de qualquer saída.' }
      ]
    },
    {
      titulo: 'Sessão ou cookie?',
      blocos: [
        { tabela: { cab: ['', 'Sessão ($_SESSION)', 'Cookie ($_COOKIE)'], linhas: [
          ['Onde fica', 'No servidor', 'No navegador do visitante'],
          ['O visitante pode ver/alterar?', 'Não', 'Sim'],
          ['Quanto tempo dura', 'Até fechar o navegador ou fazer logout', 'O tempo que você definir (dias, meses)'],
          ['Use para', 'Login, carrinho, dados sensíveis', 'Preferências: tema escuro, idioma, "lembrar meu e-mail"']
        ] } },
        { code: `<?php
// Cookie: guarda o tema escolhido por 30 dias no navegador
setcookie("tema", "escuro", time() + 60 * 60 * 24 * 30);

// Em outra visita:
$tema = $_COOKIE["tema"] ?? "claro";`, lang: 'php' },
        { nota: 'O laboratório simula sessões, mas não cookies. Para testar <code>setcookie</code>, use o XAMPP (Apêndice C da apostila).', rotulo: 'No laboratório' }
      ]
    },
    {
      titulo: 'Senhas: nunca guarde o texto original',
      blocos: [
        'Se o arquivo (ou banco) de usuários vazar e as senhas estiverem escritas normalmente, todas as contas estão comprometidas, e como muita gente repete senhas, outros sites também. Por isso guardamos apenas o <strong>hash</strong> da senha.',
        { analogia: 'Um hash é como uma <strong>impressão digital</strong>: a partir do dedo é fácil tirar a digital, mas a partir da digital é impossível reconstruir o dedo. Para conferir, você não "desfaz" a digital: tira a digital de novo e compara.' },
        { code: `<?php
// No cadastro: gera o hash e guarda ELE (nunca a senha)
$hash = password_hash("123456", PASSWORD_DEFAULT);
echo $hash . "<br>";   // ex.: $2y$12$Kd/pauOQ... (muda a cada execução!)

// No login: confere a senha digitada com o hash guardado
if (password_verify("123456", $hash)) {
    echo "Senha correta!";
} else {
    echo "Senha errada!";
}
?>`, lang: 'php', run: true },
        { dica: 'Execute o exemplo duas vezes: o hash muda, mas o <code>password_verify</code> continua funcionando. Isso acontece porque o hash inclui um "tempero" aleatório (o <em>salt</em>), o que impede ataques com tabelas prontas.' },
        { atencao: 'Ao colar um hash no código, use <strong>aspas simples</strong>: <code>\'$2y$12$Kd...\'</code>. Com aspas duplas, o PHP acha que <code>$2y</code> e <code>$12</code> são variáveis e estraga o hash.' }
      ]
    },
    {
      titulo: 'O fluxo completo do login',
      blocos: [
        { passos: [
          '<strong>Formulário</strong> (POST) com usuário e senha.',
          '<strong>Buscar</strong> o usuário: ele existe na lista?',
          '<strong>Conferir</strong> a senha com <code>password_verify()</code>.',
          'Deu certo? <strong>Guardar na sessão</strong> quem entrou (nunca a senha!) e redirecionar para o painel.',
          'Deu errado? Mostrar uma mensagem <strong>genérica</strong>: "Usuário ou senha incorretos" (não diga qual dos dois errou, para não ajudar invasores).'
        ] },
        { code: `<?php
session_start();
$usuarios = [
    "ana" => ["nome" => "Ana Souza", "senha" => '$2y$12$Kd/pauOQPJFq3QQVui1LXO9xIXMNENBY2Na5hruHXN0Pv/yucw3w.'],
];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $login = $_POST["login"] ?? "";
    $senha = $_POST["senha"] ?? "";

    if (isset($usuarios[$login]) && password_verify($senha, $usuarios[$login]["senha"])) {
        $_SESSION["usuario"] = $login;
        echo "Bem-vinda, " . $usuarios[$login]["nome"] . "!";
    } else {
        echo "Usuário ou senha incorretos.";
    }
}
?>
<form method="post">
    <input name="login" placeholder="usuário (ana)">
    <input name="senha" type="password" placeholder="senha (123456)">
    <button>Entrar</button>
</form>`, lang: 'php', run: true }
      ]
    },
    {
      titulo: 'Protegendo páginas e saindo',
      blocos: [
        'Uma página restrita começa sempre com a mesma verificação: "existe usuário na sessão? Se não, volte para o login". Colocamos isso num arquivo e incluímos no topo de cada página protegida.',
        { compara: [
          { titulo: 'protecao.php', lang: 'php', code: `<?php
session_start();

// Sem pulseira? Volta para a recepção.
if (!isset($_SESSION["usuario"])) {
    header("Location: index.php");
    exit;
}` },
          { titulo: 'sair.php', lang: 'php', code: `<?php
session_start();
session_destroy();   // corta a pulseira

header("Location: index.php");
exit;` }
        ] },
        { code: `<?php
require "protecao.php";   // primeira linha de toda página restrita
?>
<h1>Área do aluno</h1>
<p>Só quem fez login vê esta página.</p>
<a href="sair.php">Sair</a>`, lang: 'php', file: 'painel.php' },
        { atencao: 'O <code>exit</code> depois do <code>header("Location: ...")</code> é obrigatório. Sem ele, o PHP continua executando o resto da página protegida, e o conteúdo pode vazar.' }
      ]
    }
  ],
  modelo: {
    nome: 'Portal do Aluno',
    descricao: 'Sistema com login, painel protegido com boletim e média, e logout. Usuários de teste: ana / 123456 e bruno / senha123. Há também uma ferramenta para gerar hashes de novas senhas.',
    inicial: 'index.php',
    arquivos: {
      'index.php': `<?php
/* =========================================================
   AULA 07 — PORTAL DO ALUNO: tela de login
   Usuários de teste:  ana / 123456   ·   bruno / senha123
   ========================================================= */
session_start();
require_once "usuarios.php";

// Já está logado? Vai direto para o painel.
if (isset($_SESSION["usuario"])) {
    header("Location: painel.php");
    exit;
}

$erro = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $login = trim($_POST["login"] ?? "");
    $senha = $_POST["senha"] ?? "";

    // 1) o usuário existe?   2) a senha confere com o hash guardado?
    if (isset($usuarios[$login]) && password_verify($senha, $usuarios[$login]["senha"])) {
        // Guarda na sessão SÓ o necessário. Nunca a senha!
        $_SESSION["usuario"]   = $login;
        $_SESSION["entrou_em"] = date("H:i");

        header("Location: painel.php");
        exit;
    } else {
        // Mensagem genérica: não revela se errou o usuário ou a senha
        $erro = "Usuário ou senha incorretos.";
    }
}
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
            <!-- DESAFIO: mantenha o usuário digitado quando a senha estiver errada -->
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
      'usuarios.php': `<?php
/* =========================================================
   "BANCO" DE USUÁRIOS
   As senhas estão guardadas como HASH (password_hash).
   Use a página gerar-hash.php para criar hashes novos.
   ATENÇÃO: hashes sempre entre ASPAS SIMPLES.
   ========================================================= */
$usuarios = [
    "ana" => [
        "nome"  => "Ana Souza",
        "turma" => "2DS",
        "senha" => '$2y$12$Kd/pauOQPJFq3QQVui1LXO9xIXMNENBY2Na5hruHXN0Pv/yucw3w.',  // 123456
        "notas" => [
            "Programação Web" => 8.5,
            "Banco de Dados"  => 7.0,
            "Inglês Técnico"  => 9.0,
            "Matemática"      => 5.5,
        ],
    ],
    "bruno" => [
        "nome"  => "Bruno Lima",
        "turma" => "2DS",
        "senha" => '$2y$12$ECmBTgOFqajrR6eS784DnuEC9CRC9rgM3duCiKt33sna9uwWaQKia',  // senha123
        "notas" => [
            "Programação Web" => 6.0,
            "Banco de Dados"  => 8.0,
            "Inglês Técnico"  => 7.5,
            "Matemática"      => 8.0,
        ],
    ],
];
`,
      'protecao.php': `<?php
/* =========================================================
   PROTEÇÃO: inclua na PRIMEIRA linha de toda página restrita.
   Sem login na sessão = volta para a tela de entrada.
   ========================================================= */
session_start();

if (!isset($_SESSION["usuario"])) {
    header("Location: index.php");
    exit;   // obrigatório: impede que o resto da página seja enviado
}
`,
      'painel.php': `<?php
/* =========================================================
   PAINEL (ÁREA RESTRITA)
   ========================================================= */
require "protecao.php";       // só passa daqui quem está logado
require_once "usuarios.php";

// Busca os dados completos do usuário logado
$login = $_SESSION["usuario"];
$aluno = $usuarios[$login];

// Calcula a média das notas
$media = array_sum($aluno["notas"]) / count($aluno["notas"]);

// DESAFIO: conte quantas vezes o painel foi aberto nesta sessão
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal do Aluno | Painel</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topo">
    <span class="marca">Portal do Aluno</span>
    <nav>
        <span>Olá, <?= $aluno["nome"] ?></span>
        <a class="sair" href="sair.php">Sair</a>
    </nav>
</header>

<main class="conteudo">
    <h1>Boletim</h1>
    <!-- DESAFIO: mostre a turma e o horário em que a pessoa entrou -->

    <table class="boletim">
        <tr><th>Disciplina</th><th>Nota</th><th>Situação</th></tr>
        <?php foreach ($aluno["notas"] as $disciplina => $nota): ?>
            <tr>
                <td><?= $disciplina ?></td>
                <td><?= number_format($nota, 1, ",", ".") ?></td>
                <td>
                    <?php if ($nota >= 6): ?>
                        <span class="ok">Aprovado</span>
                    <?php else: ?>
                        <span class="rec">Recuperação</span>
                    <?php endif; ?>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>

    <div class="media">
        Média geral: <strong><?= number_format($media, 1, ",", ".") ?></strong>
    </div>
</main>
</body>
</html>
`,
      'sair.php': `<?php
/* LOGOUT: destrói a sessão e volta para o login */
session_start();
session_destroy();

header("Location: index.php");
exit;
`,
      'gerar-hash.php': `<?php
/* =========================================================
   FERRAMENTA: gera o hash de uma senha para colar em usuarios.php
   (Em um sistema real, isso acontece na tela de cadastro.)
   ========================================================= */
$hash = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $hash = password_hash($_POST["senha"] ?? "", PASSWORD_DEFAULT);
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Gerar hash</title><link rel="stylesheet" href="style.css"></head>
<body class="tela-login">
    <form method="post" class="caixa-login">
        <h1>Gerar hash de senha</h1>
        <label>Senha <input type="text" name="senha"></label>
        <button>Gerar</button>
        <?php if ($hash): ?>
            <p class="dica">Copie e cole em usuarios.php (entre aspas simples):</p>
            <code class="hash"><?= $hash ?></code>
        <?php endif; ?>
        <p class="dica"><a href="index.php">Voltar ao login</a></p>
    </form>
</body>
</html>
`,
      'style.css': `* { box-sizing: border-box; }
body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; background: #f3f5f9; color: #1e2532; }
.tela-login { min-height: 100vh; display: grid; place-items: center; background: linear-gradient(135deg, #0f766e, #134e4a); padding: 16px; }
.caixa-login { background: #fff; width: 100%; max-width: 360px; padding: 28px; border-radius: 14px; display: grid; gap: 14px; box-shadow: 0 20px 50px rgba(0,0,0,.25); }
.caixa-login h1 { margin: 0; font-size: 24px; }
.marca { font-weight: 800; color: #0f766e; letter-spacing: .5px; }
label { display: grid; gap: 6px; font-size: 14px; font-weight: 600; color: #475066; }
input { font: inherit; padding: 10px 12px; border: 1px solid #cfd6e3; border-radius: 8px; }
button { background: #0f766e; color: #fff; border: 0; padding: 12px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
.erro { background: #fdecec; color: #b42318; padding: 10px 12px; border-radius: 8px; margin: 0; font-size: 14px; }
.dica { font-size: 13px; color: #6b7385; margin: 0; }
.hash { display: block; word-break: break-all; background: #f3f5f9; padding: 10px; border-radius: 8px; font-size: 12px; }
.topo { display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; background: #0f766e; color: #fff; }
.topo .marca { color: #fff; }
.topo nav { display: flex; gap: 16px; align-items: center; font-size: 15px; }
.sair { color: #fff; background: rgba(255,255,255,.15); padding: 6px 12px; border-radius: 6px; text-decoration: none; }
.conteudo { max-width: 760px; margin: 0 auto; padding: 28px 16px; }
.boletim { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.05); }
.boletim th, .boletim td { text-align: left; padding: 12px 16px; border-bottom: 1px solid #edf0f5; }
.boletim th { background: #f8fafc; font-size: 13px; color: #6b7385; text-transform: uppercase; letter-spacing: .5px; }
.ok { color: #067647; font-weight: 600; }
.rec { color: #b54708; font-weight: 600; }
.media { margin-top: 16px; background: #fff; padding: 16px; border-radius: 12px; font-size: 18px; }
.info { color: #6b7385; }
`
    }
  },
  modeloTexto: [
    'Faça login com <strong>ana / 123456</strong>, navegue, use o botão Sair e tente abrir <code>painel.php</code> sem estar logado (pela barra de endereço do laboratório, clique num link ou crie um). Veja o redirecionamento no console.'
  ],
  desafios: [
    {
      nivel: 'Básico', titulo: 'Turma e horário de entrada',
      texto: 'No painel, abaixo do título, mostre: "Turma 2DS · Você entrou às 14:05". A turma está em <code>$aluno</code> e o horário em <code>$_SESSION["entrou_em"]</code>.',
      solucao: `<p class="info">Turma <?= $aluno["turma"] ?> · Você entrou às <?= $_SESSION["entrou_em"] ?></p>`
    },
    {
      nivel: 'Básico', titulo: 'Login que lembra o usuário',
      texto: 'Quando a senha estiver errada, o campo usuário deve continuar preenchido. Lembre-se do <code>htmlspecialchars</code>.',
      solucao: `<?php $login = $login ?? ""; ?>
<input type="text" name="login" value="<?= htmlspecialchars($login) ?>">`,
      solucaoTexto: 'Declare <code>$login = "";</code> antes do <code>if</code> do POST para não gerar aviso na primeira visita.'
    },
    {
      nivel: 'Intermediário', titulo: 'Contador de acessos ao painel',
      texto: 'Use a sessão para contar quantas vezes o painel foi aberto desde o login e mostre "Você abriu o painel X vez(es)". Ao sair e entrar de novo, o contador deve recomeçar.',
      solucao: `$_SESSION["acessos_painel"] = ($_SESSION["acessos_painel"] ?? 0) + 1;
// no HTML:
<p class="info">Você abriu o painel <?= $_SESSION["acessos_painel"] ?> vez(es).</p>`
    },
    {
      nivel: 'Intermediário', titulo: 'Novo usuário',
      texto: 'Abra <code>gerar-hash.php</code>, gere o hash de uma senha nova e cadastre você mesmo em <code>usuarios.php</code>, com suas disciplinas e notas. Faça login com seu usuário.',
      solucaoTexto: 'Copiar o hash gerado para um novo item do array <code>$usuarios</code>, usando aspas simples. Erro comum: usar aspas duplas e o login nunca funcionar.'
    },
    {
      nivel: 'Avançado', titulo: 'Nova página protegida',
      texto: 'Crie <code>perfil.php</code> com o nome, a turma e o usuário logado, protegida com <code>protecao.php</code>. Adicione os links "Boletim" e "Perfil" no menu. Teste: depois de sair, tente acessar o perfil.',
      solucaoArquivo: 'perfil.php',
      solucao: `<?php
require "protecao.php";
require_once "usuarios.php";
$aluno = $usuarios[$_SESSION["usuario"]];
?>
<link rel="stylesheet" href="style.css">
<main class="conteudo">
    <h1>Meu perfil</h1>
    <p>Nome: <?= $aluno["nome"] ?></p>
    <p>Turma: <?= $aluno["turma"] ?></p>
    <p>Usuário: <?= $_SESSION["usuario"] ?></p>
    <a href="painel.php">Voltar ao boletim</a>
</main>`
    },
    {
      nivel: 'Avançado', titulo: 'Bloqueio após 3 tentativas',
      texto: 'Conte as tentativas erradas na sessão. Depois de 3 erros, não confira mais a senha e mostre "Muitas tentativas. Tente novamente mais tarde." Ao acertar, zere o contador.',
      solucao: `$tentativas = $_SESSION["tentativas"] ?? 0;

if ($tentativas >= 3) {
    $erro = "Muitas tentativas. Tente novamente mais tarde.";
} elseif (isset($usuarios[$login]) && password_verify($senha, $usuarios[$login]["senha"])) {
    $_SESSION["tentativas"] = 0;
    $_SESSION["usuario"] = $login;
    $_SESSION["entrou_em"] = date("H:i");
    header("Location: painel.php");
    exit;
} else {
    $_SESSION["tentativas"] = $tentativas + 1;
    $erro = "Usuário ou senha incorretos. Tentativa " . ($tentativas + 1) . " de 3.";
}`,
      solucaoTexto: 'Para "desbloquear" no laboratório, use o botão Limpar dados (apaga a sessão). Em sistemas reais, o bloqueio é por tempo e registrado no servidor, não só na sessão.'
    }
  ],
  revisao: [
    'O HTTP não tem memória; a sessão guarda dados do visitante no servidor e o navegador guarda só o ID (cookie).',
    '<code>session_start()</code> na primeira linha; depois use <code>$_SESSION</code> como um array comum.',
    'Senhas: guarde só o <code>password_hash()</code> e confira com <code>password_verify()</code>. Hash entre aspas simples.',
    'Página protegida: <code>if (!isset($_SESSION["usuario"])) { header("Location: index.php"); exit; }</code>.',
    'Logout: <code>session_destroy()</code> e redirecionar.'
  ],
  slides: [
    { capa: true, t: 'Sessões e login', b: ['Áreas restritas do site'], notas: 'Hoje os alunos constroem algo que usam todo dia: login. Pergunte quantas senhas cada um tem.' },
    { t: 'O servidor tem memória curta', b: ['Cada página pedida é uma conversa nova.', { code: `// login.php: "Sou a Ana, senha 123"  -> OK!
// notas.php: "Quero minhas notas"   -> "Quem é você?"`, lang: 'php' }],
      notas: 'Retome a aula passada: variáveis somem entre requisições. Agora o problema é saber QUEM está pedindo.' },
    { t: 'A pulseira da festa', b: [{ fluxo: [['Recepção', 'confere o convite (login)'], ['Pulseira', 'cookie com ID'], ['Lista', '$_SESSION no servidor'], ['Seguranças', 'conferem a pulseira']] }],
      notas: 'A analogia resolve 90% das dúvidas. Volte a ela sempre que alguém se confundir.' },
    { t: '$_SESSION na prática', b: [{ code: `session_start();   // sempre no topo

$_SESSION["visitas"] = ($_SESSION["visitas"] ?? 0) + 1;
echo "Visitas: " . $_SESSION["visitas"];`, lang: 'php' }, 'Um array que <strong>sobrevive</strong> entre as páginas.'],
      notas: 'Rode no laboratório e mostre a aba Dados salvos com o $_SESSION.' },
    { t: 'Sessão x cookie', b: [{ tabela: { cab: ['', 'Sessão', 'Cookie'], linhas: [['Fica', 'Servidor', 'Navegador'], ['Usuário altera?', 'Não', 'Sim'], ['Use para', 'Login, carrinho', 'Tema, idioma']] } }],
      notas: 'Mostre os cookies de um site no F12 (Application > Cookies) e encontre um PHPSESSID.' },
    { t: 'Senha nunca em texto puro', b: [{ code: `$hash = password_hash("123456", PASSWORD_DEFAULT);
// $2y$12$Kd/pauOQPJFq3QQVui1LXO9x...

password_verify("123456", $hash);  // true
password_verify("654321", $hash);  // false`, lang: 'php' }, { analogia: 'Impressão digital: do dedo sai a digital, da digital não volta o dedo.' }],
      notas: 'Comente vazamentos famosos de senhas. Mostre que o hash muda a cada execução, mas o verify funciona.' },
    { t: 'O fluxo do login', b: [{ passos: ['Formulário POST', 'Usuário existe?', '<code>password_verify()</code> confere?', 'Sim: <code>$_SESSION["usuario"] = $login</code> + redirect', 'Não: "Usuário ou senha incorretos"'] }],
      notas: 'Por que a mensagem é genérica? Para não confirmar a um invasor que o usuário existe.' },
    { t: 'Protegendo páginas', b: [{ code: `<?php
session_start();
if (!isset($_SESSION["usuario"])) {
    header("Location: index.php");
    exit;   // sem isto, a página vaza!
}`, lang: 'php', file: 'protecao.php' }, 'Inclua no topo de toda página restrita.'],
      notas: 'Demonstre removendo o exit: o redirect acontece no navegador real, mas o HTML protegido já foi enviado (dá para ver com ferramentas).' },
    { t: 'Sair', b: [{ code: `<?php
session_start();
session_destroy();
header("Location: index.php");
exit;`, lang: 'php', file: 'sair.php' }, 'Cortar a pulseira.'],
      notas: 'Pergunte: por que é importante sair em computadores da escola ou lan house?' },
    { t: 'Mão na massa: Portal do Aluno', b: [{ passos: ['Abra "Aula 07 — Portal do Aluno" (ana / 123456)', 'Mostre turma, horário e contador de acessos', 'Cadastre-se usando gerar-hash.php', 'Avançado: perfil.php e bloqueio após 3 tentativas'] }],
      notas: 'O desafio de cadastrar o próprio usuário é ótimo para fixar o conceito de hash e aspas simples.' }
  ]
});
