import connection from '../databases/postgres.js';
import getUrlMetadata from '../utils/getUrlMetadata.js';

async function savePost(userId, url, content) {
  const postContent = content ? content : null;
  const { urlTitle, urlImage, urlDescription } = await getUrlMetadata(url);

  await connection.query(
    `
      INSERT INTO posts (user_id, conteudo, url, url_title, url_image, url_description)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [userId, postContent, url, urlTitle, urlImage, urlDescription]
  );
}

async function getPosts() {
  const { rows } = await connection.query(
    `
      SELECT posts.id, posts.conteudo, url, url_title AS "urlTitle",
      url_image AS "urlImage", url_description AS "urlDescription", 
      json_build_object('id', users.id, 'name', users.nome, 'picture', users.foto) AS "user"
      FROM posts
      JOIN users
      ON users.id = posts.user_id
      ORDER BY posts.criado_em DESC
      LIMIT 20
    `
  );

  return rows;
}

const postsRepository = {
  savePost,
  getPosts
};

export default postsRepository;
