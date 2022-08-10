import joi from 'joi';

const postsSchema = joi.object({
  url: joi.string().required(),
  content: joi.string(),
});

export { postsSchema };
