export type SignInCredential = {
  userName: string;
  password: string;
};

export type SignInResponse = {
  success: boolean;
  data: unknown;
  dataReason: string;
  token: string;
  user: {
    userName: string;
    authority: string[];
    avatar: string;
    email: string;
  };
};

export type SignUpResponse = SignInResponse;

export type SignUpCredential = {
  userName: string;
  email: string;
  password: string;
};

export type ForgotPassword = {
  username: string;
  channel?: string;
};

export type ResetPassword = {
  password: string;
  acctId: string;
  sessionId: string;
};

export type IsAdminUser = {
  username: string;
};
