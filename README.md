<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Entrada - Jogo da Memória Junina</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="entrada-container">
    <h2>Bem-vindo(a) à Festa Junina da Memória!</h2>
    <form id="entrada-nome">
      <label for="nome">Digite seu nome:</label>
      <input type="text" id="nome" required />
      <button type="submit">Começar jogo</button>
    </form>
  </div>

  <script>
  const form = document.getElementById('entrada-nome');

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value.trim();

    if (nome === "") {
      alert("Ops! Por favor, digite seu nome antes de começar.");
      return;
    }

    window.location.href = `index.html?nome=${encodeURIComponent(nome)}`;
  });
</script>

-
