import {useEffect} from "react";
import {useMutation} from "@tanstack/react-query";
import {jwtDecode} from "jwt-decode";

// Import objects
import * as IdentityAPI from "@/objects/identity/api";
import * as Identity from "@/objects/identity";

// Import utils
import * as CookieUtils from "@/utils/cookie";

// Import states
import {useIdentityState, identityStActions} from "@/states/identity";

// Import types
import type {
  TSignInResPayload,
  TRefreshTokenResPayload,
} from "@/objects/identity/types";

export function useAuth() {
  const {user, isAuthenticated} = useIdentityState();

  const signInMutation = useMutation({
    mutationFn: async function (params: any) {
      return await IdentityAPI.signin(params);
    },
    onSuccess(data: TSignInResPayload) {
      // Save tokens
      const {idToken, accessToken, refreshToken} = data.auth;
      console.log("Id Token:", idToken);
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);
      // Decode tokens
      const decodedIdToken = jwtDecode(idToken);
      const decodedAccessToken = jwtDecode(accessToken);

      const idTokenExpDateStr = new Date(decodedIdToken.exp! * 1000).toUTCString();
      const accessTokenExpDateStr = new Date(decodedAccessToken.exp! * 1000).toUTCString();

      CookieUtils.writeSessionCookie(
        "idToken",
        idToken, idTokenExpDateStr
      );
      CookieUtils.writeSessionCookie(
        "accessToken",
        accessToken, accessTokenExpDateStr
      );
      CookieUtils.writePersistentCookie(
        "refreshToken",
        refreshToken
      );

      // Save user's information
      identityStActions.setUser(
        Identity.createUserFromDecodedToken(decodedIdToken)
      );

      // Update authenticated status
      identityStActions.setIsAuthenticated(true);
    },
    onError(error) {
      identityStActions.setIsAuthenticated(false);
    },
  });

  const refreshTokensMutation = useMutation({
    mutationFn: async function (params: any) {
      return await IdentityAPI.refreshTokens(params);
    },
    onSuccess(data: TRefreshTokenResPayload) {
      // Save tokens
      const {idToken, accessToken} = data.auth;

      // Decode tokens
      const decodedIdToken = jwtDecode(idToken);
      const decodedAccessToken = jwtDecode(accessToken);

      const idTokenExpDateStr = new Date(decodedIdToken.exp! * 1000).toUTCString();
      const accessTokenExpDateStr = new Date(decodedAccessToken.exp! * 1000).toUTCString();

      CookieUtils.writeSessionCookie(
        "idToken",
        idToken, idTokenExpDateStr
      );
      CookieUtils.writeSessionCookie(
        "accessToken",
        accessToken, accessTokenExpDateStr
      );

      // Save user's information
      identityStActions.setUser(
        Identity.createUserFromDecodedToken(decodedIdToken)
      );

      // Update authenticated status
      identityStActions.setIsAuthenticated(true);
    },
    onError(error) {
      identityStActions.setIsAuthenticated(false);
    },
  });

  const reSignInUserOffline = function (token: string) {
    const decodedIdToken = jwtDecode(token);

    // Save user's information
    identityStActions.setUser(
      Identity.createUserFromDecodedToken(decodedIdToken)
    );

    // Update authenticated status
    identityStActions.setIsAuthenticated(true);
  };

  return {
    isAuthenticated,
    user,
    signInMutation,
    refreshTokensMutation,
    reSignInUserOffline,
  };
}
