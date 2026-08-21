export type AuthenticatedUser = {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar?: string;
  emailVerified?: boolean;
};

export type RegisterCredentials = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type VerifyEmailCommand = {
  email: string;
  token: string;
};

export type ResetPasswordCommand = {
  email: string;
  token: string;
  password: string;
};
