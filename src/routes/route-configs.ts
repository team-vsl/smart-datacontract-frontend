type TRouteConfig = {
  Path: string;
  Sidebar?: {
    IsVisible: boolean;
    Title: string;
    GroupName?: string;
  };
  Name?: string;
  Icon?: any;
};

const routeGroups = {
  features: {
    name: "Features",
  },
  others: {
    name: "Others",
  },
  support: {
    name: "Support",
  },
};

/**
 * A global configuration of routes in application
 */
const RouteConfigs = {
  Root: {
    Path: "/",
  },
  Home: {
    Path: "/",
  },
  SignIn: {
    Path: "/sign-in",
  },
  DCGenerator: {
    Path: "/dc-generator",
    Name: "Data Contract Generator",
  },
  DCManagement: {
    Path: "/dc-management",
    Name: "Data Contract Management",
  },
} satisfies Record<string, TRouteConfig>;

export { type TRouteConfig, RouteConfigs, routeGroups };
