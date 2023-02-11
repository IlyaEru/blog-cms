import joi from 'joi';

export const loginValidationSchema = joi.object({
  username: joi.string().required().trim().min(3).max(100),
  password: joi.string().required().trim().min(3).max(100),
});

export const validateLoginForm = (username: string, password: string) => {
  const { error } = loginValidationSchema.validate(
    { username, password },
    { abortEarly: false },
  );
  return error;
};
