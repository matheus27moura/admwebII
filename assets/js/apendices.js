/* Conteúdo extra da apostila: introdução e apêndices */
window.APENDICES = {
  intro: [
    'Bem-vindo à disciplina! Na etapa anterior você aprendeu a construir a parte <strong>visível</strong> dos sites com HTML, CSS e JavaScript. Agora vamos trabalhar na parte <strong>invisível</strong>, que roda no servidor: o PHP. Ao final das 10 aulas você terá construído dez pequenos sistemas e será capaz de criar formulários que funcionam, salvar dados, fazer login, consumir APIs, montar agendas e integrar o WhatsApp.',
    { h: 'Como cada aula funciona' },
    { passos: [
      '<strong>Explicação</strong> com exemplos curtos e comentados, sempre comparando com o que você já sabe de JavaScript.',
      '<strong>Projeto pronto</strong>: um site básico de um negócio fictício (cafeteria, loja, academia, barbearia...).',
      '<strong>Desafios</strong> em três níveis (básico, intermediário e avançado) para melhorar e automatizar o site com PHP.',
      '<strong>Revisão</strong> com os pontos principais para estudar depois.'
    ] },
    { h: 'O laboratório online' },
    'O site da disciplina tem um laboratório que roda HTML, CSS, JavaScript e PHP direto no navegador, sem instalar nada. Ele funciona como um pequeno servidor: você edita os arquivos à esquerda, clica em <strong>Executar</strong> e vê o resultado à direita. Formulários, links, sessões e arquivos salvos funcionam como num servidor de verdade.',
    { tabela: { cab: ['Parte do laboratório', 'Para que serve'], linhas: [
      ['Lista de projetos (topo)', 'Escolher o projeto de cada aula ou um projeto em branco'],
      ['Abas de arquivos', 'Editar <code>index.php</code>, <code>style.css</code> etc. O botão <strong>+</strong> cria arquivos novos'],
      ['Executar (Ctrl + Enter)', 'Roda o arquivo aberto (ou recarrega a página atual)'],
      ['Barra de endereço', 'Mostra a página atual e o método (GET/POST), como um navegador'],
      ['Console', 'Erros e avisos do PHP com a linha, e-mails simulados, chamadas de API e console.log do JS'],
      ['Dados salvos', 'Arquivos criados pelo PHP (JSON, TXT) e o conteúdo da sessão'],
      ['Requisição', 'O que chegou em <code>$_GET</code> e <code>$_POST</code>'],
      ['Baixar .zip', 'Leva o projeto para casa ou para o XAMPP'],
      ['Restaurar modelo / Limpar dados', 'Volta os arquivos ao original / apaga dados e sessão']
    ] } },
    { atencao: 'O laboratório guarda seu código no navegador do computador que você está usando. Ao trocar de computador, use "Baixar .zip" antes.' },
    { h: 'Dicas para estudar programação' },
    { lista: [
      '<strong>Digite</strong> os exemplos em vez de copiar e colar: os dedos também aprendem.',
      '<strong>Leia a mensagem de erro</strong> com calma. Ela diz o arquivo e a linha. Muitas vezes o erro está na linha de cima (um <code>;</code> esquecido).',
      '<strong>Teste aos poucos</strong>: escreva poucas linhas, execute, confira. É mais fácil achar um erro em 3 linhas do que em 30.',
      'Use <code>var_dump()</code> e <code>print_r()</code> para "espiar" variáveis quando algo não sai como esperado.',
      'Comente seu código explicando o <strong>porquê</strong>, não só o quê. Você do futuro vai agradecer.'
    ] }
  ],

  referencia: [
    'Você já conhece JavaScript, então aprender PHP é, em grande parte, aprender "como se diz isso em PHP". Use esta tabela como dicionário.',
    { tabela: { cab: ['Assunto', 'JavaScript', 'PHP'], linhas: [
      ['Variável', '<code>let nome = "Ana";</code>', '<code>$nome = "Ana";</code>'],
      ['Constante', '<code>const PI = 3.14;</code>', '<code>const PI = 3.14;</code> ou <code>define("PI", 3.14);</code>'],
      ['Mostrar algo', '<code>console.log(x)</code> / <code>innerHTML</code>', '<code>echo $x;</code> ou <code>&lt;?= $x ?&gt;</code>'],
      ['Juntar textos', '<code>"Olá, " + nome</code>', '<code>"Olá, " . $nome</code> ou <code>"Olá, $nome"</code>'],
      ['Acrescentar texto', '<code>texto += "abc"</code>', '<code>$texto .= "abc"</code>'],
      ['Comparar', '<code>===</code> / <code>!==</code>', '<code>===</code> / <code>!==</code> (iguais)'],
      ['Senão-se', '<code>else if</code>', '<code>elseif</code>'],
      ['Valor padrão', '<code>x ?? "padrão"</code>', '<code>$x ?? "padrão"</code> (igual)'],
      ['Array', '<code>[1, 2, 3]</code>', '<code>[1, 2, 3]</code>'],
      ['Adicionar no array', '<code>lista.push(4)</code>', '<code>$lista[] = 4;</code>'],
      ['Tamanho', '<code>lista.length</code>', '<code>count($lista)</code>'],
      ['Objeto / ficha', '<code>{ nome: "Ana" }</code> → <code>p.nome</code>', '<code>["nome" =&gt; "Ana"]</code> → <code>$p["nome"]</code>'],
      ['Percorrer', '<code>for (let x of lista)</code>', '<code>foreach ($lista as $x)</code>'],
      ['Função', '<code>function soma(a, b) { return a + b; }</code>', '<code>function soma($a, $b) { return $a + $b; }</code>'],
      ['Contém texto', '<code>t.includes("x")</code>', '<code>str_contains($t, "x")</code>'],
      ['Maiúsculas', '<code>t.toUpperCase()</code>', '<code>strtoupper($t)</code> / <code>mb_strtoupper($t)</code>'],
      ['Tamanho do texto', '<code>t.length</code>', '<code>strlen($t)</code> / <code>mb_strlen($t)</code>'],
      ['Tirar espaços', '<code>t.trim()</code>', '<code>trim($t)</code>'],
      ['Dividir texto', '<code>t.split(",")</code>', '<code>explode(",", $t)</code>'],
      ['Juntar lista', '<code>lista.join(", ")</code>', '<code>implode(", ", $lista)</code>'],
      ['Número inteiro', '<code>parseInt(t)</code>', '<code>(int) $t</code>'],
      ['Arredondar', '<code>Math.round(x)</code>', '<code>round($x)</code>'],
      ['Data atual', '<code>new Date()</code>', '<code>date("d/m/Y")</code> / <code>new DateTime()</code>'],
      ['JSON → dados', '<code>JSON.parse(t)</code>', '<code>json_decode($t, true)</code>'],
      ['Dados → JSON', '<code>JSON.stringify(o)</code>', '<code>json_encode($a)</code>'],
      ['Buscar URL', '<code>fetch(url).then(...)</code>', '<code>file_get_contents($url)</code>'],
      ['Comentário', '<code>// linha</code> e <code>/* bloco */</code>', '<code>// linha</code>, <code># linha</code> e <code>/* bloco */</code>']
    ] } },
    { h: 'Superglobais mais usadas' },
    { tabela: { cab: ['Variável', 'Contém'], linhas: [
      ['<code>$_GET</code>', 'Dados enviados pela URL (formulários GET e links com <code>?chave=valor</code>)'],
      ['<code>$_POST</code>', 'Dados enviados por formulários POST'],
      ['<code>$_SESSION</code>', 'Dados guardados para o visitante entre páginas (precisa de <code>session_start()</code>)'],
      ['<code>$_COOKIE</code>', 'Cookies enviados pelo navegador'],
      ['<code>$_SERVER</code>', 'Informações da requisição, como <code>$_SERVER["REQUEST_METHOD"]</code>']
    ] } }
  ],

  erros: [
    'Todo programador passa o dia lendo mensagens de erro. A diferença entre iniciante e experiente é saber o que cada uma significa. Veja as mais comuns:',
    { tabela: { cab: ['Mensagem', 'O que significa', 'Como resolver'], linhas: [
      ['<em>Parse error: syntax error, unexpected ...</em>', 'O PHP não entendeu a escrita do código', 'Procure <code>;</code>, <code>)</code>, <code>}</code> ou aspas faltando na linha indicada <strong>ou na anterior</strong>'],
      ['<em>Warning: Undefined variable $x</em>', 'A variável foi usada antes de receber valor (ou o nome está diferente)', 'Confira maiúsculas/minúsculas e se a variável foi criada antes'],
      ['<em>Warning: Undefined array key "nome"</em>', 'O array não tem essa chave (ex.: campo de formulário não enviado)', 'Use <code>$_POST["nome"] ?? ""</code> ou <code>isset()</code>; confira o <code>name</code> do campo'],
      ['<em>Fatal error: Call to undefined function x()</em>', 'A função não existe (nome errado ou arquivo não incluído)', 'Confira o nome e o <code>require</code> do arquivo de funções'],
      ['<em>Fatal error: Cannot redeclare function</em>', 'A mesma função foi criada duas vezes', 'Use <code>require_once</code> em vez de <code>require</code>'],
      ['<em>Unsupported operand types: string + string</em>', 'Usou <code>+</code> para juntar textos', 'Em PHP, junte textos com o ponto <code>.</code>'],
      ['<em>Division by zero</em>', 'Divisão por zero (ex.: altura vazia no IMC)', 'Valide o valor antes de dividir'],
      ['<em>Cannot modify header information - headers already sent</em>', 'Algo foi mostrado antes do <code>header()</code> ou <code>session_start()</code>', 'Coloque o PHP no topo, antes de qualquer HTML, espaço ou <code>echo</code>'],
      ['<em>failed to open stream: No such file or directory</em>', 'O arquivo do <code>include</code>/<code>file_get_contents</code> não existe', 'Confira o nome e a pasta do arquivo'],
      ['Página em branco, nada acontece', 'Erro fatal com exibição de erros desligada, ou laço infinito', 'Veja o console do laboratório; no XAMPP, confira os logs']
    ] } },
    { h: 'Roteiro para caçar erros' },
    { passos: [
      'Leia a mensagem inteira: <strong>tipo</strong> (Warning, Fatal, Parse), <strong>arquivo</strong> e <strong>linha</strong>.',
      'Vá até a linha (no laboratório, clique na mensagem do console).',
      'Se não encontrar nada, olhe a linha de cima.',
      'Use <code>var_dump($variavel)</code> para conferir valores no meio do caminho.',
      'Desfaça a última alteração e teste de novo: o erro costuma estar no que você acabou de mudar.'
    ] }
  ],

  xampp: [
    'O laboratório é ótimo para estudar, mas é importante saber rodar PHP no próprio computador, como em um servidor real. A forma mais simples é o <strong>XAMPP</strong>, um pacote gratuito que instala o servidor Apache, o PHP e o banco de dados MySQL.',
    { passos: [
      'Baixe o XAMPP em <strong>apachefriends.org</strong> (versão para o seu sistema) e instale com as opções padrão.',
      'Abra o <strong>XAMPP Control Panel</strong> e clique em <strong>Start</strong> ao lado de <strong>Apache</strong>.',
      'No laboratório, clique em <strong>Baixar .zip</strong> e extraia a pasta do projeto.',
      'Copie a pasta para <code>C:\\xampp\\htdocs\\</code> (no Windows).',
      'No navegador, acesse <code>http://localhost/nome-da-pasta/</code>.',
      'Edite os arquivos com o VS Code e apenas atualize o navegador (F5) para ver as mudanças.'
    ] },
    { tabela: { cab: ['No laboratório', 'No XAMPP'], linhas: [
      ['E-mails do <code>mail()</code> aparecem no console', 'O <code>mail()</code> precisa de configuração de SMTP (ou use PHPMailer)'],
      ['Chamadas de API passam pelo navegador', 'O PHP acessa a internet direto'],
      ['Cookies não são simulados', '<code>setcookie</code> funciona normalmente'],
      ['Dados ficam no navegador', 'Dados ficam em arquivos dentro da pasta do projeto']
    ] } },
    { dica: 'Se o Apache não iniciar, provavelmente outro programa está usando a porta 80 (Skype, IIS). Feche-o ou altere a porta nas configurações do Apache.' },
    { h: 'Colocando o site no ar' },
    'Para publicar um site PHP na internet você precisa de uma <strong>hospedagem com suporte a PHP</strong> (existem planos gratuitos para estudo). Observe: o GitHub Pages, onde este site da disciplina está publicado, só hospeda arquivos estáticos (HTML, CSS, JS) e <strong>não executa PHP</strong>. É por isso que o laboratório roda o PHP dentro do navegador.'
  ],

  glossario: [
    { tabela: { cab: ['Termo', 'Significado'], linhas: [
      ['API', 'Porta de serviço que um sistema oferece para outros programas pedirem dados ou ações'],
      ['Array', 'Variável que guarda vários valores; pode ser indexado (posições) ou associativo (chaves)'],
      ['Back-end', 'Parte do sistema que roda no servidor (PHP, banco de dados)'],
      ['Cliente', 'O navegador (ou app) que faz pedidos ao servidor'],
      ['Concatenação', 'Juntar textos; em PHP, com o ponto <code>.</code>'],
      ['Cookie', 'Pequeno dado guardado no navegador e enviado ao servidor a cada requisição'],
      ['CRUD', 'Create, Read, Update, Delete: as quatro operações básicas com dados'],
      ['Front-end', 'Parte do sistema que roda no navegador (HTML, CSS, JS)'],
      ['GET', 'Método de envio com os dados na URL; usado para consultas'],
      ['Hash', 'Resultado de uma transformação de mão única, usado para guardar senhas'],
      ['HTTP / HTTPS', 'Protocolo de comunicação da web; o S indica conexão criptografada'],
      ['JSON', 'Formato de texto para representar dados (listas e fichas), usado por APIs e arquivos'],
      ['Persistência', 'Guardar dados de forma permanente (arquivo, banco de dados)'],
      ['POST', 'Método de envio com os dados no corpo da requisição; usado para cadastros e senhas'],
      ['Regra de negócio', 'Regra do mundo real que o sistema precisa respeitar (ex.: não agendar no domingo)'],
      ['Requisição / resposta', 'O pedido do navegador e o que o servidor devolve'],
      ['Servidor', 'Computador que recebe requisições e executa o PHP'],
      ['Sessão', 'Dados de um visitante guardados no servidor enquanto ele navega'],
      ['Superglobal', 'Variáveis automáticas do PHP disponíveis em qualquer lugar, como <code>$_GET</code> e <code>$_POST</code>'],
      ['Timestamp', 'Número de segundos desde 01/01/1970, usado para representar datas'],
      ['Token', 'Código secreto que identifica e autoriza um sistema a usar uma API'],
      ['Validação', 'Conferir se os dados recebidos seguem as regras antes de usá-los'],
      ['Webhook', 'Endereço do seu sistema que outro serviço chama automaticamente quando algo acontece'],
      ['XSS', 'Ataque em que código malicioso digitado pelo usuário é executado na página; evitado com <code>htmlspecialchars</code>']
    ] } }
  ]
};
