import { Outlet, Navigate } from "react-router-dom";

// Import configs
import { RouteConfigs } from "./route-configs";

// Import components
import SignIn from "@/pages/auth/components/sign-in";

// Import pages
import AuthPage from "@/pages/auth";

// Import types
import type { RouteObject } from "react-router-dom";

/**
 * Array contains all unanthentication routes
 */
const unauthenticatedRoutes: Array<RouteObject> = [
  {
    path: RouteConfigs.Root.Path,
    element: (
      <AuthPage>
        <Outlet />
      </AuthPage>
    ),
    children: [
      {
        path: RouteConfigs.SignIn.Path,
        element: <SignIn />,
      },
      {
        path: RouteConfigs.Root.Path,
        element: <Navigate to={RouteConfigs.SignIn.Path} replace />,
      },
      {
        path: "",
        element: <Navigate to={RouteConfigs.SignIn.Path} replace />,
      },
      {
        path: "*",
        element: <Navigate to={RouteConfigs.SignIn.Path} replace />,
      },
    ],
  },
];

export { unauthenticatedRoutes };
