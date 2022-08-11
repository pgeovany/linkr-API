import postsRepository from '../repositories/postsRepository.js';
import urlMetadata from 'url-metadata';

async function savePost(req, res) {
  const { userId } = res.locals;
  const { url, content } = req.body;

  try {
    await postsRepository.savePost(userId, url, content);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getPosts(req, res) {
  try {
    const posts = await postsRepository.getPosts();
    // const postsMetadata = posts.map((post) => parseUrl(post.url));

    const { title, description, image } = await urlMetadata(posts[3].url);
    // const metadata = await urlMetadata(posts[3].url);

    res.status(200).send(title, description, image);
    // res.status(200).send(metadata);
  } catch (error) {
    res.status(500).send(error);
  }
}

export { savePost, getPosts };
