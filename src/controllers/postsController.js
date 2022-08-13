import postsRepository from '../repositories/postsRepository.js';

async function savePost(req, res) {
  const { userId } = res.locals;
  const { url, content } = req.body;

  try {
    await postsRepository.savePost(userId, url, content);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
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

export { savePost, getPosts };
