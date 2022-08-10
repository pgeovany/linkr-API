import connection from '../databases/postgres.js';

async function savePost(userId, url, content) {
  const postContent = content ? content : null;

  await connection.query(
    `
      INSERT INTO posts (user_id, url, conteudo)
      VALUES ($1, $2, $3)
    `,
    [userId, url, postContent]
  );
}

const postsRepository = {
  savePost,
};

export default postsRepository;
