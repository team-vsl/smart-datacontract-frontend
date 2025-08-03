export type TUser = {
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  name: string;
  familyName: string;
  givenName: string;
  gender: string;
  birthdate: string;
  role: string;
  team: string;
  sub: string;
};

export type TSignInResPayload = {
  auth: {
    tokenType: string;
    expiresIn: string;
    accessToken: string;
    refreshToken: string;
    idToken: string;
  };
  user: TUser;
};
