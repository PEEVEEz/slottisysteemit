import { toast } from "sonner";
import { RootState } from "@/redux/store";
import { huntsRouteLayout } from "../hunts";
import { Route } from "@tanstack/react-router";
import { deleteBonus } from "@/redux/slices/hunt";
import { DialogTrigger } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "@tanstack/react-router";
import { AddBonusDialog } from "./components/add-bonus-dialog";
import { EditBonusDialog } from "./components/edit-bonus-dialog";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";


function HuntPage() {
    const dispatch = useDispatch();
    const { id } = huntRoute.useParams();
    const hunt = useSelector((state: RootState) => state.hunt.hunts).find((v) => v.id === id)

    if (!hunt) {
        useNavigate({ from: "/dashboard/hunts" })();
        return null;
    }

    const handleDelete = async (bonus_id: string) => {

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/hunts/bonus/${bonus_id}`, {
                method: "DELETE",
                credentials: "include"
            })

            dispatch(deleteBonus({
                hunt_id: id,
                bonus_id
            }))

            toast.success("Bonus deleted!", { duration: 1500 })
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete bonus!", { duration: 1500 })
        }
    }

    return <div className="text-zinc-200">
        <div className="flex justify-between items-center">
            <div className="text-lg font-semibold flex items-center gap-2.5">
                <Link to={"/dashboard/hunts"} className="hover:underline">Hunts</Link> / <div>{hunt.name}</div>
            </div>

            <AddBonusDialog hunt_id={hunt.id} />
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

            {hunt.bonuses &&
                <TableBody>
                    {hunt.bonuses.map((v, k) => <TableRow key={`action_dropdown_${k}`}>
                        <TableCell>{v.game}</TableCell>
                        <TableCell>{v.bet}€</TableCell>
                        <TableCell>{v.payout ? `${v.payout}€` : '-'}</TableCell>
                        <TableCell className="flex items-center gap-4">
                            <EditBonusDialog hunt_id={hunt.id} bonus_id={v.id} current_bet={v.bet}>
                                <DialogTrigger asChild>
                                    <button>
                                        Edit
                                    </button>
                                </DialogTrigger>
                            </EditBonusDialog>

                            <div>/</div>

                            <button onClick={() => handleDelete(v.id)}>
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
    getParentRoute: () => huntsRouteLayout,
    path: "hunts/$id",
    component: HuntPage
})