import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository.js';

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

    const isValidPssword = bcrypt.compareSync(password, validUser[0].password);
    if (!isValidPssword) {
      return res.status(401).send('Invalid email or password.');
    }

    const token = jwt.sign(validUser[0], SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    res.status(200).json({
      auth: true,
      name: validUser[0].name,
      image: validUser[0].image,
      token: token,
    });
  } catch (err) {
    res.status(500).send(err);
  }
}

async function logUp(req, res) {
  const body = req.body;
  console.log(body);
  try {
    const { rowCount: thereIsEmail } = await userRepository.getUserByEmail(
      body.email
    );
      console.log(thereIsEmail);
    if (thereIsEmail > 0) {
      return res.status(401).send('this email is already in use');
    }

    const encryptedPassword = bcrypt.hashSync(body.password, 10);
    delete body.password;

    const bodyInsert = { ...body, password: encryptedPassword };
    console.log(bodyInsert);
    await userRepository.insertUser(bodyInsert);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { logIn, logUp };
