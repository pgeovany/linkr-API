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
      is_repost AS "isRepost",
      json_build_object('id', users.id, 'name', users.name, 'picture', users.image) AS "user",
       COALESCE(COUNT(comments.post_id), 0) AS comments_counter,
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
      ) AS is_liked,
      (
        SELECT follows.id
        FROM follows
        WHERE followed_id = posts.user_id AND follower_id = $1
      ) AS is_follower, reposts.user_id, u.name as "repostedBy",
      (
        SELECT follows.id
        FROM follows
        WHERE followed_id = reposts.user_id AND follower_id = $1
      ) AS follows_who_reposted
      FROM posts
      JOIN users
      ON users.id = posts.user_id
      LEFT JOIN likes
      ON likes.post_id = posts.id
      left join reposts
      on posts.id = reposts.repost_id
      left join users u
      on reposts.user_id = u.id
      left join comments
      on posts.id = comments.post_id
      GROUP BY posts.id, users.id, reposts.user_id, "repostedBy"
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
      is_repost AS "isRepost",
      json_build_object('id', users.id, 'name', users.name, 'picture', users.image) AS "user",
      COALESCE(COUNT(comments.post_id), 0) AS comments_counter,
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
      ) AS is_liked,
      (
        SELECT follows.id
        FROM follows
        WHERE followed_id = posts.user_id AND follower_id = $2
      ) AS is_follower, reposts.user_id, u.name as "repostedBy"
      FROM posts
      JOIN users
      ON users.id = posts.user_id
      LEFT JOIN likes
      ON likes.post_id = posts.id
      left join reposts
      on posts.id = reposts.repost_id
      left join users u
      on reposts.user_id = u.id
      left join comments
      on posts.id = comments.post_id
      WHERE users.id = $1
      GROUP BY posts.id, users.id, reposts.user_id, "repostedBy"
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

async function getPostById(postId) {
  const { rows } = await connection.query(
    `
      SELECT * FROM posts
      WHERE id = $1
    `,
    [postId]
  );

  if (rows.length === 0) {
    return false;
  }

  return rows[0];
}

async function saveRepost(userId, originalPost) {
  const { rows } = await connection.query(
    `
      INSERT INTO posts (user_id, content, url, url_title, url_image, url_description, is_repost)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `,
    [
      originalPost.user_id,
      originalPost.content,
      originalPost.url,
      originalPost.url_title,
      originalPost.url_image,
      originalPost.url_description,
      true,
    ]
  );

  const repostId = rows[0].id;

  await connection.query(
    `
      INSERT INTO reposts (original_post_id, repost_id, user_id)
      VALUES ($1, $2, $3)
    `,
    [originalPost.id, repostId, userId]
  );
}

const postsRepository = {
  savePost,
  getPosts,
  insertLikePost,
  deleteLikePost,
  getUserPosts,
  deletePost,
  updatePost,
  getPostById,
  saveRepost,
};

export default postsRepository;
