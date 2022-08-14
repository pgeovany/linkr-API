import connection from '../databases/postgres.js';

async function getTrends() {
    const { rows } = await connection.query(
      `
        SELECT COUNT(post_hashtag.name) AS contagem, post_hashtag.name 
        FROM post_hashtag
        GROUP BY post_hashtag.name
        ORDER BY contagem DESC
        LIMIT 10
      `
    );
    return rows;
}

async function getTrendsByName(name) {
    const { rows } = await connection.query(
      `
        SELECT posts.id, posts.content, url, url_title AS "urlTitle",
        url_image AS "urlImage", url_description AS "urlDescription", post_hashtag.name,
        COALESCE(COUNT(likes.post_id), 0) AS likes,
        json_build_object('id', users.id, 'name', users.name, 'picture', users.image) AS "user",
        ARRAY (
        SELECT users.name FROM likes
        JOIN users
        ON likes.user_id = users.id
        where posts.id = likes.post_id
        ) AS "likedBy"
        FROM post_hashtag
        JOIN posts
        ON post_hashtag.post_id = posts.id
        JOIN users
        ON users.id = posts.user_id
        LEFT JOIN likes
        ON likes.post_id = posts.id
        WHERE post_hashtag.name ILIKE $1
        GROUP BY posts.id, post_hashtag.name, users.id
        ORDER BY likes DESC
        LIMIT 20
      `,
      [name]
    );
    return rows;
}

const trendsRepository = {
    getTrends,
    getTrendsByName
};
  
export default trendsRepository;