export function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function validatePassword(password) {
  return password.length >= 6;
}

export function validateName(name) {
  return name.trim().length >= 2;
}

export function validatePostContent(content) {
  return content.trim().length > 0 && content.length <= 280;
}
