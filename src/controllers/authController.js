import userRepository from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function logOut(req, res) {
  res.sendStatus(200);
}

async function logIn(req, res) {
  const { email, senha } = req.body;
  const SECRET = process.env.JWT_SECRET;
  try {
    const { rows: validUser } = await userRepository.getUserByEmail(email.trim());
    if(validUser.length === 0) {
        return res.status(401).send('Invalid email or password.') 
    }
    const isValidPssword = bcrypt.compareSync(senha, validUser[0].senha);     
    if(!isValidPssword) {
        return res.status(401).send('Invalid email or password.') 
    }

    const token = jwt.sign(validUser[0], SECRET, {
        expiresIn: 900
    });

    res.status(200).json({auth: true, nome: validUser[0].nome , token: token});

  } catch (err) {
      console.error(err);
      res.status(500).send(err);
  }
}

// async function cadastrar(req, res) {
//   const { nome, email, senha, foto } = req.body;
//   const encryptKey = bcrypt.hashSync(senha, 10);

//   try {
//       const { rows: validUser } = await userRepository.getUserByEmail(email.trim());
//       console.log(validUser);
//       if(validUser.length > 0) {
//           return res.status(409).send('User already exists');
//       }

//       await userRepository.insertUser(nome, email, encryptKey, foto);

//       return res.status(201).send('User created successfully');
      
//   } catch (error) {
//       console.error(error);
//       res.status(500).send(error);
//   }
// }

export { logOut, logIn };
