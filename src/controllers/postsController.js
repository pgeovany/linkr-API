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
    res.status(500).send(error);
  }
}

async function getPosts(req, res) {
  try {
    const posts = await postsRepository.getPosts();
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function likePost(req, res) {
  const { userId } = res.locals;
  const { idPost } = req.body;
  console.log(req.body);
  try {
    await postsRepository.insertLikePost(userId, idPost);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function desLikePost(req, res) {
  const { userId } = res.locals;
  const { idPost } = req.params;
  console.log(req.headers);
  try {
    await postsRepository.deleteLikePost(userId, idPost);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
}

export { savePost, getPosts, likePost, desLikePost };
