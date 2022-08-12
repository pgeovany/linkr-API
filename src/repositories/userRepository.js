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

async function insertUser({ email, password, username, pictureUrl }) {
  return await connection.query(
    `
      INSERT INTO users(name ,email, password, image) VALUES($1, $2, $3, $4);
    `,
    [username, email, password, pictureUrl]
  );
}

async function searchUsers(name, id) {
  const { rows } = await connection.query(
    `
      SELECT id, name, image FROM users
      WHERE name ILIKE $1 AND id <> $2
    `,
    [`${name}%`, id]
  );

  return rows;
}

const userRepository = {
  getUserByEmail,
  insertUser,
  searchUsers,
};

export default userRepository;
