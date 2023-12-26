import { Hunt } from "@/types/types";
import { dashboardRoute } from "./dashboard";
import { Loader } from "@/components/loader";
import { Link } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { Route } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CreateHuntDialog } from "./components/create-hunt-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function HuntsPage() {
    const { isLoading, data, fetchStatus, refetch } = useQuery<Hunt[]>({
        queryKey: ["hunts"],
        queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/hunts`, { credentials: "include" }).then((res) => res.json())
    })

    if (isLoading || fetchStatus === "fetching") {
        return <Loader />
    }

    const handleDelete = async (id: number) => {
        await fetch(`${import.meta.env.VITE_API_URL}/hunts/${id}`, {
            method: "DELETE",
            credentials: "include"
        })

        refetch();
    }

    return <div className="text-zinc-200">
        <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">
                Hunts
            </div>

            <CreateHuntDialog />
        </div>

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>Win/Lose</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>


            {data &&
                <TableBody>
                    {data.map((v, k) => <TableRow key={`action_dropdown_${k}`}>
                        <TableCell><Link to={`/dashboard/hunts/$id`} params={{ id: v.id.toString() }}>{v.name}</Link></TableCell>
                        <TableCell>{v.start}€</TableCell>
                        <TableCell>-400€</TableCell>
                        <TableCell className="flex items-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreHorizontal />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="*:cursor-pointer">
                                    <DropdownMenuItem asChild>
                                        <Link to={`/dashboard/hunts/$id`} params={{ id: v.id.toString() }}>View</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(v.id)}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </TableCell>
                    </TableRow>
                    ).reverse()}
                </TableBody>
            }
        </Table>
    </div >
}

export const huntsRoute = new Route({
    getParentRoute: () => dashboardRoute,
    path: "/",
    component: HuntsPage
})