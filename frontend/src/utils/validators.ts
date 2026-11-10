export const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

export const validatePassword = (password: string): boolean => password.length >= 8;

/** Mot de passe uniquement numérique : refusé par Django (NumericPasswordValidator). */
export const isNumericOnly = (password: string): boolean => /^\d+$/.test(password);

export const validateRequired = (value: string): boolean => value.trim().length > 0;

export const validatePasswordMatch = (p1: string, p2: string): boolean => p1 === p2;
