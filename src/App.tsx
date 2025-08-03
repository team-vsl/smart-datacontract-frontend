import { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
  const { isAuthenticated, signInMutation, reSignInUserOffline } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user doesn't authenticate, navigate
    // he/she to Root Path
    if (!isAuthenticated) {
      navigate(RouteConfigs.SignIn.Path);

      // Sign in with ID token
      const idToken = readCookie("idToken");

      // User is signed in
      if (idToken) {
        reSignInUserOffline(idToken);
      }
    } else {
      navigate(RouteConfigs.Home.Path);
    }
  }, [isAuthenticated]);

  if (signInMutation.isPending) return <LoadingSection />;

  return isAuthenticated
    ? useRoutes(authenticatedRoutes)
    : useRoutes(unauthenticatedRoutes);
}

export default function App() {
  return <RoutesSwitcher />;
}
