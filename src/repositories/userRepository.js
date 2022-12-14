import connection from '../databases/postgres.js';

async function getUserByEmail(email) {
  return await connection.query(
    `
      SELECT * FROM users 
      WHERE email = $1
    `,
    [email]
  );
}

async function insertUser({ email, password, username, pictureUrl }) {
  return await connection.query(
    `
      INSERT INTO users(name ,email, password, image) VALUES($1, $2, $3, $4);
    `,
    [username, email, password, pictureUrl]
  );
}

async function searchUsers(name, id) {
  const { rows } = await connection.query(
    `
      SELECT users.id, users.name, users.image,
      (
        SELECT follows.id
          FROM follows
          WHERE followed_id = users.id AND follower_id = $2
      ) AS is_follower
      FROM users
      WHERE users.name ILIKE $1 AND id <> $2;
    `,
    [`${name}%`, id]
  );

  return rows;
}

async function isFollowedBy(followedId, followerId) {
  const { rows } = await connection.query(
    `
      SELECT * FROM follows
      WHERE followed_id = $1 AND follower_id = $2
    `,
    [followedId, followerId]
  );

  if (rows.length === 0) {
    return false;
  }

  return true;
}

async function followUser(userId, userToBeFollowed) {
  await connection.query(
    `
      INSERT INTO follows (follower_id, followed_id)
      VALUES ($1, $2)
    `,
    [userId, userToBeFollowed]
  );
}

async function unfollowUser(userId, userToBeUnFollowed) {
  await connection.query(
    `
      DELETE FROM follows
      WHERE follower_id = $1 AND followed_id = $2
    `,
    [userId, userToBeUnFollowed]
  );
}

async function getUserFollowingCount(userId) {
  const { rows } = await connection.query(
    `
      SELECT COUNT(*) as "following" FROM follows
      WHERE follower_id = $1
    `,
    [userId]
  );

  return rows[0];
}

const userRepository = {
  getUserByEmail,
  insertUser,
  searchUsers,
  isFollowedBy,
  followUser,
  unfollowUser,
  getUserFollowingCount,
};

export default userRepository;
