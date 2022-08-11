import joi from 'joi';

const postsSchema = joi.object({
  url: joi.string().required(),
  content: joi.string(),
});

const loginSchema = joi.object({
  email: joi.string().required(),
  senha: joi.string().required(),
});

const logupSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  username: joi.string().required(),
  pictureUrl: joi
    .string()
    .pattern(/(http[s]?:.*.(?:png|jpg|gif|svg|jpeg))/i)
    .required(),
});

export { postsSchema, loginSchema, logupSchema };
