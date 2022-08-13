import postsRepository from '../repositories/postsRepository.js';
import getPostHashtags from '../utils/getPostHashtags.js';

async function savePost(req, res) {
  const { userId } = res.locals;
  const { url, content } = req.body;

  try {
    const postHashtags = getPostHashtags(content);
    await postsRepository.savePost(userId, url, content, postHashtags);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function getPosts(req, res) {
  const { id } = req.query;

  try {
    let posts;

    if (id) {
      posts = await postsRepository.getUserPosts(id);
    } else {
      posts = await postsRepository.getPosts();
    }

    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
}

export { savePost, getPosts };
