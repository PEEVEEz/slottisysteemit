import { toast } from "sonner";
import { Bonus, Hunt } from "@/types/types";
import { Loader } from "@/components/loader";
import { dashboardRoute } from "../dashboard";
import { Route } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DialogTrigger } from "@/components/ui/dialog";
import { Link, useNavigate } from "@tanstack/react-router";
import { AddBonusDialog } from "./components/add-bonus-dialog";
import { EditBonusDialog } from "./components/edit-bonus-dialog";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";


function HuntPage() {
    const { id } = huntRoute.useParams();

    const { isLoading, data, refetch } = useQuery<Hunt & { bonuses: Bonus[] }>({
        queryKey: [`hunt_${id}`],
        refetchOnWindowFocus: false,
        queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/hunts/${id}`, { credentials: "include" }).then((res) => res.json()),
    })

    if (isLoading) {
        return <Loader />
    }

    if (!data) {
        useNavigate({ from: "/" })();
        return null;
    }

    const handleDelete = async (bonus_id: string) => {
        await fetch(`${import.meta.env.VITE_API_URL}/hunts/bonus/${bonus_id}`, {
            method: "DELETE",
            credentials: "include"
        })

        await refetch();

        toast.success("Bonus deleted!", {
            duration: 1500
        })
    }

    return <div className="text-zinc-200">
        <div className="flex justify-between items-center">
            <div className="text-lg font-semibold flex items-center gap-2.5">
                <Link to={"/dashboard/hunts"} className="hover:underline">Hunts</Link> / <div>{data.name}</div>
            </div>

            <AddBonusDialog hunt_id={data._id} />
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
                        <TableCell className="flex items-center gap-4">
                            <EditBonusDialog hunt_id={data._id} bonus_id={v._id} current_bet={v.bet}>
                                <DialogTrigger asChild>
                                    <button>
                                        Edit
                                    </button>
                                </DialogTrigger>
                            </EditBonusDialog>

                            <div>/</div>

                            <button onClick={() => handleDelete(v._id)}>
                                Delete
                            </button>
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