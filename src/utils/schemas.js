import joi from 'joi';

const postsSchema = joi.object({
  url: joi
    .string()
    .pattern(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
    )
    .required(),
  content: joi.string(),
});

const editPostSchema = joi.object({
  content: joi.string().required(),
});

const loginSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
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

const bodyLikePost = joi.object({
  idPost: joi.number().required(),
});

const commentSchema = joi.object({
  content: joi.string().required(),
});

export { postsSchema, loginSchema, logupSchema, bodyLikePost, editPostSchema, commentSchema };
