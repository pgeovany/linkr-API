import joi from 'joi';

const postsSchema = joi.object({
  url: joi.string().required(),
  content: joi.string(),
});

const loginSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

export { postsSchema, loginSchema };
