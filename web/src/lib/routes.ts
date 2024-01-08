import { RootRoute, Router } from "@tanstack/react-router";
import { App } from "../app";

//routes
import { homeRoute } from "../pages/home";
import { dashboardRoute } from "../pages/dashboard/dashboard";
import { huntRoute } from "../pages/dashboard/hunts/hunt/hunt";
import { huntsRoute, huntsRouteLayout } from "../pages/dashboard/hunts/hunts";

export const rootRoute = new RootRoute({
  component: App,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  dashboardRoute.addChildren([
    huntsRoute,
    huntsRouteLayout.addChildren([huntsRoute, huntRoute]),
  ]),
]);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const router = new Router({ routeTree });
