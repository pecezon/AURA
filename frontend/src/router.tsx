import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
} from "@tanstack/react-router";
import { RouterProvider } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

import Login from "./routes/login";
import WorkerDashboard from "./routes/worker-dashboard";
import SupervisorDashboard from "./routes/supervisor-dashboard";
import Landing from "./routes/landing";
import RegistrationForm from "./routes/registration-form";

import { getUserState } from "./lib/authGuard";
import AdminDashboard from "./routes/admin-dashboard";

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

// General Dashboard Rout
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

    throw redirect({ to: "/dashboard/worker" }); // Default to worker dashboard for now, can be enhanced with role-based routing in the future
  },
});

// Specific Dashboard Routes
const workerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/worker",
  beforeLoad: async () => {
    const user = await getUserState();

    if (!user.isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    if (!user.isProfileComplete) {
      throw redirect({ to: "/registration-form" });
    }

    // requireRole("worker"), Needs implementation of role-based access control
  },
  component: WorkerDashboard,
});

const supervisorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/supervisor",
  beforeLoad: async () => {
    const user = await getUserState();

    if (!user.isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    if (!user.isProfileComplete) {
      throw redirect({ to: "/registration-form" });
    }

    // requireRole("worker"), Needs implementation of role-based access control
  },
  component: SupervisorDashboard,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/admin",
  beforeLoad: async () => {
    const user = await getUserState();

    if (!user.isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    if (!user.isProfileComplete) {
      throw redirect({ to: "/registration-form" });
    }

    // requireRole("worker"), Needs implementation of role-based access control
  },
  component: AdminDashboard,
});

// Registration Form Route
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
  workerDashboardRoute,
  supervisorDashboardRoute,
  adminDashboardRoute,
  landingRoute,
  registrationFormRoute,
]);

export const router = createRouter({ routeTree });

export function AppRouter() {
  return <RouterProvider router={router} />;
}
