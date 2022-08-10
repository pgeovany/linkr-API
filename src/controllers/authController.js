import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository.js';

async function logOut(req, res) {
  try {
    const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: 3 });
    res.status(200).send({ token });
  } catch (err) {
    res.status(500).send(err);
  }
}

async function logIn(req, res) {
  const { email, password } = req.body;
  const SECRET = process.env.JWT_SECRET;
  try {
    const { rows: validUser } = await userRepository.getUserByEmail(
      email.trim()
    );
    if (validUser.length === 0) {
      return res.status(401).send('Invalid email or password.');
    }
    const isValidPssword = bcrypt.compareSync(password, validUser[0].senha);
    if (!isValidPssword) {
      return res.status(401).send('Invalid email or password.');
    }

    const token = jwt.sign(validUser[0], SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    res.status(200).json({ auth: true, token: token });
  } catch (err) {
    res.status(500).send(err);
  }
}

async function logUp(req, res) {}

export { logOut, logIn, logUp };
