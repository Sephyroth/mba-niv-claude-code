const express = require('express');

const app = express();
const PORT = 3000;

// Usuário fixo para a demonstração
const USER = { email: 'admin@demo.com', password: '1234' };

app.use(express.urlencoded({ extended: false }));

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body>
${body}
</body>
</html>`;
}

// GET /login — formulário de login
app.get('/login', (req, res) => {
  const error = req.query.error
    ? '<p style="color:red">Email ou senha inválidos.</p>'
    : '';

  res.send(
    page(
      'Login',
      `<h1>Login</h1>
${error}
<form method="POST" action="/login">
  <label>Email: <input type="email" name="email" required></label><br>
  <label>Senha: <input type="password" name="password" required></label><br>
  <button type="submit">Entrar</button>
</form>`
    )
  );
});

// POST /login — valida credenciais
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === USER.email && password === USER.password) {
    return res.redirect('/dashboard');
  }

  return res.redirect('/login?error=1');
});

// GET /dashboard
app.get('/dashboard', (req, res) => {
  res.send(page('Dashboard', '<h1>Bem-vindo, admin</h1>'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
