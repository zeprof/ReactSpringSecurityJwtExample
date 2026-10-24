const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const validateEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

export const validatePassword = (password) => {
  return password.trim().length > 0;
};

export const getFieldErrors = (formData) => {
  const errors = {};

  if (!validateEmail(formData.email)) {
    errors.email = "courriel invalide";
  }

  if (!validatePassword(formData.password)) {
    errors.password = "mot de passe invalide";
  }

  return errors;
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
