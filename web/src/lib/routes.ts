import { RootRoute, Router } from "@tanstack/react-router";
import { App } from "../app";

//routes
import { homeRoute } from "../pages/home";
import { huntsRoute } from "../pages/dashboard/hunts";
import { huntRoute } from "../pages/dashboard/hunt/hunt";
import { dashboardRoute } from "../pages/dashboard/dashboard";

export const rootRoute = new RootRoute({
  component: App,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  dashboardRoute.addChildren([huntsRoute, huntRoute]),
]);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const router = new Router({ routeTree });
