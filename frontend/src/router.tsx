import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
} from "@tanstack/react-router";
import { RouterProvider } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

import Login from "./routes/login";
import Dashboard from "./routes/dashboard";
import Landing from "./routes/landing";
import RegistrationForm from "./routes/registration-form";

import { getUserState } from "./lib/authGuard";

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
  beforeLoad: async () => {
    const user = await getUserState();

    if (user.isAuthenticated) {
      if (user.isProfileComplete) {
        throw redirect({ to: "/dashboard" });
      }

      throw redirect({ to: "/registration-form" });
    }
  },
  component: Login,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: async () => {
    const user = await getUserState();

    if (!user.isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    if (!user.isProfileComplete) {
      throw redirect({ to: "/registration-form" });
    }
  },
  component: Dashboard,
});

const registrationFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/registration-form",
  beforeLoad: async () => {
    const user = await getUserState();

    if (!user.isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    if (user.isProfileComplete) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RegistrationForm,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  landingRoute,
  registrationFormRoute,
]);

export const router = createRouter({ routeTree });

export function AppRouter() {
  return <RouterProvider router={router} />;
}
