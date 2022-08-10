import postsRepository from '../repositories/postsRepository.js';

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

export { savePost };
