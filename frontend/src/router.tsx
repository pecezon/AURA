import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { RouterProvider } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

import Login from "./routes/login";
import Dashboard from "./routes/dashboard";
import Landing from "./routes/landing";

const rootRoute = createRootRoute({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  landingRoute,
]);

export const router = createRouter({ routeTree });

export function AppRouter() {
  return <RouterProvider router={router} />;
}
