/* =========================================================
   Projeto da disciplina — site modelo "Patas & Cia"
   ---------------------------------------------------------
   Estes são os arquivos que o aluno recebe na Etapa 1.
   As páginas .php contêm SOMENTE HTML: o PHP será escrito
   pelo aluno, etapa por etapa (uma etapa por aula).
   style.css e script.js ficam travados na IDE.
   ========================================================= */
window.PROJETO_SITE = {
'index.php': String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Patas &amp; Cia — Pet shop e clínica</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Faixa de informações: a data deve ser a de HOJE (etapa 1) -->
  <div class="faixa">Hoje é 01/01/2025 · Seg a Sáb, 8h às 18h · (11) 4002-8922</div>

  <header class="topo">
    <div class="container topo-linha">
      <a class="logo" href="index.php"><span class="logo-marca">P</span>Patas &amp; Cia</a>
      <button class="menu-btn" type="button" aria-label="Abrir menu">Menu</button>
      <nav class="menu">
        <a href="index.php">Início</a>
        <a href="servicos.php">Serviços</a>
        <a href="agendar.php">Agendar</a>
        <a href="contato.php">Contato</a>
        <a href="atendimento.php">Atendimento</a>
        <a href="login.php" class="menu-admin">Área restrita</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <!-- O selo muda conforme o horário de funcionamento (etapa 2) -->
        <span class="selo aberto">Aberto agora</span>
        <!-- A saudação muda conforme a hora do dia (etapa 2) -->
        <h1>Bom dia! Seu pet merece cuidado de verdade.</h1>
        <p>Banho, tosa, consultas e hospedagem com muito carinho, em São Paulo.</p>
        <a class="btn" href="agendar.php">Agendar horário</a>
        <!-- Temperatura real vinda de uma API de clima (etapa 8) -->
        <p class="clima">Agora em São Paulo: -- °C</p>
      </div>
    </section>

    <section class="container secao">
      <!-- O número de anos deve ser CALCULADO a partir do ano de fundação (etapa 1) -->
      <p class="destaque-anos">Fundada em 2015 — há <strong>10 anos</strong> cuidando de pets.</p>
    </section>

    <section class="container secao">
      <h2>Serviços em destaque</h2>
      <!-- Os 3 primeiros serviços do array (etapa 3) -->
      <div class="grade">
        <article class="servico">
          <span class="categoria">Higiene</span>
          <h3>Banho</h3>
          <p>Shampoo neutro, secagem e perfume suave.</p>
          <p class="preco">R$ 45,00</p>
        </article>
        <article class="servico">
          <span class="categoria">Higiene</span>
          <h3>Tosa higiênica</h3>
          <p>Aparo de patas, barriga e região íntima.</p>
          <p class="preco">R$ 35,00</p>
        </article>
        <article class="servico">
          <span class="categoria">Higiene</span>
          <h3>Banho e tosa completa</h3>
          <p>Banho completo com tosa na tesoura ou máquina.</p>
          <p class="preco">R$ 90,00</p>
        </article>
      </div>
      <p><a href="servicos.php">Ver todos os serviços &rarr;</a></p>
    </section>
  </main>

  <footer class="rodape">
    <div class="container">
      <p><strong>Patas &amp; Cia</strong> · Rua das Flores, 120 · São Paulo/SP · (11) 4002-8922</p>
      <!-- O ano deve ser sempre o ano atual (etapa 1) -->
      <p>&copy; 2024 Patas &amp; Cia. Todos os direitos reservados.</p>
    </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>
`,

'servicos.php': String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Serviços — Patas &amp; Cia</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="faixa">Hoje é 01/01/2025 · Seg a Sáb, 8h às 18h · (11) 4002-8922</div>

  <header class="topo">
    <div class="container topo-linha">
      <a class="logo" href="index.php"><span class="logo-marca">P</span>Patas &amp; Cia</a>
      <button class="menu-btn" type="button" aria-label="Abrir menu">Menu</button>
      <nav class="menu">
        <a href="index.php">Início</a>
        <a href="servicos.php">Serviços</a>
        <a href="agendar.php">Agendar</a>
        <a href="contato.php">Contato</a>
        <a href="atendimento.php">Atendimento</a>
        <a href="login.php" class="menu-admin">Área restrita</a>
      </nav>
    </div>
  </header>

  <main class="container secao">
    <h1>Nossos serviços</h1>

    <!-- Busca por nome e filtro por categoria (etapa 4) -->
    <form class="busca" method="get" action="servicos.php">
      <input type="search" name="busca" placeholder="Buscar serviço (ex.: banho)" value="">
      <select name="categoria">
        <option value="">Todas as categorias</option>
        <option>Higiene</option>
        <option>Saúde</option>
        <option>Hospedagem</option>
      </select>
      <button class="btn" type="submit">Buscar</button>
    </form>

    <p class="resultado">6 serviço(s) encontrado(s)</p>

    <!-- Quando nada for encontrado, mostre no lugar da grade (etapa 4):
         <p class="vazio">Nenhum serviço encontrado. Tente outra palavra.</p> -->

    <!-- Estes 6 cartões devem vir do array $servicos (etapa 3) -->
    <div class="grade">
      <article class="servico">
        <span class="categoria">Higiene</span>
        <h3>Banho</h3>
        <p>Shampoo neutro, secagem e perfume suave.</p>
        <p class="preco">R$ 45,00</p>
      </article>
      <article class="servico">
        <span class="categoria">Higiene</span>
        <h3>Tosa higiênica</h3>
        <p>Aparo de patas, barriga e região íntima.</p>
        <p class="preco">R$ 35,00</p>
      </article>
      <article class="servico">
        <span class="categoria">Higiene</span>
        <h3>Banho e tosa completa</h3>
        <p>Banho completo com tosa na tesoura ou máquina.</p>
        <p class="preco">R$ 90,00</p>
      </article>
      <article class="servico">
        <span class="categoria">Saúde</span>
        <h3>Consulta veterinária</h3>
        <p>Avaliação completa com médica veterinária.</p>
        <p class="preco">R$ 150,00</p>
      </article>
      <article class="servico">
        <span class="categoria">Saúde</span>
        <h3>Vacinação</h3>
        <p>Vacinas importadas com carteirinha digital.</p>
        <p class="preco">R$ 80,00</p>
      </article>
      <article class="servico">
        <span class="categoria">Hospedagem</span>
        <h3>Hotelzinho (diária)</h3>
        <p>Espaço climatizado, passeios e câmeras ao vivo.</p>
        <p class="preco">R$ 70,00</p>
      </article>
    </div>
  </main>

  <footer class="rodape">
    <div class="container">
      <p><strong>Patas &amp; Cia</strong> · Rua das Flores, 120 · São Paulo/SP · (11) 4002-8922</p>
      <p>&copy; 2024 Patas &amp; Cia. Todos os direitos reservados.</p>
    </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>
`,

'agendar.php': String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Agendar — Patas &amp; Cia</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="faixa">Hoje é 01/01/2025 · Seg a Sáb, 8h às 18h · (11) 4002-8922</div>

  <header class="topo">
    <div class="container topo-linha">
      <a class="logo" href="index.php"><span class="logo-marca">P</span>Patas &amp; Cia</a>
      <button class="menu-btn" type="button" aria-label="Abrir menu">Menu</button>
      <nav class="menu">
        <a href="index.php">Início</a>
        <a href="servicos.php">Serviços</a>
        <a href="agendar.php">Agendar</a>
        <a href="contato.php">Contato</a>
        <a href="atendimento.php">Atendimento</a>
        <a href="login.php" class="menu-admin">Área restrita</a>
      </nav>
    </div>
  </header>

  <main class="container secao">
    <h1>Agendar horário</h1>

    <!-- MODELOS DE AVISO: use quando precisar (etapas 4, 5, 9 e 10)

    <div class="alerta sucesso">
      Agendamento de <strong>NOME DO PET</strong> confirmado para DD/MM/AAAA às HH:MM.
      <a class="btn btn-whats" href="https://wa.me/5511940028922?text=MENSAGEM" target="_blank">Confirmar pelo WhatsApp</a>
    </div>

    <div class="alerta erro">
      <ul>
        <li>Mensagem de erro</li>
      </ul>
    </div>
    -->

    <!-- Formulário 1: escolher o dia (envia por GET para esta mesma página) -->
    <form class="cartao" method="get" action="agendar.php">
      <h2>1. Escolha o dia</h2>
      <div class="linha-dia">
        <label>Data <input type="date" name="data" value=""></label>
        <button class="btn secundario" type="submit">Ver horários</button>
      </div>
    </form>

    <!-- Formulário 2: horário e dados (envia por POST para esta mesma página).
         Sem o atributo "required" de propósito: quem valida é o PHP (etapa 5). -->
    <form class="cartao" method="post" action="agendar.php">
      <!-- o dia escolhido no formulário 1 viaja escondido neste campo -->
      <input type="hidden" name="data" value="">

      <h2>2. Escolha o horário</h2>
      <!-- Os horários vão das 08:00 às 17:00, de hora em hora (etapa 2).
           Horário já reservado recebe a classe "ocupado" e o atributo disabled (etapa 9). -->
      <div class="horarios">
        <label class="horario"><input type="radio" name="horario" value="08:00"> 08:00</label>
        <label class="horario"><input type="radio" name="horario" value="09:00"> 09:00</label>
        <label class="horario ocupado"><input type="radio" name="horario" value="10:00" disabled> 10:00</label>
      </div>

      <h2>3. Seus dados</h2>
      <div class="campos">
        <label>Seu nome <input type="text" name="tutor" value=""></label>
        <label>Telefone (WhatsApp) <input type="tel" name="telefone" value="" placeholder="(11) 99999-9999"></label>
        <label>Nome do pet <input type="text" name="pet" value=""></label>
        <label>Serviço
          <!-- As opções devem vir do array $servicos (etapa 3) -->
          <select name="servico">
            <option value="">Selecione...</option>
            <option>Banho</option>
            <option>Tosa higiênica</option>
          </select>
        </label>
      </div>
      <button class="btn" type="submit">Confirmar agendamento</button>
    </form>
  </main>

  <footer class="rodape">
    <div class="container">
      <p><strong>Patas &amp; Cia</strong> · Rua das Flores, 120 · São Paulo/SP · (11) 4002-8922</p>
      <p>&copy; 2024 Patas &amp; Cia. Todos os direitos reservados.</p>
    </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>
`,

'contato.php': String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Contato — Patas &amp; Cia</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="faixa">Hoje é 01/01/2025 · Seg a Sáb, 8h às 18h · (11) 4002-8922</div>

  <header class="topo">
    <div class="container topo-linha">
      <a class="logo" href="index.php"><span class="logo-marca">P</span>Patas &amp; Cia</a>
      <button class="menu-btn" type="button" aria-label="Abrir menu">Menu</button>
      <nav class="menu">
        <a href="index.php">Início</a>
        <a href="servicos.php">Serviços</a>
        <a href="agendar.php">Agendar</a>
        <a href="contato.php">Contato</a>
        <a href="atendimento.php">Atendimento</a>
        <a href="login.php" class="menu-admin">Área restrita</a>
      </nav>
    </div>
  </header>

  <main class="container secao">
    <h1>Fale conosco</h1>

    <!-- MODELOS DE AVISO (etapas 4 e 5):
    <div class="alerta sucesso">Obrigado, NOME! Respondemos em até 1 dia útil.</div>
    <div class="alerta erro"><ul><li>Mensagem de erro</li></ul></div>
    -->

    <div class="colunas">
      <!-- Mensagem: envia por POST para esta mesma página -->
      <form class="cartao" method="post" action="contato.php">
        <h2>Envie uma mensagem</h2>
        <label>Nome <input type="text" name="nome" value=""></label>
        <label>E-mail <input type="text" name="email" value=""></label>
        <label>Assunto
          <select name="assunto">
            <option>Dúvida</option>
            <option>Orçamento</option>
            <option>Elogio</option>
            <option>Reclamação</option>
          </select>
        </label>
        <label>Mensagem <textarea name="mensagem" rows="5"></textarea></label>
        <button class="btn" type="submit">Enviar mensagem</button>
      </form>

      <!-- Leva e traz: consulta o CEP numa API (etapa 8) -->
      <form class="cartao" method="get" action="contato.php">
        <h2>Leva e traz</h2>
        <p class="muted">Buscamos seu pet em casa. Digite o CEP para conferir o endereço.</p>
        <div class="linha-dia">
          <label>CEP <input type="text" name="cep" value="" placeholder="00000-000"></label>
          <button class="btn secundario" type="submit">Buscar endereço</button>
        </div>
        <!-- Se o CEP não existir: <p class="alerta erro">CEP não encontrado.</p> -->
        <label>Rua <input type="text" name="rua" value="" readonly></label>
        <label>Bairro <input type="text" name="bairro" value="" readonly></label>
        <label>Cidade <input type="text" name="cidade" value="" readonly></label>
      </form>
    </div>
  </main>

  <footer class="rodape">
    <div class="container">
      <p><strong>Patas &amp; Cia</strong> · Rua das Flores, 120 · São Paulo/SP · (11) 4002-8922</p>
      <p>&copy; 2024 Patas &amp; Cia. Todos os direitos reservados.</p>
    </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>
`,

'login.php': String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Área restrita — Patas &amp; Cia</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="faixa">Hoje é 01/01/2025 · Seg a Sáb, 8h às 18h · (11) 4002-8922</div>

  <header class="topo">
    <div class="container topo-linha">
      <a class="logo" href="index.php"><span class="logo-marca">P</span>Patas &amp; Cia</a>
      <button class="menu-btn" type="button" aria-label="Abrir menu">Menu</button>
      <nav class="menu">
        <a href="index.php">Início</a>
        <a href="servicos.php">Serviços</a>
        <a href="agendar.php">Agendar</a>
        <a href="contato.php">Contato</a>
        <a href="atendimento.php">Atendimento</a>
        <a href="login.php" class="menu-admin">Área restrita</a>
      </nav>
    </div>
  </header>

  <main class="container secao estreito">
    <h1>Área restrita</h1>
    <p class="muted">Acesso exclusivo da equipe da Patas &amp; Cia.</p>

    <!-- Se o login falhar (etapa 7):
    <div class="alerta erro">E-mail ou senha incorretos.</div>
    -->

    <form class="cartao" method="post" action="login.php">
      <label>E-mail <input type="text" name="email" value=""></label>
      <label>Senha <input type="password" name="senha"></label>
      <button class="btn" type="submit">Entrar</button>
    </form>
  </main>

  <footer class="rodape">
    <div class="container">
      <p><strong>Patas &amp; Cia</strong> · Rua das Flores, 120 · São Paulo/SP · (11) 4002-8922</p>
      <p>&copy; 2024 Patas &amp; Cia. Todos os direitos reservados.</p>
    </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>
`,

'admin.php': String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Painel — Patas &amp; Cia</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="faixa">Hoje é 01/01/2025 · Seg a Sáb, 8h às 18h · (11) 4002-8922</div>

  <header class="topo">
    <div class="container topo-linha">
      <a class="logo" href="index.php"><span class="logo-marca">P</span>Patas &amp; Cia</a>
      <button class="menu-btn" type="button" aria-label="Abrir menu">Menu</button>
      <nav class="menu">
        <a href="index.php">Início</a>
        <a href="servicos.php">Serviços</a>
        <a href="agendar.php">Agendar</a>
        <a href="contato.php">Contato</a>
        <a href="atendimento.php">Atendimento</a>
        <a href="login.php" class="menu-admin">Área restrita</a>
      </nav>
    </div>
  </header>

  <!-- Só quem fez login pode ver esta página (etapa 7) -->
  <main class="container secao">
    <div class="painel-topo">
      <h1>Olá, Administrador</h1>
      <a class="btn secundario" href="sair.php">Sair</a>
    </div>

    <div class="numeros">
      <div><strong>2</strong><span>agendamentos</span></div>
      <div><strong>0</strong><span>para hoje</span></div>
      <div><strong>1</strong><span>mensagens</span></div>
    </div>

    <h2>Agendamentos</h2>
    <!-- As linhas vêm de dados/agendamentos.json (etapa 7), em ordem de data e hora (etapa 9) -->
    <table class="tabela agendamentos">
      <thead><tr><th>Data</th><th>Hora</th><th>Pet</th><th>Serviço</th><th>Tutor</th><th>Telefone</th></tr></thead>
      <tbody>
        <tr><td>20/11/2025</td><td>09:00</td><td>Thor</td><td>Banho</td><td>Mariana</td><td>11999998888</td></tr>
        <tr><td>21/11/2025</td><td>14:00</td><td>Luna</td><td>Vacinação</td><td>Carlos</td><td>11988887777</td></tr>
      </tbody>
    </table>

    <h2>Mensagens</h2>
    <!-- As linhas vêm de dados/mensagens.json (etapa 7) -->
    <table class="tabela mensagens">
      <thead><tr><th>Data</th><th>Nome</th><th>E-mail</th><th>Assunto</th><th>Mensagem</th></tr></thead>
      <tbody>
        <tr><td>19/11/2025 10:32</td><td>Beatriz</td><td>bia@email.com</td><td>Dúvida</td><td>Vocês aceitam gatos no hotelzinho?</td></tr>
      </tbody>
    </table>
  </main>

  <footer class="rodape">
    <div class="container">
      <p><strong>Patas &amp; Cia</strong> · Rua das Flores, 120 · São Paulo/SP · (11) 4002-8922</p>
      <p>&copy; 2024 Patas &amp; Cia. Todos os direitos reservados.</p>
    </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>
`,

'atendimento.php': String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Atendimento — Patas &amp; Cia</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="faixa">Hoje é 01/01/2025 · Seg a Sáb, 8h às 18h · (11) 4002-8922</div>

  <header class="topo">
    <div class="container topo-linha">
      <a class="logo" href="index.php"><span class="logo-marca">P</span>Patas &amp; Cia</a>
      <button class="menu-btn" type="button" aria-label="Abrir menu">Menu</button>
      <nav class="menu">
        <a href="index.php">Início</a>
        <a href="servicos.php">Serviços</a>
        <a href="agendar.php">Agendar</a>
        <a href="contato.php">Contato</a>
        <a href="atendimento.php">Atendimento</a>
        <a href="login.php" class="menu-admin">Área restrita</a>
      </nav>
    </div>
  </header>

  <main class="container secao estreito">
    <h1>Atendimento virtual</h1>
    <p class="muted">Converse com a Mel, nossa assistente. Ela responde na hora.</p>

    <!-- As mensagens vêm da sessão do visitante (etapa 10).
         "bot" = resposta da Mel, "cliente" = o que o visitante digitou. -->
    <div class="chat" id="chat">
      <div class="msg bot">Olá! Eu sou a Mel, assistente virtual da Patas &amp; Cia. Digite:<br>1 - Horários<br>2 - Preços<br>3 - Endereço<br>4 - Agendar</div>
      <div class="msg cliente">2</div>
      <div class="msg bot">Nossos preços:<br>Banho: R$ 45,00<br>Tosa higiênica: R$ 35,00</div>
    </div>

    <form class="chat-form" method="post" action="atendimento.php">
      <input type="text" name="mensagem" placeholder="Digite sua mensagem..." autocomplete="off">
      <button class="btn" type="submit">Enviar</button>
    </form>
    <p><a href="atendimento.php?limpar=1">Começar nova conversa</a></p>
  </main>

  <footer class="rodape">
    <div class="container">
      <p><strong>Patas &amp; Cia</strong> · Rua das Flores, 120 · São Paulo/SP · (11) 4002-8922</p>
      <p>&copy; 2024 Patas &amp; Cia. Todos os direitos reservados.</p>
    </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>
`,

'style.css': String.raw`/* =========================================
   Patas & Cia — estilo do site (pronto)
   Você não precisa mexer aqui: o foco é o PHP.
   ========================================= */
* { box-sizing: border-box; }
:root {
  --verde: #2f7d6d;
  --verde-escuro: #225c50;
  --verde-claro: #e6f2ef;
  --areia: #f7f3ec;
  --texto: #23302d;
  --cinza: #6b7774;
  --borda: #dfe5e3;
  --erro: #b3261e;
  --erro-claro: #fbeceb;
  --ok: #1f7a43;
  --ok-claro: #e7f5ec;
  --raio: 12px;
}
body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: var(--texto); background: #fff; line-height: 1.6; }
a { color: var(--verde); }
h1, h2, h3 { line-height: 1.25; margin: 0 0 12px; }
.container { max-width: 1040px; margin: 0 auto; padding: 0 20px; }
.secao { padding: 36px 20px; }
.estreito { max-width: 560px; }
.muted { color: var(--cinza); }

.faixa { background: var(--verde-escuro); color: #e9f3f0; font-size: .85rem; text-align: center; padding: 6px 12px; }
.topo { border-bottom: 1px solid var(--borda); background: #fff; position: sticky; top: 0; z-index: 5; }
.topo-linha { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.logo { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1.15rem; color: var(--texto); text-decoration: none; }
.logo-marca { width: 34px; height: 34px; border-radius: 10px; background: var(--verde); color: #fff; display: grid; place-items: center; }
.menu { display: flex; gap: 4px; }
.menu a { text-decoration: none; color: var(--texto); padding: 8px 12px; border-radius: 8px; font-size: .95rem; }
.menu a:hover { background: var(--verde-claro); }
.menu .menu-admin { color: var(--cinza); }
.menu-btn { display: none; border: 1px solid var(--borda); background: #fff; border-radius: 8px; padding: 6px 12px; font: inherit; cursor: pointer; }

.hero { background: var(--areia); padding: 56px 0; }
.hero h1 { font-size: 2.2rem; max-width: 620px; }
.hero p { font-size: 1.1rem; color: var(--cinza); max-width: 560px; }
.selo { display: inline-block; font-size: .8rem; font-weight: 600; padding: 4px 10px; border-radius: 99px; margin-bottom: 14px; }
.selo.aberto { background: var(--ok-claro); color: var(--ok); }
.selo.fechado { background: var(--erro-claro); color: var(--erro); }
.clima { font-size: .95rem !important; margin-top: 18px; }
.destaque-anos { font-size: 1.15rem; text-align: center; margin: 0; }

.btn { display: inline-block; background: var(--verde); color: #fff; border: 0; border-radius: 10px; padding: 11px 20px; font: 600 .95rem system-ui, sans-serif; text-decoration: none; cursor: pointer; }
.btn:hover { background: var(--verde-escuro); }
.btn.secundario { background: #fff; color: var(--verde); border: 1px solid var(--verde); }
.btn-whats { background: #1f8f4e; margin-top: 10px; }

.grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; margin: 16px 0; }
.servico { border: 1px solid var(--borda); border-radius: var(--raio); padding: 18px; background: #fff; }
.servico h3 { margin: 8px 0 6px; font-size: 1.1rem; }
.servico p { margin: 0 0 8px; color: var(--cinza); font-size: .95rem; }
.servico .preco { color: var(--verde-escuro); font-weight: 700; font-size: 1.05rem; margin: 0; }
.categoria { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: var(--verde); background: var(--verde-claro); padding: 2px 8px; border-radius: 99px; }

.busca { display: flex; gap: 8px; flex-wrap: wrap; margin: 16px 0 6px; }
.busca input, .busca select { flex: 1; min-width: 180px; }
.resultado { color: var(--cinza); font-size: .9rem; }
.vazio { padding: 24px; text-align: center; background: var(--areia); border-radius: var(--raio); }

input, select, textarea { width: 100%; font: inherit; padding: 10px 12px; border: 1px solid var(--borda); border-radius: 8px; background: #fff; color: var(--texto); }
input:focus, select:focus, textarea:focus { outline: 2px solid var(--verde-claro); border-color: var(--verde); }
input[readonly] { background: var(--areia); }
label { display: block; font-weight: 600; font-size: .9rem; margin-bottom: 12px; }
label input, label select, label textarea { margin-top: 4px; font-weight: 400; }

.cartao { border: 1px solid var(--borda); border-radius: var(--raio); padding: 22px; margin-bottom: 18px; background: #fff; }
.cartao h2 { font-size: 1.1rem; }
.colunas { display: grid; grid-template-columns: 1.3fr 1fr; gap: 18px; align-items: start; }
.campos { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
.linha-dia { display: flex; gap: 10px; align-items: end; }
.linha-dia label { flex: 1; }
.linha-dia .btn { margin-bottom: 12px; }

.horarios { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
.horario { display: flex; align-items: center; gap: 6px; border: 1px solid var(--borda); border-radius: 8px; padding: 8px 12px; margin: 0; font-weight: 500; cursor: pointer; }
.horario input { width: auto; margin: 0; }
.horario.ocupado { background: #f1f1f1; color: #aaa; text-decoration: line-through; cursor: not-allowed; }

.alerta { border-radius: var(--raio); padding: 14px 18px; margin: 0 0 18px; }
.alerta ul { margin: 0; padding-left: 18px; }
.alerta.sucesso { background: var(--ok-claro); color: var(--ok); border: 1px solid #b9e0c7; }
.alerta.erro { background: var(--erro-claro); color: var(--erro); border: 1px solid #efc2bf; }

.painel-topo { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.numeros { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 18px 0 28px; }
.numeros div { background: var(--areia); border-radius: var(--raio); padding: 16px; }
.numeros strong { display: block; font-size: 1.8rem; color: var(--verde-escuro); }
.numeros span { color: var(--cinza); font-size: .9rem; }
.tabela { width: 100%; border-collapse: collapse; margin-bottom: 28px; font-size: .92rem; }
.tabela th, .tabela td { text-align: left; padding: 10px; border-bottom: 1px solid var(--borda); }
.tabela th { background: var(--areia); font-size: .8rem; text-transform: uppercase; letter-spacing: .03em; color: var(--cinza); }

.chat { border: 1px solid var(--borda); border-radius: var(--raio); padding: 16px; height: 360px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: var(--areia); }
.msg { max-width: 80%; padding: 10px 14px; border-radius: 14px; font-size: .95rem; }
.msg.bot { background: #fff; border: 1px solid var(--borda); align-self: flex-start; }
.msg.cliente { background: var(--verde); color: #fff; align-self: flex-end; }
.chat-form { display: flex; gap: 8px; margin-top: 12px; }

.rodape { background: var(--texto); color: #cfd8d6; font-size: .88rem; padding: 22px 0; margin-top: 30px; }
.rodape p { margin: 4px 0; }

@media (max-width: 760px) {
  .menu-btn { display: block; }
  .menu { display: none; position: absolute; top: 64px; left: 0; right: 0; background: #fff; flex-direction: column; padding: 8px 20px 16px; border-bottom: 1px solid var(--borda); }
  .menu.aberto { display: flex; }
  .colunas, .campos { grid-template-columns: 1fr; }
  .hero h1 { font-size: 1.7rem; }
  .numeros { grid-template-columns: 1fr; }
  .tabela { display: block; overflow-x: auto; }
}
`,

'script.js': String.raw`// =========================================
// Patas & Cia — JavaScript do site (pronto)
// Roda no NAVEGADOR, depois que o PHP já montou a página.
// =========================================

// Menu no celular: abre e fecha a lista de links
const botaoMenu = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
if (botaoMenu && menu) {
  botaoMenu.addEventListener('click', () => menu.classList.toggle('aberto'));
}

// Destaca no menu o link da página atual
const paginaAtual = location.pathname.split('/').pop() || 'index.php';
document.querySelectorAll('.menu a').forEach((link) => {
  if (link.getAttribute('href') === paginaAtual) link.style.fontWeight = '700';
});

// Chat: rola até a última mensagem
const chat = document.getElementById('chat');
if (chat) chat.scrollTop = chat.scrollHeight;

// Máscara simples de telefone: (11) 99999-9999
const tel = document.querySelector('input[name="telefone"]');
if (tel) {
  tel.addEventListener('input', () => {
    const n = tel.value.replace(/\D/g, '').slice(0, 11);
    let t = n;
    if (n.length > 2) t = '(' + n.slice(0, 2) + ') ' + n.slice(2);
    if (n.length > 7) t = '(' + n.slice(0, 2) + ') ' + n.slice(2, n.length - 4) + '-' + n.slice(-4);
    tel.value = t;
  });
}
`
};
