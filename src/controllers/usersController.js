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

export { searchUsers };
