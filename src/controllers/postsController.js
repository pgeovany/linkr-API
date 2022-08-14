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
  const { id } = req.query;
  const { userId } = res.locals;

  try {
    let posts;

    if (id) {
      posts = await postsRepository.getUserPosts(id, userId);
    } else {
      posts = await postsRepository.getPosts(userId);
    }

    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function likePost(req, res) {
  const { userId } = res.locals;
  const { idPost } = req.body;

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

  try {
    await postsRepository.deleteLikePost(userId, idPost);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
}

export { savePost, getPosts, likePost, desLikePost };
