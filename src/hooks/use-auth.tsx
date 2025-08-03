import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

// Import objects
import * as IdentityAPI from "@/objects/identity/api";
import * as Identity from "@/objects/identity";

// Import utils
import * as CookieUtils from "@/utils/cookie";

// Import states
import { useIdentityState, identityStActions } from "@/states/identity";

// Import types
import type { TSignInResPayload } from "@/objects/identity/types";

export function useAuth() {
  const { user, isAuthenticated } = useIdentityState();

  const reSignInUserOffline = function (token: string) {
    const decodedIdToken = jwtDecode(token);

    // Save user's information
    identityStActions.setUser(
      Identity.createUserFromDecodedToken(decodedIdToken)
    );

    // Update authenticated status
    identityStActions.setIsAuthenticated(true);
  };

  const signInMutation = useMutation({
    mutationFn: async function (params: any) {
      return await IdentityAPI.signin(params);
    },
    onSuccess(data: TSignInResPayload) {
      // Save tokens
      const { idToken, accessToken, refreshToken } = data.auth;

      // Decode tokens
      const decodedIdToken = jwtDecode(idToken);
      const decodedAccessToken = jwtDecode(accessToken);
      const decodedRefreshToken = jwtDecode(refreshToken);

      CookieUtils.writeSessionCookie(
        "idToken",
        idToken,
        new Date(decodedIdToken.exp!).toUTCString()
      );
      CookieUtils.writeSessionCookie(
        "accessToken",
        accessToken,
        new Date(decodedAccessToken.exp!).toUTCString()
      );
      CookieUtils.writeSessionCookie(
        "refreshToken",
        refreshToken,
        new Date(decodedRefreshToken.exp!).toUTCString()
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

  return {
    isAuthenticated,
    user,
    signInMutation,
    reSignInUserOffline,
  };
}
