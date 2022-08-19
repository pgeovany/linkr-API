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
      SELECT comments.user_id as "userId", comments.content, comments.post_id as "postId", 
      comments.created_at as createdAt, co.name as "commentOwner", co.image as "commentOwnerImage", 
      posts.user_id as "postOwnerId", po.name as "postOwnerName", po.image as "postOwnerImage", 
      (SELECT
      CASE
        WHEN followed_id = co.id THEN 'true'
        ELSE 'false'
      END "isFollowing"
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