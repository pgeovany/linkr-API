import connection from "../databases/postgres.js";
import getUrlMetadata from "../utils/getUrlMetadata.js";

async function postComment(userId, postId, content) {
  const commentContent = content ? content : null;

  const { rows } = await connection.query(
    `
      INSERT INTO comments (user_id, post_id, content)
      VALUES ($1, $2, $3)
      RETURNING id
    `,
    [userId, postId, commentContent]
  );

  const commentId = rows[0].id;

  return commentId;
}

async function getPostComments(userId, postId) {
  console.log(userId, postId, 'getPostComments');
  const { rows } = await connection.query(
    `
      SELECT comments.*, co.name as comment_owner, co.image as comment_owner_image, posts.user_id as post_owner_id, po.name as post_owner_name, po.image as post_owner_image, 
      (SELECT
      CASE
        WHEN followed_id = co.id THEN 'true'
        ELSE 'false'
      END is_following
      FROM follows
      WHERE followed_id = co.id
      AND follower_id = $1
      )
    FROM comments
    JOIN users co
    ON user_id = co.id
    JOIN posts 
    ON posts.id = comments.post_id
    JOIN users po
    ON posts.user_id = po.id
    WHERE comments.post_id = $2
    `,
    [userId, postId]
  );
  return rows;
}

const commentsRepository = {
    postComment,
    getPostComments,
}

export default commentsRepository;