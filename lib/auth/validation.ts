type ValidationSuccess<T> = { valid: true; data: T };
type ValidationError = { valid: false; error: string };

export function validateEmail(email: string) {
  return /.+@.+\..+/.test(email);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateRegistrationInput(input: {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}): ValidationSuccess<{ firstName: string; lastName: string; email: string; password: string }> | ValidationError {
  const firstName = input.firstName?.trim() ?? "";
  const lastName = input.lastName?.trim() ?? "";
  const email = normalizeEmail(input.email ?? "");
  const password = input.password ?? "";

  if (!firstName || firstName.length < 2) return { valid: false, error: "Bitte geben Sie einen gültigen Vornamen ein." };
  if (!lastName || lastName.length < 2) return { valid: false, error: "Bitte geben Sie einen gültigen Nachnamen ein." };
  if (!validateEmail(email)) return { valid: false, error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." };
  if (password.length < 8) return { valid: false, error: "Das Passwort muss mindestens 8 Zeichen lang sein." };

  return { valid: true, data: { firstName, lastName, email, password } };
}

export function validateLoginInput(input: {
  email?: string;
  password?: string;
}): ValidationSuccess<{ email: string; password: string }> | ValidationError {
  const email = normalizeEmail(input.email ?? "");
  const password = input.password ?? "";

  if (!validateEmail(email)) return { valid: false, error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." };
  if (!password) return { valid: false, error: "Bitte geben Sie Ihr Passwort ein." };

  return { valid: true, data: { email, password } };
}
