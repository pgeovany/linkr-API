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

async function getPosts(userId) {
  const { rows } = await connection.query(
    `
      SELECT posts.id, posts.content, url, url_title AS "urlTitle",
      url_image AS "urlImage", url_description AS "urlDescription",
      COALESCE(COUNT(likes.post_id), 0) AS likes,
      json_build_object('id', users.id, 'name', users.name, 'picture', users.image) AS "user",
      ARRAY (
        SELECT users.name FROM likes
        JOIN users
        ON likes.user_id = users.id
        WHERE posts.id = likes.post_id
      ) AS "likedBy",
      (
        SELECT likes.user_id 
        FROM likes
        WHERE likes.post_id = posts.id
        AND user_id = $1
      ) AS is_liked
      FROM posts
      JOIN users
      ON users.id = posts.user_id
      LEFT JOIN likes
      ON likes.post_id = posts.id
      GROUP BY posts.id, users.id
      ORDER BY posts.created_at DESC
      LIMIT 20;
    `,
    [userId]
  );

  return rows;
}

async function getUserPosts(id, userId) {
  const { rows } = await connection.query(
    `
      SELECT posts.id, posts.content, url, url_title AS "urlTitle",
      url_image AS "urlImage", url_description AS "urlDescription",
      COALESCE(COUNT(likes.post_id), 0) AS likes,
      json_build_object('id', users.id, 'name', users.name, 'picture', users.image) AS "user",
      ARRAY (
        SELECT users.name FROM likes
        JOIN users
        ON likes.user_id = users.id
        WHERE posts.id = likes.post_id
      ) AS "likedBy",
      (
        SELECT likes.user_id 
        FROM likes
        WHERE likes.post_id = posts.id
        AND user_id = $2
      ) AS is_liked
      FROM posts
      JOIN users
      ON users.id = posts.user_id
      LEFT JOIN likes
      ON likes.post_id = posts.id
      WHERE users.id = $1
      GROUP BY posts.id, users.id
      ORDER BY posts.created_at DESC
      LIMIT 20;
    `,
    [id, userId]
  );
  return rows;
}

async function deletePost(postId, userId) {
  const { rows } = await connection.query(
    `
      SELECT * FROM posts
      WHERE posts.id = $1 AND posts.user_id = $2
    `,
    [postId, userId]
  );

  if (rows.length === 0) {
    return false;
  }

  await connection.query(
    `
      DELETE FROM posts
      WHERE posts.id = $1 AND posts.user_id = $2
    `,
    [postId, userId]
  );

  return true;
}

async function updatePost(userId, postId, content, hashtags) {
  const { rows } = await connection.query(
    `
      SELECT * FROM posts
      WHERE posts.id = $1 AND posts.user_id = $2
    `,
    [postId, userId]
  );

  if (rows.length === 0) {
    return false;
  }

  await connection.query(
    `
      UPDATE posts SET content = $1
      WHERE posts.id = $2 AND posts.user_id = $3
    `,
    [content, postId, userId]
  );

  await connection.query(
    `
      DELETE FROM post_hashtag
      WHERE post_id = $1
    `,
    [postId]
  );

  if (hashtags) {
    hashtags.forEach(async (hashtag) => await savePostHashtag(hashtag, postId));
  }

  return true;
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
  const { rows } = await connection.query(
    `
      SELECT * FROM likes
      WHERE user_id = $1 AND post_id = $2
    `,
    [userId, postId]
  );

  if (rows.length > 0) {
    return false;
  }

  await connection.query(
    `
      INSERT INTO likes (user_id, post_id)
      VALUES ($1, $2)
    `,
    [userId, postId]
  );

  return true;
}

async function deleteLikePost(userId, postId) {
  const { rows } = await connection.query(
    `
      SELECT * FROM likes
      WHERE user_id = $1 AND post_id = $2
    `,
    [userId, postId]
  );

  if (rows.length === 0) {
    return false;
  }

  await connection.query(
    `
      DELETE FROM likes WHERE user_id = $1 AND post_id = $2;
    `,
    [userId, postId]
  );

  return true;
}

const postsRepository = {
  savePost,
  getPosts,
  insertLikePost,
  deleteLikePost,
  getUserPosts,
  deletePost,
  updatePost,
};

export default postsRepository;
