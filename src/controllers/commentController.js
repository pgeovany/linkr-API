import commentsRepository from "../repositories/commentsRepository.js";


async function postComment(req, res) {
  const { userId } = res.locals;
  const { postId } = req.params;
  const { content } = req.body;

  try {
    const comment = await commentsRepository.postComment(
      userId,
      postId,
      content
    );

    res.sendStatus(201)
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getPostComments(req, res) {
    const { postId } = req.params;
    const { userId } = res.locals;
    console.log(userId, postId);
    
    try {
        const comments = await commentsRepository.getPostComments(userId, postId);
        res.status(200).send(comments);
    } catch (error) {
        res.status(500).send(error);
    }
}

export { postComment, getPostComments };