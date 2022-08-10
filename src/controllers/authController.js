import jwt from 'jsonwebtoken';

async function logOut(req, res) {
  try {
    const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: 3 });
    res.status(200).send({ token });
  } catch (err) {
    res.status(500).send(err);
  }
}

export { logOut };
