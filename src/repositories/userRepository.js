import connection from '../databases/postgres.js';

async function getUserByEmail(email) {
    return await connection.query(`
    SELECT * FROM users 
    WHERE email = $1
    `, [email]);
}

const userRepository = {
    getUserByEmail,
}

export default userRepository;