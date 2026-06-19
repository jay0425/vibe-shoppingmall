export type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

export type SignupFormErrors = Partial<Record<keyof SignupFormValues | 'agree', string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[A-Za-z가-힣\s]+$/;
const PASSWORD_ALLOWED_REGEX = /^[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;

const simplePasswords = new Set(['password', 'password1', 'qwerty123', 'abc12345', '12345678']);

const isBlank = (value: string) => value.trim().length === 0;

const hasRepeatedCharacter = (value: string) => /(.)\1{3,}/.test(value);

const isSequentialNumber = (value: string) =>
  '0123456789'.includes(value) || '9876543210'.includes(value);

export const normalizeSignupForm = (values: SignupFormValues): SignupFormValues => ({
  name: values.name.trim().replace(/\s+/g, ' '),
  email: values.email.trim().toLowerCase(),
  password: values.password,
  confirm: values.confirm,
});

export const validateSignupForm = (
  values: SignupFormValues,
  agree: boolean,
): SignupFormErrors => {
  const normalizedValues = normalizeSignupForm(values);
  const errors: SignupFormErrors = {};

  if (isBlank(values.name)) {
    errors.name = '이름을 입력해주세요.';
  } else if (normalizedValues.name.length < 2 || normalizedValues.name.length > 20) {
    errors.name = '이름은 2자 이상 20자 이하로 입력해주세요.';
  } else if (!NAME_REGEX.test(normalizedValues.name)) {
    errors.name = '이름은 한글, 영문, 공백만 사용할 수 있습니다.';
  }

  if (isBlank(values.email)) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!EMAIL_REGEX.test(normalizedValues.email)) {
    errors.email = '올바른 이메일 형식으로 입력해주세요.';
  }

  if (isBlank(values.password)) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (values.password.length < 8 || values.password.length > 20) {
    errors.password = '비밀번호는 8자 이상 20자 이하로 입력해주세요.';
  } else if (!PASSWORD_ALLOWED_REGEX.test(values.password)) {
    errors.password = '비밀번호는 영문, 숫자, 허용된 특수문자만 사용할 수 있습니다.';
  } else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
    errors.password = '비밀번호는 영문과 숫자를 모두 포함해야 합니다.';
  } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(values.password)) {
    errors.password = '비밀번호는 특수문자를 1개 이상 포함해야 합니다.';
  } else if (
    simplePasswords.has(values.password.toLowerCase()) ||
    hasRepeatedCharacter(values.password) ||
    isSequentialNumber(values.password)
  ) {
    errors.password = '너무 단순한 비밀번호는 사용할 수 없습니다.';
  }

  if (isBlank(values.confirm)) {
    errors.confirm = '비밀번호 확인을 입력해주세요.';
  } else if (values.password !== values.confirm) {
    errors.confirm = '비밀번호가 일치하지 않습니다.';
  }

  if (!agree) {
    errors.agree = '이용약관 및 개인정보 처리방침에 동의해주세요.';
  }

  return errors;
};
