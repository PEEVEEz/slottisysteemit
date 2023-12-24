import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link } from "@tanstack/react-router";
import { CoffeeIcon, GithubIcon, HomeIcon, MenuIcon, Twitch } from "lucide-react";

export function Navbar() {
    const isLoggedIn = useSelector((state: RootState) => state.user.data) !== null;

    return <nav className="sticky top-0 h-14 text-zinc-100">
        <div className="mx-auto max-w-7xl py-4 px-2 xl:px-0 flex items-center justify-between">
            <div className="text-2xl font-semibold">
                Slottisysteemit
            </div>

            <div className="hidden lg:flex items-center gap-3">
                <Button variant={"link"} asChild className="flex items-center gap-2">
                    <Link to={"/"}>
                        <HomeIcon className="w-4 h-4" />
                        <span>Home</span>
                    </Link>
                </Button>

                <Button variant={"link"} asChild className="flex items-center gap-2">
                    <a href={"https://github.com/PEEVEEz/slottisysteemit"}>
                        <GithubIcon className="w-4 h-4" />
                        <span>Source Code</span>
                    </a>
                </Button>


                <Button variant={"link"} asChild className="flex items-center gap-2">
                    <a href={"https://www.buymeacoffee.com/peevee"}>
                        <CoffeeIcon className="w-4 h-4" />
                        <span>Buy me a coffee</span>
                    </a>
                </Button>

                {isLoggedIn ?
                    <Button size={"sm"} variant={"secondary"}>
                        <Link to={"/dashboard"}>
                            <span>Dahsboard</span>
                        </Link>
                    </Button>
                    :
                    <Button size={"sm"} asChild variant={"secondary"} className="flex items-center gap-2">
                        <a href={`${import.meta.env.VITE_API_URL}/auth/login`}>
                            <Twitch className="w-4 h-4" />
                            <span>Login</span>
                        </a>
                    </Button>
                }
            </div>

            <Button variant={"ghost"} className="lg:hidden">
                <MenuIcon />
            </Button>
        </div>
    </nav>
}