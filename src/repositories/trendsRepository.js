import connection from '../databases/postgres.js';

async function getTrends() {
    const { rows } = await connection.query(
      `
        SELECT hashtags.id AS id, COUNT(hashtag_id) AS contagem, hashtags.nome
        FROM post_hashtag
        JOIN hashtags
        ON post_hashtag.hashtag_id = hashtags.id
        GROUP BY hashtags.nome, hashtags.id
        ORDER BY contagem DESC
        LIMIT 10
      `
    );
    return rows;
}

async function getTrendsById(name) {
    const { rows } = await connection.query(
      `
        SELECT posts.id, posts.conteudo, posts.url, users.nome , users.foto as user_pic, hashtags.nome as hashtag_name, hashtags.id AS hastags_id, COUNT(curtidas.user_id) AS curtidas
        FROM curtidas
        JOIN posts
        ON curtidas.post_id = posts.id
        JOIN users
        ON posts.user_id = users.id
        JOIN post_hashtag
        ON post_hashtag.post_id = posts.id
        JOIN hashtags
        ON post_hashtag.hashtag_id = hashtags.id
        WHERE hashtags.nome = $1
        GROUP BY posts.id, posts.conteudo, posts.url, users.nome, users.foto, hashtags.nome, hashtags.id
        ORDER BY curtidas DESC
      `,
      [name]
    );
    return rows;
}

const trendsRepository = {
    getTrends,
    getTrendsById
};
  
export default trendsRepository;