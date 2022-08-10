import connection from '../databases/postgres.js';

async function getUserByEmail(email) {
  return await connection.query(
    `
    SELECT * FROM users 
    WHERE email = $1
    `,
    [email]
  );
}
async function insertUser(body) {
  const nome = body.name;
  const email = body.email;
  const senha = body.password;
  const foto = body.pictureUrl;

  return await connection.query(
    `
    INSERT INTO users(nome,email,senha,foto) VALUES($1,$2,$3,$4);
    `,
    [nome, email, senha, foto]
  );
}

const userRepository = {
  getUserByEmail,
  insertUser,
};

export default userRepository;
