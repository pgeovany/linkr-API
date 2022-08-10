import jwt from 'jsonwebtoken';

async function tokenMiddleware(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    res.sendStatus(401);
    return;
  }

  let id;

  try {
    const SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, SECRET);

    id = decoded.id;
  } catch (error) {
    res.sendStatus(401);
    return;
  }

  res.locals = { userId: id };

  next();
}

export default tokenMiddleware;
