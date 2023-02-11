import joi from 'joi';

export const newPostValidationSchema = joi.object({
  title: joi.string().required().trim().min(3).max(100),
  body: joi.string().required().trim().min(3).max(10000),
});

export const validateNewPostForm = (title: string, body: string) => {
  const { error } = newPostValidationSchema.validate(
    { title, body },
    { abortEarly: false },
  );
  return error;
};
