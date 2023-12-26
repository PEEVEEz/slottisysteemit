import { rootRoute } from "@/lib/routes";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Sidebar } from "@/components/sidebar";
import { Outlet, Route, useNavigate } from "@tanstack/react-router";

function DashboardPage() {
    const isAuthenticated = !!useSelector((state: RootState) => state.user.data)

    if (!isAuthenticated) {
        useNavigate({ from: "/" })()
        return;
    }

    return <div className="mx-auto max-w-7xl">
        <div className="flex mt-7 gap-5 mx-3 xl:mx-0">
            <Sidebar />

            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    </div>
}

export const dashboardRoute = new Route({
    getParentRoute: () => rootRoute,
    component: DashboardPage,
    path: "dashboard",
})