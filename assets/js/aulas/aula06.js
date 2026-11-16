/* AULA 06 — Guardando dados em arquivos JSON */
AULAS.push({
  n: 6,
  titulo: 'Guardando dados: arquivos JSON e o primeiro CRUD',
  curto: 'Arquivos e JSON',
  resumo: 'Faça o site lembrar das informações mesmo depois de fechar a página: salve recados num arquivo JSON e crie, liste e exclua registros.',
  conteudos: 'Persistência, file_put_contents, file_get_contents, file_exists, json_encode/json_decode, CRUD, padrão Post/Redirect/Get',
  objetivos: [
    'Entender por que as variáveis "esquecem" tudo a cada requisição.',
    'Ler e gravar arquivos com <code>file_get_contents()</code> e <code>file_put_contents()</code>.',
    'Converter arrays em JSON e de volta com <code>json_encode()</code> e <code>json_decode()</code>.',
    'Construir as operações de um CRUD: criar, listar e excluir registros.',
    'Evitar envios duplicados com o padrão Post/Redirect/Get.'
  ],
  cronograma: [
    ['0:00 – 0:10', 'Revisão: validação e htmlspecialchars'],
    ['0:10 – 0:30', 'Por que os dados somem? Arquivos de texto e o contador de visitas'],
    ['0:30 – 0:55', 'JSON no PHP: json_encode e json_decode (comparação com JSON.stringify/parse)'],
    ['0:55 – 1:05', 'Intervalo'],
    ['1:05 – 1:25', 'CRUD: ler → alterar → salvar; excluir por id; Post/Redirect/Get'],
    ['1:25 – 1:55', 'Projeto: Mural de recados da turma + desafios'],
    ['1:55 – 2:00', 'Fechamento e ponte para banco de dados']
  ],
  secoes: [
    {
      titulo: 'Por que os dados somem?',
      blocos: [
        'Toda vez que uma página PHP termina de ser montada, <strong>todas as variáveis são apagadas</strong>. Na próxima requisição o PHP começa do zero. Por isso, se você guardar um recado numa variável, ele some quando outra pessoa abrir a página.',
        { analogia: 'As variáveis são como um <strong>quadro branco</strong>: ótimo para trabalhar durante a aula, mas é apagado no final. Para guardar algo de verdade, você precisa de um <strong>caderno</strong>: um arquivo no servidor ou um banco de dados.' },
        'Guardar informações de forma permanente se chama <strong>persistência</strong>. Nesta aula vamos usar arquivos, a forma mais simples. Mais adiante na sua formação você verá bancos de dados (MySQL), que seguem a mesma lógica.'
      ]
    },
    {
      titulo: 'Lendo e gravando arquivos',
      blocos: [
        { tabela: { cab: ['Função', 'O que faz'], linhas: [
          ['<code>file_put_contents($arquivo, $texto)</code>', 'Grava o texto no arquivo (cria se não existir, <strong>substitui</strong> se existir)'],
          ['<code>file_put_contents($arquivo, $texto, FILE_APPEND)</code>', 'Acrescenta o texto no final, sem apagar o que já havia'],
          ['<code>file_get_contents($arquivo)</code>', 'Lê todo o conteúdo do arquivo como texto'],
          ['<code>file_exists($arquivo)</code>', 'O arquivo existe?'],
          ['<code>is_dir($pasta)</code> / <code>mkdir($pasta)</code>', 'A pasta existe? / Cria a pasta']
        ] } },
        'O exemplo clássico é o <strong>contador de visitas</strong>. Execute várias vezes e veja o número aumentar. Depois abra a aba <strong>Dados salvos</strong> do console no laboratório: o arquivo está lá.',
        { code: `<?php
$arquivo = "contador.txt";

// 1) LER: se o arquivo existe, pega o número; senão começa do zero
$visitas = file_exists($arquivo) ? (int) file_get_contents($arquivo) : 0;

// 2) ALTERAR
$visitas++;

// 3) SALVAR
file_put_contents($arquivo, $visitas);

echo "Esta página já foi vista $visitas vez(es).";
?>`, lang: 'php', run: true },
        { code: `<?php
// Um "diário" simples: cada linha é acrescentada no fim do arquivo
$linha = date("d/m/Y H:i:s") . " - alguém visitou a página\\n";
file_put_contents("log.txt", $linha, FILE_APPEND);

echo "<pre>" . file_get_contents("log.txt") . "</pre>";
?>`, lang: 'php', run: true }
      ]
    },
    {
      titulo: 'JSON: arrays guardados em texto',
      blocos: [
        'Arquivos guardam <strong>texto</strong>. Mas nossos dados são <strong>arrays</strong> (listas de fichas). Precisamos de um formato que transforme o array em texto e depois o texto de volta em array. Esse formato é o <strong>JSON</strong>, o mesmo que você já viu no JavaScript.',
        { compara: [
          { titulo: 'JavaScript', lang: 'js', code: `const aluno = { nome: "Ana", nota: 9 };

// objeto -> texto
const texto = JSON.stringify(aluno);

// texto -> objeto
const deVolta = JSON.parse(texto);` },
          { titulo: 'PHP', lang: 'php', code: `<?php
$aluno = ["nome" => "Ana", "nota" => 9];

// array -> texto
$texto = json_encode($aluno);

// texto -> array (true = array associativo)
$deVolta = json_decode($texto, true);` }
        ] },
        { analogia: 'Pense numa <strong>mudança</strong>: para transportar um móvel montado (o array), você o desmonta e coloca numa caixa (<code>json_encode</code> → texto no arquivo). No destino, monta de novo (<code>json_decode</code> → array outra vez).' },
        { code: `<?php
$contatos = [
    ["nome" => "Ana",   "fone" => "11 98888-1111"],
    ["nome" => "Bruno", "fone" => "11 97777-2222"],
];

// JSON_PRETTY_PRINT = organizado; JSON_UNESCAPED_UNICODE = mantém acentos
$json = json_encode($contatos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
file_put_contents("contatos.json", $json);

// Lendo de volta
$lidos = json_decode(file_get_contents("contatos.json"), true);
echo "Primeiro contato: " . $lidos[0]["nome"];
echo "<pre>$json</pre>";
?>`, lang: 'php', run: true },
        { atencao: 'Sem o <code>true</code> no <code>json_decode</code>, o PHP devolve um <em>objeto</em> (acessado com <code>-&gt;</code>), e não um array. Neste curso usaremos sempre <code>json_decode($texto, true)</code>.' }
      ]
    },
    {
      titulo: 'CRUD: as quatro operações',
      blocos: [
        'Quase todo sistema (rede social, loja, agenda, banco) faz as mesmas quatro coisas com seus dados. Elas formam a sigla <strong>CRUD</strong>:',
        { tabela: { cab: ['Letra', 'Operação', 'Exemplo no mural', 'Na agenda de papel'], linhas: [
          ['C', '<strong>Create</strong> (criar)', 'Publicar um recado', 'Escrever um contato novo'],
          ['R', '<strong>Read</strong> (ler)', 'Listar os recados', 'Folhear a agenda'],
          ['U', '<strong>Update</strong> (atualizar)', 'Editar ou curtir um recado', 'Corrigir um telefone'],
          ['D', '<strong>Delete</strong> (excluir)', 'Apagar um recado', 'Riscar um contato']
        ] } },
        'Com arquivos JSON, toda operação segue a mesma receita de três passos:',
        { fluxo: [['1. Ler', 'arquivo → array'], ['2. Alterar', 'adicionar, mudar ou remover itens do array'], ['3. Salvar', 'array → arquivo']] },
        'Para não repetir código, criamos duas funções no arquivo <code>funcoes.php</code>:',
        { code: `<?php
function lerRecados() {
    if (!file_exists("dados/recados.json")) {
        return [];   // primeira vez: mural vazio
    }
    return json_decode(file_get_contents("dados/recados.json"), true) ?? [];
}

function salvarRecados($recados) {
    if (!is_dir("dados")) {
        mkdir("dados");   // cria a pasta na primeira vez
    }
    $json = json_encode($recados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents("dados/recados.json", $json);
}`, lang: 'php', file: 'funcoes.php' },
        { dica: 'Cada registro precisa de uma identificação única, o <strong>id</strong>, para sabermos qual excluir ou editar. A função <code>uniqid()</code> gera um código diferente a cada chamada, como <code>6af74a35cb200</code>.' }
      ]
    },
    {
      titulo: 'Excluindo por id',
      blocos: [
        'Para excluir, recebemos o <code>id</code> do recado, percorremos a lista e guardamos num novo array <strong>todos, menos aquele</strong>. Depois salvamos o novo array.',
        { code: `<?php
$idParaExcluir = $_POST["id"] ?? "";
$recados = lerRecados();

$restantes = [];
foreach ($recados as $recado) {
    if ($recado["id"] !== $idParaExcluir) {
        $restantes[] = $recado;   // mantém quem NÃO é o excluído
    }
}
salvarRecados($restantes);`, lang: 'php', file: 'excluir.php' },
        { analogia: 'É como passar a limpo um caderno: você copia todas as linhas para uma folha nova, pulando a linha que quer apagar.' },
        { atencao: 'Ações que <strong>alteram</strong> dados (excluir, curtir, editar) devem usar <strong>POST</strong>, nunca um link GET. Robôs de busca e pré-carregamento de navegadores "clicam" em links sozinhos e poderiam apagar seus dados.' }
      ]
    },
    {
      titulo: 'Post/Redirect/Get: chega de envio duplicado',
      blocos: [
        'Depois de enviar um formulário por POST, se o usuário apertar <kbd>F5</kbd> o navegador pergunta "Reenviar formulário?". Se ele aceitar, o recado é publicado <strong>duas vezes</strong>. A solução é: depois de salvar, <strong>redirecionar</strong> para a página com GET.',
        { fluxo: [['POST', 'formulário enviado'], ['PHP salva', 'no arquivo JSON'], ['Redirect', 'header("Location: index.php")'], ['GET', 'página recarregada limpa']] },
        { code: `<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // ... valida e salva ...
    header("Location: index.php");  // manda o navegador abrir a página de novo (GET)
    exit;                           // para o script aqui
}`, lang: 'php' },
        { dica: 'No laboratório, o console mostra a linha "Redirecionado (header Location)" quando isso acontece.' }
      ]
    },
    {
      titulo: 'Arquivos ou banco de dados?',
      blocos: [
        { tabela: { cab: ['', 'Arquivo JSON', 'Banco de dados (MySQL)'], linhas: [
          ['Facilidade para começar', 'Muito fácil', 'Exige instalar e aprender SQL'],
          ['Quantidade de dados', 'Pequena (centenas de registros)', 'Enorme (milhões)'],
          ['Vários usuários ao mesmo tempo', 'Pode dar conflito', 'Feito para isso'],
          ['Buscas e filtros', 'Você programa no PHP', 'O banco faz (comando SELECT)'],
          ['Uso típico', 'Protótipos, configurações, sites pequenos', 'Sistemas reais']
        ] } },
        'A lógica que você aprendeu hoje (ler, alterar, salvar; id único; CRUD) é exatamente a mesma usada com bancos de dados. Só muda a ferramenta.'
      ]
    }
  ],
  modelo: {
    nome: 'Mural de recados da turma',
    descricao: 'Um mural de post-its onde qualquer aluno pode deixar um recado. Os recados ficam salvos em dados/recados.json. Já é possível criar, listar e excluir.',
    inicial: 'index.php',
    arquivos: {
      'index.php': `<?php
/* =========================================================
   AULA 06 — MURAL DE RECADOS
   CRUD com arquivo JSON:  C (criar)  R (listar)  D (excluir)
   ========================================================= */
require_once "funcoes.php";

// Cores permitidas para os post-its (lista "branca")
$cores = ["amarelo", "azul", "verde", "rosa"];

// ---------- C: CRIAR um recado (formulário enviado) ----------
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $autor    = trim($_POST["autor"] ?? "");
    $mensagem = trim($_POST["mensagem"] ?? "");
    $cor      = $_POST["cor"] ?? "amarelo";

    // segurança: se a cor não estiver na lista, usa amarelo
    if (!in_array($cor, $cores)) {
        $cor = "amarelo";
    }

    // DESAFIO: valide autor e mensagem antes de salvar

    // 1) ler  2) alterar  3) salvar
    $recados = lerRecados();
    $recados[] = [
        "id"       => uniqid(),           // identificação única
        "autor"    => $autor,
        "mensagem" => $mensagem,
        "cor"      => $cor,
        "data"     => date("d/m/Y H:i"),
    ];
    salvarRecados($recados);

    // Post/Redirect/Get: evita duplicar o recado ao apertar F5
    header("Location: index.php");
    exit;
}

// ---------- R: LER os recados para mostrar ----------
$recados = lerRecados();
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

    <!-- DESAFIO: mostre quantos recados existem -->

    <?php if (empty($recados)): ?>
        <p class="vazio">Nenhum recado ainda. Seja o primeiro!</p>
    <?php endif; ?>

    <section class="mural">
        <?php foreach ($recados as $recado): ?>
            <article class="postit <?= $recado["cor"] ?>">
                <p class="mensagem"><?= e($recado["mensagem"]) ?></p>
                <footer>
                    <strong><?= e($recado["autor"]) ?></strong>
                    <span><?= $recado["data"] ?></span>
                </footer>
                <!-- D: EXCLUIR envia o id escondido por POST -->
                <form action="excluir.php" method="post" class="excluir">
                    <input type="hidden" name="id" value="<?= $recado["id"] ?>">
                    <button title="Excluir recado">&times;</button>
                </form>
            </article>
        <?php endforeach; ?>
    </section>
</main>
</body>
</html>
`,
      'funcoes.php': `<?php
/* =========================================================
   FUNÇÕES DE ACESSO AOS DADOS
   Toda leitura e gravação do arquivo passa por aqui.
   ========================================================= */
const ARQUIVO_RECADOS = "dados/recados.json";

// Lê o arquivo e devolve um ARRAY de recados
function lerRecados() {
    if (!file_exists(ARQUIVO_RECADOS)) {
        return [];  // arquivo ainda não existe = mural vazio
    }
    $json = file_get_contents(ARQUIVO_RECADOS);
    return json_decode($json, true) ?? [];
}

// Recebe o ARRAY e grava no arquivo como JSON
function salvarRecados($recados) {
    if (!is_dir("dados")) {
        mkdir("dados");
    }
    $json = json_encode($recados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents(ARQUIVO_RECADOS, $json);
}

// Atalho de segurança contra XSS (Aula 05)
function e($texto) {
    return htmlspecialchars($texto, ENT_QUOTES, "UTF-8");
}
`,
      'excluir.php': `<?php
/* =========================================================
   D: EXCLUIR um recado pelo id (recebido por POST)
   ========================================================= */
require_once "funcoes.php";

$id = $_POST["id"] ?? "";
$recados = lerRecados();

// Monta uma nova lista com todos, MENOS o recado excluído
$restantes = [];
foreach ($recados as $recado) {
    if ($recado["id"] !== $id) {
        $restantes[] = $recado;
    }
}
salvarRecados($restantes);

header("Location: index.php");  // volta para o mural
exit;
`,
      'style.css': `* { box-sizing: border-box; }
body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; background: #e9e4da; color: #2b2b2b; }
.topo { text-align: center; padding: 36px 16px 12px; }
.topo h1 { margin: 0; font-size: 36px; }
.topo p { color: #6b6457; }
.conteudo { max-width: 980px; margin: 0 auto; padding: 0 16px 40px; }
.novo { background: #fff; border-radius: 12px; padding: 16px; display: grid; gap: 10px; max-width: 560px; margin: 0 auto 24px; box-shadow: 0 2px 10px rgba(0,0,0,.06); }
.novo input, .novo textarea { font: inherit; padding: 10px; border: 1px solid #d8d2c4; border-radius: 8px; }
.linha { display: flex; justify-content: space-between; align-items: center; }
.cores { display: flex; gap: 8px; }
.cor { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; }
.cor input { display: none; }
.cor:has(input:checked) { border-color: #2b2b2b; }
.novo button { background: #2b2b2b; color: #fff; border: 0; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 15px; }
.vazio { text-align: center; color: #6b6457; }
.mural { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 18px; }
.postit { position: relative; padding: 18px 16px 12px; min-height: 160px; display: flex; flex-direction: column; box-shadow: 0 6px 14px rgba(0,0,0,.12); transform: rotate(-1deg); }
.postit:nth-child(even) { transform: rotate(1.2deg); }
.mensagem { flex: 1; font-size: 17px; margin: 0 0 12px; white-space: pre-wrap; word-break: break-word; }
.postit footer { font-size: 13px; display: flex; justify-content: space-between; gap: 8px; color: #4a4536; }
.excluir { position: absolute; top: 4px; right: 6px; margin: 0; }
.excluir button { border: 0; background: transparent; font-size: 20px; cursor: pointer; color: #4a4536; opacity: .5; }
.excluir button:hover { opacity: 1; }
.amarelo { background: #fff3a8; }
.azul { background: #c9e4ff; }
.verde { background: #cdf2c8; }
.rosa { background: #ffd1e1; }
.erro { background: #fde2e2; color: #a12b2b; padding: 10px; border-radius: 8px; }
`
    }
  },
  modeloTexto: [
    'Publique alguns recados e abra a aba <strong>Dados salvos</strong> do console: você verá o arquivo <code>dados/recados.json</code> sendo atualizado. Para recomeçar do zero, use o botão <strong>Limpar dados</strong>.'
  ],
  desafios: [
    {
      nivel: 'Básico', titulo: 'Contador de recados',
      texto: 'Acima do mural, mostre "X recado(s) no mural". Use <code>count()</code>.',
      solucao: `<p class="vazio"><?= count($recados) ?> recado(s) no mural</p>`
    },
    {
      nivel: 'Básico', titulo: 'Mais recentes primeiro',
      texto: 'Hoje os recados novos vão para o final. Faça os mais recentes aparecerem primeiro.',
      dica: 'A função <code>array_reverse()</code> devolve o array de trás para frente. Use-a só na hora de mostrar.',
      solucao: `<?php foreach (array_reverse($recados) as $recado): ?>`
    },
    {
      nivel: 'Intermediário', titulo: 'Validação do recado',
      texto: 'Não permita recados sem autor ou sem mensagem, nem mensagens com mais de 280 caracteres. Em caso de erro, não salve, mostre a mensagem com a classe <code>erro</code> e mantenha o texto digitado.',
      solucao: `$erro = "";
if ($autor === "" || $mensagem === "") {
    $erro = "Preencha seu nome e o recado.";
} elseif (mb_strlen($mensagem) > 280) {
    $erro = "O recado pode ter no máximo 280 caracteres.";
}

if ($erro === "") {
    // ... ler, adicionar, salvar e redirecionar (código atual) ...
}
// Atenção: declare $erro = ""; $autor = $mensagem = ""; ANTES do if do POST
// e no HTML: <?php if ($erro): ?><p class="erro"><?= $erro ?></p><?php endif; ?>`
    },
    {
      nivel: 'Intermediário', titulo: 'Campo turma',
      texto: 'Adicione um <code>select</code> com as turmas (1DS, 2DS, 3DS). Salve a turma no recado e mostre no rodapé do post-it. Recados antigos, que não têm turma, devem continuar funcionando.',
      solucao: `// ao salvar
"turma" => in_array($_POST["turma"] ?? "", ["1DS", "2DS", "3DS"]) ? $_POST["turma"] : "",

// ao mostrar
<span><?= e($recado["turma"] ?? "") ?></span>`
    },
    {
      nivel: 'Avançado', titulo: 'Curtir recados (Update)',
      texto: 'Crie <code>curtir.php</code>, que recebe o id por POST e soma 1 no campo <code>curtidas</code> do recado. Mostre um botão "Curtir (N)" em cada post-it.',
      dica: 'No <code>foreach</code>, use <code>&amp;$recado</code> (com &amp;) para alterar o item original, ou percorra com a chave: <code>foreach ($recados as $i =&gt; $r)</code> e altere <code>$recados[$i]</code>.',
      solucaoArquivo: 'curtir.php',
      solucao: `<?php
require_once "funcoes.php";
$id = $_POST["id"] ?? "";
$recados = lerRecados();

foreach ($recados as $i => $r) {
    if ($r["id"] === $id) {
        $recados[$i]["curtidas"] = ($r["curtidas"] ?? 0) + 1;
    }
}
salvarRecados($recados);
header("Location: index.php");
exit;

// no index.php, dentro do post-it:
// <form action="curtir.php" method="post">
//     <input type="hidden" name="id" value="<?= $recado["id"] ?>">
//     <button>Curtir (<?= $recado["curtidas"] ?? 0 ?>)</button>
// </form>`
    },
    {
      nivel: 'Avançado', titulo: 'Editar recado (Update completo)',
      texto: 'Crie <code>editar.php</code>: ao abrir com <code>?id=...</code> (GET) ele mostra o formulário preenchido com o recado; ao enviar (POST), atualiza a mensagem e volta para o mural. Coloque um link "Editar" em cada post-it.',
      solucaoArquivo: 'editar.php',
      solucao: `<?php
require_once "funcoes.php";
$recados = lerRecados();
$id = $_GET["id"] ?? $_POST["id"] ?? "";

// encontra a posição do recado
$pos = null;
foreach ($recados as $i => $r) {
    if ($r["id"] === $id) { $pos = $i; }
}
if ($pos === null) { header("Location: index.php"); exit; }

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $recados[$pos]["mensagem"] = trim($_POST["mensagem"] ?? "");
    salvarRecados($recados);
    header("Location: index.php");
    exit;
}
?>
<form method="post" class="novo">
    <input type="hidden" name="id" value="<?= e($id) ?>">
    <textarea name="mensagem"><?= e($recados[$pos]["mensagem"]) ?></textarea>
    <button>Salvar alteração</button>
</form>`
    }
  ],
  revisao: [
    'Variáveis são apagadas a cada requisição; para guardar, use arquivos ou banco de dados (persistência).',
    '<code>file_put_contents</code> grava, <code>file_get_contents</code> lê, <code>file_exists</code> confere.',
    '<code>json_encode($array)</code> transforma em texto; <code>json_decode($texto, true)</code> volta para array.',
    'CRUD = Create, Read, Update, Delete. Receita: <strong>ler → alterar → salvar</strong>.',
    'Depois de um POST que altera dados, redirecione com <code>header("Location: ...")</code> e <code>exit</code>.'
  ],
  slides: [
    { capa: true, t: 'Guardando dados', b: ['Arquivos JSON e o primeiro CRUD'], notas: 'Hoje o site ganha memória. É a aula em que muitos alunos percebem a utilidade real do back-end.' },
    { t: 'O quadro branco é apagado', b: ['Cada requisição começa do zero:', { code: `$recados[] = "Olá turma!";
// próxima visita... $recados está vazio de novo`, lang: 'php' }, { analogia: 'Variável = quadro branco. Arquivo/banco = caderno.' }],
      notas: 'Pergunte: como o Instagram lembra das fotos que vocês postaram ontem? Leve à ideia de persistência.' },
    { t: 'Ler e gravar arquivos', b: [{ code: `$visitas = file_exists("contador.txt")
    ? (int) file_get_contents("contador.txt")
    : 0;
$visitas++;
file_put_contents("contador.txt", $visitas);
echo "Visitas: $visitas";`, lang: 'php' }],
      notas: 'Rode o contador no laboratório e mostre a aba Dados salvos. Recarregue a página do laboratório: o número continua.' },
    { t: 'JSON: mesma ideia do JS', b: [{ compara: [{ titulo: 'JavaScript', lang: 'js', code: `JSON.stringify(obj)
JSON.parse(texto)` }, { titulo: 'PHP', lang: 'php', code: `json_encode($array)
json_decode($texto, true)` }] }, { analogia: 'Mudança: desmonta o móvel para caber na caixa e monta de novo no destino.' }],
      notas: 'Enfatize o true no json_decode para receber array associativo.' },
    { t: 'CRUD', b: [{ tabela: { cab: ['', 'Operação', 'No mural'], linhas: [['C', 'Create', 'Publicar'], ['R', 'Read', 'Listar'], ['U', 'Update', 'Editar/curtir'], ['D', 'Delete', 'Excluir']] } }, 'Instagram, banco, loja: todos são CRUDs.'],
      notas: 'Peça exemplos de CRUD em apps do dia a dia. Ex.: lista de contatos do celular.' },
    { t: 'A receita: ler → alterar → salvar', b: [{ code: `$recados = lerRecados();          // 1) ler
$recados[] = [                    // 2) alterar
    "id" => uniqid(),
    "autor" => $autor,
    "mensagem" => $mensagem,
];
salvarRecados($recados);          // 3) salvar`, lang: 'php' }],
      notas: 'Mostre as funções lerRecados e salvarRecados no funcoes.php. Explique o id único com uniqid().' },
    { t: 'Excluir = passar a limpo', b: [{ code: `$restantes = [];
foreach ($recados as $r) {
    if ($r["id"] !== $idExcluir) {
        $restantes[] = $r;
    }
}
salvarRecados($restantes);`, lang: 'php' }, { atencao: 'Excluir sempre com POST, nunca com link GET.' }],
      notas: 'Explique por que links GET para excluir são perigosos (robôs, pré-carregamento).' },
    { t: 'Post / Redirect / Get', b: [{ fluxo: [['POST', 'envia'], ['Salva', 'JSON'], ['Redirect', 'Location'], ['GET', 'página limpa']] }, { code: `header("Location: index.php");
exit;`, lang: 'php' }],
      notas: 'Demonstre o problema: sem o redirect, F5 publica o recado de novo.' },
    { t: 'E o banco de dados?', b: [{ tabela: { cab: ['', 'Arquivo JSON', 'MySQL'], linhas: [['Começar', 'Fácil', 'Exige SQL'], ['Volume', 'Pequeno', 'Enorme'], ['Muitos usuários', 'Conflitos', 'Preparado']] } }, 'A lógica do CRUD é a mesma.'],
      notas: 'Ponte para disciplinas futuras. Não aprofunde: a meta é a lógica.' },
    { t: 'Mão na massa: Mural da Turma', b: [{ passos: ['Abra "Aula 06 — Mural de recados da turma"', 'Publique, exclua e veja a aba Dados salvos', 'Contador, ordem e validação', 'Avançado: curtir e editar (Update)'] }],
      notas: 'Os desafios avançados completam o CRUD. Em turma rápida, proponha uma disputa amigável de quem implementa o "curtir" primeiro.' }
  ]
});
