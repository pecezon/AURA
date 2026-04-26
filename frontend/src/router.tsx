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
import AdminDashboard from "./routes/admin-dashboard";
import ProfilePage from "./routes/profile";
import Landing from "./routes/landing";
import RegistrationForm from "./routes/registration-form";

import { getUserState } from "./lib/authGuard";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50 ">
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

// General Dashboard Route
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

    switch (user.role) {
      case "EMPLOYEE":
        throw redirect({ to: "/dashboard/worker" });
      case "OWNER":
        throw redirect({ to: "/dashboard/supervisor" });
      case "ADMIN":
        throw redirect({ to: "/dashboard/admin" });
      default:
        throw redirect({ to: "/" }); // Redirige a landing si el rol es desconocido (no debería pasar)
    }

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

    // requireRole("WORKER"), Needs implementation of role-based access control
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

    // requireRole("SUPERVISOR"), Needs implementation of role-based access control
  },
  component: SupervisorDashboard,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/admin",
  beforeLoad: async () => {
    /*
    const user = await getUserState();

    if (!user.isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    if (!user.isProfileComplete) {
      throw redirect({ to: "/registration-form" });
    }
      */

    // requireRole("ADMIN"), Needs implementation of role-based access control
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

// Profile Route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  beforeLoad: async () => {
    const user = await getUserState();

    if (!user.isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    if (!user.isProfileComplete) {
      throw redirect({ to: "/registration-form" });
    }
  },
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  workerDashboardRoute,
  supervisorDashboardRoute,
  adminDashboardRoute,
  landingRoute,
  registrationFormRoute,
  profileRoute,
]);

export const router = createRouter({ routeTree });

export function AppRouter() {
  return <RouterProvider router={router} />;
}
