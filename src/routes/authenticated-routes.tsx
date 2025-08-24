import { Outlet, Navigate } from "react-router-dom";

// Import configs
import { RouteConfigs } from "./route-configs";

// Import layouts
import MainLayout from "@/layouts/main-layout";

// Import pages
import HomePage from "@/pages/home";
import DataContractGeneratorPage from "@/pages/dc-generator";
import DataContractManagementPage from "@/pages/dc-management";
import RulesetManagementPage from "@/pages/rl-management";
import JobManagementPage from "@/pages/job-management";

// Import types
import type { RouteObject } from "react-router-dom";

/**
 * Array contains all unanthentication routes
 */
const authenticatedRoutes: Array<RouteObject> = [
  {
    path: RouteConfigs.Root.Path,
    element: (
      <MainLayout>
        <Outlet />
      </MainLayout>
    ),
    children: [
      {
        path: RouteConfigs.Home.Path,
        element: <HomePage />,
      },
      {
        path: RouteConfigs.DCGenerator.Path,
        element: <DataContractGeneratorPage />,
      },
      {
        path: RouteConfigs.DCManagement.Path,
        element: <DataContractManagementPage />,
      },
      {
        path: RouteConfigs.RulesetManagement.Path,
        element: <RulesetManagementPage />,
      },
      {
        path: RouteConfigs.JobManagement.Path,
        element: <JobManagementPage />,
      },
      {
        path: RouteConfigs.Root.Path,
        element: <Navigate to={RouteConfigs.Home.Path} replace />,
      },
      {
        path: "",
        element: <Navigate to={RouteConfigs.Home.Path} replace />,
      },
      {
        path: "*",
        element: <Navigate to={RouteConfigs.Home.Path} replace />,
      },
    ],
  },
];

export { authenticatedRoutes };
