import Cookies from "js-cookie";
import { Button } from "./ui/button";
import { RootState } from "../redux/store";
import { setUser } from "../redux/slices/user";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "@tanstack/react-router";
import { CrosshairIcon, Grid2X2, LogOut } from "lucide-react";


export function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate({ from: "/" });
    const user = useSelector((state: RootState) => state.user.data);

    const handleLogout = () => {
        dispatch(setUser(null));
        Cookies.remove("authToken");

        navigate()
    }

    return <div className="w-56 text-zinc-200 flex flex-col gap-2 mt-3">
        <div className="flex items-center gap-2 mb-3">
            <img src={user?.profile_image_url} className="w-9 h-9 rounded-full" />
            <span className="font-semibold">{user?.display_name}</span>
        </div>

        <Button asChild className="justify-start" variant={"secondary"}>
            <Link to={"/dashboard"} className="flex items-center gap-2">
                <CrosshairIcon className="w-4 h-4" />
                <span>Hunts</span>
            </Link>
        </Button>

        <Button asChild className="justify-start" variant={"custom"}>
            <Link to={"/dashboard"} className="flex items-center gap-2">
                <Grid2X2 className="w-4 h-4" />
                <span>Tracker</span>
            </Link>
        </Button>

        <Button onClick={handleLogout} className="justify-start gap-2" variant={"custom"}>
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
        </Button>
    </div>
}