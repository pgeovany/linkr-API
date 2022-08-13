import jwt from 'jsonwebtoken';

async function tokenMiddleware(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).send('Access denied. No token provided.');
    return;
  }

  let id;

  try {
    const SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, SECRET);

    id = decoded.id;
  } catch (error) {
    res
      .status(401)
      .json({ auth: false, message: 'Failed to authenticate token.' });
    return;
  }

  res.locals = { userId: id };

  next();
}

export default tokenMiddleware;
