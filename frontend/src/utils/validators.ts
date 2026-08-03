export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validatePasswordMatch = (p1: string, p2: string): boolean => {
  return p1 === p2;
};
