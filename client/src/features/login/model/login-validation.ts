export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>;

export const validateLoginForm = (form: LoginFormValues): LoginFormErrors => {
  const errors: LoginFormErrors = {};
  const email = form.email.trim();

  if (!email) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = '올바른 이메일 형식으로 입력해주세요.';
  }

  if (!form.password) {
    errors.password = '비밀번호를 입력해주세요.';
  }

  return errors;
};

export const normalizeLoginForm = (form: LoginFormValues): LoginFormValues => ({
  email: form.email.trim(),
  password: form.password,
});
