import { toast } from "sonner";
import { Bonus, Hunt } from "@/types/types";
import { Loader } from "@/components/loader";
import { MoreHorizontal } from "lucide-react";
import { dashboardRoute } from "../dashboard";
import { Route } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { AddBonusDialog } from "./components/add-bonus-dialog";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


function HuntPage() {
    const { id } = huntRoute.useParams();

    const { isLoading, data, refetch, fetchStatus } = useQuery<Hunt & { bonuses: Bonus[] }>({
        queryKey: ["hunt"],
        queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/hunts/${id}`, { credentials: "include" }).then((res) => res.json()),
    })

    if (isLoading || fetchStatus === "fetching") {
        return <Loader />
    }

    if (!data) {
        useNavigate({ from: "/" })();
        return null;
    }

    const handleDelete = async (bonus_id: number) => {
        await fetch(`${import.meta.env.VITE_API_URL}/hunts/bonus/${bonus_id}`, {
            method: "DELETE",
            credentials: "include"
        })

        await refetch();

        toast.success("Bonus deleted", {
            duration: 1000
        })
    }

    return <div className="text-zinc-200">
        <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">
                <Link to={"/dashboard"}>Hunts</Link> / {data.name}
            </div>

            <AddBonusDialog hunt_id={data.id} />
        </div>

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Game</TableHead>
                    <TableHead>Bet</TableHead>
                    <TableHead>Payout</TableHead>

                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>

            {data.bonuses &&
                <TableBody>
                    {data.bonuses.map((v, k) => <TableRow key={`action_dropdown_${k}`}>
                        <TableCell>{v.game}</TableCell>
                        <TableCell>{v.bet}€</TableCell>
                        <TableCell>{v.payout ? `${v.payout}€` : '-'}</TableCell>
                        <TableCell className="flex items-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreHorizontal />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="*:cursor-pointer">
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(v.id)}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
            }
        </Table>
    </div>
}

export const huntRoute = new Route({
    getParentRoute: () => dashboardRoute,
    path: "/hunts/$id",
    component: HuntPage
})