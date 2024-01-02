import Cookies from "js-cookie";
import { Loader } from "lucide-react"
import { useDispatch } from "react-redux"
import { Navbar } from "./components/navbar"
import { Footer } from "./components/footer"
import { setUser } from "./redux/slices/user"
import { useQuery } from "@tanstack/react-query"
import { Outlet } from "@tanstack/react-router";
import { Toaster } from "./components/ui/sonner";


export function App() {
  if (Cookies.get("authToken")) {
    const dispatch = useDispatch();
    const { isLoading, error, data } = useQuery({
      queryKey: ["userData"],
      refetchOnWindowFocus: false,
      queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/users/@me`, { credentials: "include" }).then((res) => res.json()),
    })

    if (isLoading) return <div className="flex items-center justify-center h-[90vh] text-zinc-300">
      <Loader className="w-14 h-14 animate-spin " />
    </div>

    if (!error) {
      dispatch(setUser(data))
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>

      <Toaster />
      <Footer />
    </div>
  )
}