import userRepository from '../repositories/userRepository.js';

async function searchUsers(req, res) {
  const { name } = req.body;
  console.log(name);

  try {
    const users = await userRepository.searchUsers(name);
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { searchUsers };
