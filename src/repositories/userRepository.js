import connection from '../databases/postgres.js';

async function getUserByEmail(email) {
    return await connection.query(`
    SELECT * FROM users 
    WHERE email = $1
    `, [email]);
}

async function insertUser(name, email, encryptKey, foto) {
    return await connection.query(`
    INSERT INTO users (nome, email, senha, foto ) 
    VALUES ($1, $2, $3, $4)
    `, [name, email, encryptKey, foto]);
}

const userRepository = {
    getUserByEmail,
    insertUser
}

export default userRepository;