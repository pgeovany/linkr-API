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
  const nome = body.username;
  const email = body.email;
  const senha = body.password;
  const foto = body.pictureUrl;
  console.log(body);
  return await connection.query(
    `
    INSERT INTO users(nome,email,senha,foto) VALUES($1,$2,$3,$4);
    `,
    [nome, email, senha, foto]
  );
}

async function checkEmail(body) {
  const email = body.email;
  console.log(email);
  return await connection.query(
    `
      SELECT * FROM users WHERE email = $1;
      `,
    [email]
  );
}

// async function insertUser(name, email, encryptKey, foto) {
//   return await connection.query(
//     `
//     INSERT INTO users (nome, email, senha, foto )
//     VALUES ($1, $2, $3, $4)
//     `,
//     [name, email, encryptKey, foto]
//   );
// }

async function searchUsers(name) {
  const { rows } = await connection.query(
    `
      SELECT * FROM users
      WHERE nome ILIKE $1
    `,
    [`${name}%`]
  );

  return rows;
}

const userRepository = {
  getUserByEmail,
  insertUser,
  checkEmail,
  searchUsers,
};

export default userRepository;
