const users = [
  { id: 1, username: 'alice', password: 'secret123', active: true, role: 'admin' },
  { id: 2, username: 'bob', password: 'hunter2', active: false, role: 'user' },
];

function findUser(username) {
  return users.find((u) => u.username === username);
}

function validateUser(user) {
  return Boolean(
    user &&
      user.username &&
      user.password &&
      user.username.length >= 3 &&
      user.password.length >= 6
  );
}

function login(credentials) {
  if (!validateUser(credentials)) {
    return { success: false, message: 'Invalid input' };
  }

  const user = findUser(credentials.username);

  if (user && user.active && user.password === credentials.password) {
    const token = Buffer.from(`${user.id}:${user.username}`).toString('base64');
    return { success: true, token: token, role: user.role };
  }

  return { success: false, message: 'Authentication failed' };
}

function logout(token) {
  const decoded = Buffer.from(token, 'base64').toString('utf8');
  const parts = decoded.split(':');
  return { success: true, userId: Number(parts[0]) };
}

module.exports = { validateUser, login, logout };
