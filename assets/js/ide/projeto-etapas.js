/* =========================================================
   Projeto da disciplina — roteiro em 10 etapas (1 por aula)
   ---------------------------------------------------------
   Cada etapa tem:
   - contexto: a "história" do pedido do cliente
   - tarefas: o passo a passo
   - exemplo: código PARECIDO, de outro assunto (nunca a resposta)
   - requisitos: verificados automaticamente rodando o PHP do aluno
   - dicas: 3 níveis, liberados um de cada vez
   Formatação nos textos: **negrito** e `código`.
   ========================================================= */
(function () {
  // Agendamento válido usado em vários testes
  const agendar = (t, extra = {}) => t.post('agendar.php', Object.assign({
    data: t.diaUtil(2), horario: '09:00', tutor: 'Mariana Souza', telefone: '(11) 99999-8888', pet: 'Thor', servico: 'Banho'
  }, extra));
  const login = (t, senha = 'senha123') => t.post('login.php', { email: 'admin@patasecia.com', senha });
  const PAGINAS = ['index.php', 'servicos.php', 'agendar.php', 'contato.php', 'login.php', 'admin.php', 'atendimento.php'];

  window.PROJETO_ETAPAS = [
  // ---------------------------------------------------------------- 1
  {
    n: 1, aula: 1, titulo: 'A loja ganha vida', arquivo: 'index.php',
    conceitos: 'variáveis, echo, <?= ?>, date(), contas simples',
    contexto: [
      'A **Patas & Cia** contratou você. O site deles está pronto, mas é só HTML: a data na faixa do topo está parada em 2025 e o rodapé ainda diz 2024. Toda virada de ano alguém precisa abrir os arquivos e trocar na mão.',
      'Sua primeira missão: fazer o **index.php** mostrar a data e o ano de forma automática, usando PHP.'
    ],
    tarefas: [
      'No topo do `index.php`, antes do `<!DOCTYPE html>`, abra um bloco `<?php ... ?>` e crie variáveis para: o nome da loja, o telefone e o ano de fundação (2015).',
      'Na faixa do topo, troque a data fixa pela data de hoje no formato dia/mês/ano.',
      'No parágrafo "Fundada em 2015 — há 10 anos", **calcule** quantos anos se passaram (ano atual menos o ano de fundação) e mostre o resultado.',
      'No rodapé, troque o ano fixo pelo ano atual e o nome da loja pela variável.',
      'Clique em **Executar** e confira na pré-visualização. Depois clique em **Verificar**.'
    ],
    exemplo: {
      titulo: 'Exemplo parecido (outro site, outra loja)',
      codigo: '<?php\n  $nomeEscola = "Escola Saber";\n  $anoCriacao = 1998;\n  $idade = date("Y") - $anoCriacao;   // conta com variáveis\n?>\n<p>A <?= $nomeEscola ?> existe há <?= $idade ?> anos.</p>\n<p>Agora são <?= date("H:i") ?>.</p>'
    },
    requisitos: [
      { texto: 'Pelo menos 3 variáveis criadas com as informações da loja', teste: (t) => new Set((t.todoCodigo().match(/\$[a-zA-Z_]\w*(?=\s*=[^=>])/g) || []).filter((v) => !/^\$_/.test(v))).size >= 3 },
      { texto: 'O nome da loja vem de uma variável', teste: (t) => /\$\w+\s*=\s*['"]Patas/i.test(t.todoCodigo()) },
      { texto: 'A faixa do topo mostra a data de hoje (dd/mm/aaaa)', teste: async (t) => (await t.get('index.php')).texto.includes('Hoje é ' + t.br(t.hoje)) },
      { texto: 'O rodapé mostra o ano atual', teste: async (t) => { const p = await t.get('index.php'); const r = p.$('footer'); return !!r && r.textContent.includes('© ' + t.ano); } },
      { texto: 'Os anos de história são calculados (ano atual − 2015)', teste: async (t) => (await t.get('index.php')).texto.includes('há ' + (t.ano - 2015) + ' anos') && /date\s*\(/.test(t.todoCodigo()) },
      { texto: 'A página abre sem erros de PHP', teste: async (t) => (await t.get('index.php')).semErros }
    ],
    dicas: [
      'Variável em PHP sempre começa com `$`. Pense nela como uma etiqueta colada numa caixa: `$telefone` é a caixa, o texto dentro dela é o conteúdo.',
      'Para mostrar uma variável no meio do HTML, use a tag curta `<?= ... ?>`. A função `date()` recebe letras: `d` dia, `m` mês, `Y` ano com 4 dígitos.',
      'Esqueleto (complete as lacunas):\n<?php\n  $nomeLoja = "____";\n  $anoFundacao = ____;\n  $anos = date("_") - ________;\n?>\n...\nHoje é <?= date("__/__/__") ?>'
    ]
  },

  // ---------------------------------------------------------------- 2
  {
    n: 2, aula: 2, titulo: 'Bom dia, boa tarde, boa noite', arquivo: 'index.php',
    conceitos: 'if / elseif / else, operadores && e ||, for',
    contexto: [
      'O dono reclamou: "Às 22h o site diz **Bom dia** e que estamos **Aberto agora**. Os clientes ligam e ninguém atende!"',
      'Além disso, na página de agendamento só aparecem 3 horários, mas a loja atende das 08:00 às 17:00.'
    ],
    tarefas: [
      'No `index.php`, descubra a hora atual com `date("G")` (0 a 23) e o dia da semana com `date("w")` (0 = domingo).',
      'Monte a saudação: das 5h às 11h **Bom dia**; das 12h às 17h **Boa tarde**; nos outros horários **Boa noite**. Mostre-a no `<h1>`.',
      'A loja está aberta de **segunda a sábado, das 8h às 18h** (às 18h já fechou). Mostre `<span class="selo aberto">Aberto agora</span>` ou `<span class="selo fechado">Fechado agora</span>`.',
      'No `agendar.php`, apague os 3 horários fixos e gere os horários das **08:00 às 17:00**, de hora em hora, com um laço `for`. Mantenha o mesmo HTML de cada `<label class="horario">`.'
    ],
    exemplo: {
      titulo: 'Exemplo parecido (uma padaria)',
      codigo: '<?php\n  $hora = (int) date("G");\n  if ($hora < 10) {\n    $aviso = "Pão quentinho saindo!";\n  } elseif ($hora < 15) {\n    $aviso = "Almoço servido";\n  } else {\n    $aviso = "Cafés da tarde";\n  }\n?>\n<p><?= $aviso ?></p>\n\n<?php for ($mesa = 1; $mesa <= 5; $mesa++): ?>\n  <option>Mesa <?= $mesa ?></option>\n<?php endfor; ?>'
    },
    requisitos: [
      { texto: 'O título mostra a saudação certa para a hora atual', teste: async (t) => { const p = await t.get('index.php'); const h = p.$('.hero h1'); return !!h && h.textContent.trim().startsWith(t.saudacao()); } },
      { texto: 'O selo mostra corretamente se a loja está aberta ou fechada agora', teste: async (t) => { const p = await t.get('index.php'); const s = p.$('.selo'); if (!s) return false; return t.aberto() ? s.classList.contains('aberto') && /aberto agora/i.test(s.textContent) : s.classList.contains('fechado') && /fechado agora/i.test(s.textContent); } },
      { texto: 'O código usa if / elseif (ou match) para decidir', teste: (t) => /\belseif\b|\belse\s+if\b|\bmatch\s*\(/.test(t.codigo('index.php') + t.codigo('funcoes.php')) },
      { texto: 'O agendamento oferece 10 horários, das 08:00 às 17:00', teste: async (t) => { const p = await t.get('agendar.php', { data: t.diaUtil(3) }); const v = p.$$('input[name="horario"]').map((i) => i.value); const esperado = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']; return v.length === 10 && esperado.every((h) => v.includes(h)); } },
      { texto: 'Os horários são gerados com um laço (for ou while)', teste: (t) => /\b(for|while)\s*\(/.test(t.codigo('agendar.php') + t.codigo('funcoes.php')) && (t.fonte('agendar.php').match(/type="radio"/g) || []).length <= 1 }
    ],
    dicas: [
      'Leia o `if` como uma pergunta: "SE a hora for menor que 12, ENTÃO...". O `elseif` é o "SENÃO, SE...". O `else` é o "em todos os outros casos".',
      'Para "aberto" você precisa de três condições ao mesmo tempo: não é domingo (`!= 0`), hora `>= 8` e hora `< 18`. "Ao mesmo tempo" em PHP é `&&`. Para mostrar o horário com dois dígitos, `str_pad($h, 2, "0", STR_PAD_LEFT)` transforma 8 em "08".',
      'Esqueleto:\n<?php for ($h = __; $h <= __; $h++):\n  $texto = str_pad($h, 2, "0", STR_PAD_LEFT) . ":00"; ?>\n  <label class="horario"><input type="radio" name="horario" value="<?= ______ ?>"> <?= ______ ?></label>\n<?php endfor; ?>'
    ]
  },

  // ---------------------------------------------------------------- 3
  {
    n: 3, aula: 3, titulo: 'Um catálogo que se monta sozinho', arquivo: 'servicos.php',
    conceitos: 'arrays associativos, foreach, funções, include/require',
    contexto: [
      'A loja vai reajustar preços. Hoje cada preço está escrito à mão em **duas páginas** e o menu está copiado em **sete páginas**. Um erro e o site fica inconsistente.',
      'A solução profissional: guardar os dados **uma vez só** e montar o HTML com PHP.'
    ],
    tarefas: [
      'Crie o arquivo **dados.php** (botão + nas abas) e mova para ele as variáveis da loja. Crie também o array `$servicos`: uma lista com os 6 serviços, cada um com `nome`, `categoria`, `preco` (número, sem "R$") e `descricao`.',
      'Crie **funcoes.php** com a função `formatarPreco($valor)` que transforma `45` em `R$ 45,00`.',
      'Crie **cabecalho.php** (do `<!DOCTYPE>` até o fim do `</header>`) e **rodape.php** (do `<footer>` até `</html>`). Use `require_once` para dados.php e funcoes.php dentro do cabeçalho.',
      'Nas **7 páginas**, apague o cabeçalho e o rodapé repetidos e use `require "cabecalho.php";` e `require "rodape.php";`. Dica: recorte (Ctrl+X) e cole (Ctrl+V) dentro do editor funciona normalmente.',
      'No `servicos.php`, troque os 6 cartões por **um** cartão dentro de um `foreach`. No `index.php`, mostre só os **3 primeiros** serviços. No `agendar.php`, monte as opções do `<select name="servico">` com `foreach`.'
    ],
    exemplo: {
      titulo: 'Exemplo parecido (uma livraria)',
      codigo: '<?php\n  $livros = [\n    ["titulo" => "Dom Casmurro", "preco" => 29.9],\n    ["titulo" => "O Cortiço",    "preco" => 24.5],\n  ];\n  function emReais($v) { /* ... você descobre ... */ }\n?>\n<?php foreach ($livros as $livro): ?>\n  <li><?= $livro["titulo"] ?> — <?= emReais($livro["preco"]) ?></li>\n<?php endforeach; ?>'
    },
    requisitos: [
      { texto: 'Arquivos dados.php, funcoes.php, cabecalho.php e rodape.php criados', teste: (t) => ['dados.php', 'funcoes.php', 'cabecalho.php', 'rodape.php'].every((a) => t.existe(a)) },
      { texto: 'A função formatarPreco() existe e é usada nos preços', teste: async (t) => /function\s+formatarPreco\s*\(/.test(t.todoCodigo()) && /formatarPreco\s*\(/.test(t.codigo('servicos.php')) && (await t.get('servicos.php')).texto.includes('R$ 150,00') },
      { texto: 'servicos.php monta os 6 cartões com foreach (só um cartão no código)', teste: async (t) => { const f = t.fonte('servicos.php'); return /foreach\s*\(/.test(f) && (f.match(/class="servico"/g) || []).length === 1 && (await t.get('servicos.php')).$$('.servico').length === 6; } },
      { texto: 'A página inicial mostra só os 3 primeiros serviços, vindos do array', teste: async (t) => { const f = t.fonte('index.php'); const p = await t.get('index.php'); return (f.match(/class="servico"/g) || []).length <= 1 && p.$$('.servico').length === 3 && p.$$('.servico h3')[0].textContent.trim() === 'Banho'; } },
      { texto: 'As 7 páginas usam cabecalho.php e rodape.php (sem menu repetido)', teste: (t) => PAGINAS.every((p) => { const c = t.codigo(p); return /(require|include)(_once)?\s*\(?\s*['"]cabecalho\.php/.test(c) && /(require|include)(_once)?\s*\(?\s*['"]rodape\.php/.test(c) && !/<nav\b/i.test(c); }) },
      { texto: 'O select de serviços do agendamento lista os 6 serviços', teste: async (t) => { const p = await t.get('agendar.php', { data: t.diaUtil(3) }); return p.$$('select[name="servico"] option').filter((o) => o.textContent.trim() && o.value !== '').length === 6 && /foreach\s*\(/.test(t.codigo('agendar.php')); } },
      { texto: 'Todas as páginas públicas abrem sem erros', teste: async (t) => { for (const p of ['index.php', 'servicos.php', 'agendar.php', 'contato.php', 'login.php']) { if (!(await t.get(p)).semErros) return false; } return true; } }
    ],
    dicas: [
      'Um array associativo é como uma **ficha de cadastro**: cada informação tem uma etiqueta (`"nome"`, `"preco"`). Uma lista de fichas é um array de arrays.',
      'Para formatar dinheiro use `number_format($valor, 2, ",", ".")`: 2 casas decimais, vírgula nos centavos e ponto nos milhares. Para pegar só parte de uma lista, procure a função `array_slice`.',
      'Esqueleto do cartão:\n<?php foreach ($servicos as $s): ?>\n  <article class="servico">\n    <span class="categoria"><?= $s["_______"] ?></span>\n    <h3><?= $s["____"] ?></h3>\n    ...\n    <p class="preco"><?= formatarPreco(________) ?></p>\n  </article>\n<?php endforeach; ?>'
    ]
  },

  // ---------------------------------------------------------------- 4
  {
    n: 4, aula: 4, titulo: 'Formulários que respondem', arquivo: 'servicos.php',
    conceitos: '$_GET, $_POST, isset, ??, $_SERVER["REQUEST_METHOD"]',
    contexto: [
      'Os clientes digitam na busca de serviços... e nada acontece. Enviam o agendamento... e a página só recarrega. O HTML dos formulários está pronto: falta o PHP **receber** os dados.'
    ],
    tarefas: [
      'Em `servicos.php`, leia `busca` e `categoria` de `$_GET` (use `??` para quando não vierem). Mostre só os serviços cujo **nome** contém o texto buscado (sem diferenciar maiúsculas) e que são da categoria escolhida.',
      'Mostre a quantidade encontrada em `<p class="resultado">` e, se for zero, mostre `<p class="vazio">Nenhum serviço encontrado...</p>` no lugar da grade.',
      'Faça a busca **lembrar** o que foi digitado: coloque o texto buscado no `value` do campo.',
      'Em `agendar.php`, quando o formulário for enviado por POST, leia os campos e mostre a caixa `alerta sucesso` com o nome do pet, a data e o horário. Use o modelo que está comentado no HTML.',
      'Faça o formulário 1 (GET) levar a data escolhida para o campo escondido `data` do formulário 2.',
      'Em `contato.php`, quando a mensagem for enviada, mostre `<div class="alerta sucesso">Obrigado, NOME! ...</div>`.'
    ],
    exemplo: {
      titulo: 'Exemplo parecido (filtro de filmes)',
      codigo: '<?php\n  $genero = $_GET["genero"] ?? "";   // ?? = "se não veio, use vazio"\n\n  if ($_SERVER["REQUEST_METHOD"] === "POST") {\n    $voto = $_POST["voto"] ?? "";\n    echo "<p>Obrigado pelo voto em $voto!</p>";\n  }\n?>\n<input name="genero" value="<?= $genero ?>">'
    },
    requisitos: [
      { texto: 'A busca "tosa" mostra só serviços com "tosa" no nome (sem diferenciar maiúsculas)', teste: async (t) => { const c = (await t.get('servicos.php', { busca: 'tosa' })).$$('.servico h3').map((h) => h.textContent.toLowerCase()); return c.length === 2 && c.every((n) => n.includes('tosa')); } },
      { texto: 'O filtro de categoria "Saúde" mostra só os 2 serviços de saúde', teste: async (t) => { const c = (await t.get('servicos.php', { categoria: 'Saúde' })).$$('.servico .categoria').map((h) => h.textContent.trim()); return c.length === 2 && c.every((n) => n === 'Saúde'); } },
      { texto: 'O campo de busca continua com o texto digitado', teste: async (t) => { const i = (await t.get('servicos.php', { busca: 'banho' })).$('input[name="busca"]'); return !!i && i.value === 'banho'; } },
      { texto: 'Busca sem resultado mostra o aviso "vazio" e o contador certo', teste: async (t) => { const p = await t.get('servicos.php', { busca: 'xyz' }); const r = p.$('.resultado'); return !!p.$('.vazio') && p.$$('.servico').length === 0 && (!r || r.textContent.trim().startsWith('0')); } },
      { texto: 'Enviar o agendamento mostra a confirmação com o nome do pet', teste: async (t) => { const p = await agendar(t); const s = p.$('.alerta.sucesso'); return !!s && s.textContent.includes('Thor'); } },
      { texto: 'Abrir o agendamento sem enviar NÃO mostra confirmação', teste: async (t) => !(await t.get('agendar.php')).$('.alerta.sucesso') },
      { texto: 'A data escolhida no formulário 1 vai para o campo escondido', teste: async (t) => { const d = t.diaUtil(4); const i = (await t.get('agendar.php', { data: d })).$('form[method="post"] input[name="data"]'); return !!i && i.value === d; } },
      { texto: 'Enviar o contato agradece pelo nome', teste: async (t) => { const p = await t.post('contato.php', { nome: 'Joana', email: 'joana@email.com', assunto: 'Dúvida', mensagem: 'Vocês atendem coelhos também?' }); const s = p.$('.alerta.sucesso'); return !!s && s.textContent.includes('Joana'); } }
    ],
    dicas: [
      'GET é como um **cartão-postal**: os dados vão escritos no endereço (`?busca=tosa`). POST é como uma **carta fechada**: vai no corpo da requisição. No PHP eles chegam em `$_GET` e `$_POST`.',
      'Para "o nome contém o texto, sem diferenciar maiúsculas" use `stripos($nome, $busca)`. Cuidado: ela devolve a **posição** (pode ser 0!) ou `false`. Compare com `=== false`. Dentro do `foreach`, `continue` pula para o próximo item.',
      'Esqueleto do filtro:\n$encontrados = [];\nforeach ($servicos as $s) {\n  if ($busca !== "" && stripos(____, ____) === false) continue;\n  if ($categoria !== "" && ________ !== $categoria) continue;\n  $encontrados[] = $s;\n}'
    ]
  },

  // ---------------------------------------------------------------- 5
  {
    n: 5, aula: 5, titulo: 'Nunca confie no formulário', arquivo: 'agendar.php',
    conceitos: 'trim, validação, array de erros, preg_replace, filter_var, htmlspecialchars',
    contexto: [
      'Chegaram agendamentos sem nome, telefones com 3 números e, pior: alguém digitou `<script>` no nome do pet e uma janela estranha apareceu no site. O cliente pediu: **valide tudo no servidor e proteja o site**.'
    ],
    tarefas: [
      'Em `agendar.php`, guarde os erros num array `$erros`. Regras: nome do tutor com pelo menos 3 letras; telefone com 10 ou 11 **números** (remova o resto com `preg_replace`); nome do pet obrigatório; serviço precisa ser um dos 6; horário precisa ser um dos horários válidos.',
      'Se houver erros, mostre a caixa `alerta erro` com um `<li>` por erro e **não** confirme o agendamento.',
      'Deixe o formulário "**pegajoso**": se der erro, os campos continuam preenchidos com o que a pessoa digitou.',
      'Proteja contra XSS: todo texto que veio do usuário deve passar por `htmlspecialchars()` antes de aparecer. Sugestão: crie em funcoes.php uma função curta `e($texto)`.',
      'Em `contato.php`: nome obrigatório, e-mail válido (`filter_var`) e mensagem com pelo menos 10 caracteres.'
    ],
    exemplo: {
      titulo: 'Exemplo parecido (inscrição num campeonato)',
      codigo: '<?php\n  $erros = [];\n  $time = trim($_POST["time"] ?? "");\n  $cpf  = preg_replace("/\\D/", "", $_POST["cpf"] ?? "");  // \\D = tudo que NÃO é número\n\n  if ($time === "")        { $erros[] = "Informe o time."; }\n  if (strlen($cpf) !== 11) { $erros[] = "CPF precisa de 11 números."; }\n?>\n<input name="time" value="<?= htmlspecialchars($time) ?>">'
    },
    requisitos: [
      { texto: 'Formulário vazio mostra a lista de erros (pelo menos 3) e não confirma', teste: async (t) => { const p = await t.post('agendar.php', { data: t.diaUtil(2) }); return !!p.$('.alerta.erro') && p.$$('.alerta.erro li').length >= 3 && !p.$('.alerta.sucesso'); } },
      { texto: 'Telefone com poucos números é recusado', teste: async (t) => { const p = await agendar(t, { telefone: '123' }); return !!p.$('.alerta.erro') && !p.$('.alerta.sucesso'); } },
      { texto: 'Telefone com máscara "(11) 99999-8888" é aceito', teste: async (t) => !!(await agendar(t, { telefone: '(11) 99999-8888' })).$('.alerta.sucesso') },
      { texto: 'Serviço que não existe na lista é recusado', teste: async (t) => !!(await agendar(t, { servico: 'Corte de unha de dragão' })).$('.alerta.erro') },
      { texto: 'Formulário pegajoso: com erro, o nome digitado continua no campo', teste: async (t) => { const p = await agendar(t, { tutor: 'Mariana Souza', telefone: '' }); const i = p.$('input[name="tutor"]'); return !!i && i.value === 'Mariana Souza'; } },
      { texto: 'Proteção XSS: HTML digitado no nome do pet aparece como texto', teste: async (t) => { const p = await agendar(t, { pet: '<i>Rex</i>' }); return !!p.$('.alerta.sucesso') && !p.html.includes('<i>Rex</i>') && p.texto.includes('<i>Rex</i>'); } },
      { texto: 'Contato com e-mail inválido mostra erro', teste: async (t) => { const p = await t.post('contato.php', { nome: 'Joana', email: 'joana-sem-arroba', assunto: 'Dúvida', mensagem: 'Mensagem de teste longa.' }); return !!p.$('.alerta.erro') && !p.$('.alerta.sucesso'); } },
      { texto: 'O código usa htmlspecialchars', teste: (t) => /htmlspecialchars\s*\(/.test(t.todoCodigo()) }
    ],
    dicas: [
      'Pense num **porteiro**: ele confere a lista inteira e anota todos os problemas num caderno (`$erros[] = "..."`). No fim, se o caderno estiver vazio (`count($erros) === 0`), a pessoa entra.',
      'Para saber se o serviço é válido, pegue só os nomes com `array_column($servicos, "nome")` e confira com `in_array($servico, ...)`. O mesmo vale para os horários.',
      'Esqueleto:\nif ($_SERVER["REQUEST_METHOD"] === "POST") {\n  $tutor = trim($_POST["tutor"] ?? "");\n  $telefone = preg_replace("/\\D/", "", ________);\n  if (mb_strlen($tutor) < _) { $erros[] = "____"; }\n  ...\n  if (count($erros) === 0) { /* confirma */ }\n}'
    ]
  },

  // ---------------------------------------------------------------- 6
  {
    n: 6, aula: 6, titulo: 'Guardando os pedidos', arquivo: 'agendar.php',
    conceitos: 'JSON, file_put_contents, file_get_contents, json_encode/json_decode, Post/Redirect/Get',
    contexto: [
      'Os agendamentos são confirmados na tela... e somem para sempre. A equipe não tem como saber quem marcou horário. Vamos **guardar** cada agendamento e cada mensagem num arquivo JSON.'
    ],
    tarefas: [
      'Em `funcoes.php`, crie `lerJson($arquivo)` (devolve a lista guardada, ou `[]` se o arquivo ainda não existe) e `salvarJson($arquivo, $lista)` (cria a pasta `dados` se precisar e grava a lista).',
      'Em `agendar.php`, quando não houver erros: leia `dados/agendamentos.json`, acrescente o novo agendamento (tutor, telefone, pet, servico, data, horario) e salve.',
      'Depois de salvar, **redirecione**: `header("Location: agendar.php?ok=NOME-DO-PET&data=...&hora=...")` seguido de `exit`. A confirmação passa a ler esses dados do `$_GET`. Assim, apertar F5 não duplica o agendamento.',
      'Faça o mesmo no `contato.php`, salvando em `dados/mensagens.json` e redirecionando para `contato.php?enviado=NOME`.',
      'Teste e abra a aba **Dados salvos**, embaixo da pré-visualização, para ver o arquivo crescer.'
    ],
    exemplo: {
      titulo: 'Exemplo parecido (lista de presença)',
      codigo: '<?php\n  $arquivo = "dados/presenca.json";\n  $lista = file_exists($arquivo) ? json_decode(file_get_contents($arquivo), true) : [];\n\n  $lista[] = ["aluno" => "Pedro", "hora" => date("H:i")];\n  file_put_contents($arquivo, json_encode($lista, JSON_PRETTY_PRINT));\n\n  header("Location: presenca.php?ok=1");\n  exit;'
    },
    requisitos: [
      { texto: 'Funções lerJson e salvarJson criadas', teste: (t) => /function\s+lerJson\s*\(/.test(t.todoCodigo()) && /function\s+salvarJson\s*\(/.test(t.todoCodigo()) },
      { texto: 'Um agendamento válido é salvo em dados/agendamentos.json', teste: async (t) => { await agendar(t); const l = t.json('dados/agendamentos.json'); return Array.isArray(l) && l.length === 1 && l[0].pet === 'Thor' && l[0].horario === '09:00'; } },
      { texto: 'Dois agendamentos ficam guardados (a lista cresce)', teste: async (t) => { await agendar(t); await agendar(t, { pet: 'Luna', horario: '11:00' }); const l = t.json('dados/agendamentos.json'); return Array.isArray(l) && l.length === 2; } },
      { texto: 'Agendamento com erro NÃO é salvo', teste: async (t) => { await agendar(t, { tutor: '' }); const l = t.json('dados/agendamentos.json'); return !l || l.length === 0; } },
      { texto: 'Depois de salvar, a página redireciona e mostra a confirmação', teste: async (t) => { const p = await agendar(t); return p.redirecionou && !!p.$('.alerta.sucesso') && p.$('.alerta.sucesso').textContent.includes('Thor'); } },
      { texto: 'Mensagens do contato são salvas em dados/mensagens.json', teste: async (t) => { const p = await t.post('contato.php', { nome: 'Joana', email: 'joana@email.com', assunto: 'Elogio', mensagem: 'Atendimento excelente, parabéns!' }); const l = t.json('dados/mensagens.json'); return p.redirecionou && Array.isArray(l) && l.length === 1 && l[0].nome === 'Joana'; } }
    ],
    dicas: [
      'O arquivo JSON é um **caderno**: para anotar algo novo você abre o caderno (ler), escreve na última linha (`$lista[] = ...`) e guarda o caderno de volta (salvar). Se você só escrever sem ler antes, apaga tudo o que havia!',
      '`json_decode($texto, true)` transforma o texto do arquivo em array (o `true` é importante). `json_encode($lista)` faz o caminho inverso. Para acentos aparecerem bonitos no arquivo use `JSON_UNESCAPED_UNICODE`. Para colocar o nome do pet na URL use `urlencode($pet)`.',
      'Esqueleto:\nfunction lerJson($arquivo) {\n  if (!file_exists($arquivo)) { return __; }\n  return json_decode(file_get_contents($arquivo), ____);\n}\nfunction salvarJson($arquivo, $lista) {\n  if (!is_dir("dados")) { mkdir("dados"); }\n  file_put_contents($arquivo, json_encode(______));\n}'
    ]
  },

  // ---------------------------------------------------------------- 7
  {
    n: 7, aula: 7, titulo: 'Área restrita da equipe', arquivo: 'login.php',
    conceitos: 'session_start, $_SESSION, password_hash, password_verify, header Location, logout',
    contexto: [
      'Agora a equipe quer ver os agendamentos e as mensagens no **painel** (`admin.php`). Mas o painel não pode ficar aberto para qualquer pessoa da internet!'
    ],
    tarefas: [
      'Crie `gerar-hash.php` que mostra `password_hash("senha123", PASSWORD_DEFAULT)`. Abra essa página na pré-visualização e copie o hash. Colar um hash no editor é permitido.',
      'Em `dados.php`, crie o array `$usuarios` com o e-mail `admin@patasecia.com`, o nome `Administrador` e o **hash** (nunca a senha!).',
      'Em `login.php`: `session_start()` na primeira linha; ao receber o POST, confira o e-mail e use `password_verify`. Se der certo, guarde o nome em `$_SESSION["usuario"]` e redirecione para `admin.php`. Se não, mostre `alerta erro`.',
      'Em `admin.php`: se não houver usuário na sessão, redirecione para `login.php`. Mostre "Olá, NOME", os números e as tabelas lendo os arquivos JSON da etapa 6.',
      'Crie `sair.php`, que destrói a sessão e volta para o login.'
    ],
    exemplo: {
      titulo: 'Exemplo parecido (sala VIP de um cinema)',
      codigo: '<?php\n  session_start();                       // abre o "crachá" do visitante\n  if (!isset($_SESSION["vip"])) {        // não tem crachá VIP?\n    header("Location: entrada.php");\n    exit;\n  }\n  echo "Bem-vindo, " . $_SESSION["vip"];\n\n  // password_verify("o que digitou", $hashGuardado) -> true ou false'
    },
    requisitos: [
      { texto: 'Sem login, abrir admin.php leva para login.php', teste: async (t) => (await t.get('admin.php')).pagina === 'login.php' },
      { texto: 'Senha errada mostra erro e não entra', teste: async (t) => { const p = await login(t, 'errada'); return p.pagina === 'login.php' && !!p.$('.alerta.erro'); } },
      { texto: 'Login correto (admin@patasecia.com / senha123) abre o painel', teste: async (t) => { const p = await login(t); return p.pagina === 'admin.php' && /Olá,\s*Administrador/.test(p.texto); } },
      { texto: 'O painel lista os agendamentos guardados', teste: async (t) => { await agendar(t, { pet: 'Bidu' }); const p = await login(t); const linhas = p.$$('table.agendamentos tbody tr'); return linhas.length === 1 && linhas[0].textContent.includes('Bidu'); } },
      { texto: 'O painel lista as mensagens guardadas', teste: async (t) => { await t.post('contato.php', { nome: 'Joana', email: 'joana@email.com', assunto: 'Dúvida', mensagem: 'Vocês atendem coelhos?' }); const p = await login(t); return p.$$('table.mensagens tbody tr').length === 1 && p.$('table.mensagens').textContent.includes('Joana'); } },
      { texto: 'Sair encerra a sessão (o painel volta a pedir login)', teste: async (t) => { await login(t); await t.get('sair.php'); return (await t.get('admin.php')).pagina === 'login.php'; } },
      { texto: 'A senha não aparece escrita no código: usa password_verify', teste: (t) => /password_verify\s*\(/.test(t.codigo('login.php')) && !/senha123/.test(t.codigo('login.php') + t.codigo('dados.php')) }
    ],
    dicas: [
      'A sessão é como a **pulseira de um evento**: você mostra o ingresso uma vez (login) e ganha a pulseira (`$_SESSION`). Cada página só confere a pulseira, sem pedir o ingresso de novo.',
      'Use `isset($usuarios[$email])` para saber se o e-mail existe antes de chamar `password_verify($senha, $usuarios[$email]["hash"])`. `session_start()` precisa vir **antes** de qualquer HTML.',
      'Esqueleto (login.php):\nsession_start();\nrequire_once "dados.php";\nif ($_SERVER["REQUEST_METHOD"] === "POST") {\n  $email = trim($_POST["email"] ?? "");\n  if (isset($usuarios[$email]) && password_verify(______, ______)) {\n    $_SESSION["usuario"] = ______;\n    header("Location: admin.php");\n    exit;\n  }\n  $erro = "E-mail ou senha incorretos.";\n}'
    ]
  },

  // ---------------------------------------------------------------- 8
  {
    n: 8, aula: 8, titulo: 'Dados ao vivo com APIs', arquivo: 'contato.php',
    conceitos: 'file_get_contents com URL, json_decode, arrays aninhados, tratamento de falhas',
    contexto: [
      'Dois pedidos novos. O serviço **Leva e traz** precisa conferir o endereço pelo CEP. E a página inicial vai mostrar a **temperatura agora**, para o tutor saber se é dia de banho.',
      'Não vamos digitar endereços nem temperaturas: vamos **perguntar a outros sistemas** (APIs) pela internet.'
    ],
    tarefas: [
      'Em `funcoes.php`, crie `buscarJson($url)`: busca a URL com `file_get_contents`, devolve `null` se falhar ou o array do `json_decode`.',
      'Em `contato.php`, leia `cep` do `$_GET` e deixe só os números. Se tiver 8 números, consulte `https://viacep.com.br/ws/CEP/json/` e preencha Rua (`logradouro`), Bairro e Cidade (`localidade` e `uf`).',
      'Se o CEP não tiver 8 números ou não existir (a API responde com `"erro"`), mostre `<p class="alerta erro">CEP não encontrado.</p>`.',
      'No `index.php`, consulte `https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&current=temperature_2m` e mostre a temperatura arredondada em `<p class="clima">`. Se a API falhar, mostre uma mensagem amigável.'
    ],
    exemplo: {
      titulo: 'Exemplo parecido (cotação do dólar)',
      codigo: '<?php\n  $resposta = @file_get_contents("https://economia.awesomeapi.com.br/json/last/USD-BRL");\n  $dados = $resposta ? json_decode($resposta, true) : null;\n  // o JSON tem "gavetas dentro de gavetas":\n  $valor = $dados["USDBRL"]["bid"] ?? null;\n?>\n<p>Dólar: <?= $valor ? "R$ " . $valor : "indisponível" ?></p>'
    },
    requisitos: [
      { texto: 'Função buscarJson() criada', teste: (t) => /function\s+buscarJson\s*\(/.test(t.todoCodigo()) },
      { texto: 'O CEP 01001000 preenche a rua (Praça da Sé) e a cidade', teste: async (t) => { const p = await t.get('contato.php', { cep: '01001000' }); const r = p.$('input[name="rua"]'), c = p.$('input[name="cidade"]'); return !!r && /Praça da Sé/.test(r.value) && !!c && /São Paulo/.test(c.value); } },
      { texto: 'CEP com traço (01001-000) também funciona', teste: async (t) => { const r = (await t.get('contato.php', { cep: '01001-000' })).$('input[name="rua"]'); return !!r && /Praça da Sé/.test(r.value); } },
      { texto: 'CEP incompleto ou inexistente mostra erro', teste: async (t) => !!(await t.get('contato.php', { cep: '123' })).$('.alerta.erro') && !!(await t.get('contato.php', { cep: '00000000' })).$('.alerta.erro') },
      { texto: 'A página inicial mostra a temperatura atual vinda da API', teste: async (t) => { const c = (await t.get('index.php')).$('.clima'); return !!c && /-?\d+\s*°C/.test(c.textContent) && /open-meteo/.test(t.todoCodigo()); } },
      { texto: 'As páginas com API abrem sem erros de PHP', teste: async (t) => (await t.get('index.php')).semErros && (await t.get('contato.php', { cep: '01001000' })).semErros }
    ],
    dicas: [
      'Uma API é um **garçom**: você faz o pedido (a URL), ele vai até a cozinha (outro servidor) e volta com o prato (um texto em JSON). O `json_decode` "desembrulha" o prato em array.',
      'Para descobrir o caminho de um dado, abra a URL da API no navegador e olhe o JSON. Na Open-Meteo a temperatura fica em `["current"]["temperature_2m"]`. O `@` antes de `file_get_contents` esconde o aviso quando a internet falha (você trata o `false` depois).',
      'Esqueleto:\n$cep = preg_replace("/\\D/", "", $_GET["cep"] ?? "");\nif ($cep !== "") {\n  if (strlen($cep) !== _) { $erroCep = "..."; }\n  else {\n    $endereco = buscarJson("https://viacep.com.br/ws/" . ____ . "/json/");\n    if ($endereco === null || isset($endereco["____"])) { ... }\n  }\n}'
    ]
  },

  // ---------------------------------------------------------------- 9
  {
    n: 9, aula: 9, titulo: 'Agenda sem conflitos', arquivo: 'agendar.php',
    conceitos: 'datas no formato Y-m-d, strtotime, date("w"), comparação de datas, usort',
    contexto: [
      'Problema sério: dois clientes marcaram o **mesmo horário**, alguém agendou para **ontem** e outro para um **domingo** (a loja fecha). E no painel os agendamentos aparecem fora de ordem.'
    ],
    tarefas: [
      'Em `agendar.php`, descubra quais horários já estão ocupados **no dia escolhido**, lendo `dados/agendamentos.json`. Nesses horários coloque a classe `ocupado` no `<label>` e o atributo `disabled` no `<input>`.',
      'Recuse (com `alerta erro`): data no passado, domingo e horário já reservado. Ao escolher um domingo ou data passada no formulário 1, já mostre o aviso.',
      'No campo de data, use o atributo `min` com a data de hoje (o navegador passa a bloquear dias passados, mas o PHP continua conferindo).',
      'Crie `dataBR($data)` em funcoes.php ("2026-11-20" vira "20/11/2026") e use na confirmação e no painel.',
      'No `admin.php`, ordene os agendamentos por data e hora com `usort` e mostre quantos são **para hoje**.'
    ],
    exemplo: {
      titulo: 'Exemplo parecido (reserva de quadra)',
      codigo: '<?php\n  $hoje = date("Y-m-d");             // "2026-11-13": dá para comparar como texto!\n  if ($dia < $hoje) { $erros[] = "Dia já passou."; }\n  if (date("w", strtotime($dia)) == 0) { $erros[] = "Fechado aos domingos."; }\n\n  $reservadas = ["18:00", "19:00"];\n  $ocupada = in_array("19:00", $reservadas);   // true\n\n  usort($jogos, fn($a, $b) => strcmp($a["dia"], $b["dia"]));'
    },
    requisitos: [
      { texto: 'Horário já reservado aparece desabilitado no dia certo', teste: async (t) => { const d = t.diaUtil(2); await agendar(t, { data: d, horario: '10:00' }); const p = await t.get('agendar.php', { data: d }); const i10 = p.$('input[name="horario"][value="10:00"]'), i11 = p.$('input[name="horario"][value="11:00"]'); return !!i10 && i10.disabled && !!i11 && !i11.disabled && i10.closest('label').classList.contains('ocupado'); } },
      { texto: 'Em outro dia, o mesmo horário continua livre', teste: async (t) => { await agendar(t, { data: t.diaUtil(2), horario: '10:00' }); const i = (await t.get('agendar.php', { data: t.diaUtil(3) })).$('input[name="horario"][value="10:00"]'); return !!i && !i.disabled; } },
      { texto: 'Reservar um horário ocupado é recusado (não duplica)', teste: async (t) => { const d = t.diaUtil(2); await agendar(t, { data: d, horario: '10:00' }); const p = await agendar(t, { data: d, horario: '10:00', pet: 'Luna' }); const l = t.json('dados/agendamentos.json') || []; return !!p.$('.alerta.erro') && l.length === 1; } },
      { texto: 'Data no passado é recusada', teste: async (t) => { const p = await agendar(t, { data: t.ontem }); return !!p.$('.alerta.erro') && !(t.json('dados/agendamentos.json') || []).length; } },
      { texto: 'Domingo é recusado (e avisado ao escolher o dia)', teste: async (t) => { const p = await agendar(t, { data: t.domingo() }); const g = await t.get('agendar.php', { data: t.domingo() }); return !!p.$('.alerta.erro') && !(t.json('dados/agendamentos.json') || []).length && !!g.$('.alerta.erro'); } },
      { texto: 'O campo de data não aceita dias passados (atributo min)', teste: async (t) => { const i = (await t.get('agendar.php')).$('input[type="date"][name="data"]'); return !!i && i.getAttribute('min') === t.hoje; } },
      { texto: 'O painel mostra os agendamentos em ordem de data e no formato dd/mm/aaaa', teste: async (t) => { await agendar(t, { data: t.diaUtil(4), pet: 'Depois' }); await agendar(t, { data: t.diaUtil(1), pet: 'Antes' }); const p = await login(t); const l = p.$$('table.agendamentos tbody tr'); return l.length === 2 && l[0].textContent.includes('Antes') && l[0].textContent.includes(t.br(t.diaUtil(1))); } }
    ],
    dicas: [
      'Datas no formato **ano-mês-dia** ("2026-11-20") são como números de série: se você comparar como texto, a ordem já sai certa. Por isso guardamos assim e só convertemos para dd/mm/aaaa na hora de **mostrar**.',
      'Para saber o dia da semana de uma data qualquer: `date("w", strtotime($data))`. Para montar a lista de ocupados, percorra os agendamentos e guarde o horário dos que têm `["data"] === $data`.',
      'Esqueleto:\n$ocupados = [];\nforeach ($agendamentos as $a) {\n  if ($a["____"] === $data) { $ocupados[] = $a["______"]; }\n}\n...\n<?php $ocupado = in_array($h, $ocupados); ?>\n<label class="horario<?= $ocupado ? " ______" : "" ?>">'
    ]
  },

  // ---------------------------------------------------------------- 10
  {
    n: 10, aula: 10, titulo: 'WhatsApp e assistente virtual', arquivo: 'atendimento.php',
    conceitos: 'links wa.me, rawurlencode, funções com regras, $_SESSION como memória da conversa',
    contexto: [
      'Última etapa! O dono quer duas coisas: depois de agendar, um botão que abre o **WhatsApp** da loja com a mensagem pronta; e a **Mel**, uma assistente virtual que responde às perguntas mais comuns 24 horas por dia.'
    ],
    tarefas: [
      'Na confirmação do agendamento, monte a mensagem "Olá! Quero confirmar o agendamento de PET para DD/MM/AAAA às HH:MM." e o link `https://wa.me/5511940028922?text=` + a mensagem codificada com `rawurlencode`. Use o botão `btn-whats` do modelo.',
      'Em `funcoes.php`, crie `menuBot()` (o texto do menu com as opções 1 a 4) e `responder($mensagem, $servicos)`, que entende: **1** ou "horário"; **2** ou "preço" (lista os 6 serviços com `formatarPreco`); **3** ou "endereço"; **4** ou "agendar". Qualquer outra coisa: "Desculpe, não entendi" + o menu.',
      'A resposta não pode depender de maiúsculas: "PREÇO" e "preço" funcionam igual (use `mb_strtolower`).',
      'Em `atendimento.php`: guarde a conversa em `$_SESSION["chat"]` (lista de mensagens com `autor` "bot" ou "cliente" e `texto`). Ao receber um POST, acrescente a mensagem do cliente e a resposta da Mel, e redirecione para a própria página.',
      'Mostre cada mensagem como `<div class="msg bot">` ou `<div class="msg cliente">`. O link `?limpar=1` recomeça a conversa só com o menu.'
    ],
    exemplo: {
      titulo: 'Exemplo parecido (bot de uma biblioteca)',
      codigo: '<?php\n  function atender($pergunta) {\n    $p = mb_strtolower(trim($pergunta));\n    if ($p === "1" || str_contains($p, "horário")) {\n      return "Abrimos das 7h às 22h.";\n    }\n    return "Não entendi. Digite 1 para horários.";\n  }\n  $link = "https://wa.me/5511900000000?text=" . rawurlencode("Quero renovar meu livro");'
    },
    requisitos: [
      { texto: 'A confirmação tem o botão do WhatsApp com a mensagem do agendamento', teste: async (t) => { const p = await agendar(t, { pet: 'Thor', horario: '15:00' }); const a = p.$('a.btn-whats'); if (!a) return false; const h = a.getAttribute('href'); if (!/^https:\/\/wa\.me\/\d+\?text=/.test(h)) return false; const msg = decodeURIComponent(h.split('text=')[1]); return msg.includes('Thor') && msg.includes('15:00') && msg.includes(t.br(t.diaUtil(2))); } },
      { texto: 'A mensagem do WhatsApp usa rawurlencode (espaços viram %20)', teste: async (t) => { const a = (await agendar(t)).$('a.btn-whats'); return !!a && /%20/.test(a.getAttribute('href')) && !/\+/.test(a.getAttribute('href').split('text=')[1] || '+'); } },
      { texto: 'O chat começa com o menu da Mel', teste: async (t) => { const p = await t.get('atendimento.php'); const m = p.$$('.msg'); return m.length === 1 && m[0].classList.contains('bot') && /1/.test(m[0].textContent) && /2/.test(m[0].textContent); } },
      { texto: 'Perguntar "2" responde com os preços dos serviços', teste: async (t) => { await t.get('atendimento.php'); const p = await t.post('atendimento.php', { mensagem: '2' }); const bots = p.$$('.msg.bot'); const ult = bots[bots.length - 1]; return !!ult && ult.textContent.includes('R$ 150,00') && ult.textContent.includes('Vacinação'); } },
      { texto: '"PREÇO" (maiúsculas) e "horário" também são entendidos', teste: async (t) => { await t.post('atendimento.php', { mensagem: 'Qual o PREÇO?' }); const p = await t.post('atendimento.php', { mensagem: 'qual o horário?' }); const b = p.$$('.msg.bot').map((x) => x.textContent); return b.length >= 3 && b[b.length - 2].includes('R$') && /8h|08:00|segunda/i.test(b[b.length - 1]); } },
      { texto: 'A conversa fica guardada na sessão (as mensagens anteriores continuam)', teste: async (t) => { await t.post('atendimento.php', { mensagem: 'oi' }); const p = await t.post('atendimento.php', { mensagem: '3' }); const c = p.$$('.msg.cliente').map((x) => x.textContent.trim()); return c.length === 2 && c[0] === 'oi' && c[1] === '3' && p.redirecionou; } },
      { texto: 'Mensagem desconhecida recebe "não entendi" e o menu', teste: async (t) => { const p = await t.post('atendimento.php', { mensagem: 'abacaxi' }); const b = p.$$('.msg.bot'); return /não entendi/i.test(b[b.length - 1].textContent); } },
      { texto: '"Começar nova conversa" limpa o chat', teste: async (t) => { await t.post('atendimento.php', { mensagem: 'oi' }); const p = await t.get('atendimento.php', { limpar: '1' }); return p.$$('.msg').length === 1; } }
    ],
    dicas: [
      'O `rawurlencode` é como colocar a mensagem num **envelope** próprio para URL: espaços viram `%20`, acentos viram códigos. Sem ele, o WhatsApp recebe a mensagem cortada.',
      'A sessão é a **memória** da Mel. Em cada POST: pegue a lista que já existe em `$_SESSION["chat"]`, acrescente duas mensagens (`[] =`) e redirecione. Na hora de mostrar, use `nl2br(htmlspecialchars(...))` para as quebras de linha do menu aparecerem.',
      'Esqueleto (atendimento.php):\nsession_start();\nif (!isset($_SESSION["chat"]) || isset($_GET["______"])) {\n  $_SESSION["chat"] = [["autor" => "bot", "texto" => menuBot()]];\n}\nif ($_SERVER["REQUEST_METHOD"] === "POST") {\n  $_SESSION["chat"][] = ["autor" => "______", "texto" => $mensagem];\n  $_SESSION["chat"][] = ["autor" => "bot", "texto" => responder(____, ____)];\n  header("Location: atendimento.php");\n  exit;\n}'
    ]
  }
  ];
})();
