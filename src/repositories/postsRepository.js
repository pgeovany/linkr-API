import connection from '../databases/postgres.js';
import getUrlMetadata from '../utils/getUrlMetadata.js';

async function savePost(userId, url, content, hashtags) {
  const postContent = content ? content : null;
  const { urlTitle, urlImage, urlDescription } = await getUrlMetadata(url);

  const { rows } = await connection.query(
    `
      INSERT INTO posts (user_id, content, url, url_title, url_image, url_description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `,
    [userId, postContent, url, urlTitle, urlImage, urlDescription]
  );

  const postId = rows[0].id;

  if (hashtags) {
    hashtags.forEach(async (hashtag) => await savePostHashtag(hashtag, postId));
  }
}

async function getPosts() {
  const { rows } = await connection.query(
    `
      SELECT posts.id, posts.content, url, url_title AS "urlTitle",
      url_image AS "urlImage", url_description AS "urlDescription", 
      json_build_object('id', users.id, 'name', users.name, 'picture', users.image) AS "user"
      FROM posts
      JOIN users
      ON users.id = posts.user_id
      ORDER BY posts.created_at DESC
      LIMIT 20
    `
  );

  return rows;
}

async function savePostHashtag(hashtag, postId) {
  await connection.query(
    `
      INSERT INTO post_hashtag (post_id, name)
      VALUES ($1, $2)
    `,
    [postId, hashtag]
  );
}

async function insertLikePost(userId, postId) {
  console.log({ userId, postId });
  await connection.query(
    `
      INSERT INTO likes (user_id, post_id)
      VALUES ($1, $2)
    `,
    [userId, postId]
  );
}

async function deleteLikePost(userId, postId) {
  console.log({ userId, postId });
  await connection.query(
    `
      DELETE FROM likes WHERE user_id = $1 AND post_id = $2;
    `,
    [userId, postId]
  );
}

const postsRepository = {
  savePost,
  getPosts,
  insertLikePost,
  deleteLikePost,
};

export default postsRepository;
