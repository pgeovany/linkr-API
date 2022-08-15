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

async function deletePost(req, res) {
  const { userId } = res.locals;
  const { postId } = req.params;

  try {
    if (await postsRepository.deletePost(postId, userId)) {
      res.sendStatus(204);
      return;
    }

    res.sendStatus(401);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function editPost(req, res) {
  const { userId } = res.locals;
  const { postId } = req.params;
  const { url, content } = req.body;

  try {
    const postHashtags = getPostHashtags(content);
    const validUpdate = await postsRepository.updatePost(
      userId,
      postId,
      url,
      content,
      postHashtags
    );

    if (validUpdate) {
      res.sendStatus(200);
      return;
    }

    res.sendStatus(401);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function likePost(req, res) {
  const { userId } = res.locals;
  const { idPost } = req.body;

  try {
    if (await postsRepository.insertLikePost(userId, idPost)) {
      res.sendStatus(201);
      return;
    }

    res.sendStatus(400);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function desLikePost(req, res) {
  const { userId } = res.locals;
  const { idPost } = req.params;

  try {
    if (await postsRepository.deleteLikePost(userId, idPost)) {
      res.sendStatus(200);
      return;
    }

    res.sendStatus(400);
  } catch (error) {
    res.status(500).send(error);
  }
}

export { savePost, getPosts, deletePost, likePost, desLikePost, editPost };
