export const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email là bắt buộc';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Email không hợp lệ';
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Mật khẩu là bắt buộc';
  if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
  return undefined;
};

export const validateUsername = (username: string): string | undefined => {
  if (!username) return 'Tên người dùng là bắt buộc';
  if (username.length < 3) return 'Tên người dùng phải có ít nhất 3 ký tự';
  return undefined;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) return 'Xác nhận mật khẩu là bắt buộc';
  if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp';
  return undefined;
};