import userRepository from '../repositories/userRepository.js';

async function searchUsers(req, res) {
  const { name } = req.query;
  const { userId } = res.locals;

  try {
    const users = await userRepository.searchUsers(
      name ? name?.trim() : '',
      userId
    );
    res.status(200).send(users);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function followUser(req, res) {
  const { userId } = res.locals;
  const { userToBeFollowed } = req.params;

  try {
    if (await userRepository.isFollowedBy(userToBeFollowed, userId)) {
      res.sendStatus(400);
      return;
    }

    await userRepository.followUser(userId, userToBeFollowed);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function unfollowUser(req, res) {
  const { userId } = res.locals;
  const { userToBeUnfollowed } = req.params;

  try {
    if (await userRepository.isFollowedBy(userToBeUnfollowed, userId)) {
      await userRepository.unfollowUser(userId, userToBeUnfollowed);
      res.sendStatus(204);
      return;
    }

    res.sendStatus(400);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function getUserFollowingCount(req, res) {
  const { userId } = res.locals;

  try {
    const following = await userRepository.getUserFollowingCount(userId);
    res.status(200).send(following);
  } catch (error) {
    res.sendStatus(500);
  }
}

export { searchUsers, followUser, unfollowUser, getUserFollowingCount };
