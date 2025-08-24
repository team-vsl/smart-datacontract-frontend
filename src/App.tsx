import { useEffect } from "react";
import { useRoutes } from "react-router-dom";

// Import constants
import { CONFIGS } from "./utils/constants/configs";

// Import configs
import { RouteConfigs } from "./routes/route-configs";

// Import routes
import { authenticatedRoutes } from "./routes/authenticated-routes";
import { unauthenticatedRoutes } from "./routes/unauthenticated-routes";

// Import hooks
import { useAuth } from "./hooks/use-auth";

// Import objects
import * as Identity from "@/objects/identity";

// Import utils
import { readCookie } from "./utils/cookie";

function LoadingSection() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-background">
      <p className="text-sm text-muted-foreground">
        Đang khởi động, vui lòng đợi trong giây lát...
      </p>
      <p className="text-sm text-muted-foreground">
        Ứng dụng được phát triển bởi <span className="font-bold">Team VSL</span>
      </p>
    </div>
  );
}

/**
 * This component manages the route switching in application, it
 * will depend on various conditions to make a decision
 * @returns
 */
function RoutesSwitcher() {
  const {
    isAuthenticated,
    signInMutation,
    refreshTokensMutation,
    reSignInUserOffline,
  } = useAuth();
  const loadingShown =
    signInMutation.isPending || refreshTokensMutation.isPending;

  useEffect(() => {
    // If user doesn't authenticate, navigate
    // he/she to Root Path
    if (!isAuthenticated) {
      // Sign in with ID token
      const idToken = readCookie(CONFIGS.ID_TOKEN_COOKIE_NAME);

      // User is signed in
      if (idToken) {
        reSignInUserOffline(idToken);
      } else {
        const refreshToken = readCookie(CONFIGS.REFRESH_TOKEN_COOKIE_NAME);
        refreshTokensMutation.mutate({ refreshToken });
      }
    }
  }, [isAuthenticated]);

  if (loadingShown) return <LoadingSection />;

  return isAuthenticated
    ? useRoutes(authenticatedRoutes)
    : useRoutes(unauthenticatedRoutes);
}

export default function App() {
  return <RoutesSwitcher />;
}
