import { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

// Import configs
import { RouteConfigs } from "./routes/route-configs";

// Import routes
import { authenticatedRoutes } from "./routes/authenticated-routes";
import { unauthenticatedRoutes } from "./routes/unauthenticated-routes";

// Import hooks
import { useAuth } from "./hooks/use-auth";

/**
 * This component manages the route switching in application, it
 * will depend on various conditions to make a decision
 * @returns
 */
function RoutesSwitcher() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user doesn't authenticate, navigate
    // he/she to Root Path
    if (!isAuthenticated) {
      navigate(RouteConfigs.SignIn.Path);
    }
  }, []);

  return isAuthenticated
    ? useRoutes(authenticatedRoutes)
    : useRoutes(unauthenticatedRoutes);
}

export default function App() {
  return <RoutesSwitcher />;
}
