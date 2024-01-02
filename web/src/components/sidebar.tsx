import Cookies from "js-cookie";
import { Button } from "./ui/button";
import { RootState } from "../redux/store";
import { setUser } from "../redux/slices/user";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "@tanstack/react-router";
import { CrosshairIcon, Grid2X2, LayoutDashboardIcon, LogOut } from "lucide-react";

export function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate({ from: "/" });
    const user = useSelector((state: RootState) => state.user.data);

    const handleLogout = () => {
        dispatch(setUser(null));
        Cookies.remove("authToken");
        navigate()
    }

    return <div className="w-56 text-zinc-200 flex flex-col gap-2 mt-3 fixed lg:static z-40 bg-zinc-950 top-14 -left-full">
        <div className="flex items-center gap-2 pb-1">
            <img src={user?.profile_image_url} className="w-9 h-9 rounded-full" />
            <span className="font-semibold">{user?.display_name}</span>
        </div>


        <Link to={"/dashboard"} activeOptions={{ exact: true }}>
            {({ isActive }) => {
                return (
                    <Button className="justify-start gap-2 w-full" variant={isActive ? "secondary" : "custom"}>
                        <LayoutDashboardIcon className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Button>
                )
            }}
        </Link>

        <Link to={"/dashboard/hunts"}>
            {({ isActive }) => {
                return (
                    <Button className="justify-start gap-2 w-full" variant={isActive ? "secondary" : "custom"}>
                        <CrosshairIcon className="w-4 h-4" />
                        <span>Bonushunts</span>
                    </Button>
                )
            }}
        </Link>

        <Link to={"/dashboard"}>
            {({ isActive }) => {
                return (
                    <Button className="justify-start gap-2 w-full" variant={isActive ? "secondary" : "custom"}>
                        <Grid2X2 className="w-4 h-4" />
                        <span>Tracker</span>
                    </Button>
                )
            }}
        </Link>

        <Button onClick={handleLogout} className="justify-start gap-2" variant={"custom"}>
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
        </Button>
    </div>
}