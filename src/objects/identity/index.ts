// Import types
import type { TUser } from "./types";

/**
 * Tạo object thông tin cho user từ decoded token
 * @param decodedToken
 * @returns
 */
export function createUserFromDecodedToken(decodedToken: any): TUser {
  return {
    email: decodedToken.email,
    emailVerified: decodedToken.email_verified,
    phoneNumber: decodedToken.phone_number,
    phoneNumberVerified: decodedToken.phone_number_verified,
    name: decodedToken.name,
    familyName: decodedToken.family_name,
    givenName: decodedToken.given_name,
    gender: decodedToken.gender,
    birthdate: decodedToken.birthdate,
    role: decodedToken["custom:role"],
    team: decodedToken["cognito:groups"][0],
    sub: decodedToken.sub,
  };
}
