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

const trendsRepository = {
    getTrends
};
  
export default trendsRepository;