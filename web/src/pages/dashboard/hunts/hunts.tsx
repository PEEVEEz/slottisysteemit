import { toast } from "sonner";
import { Hunt } from "@/types/types";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { Loader } from "@/components/loader";
import { Route } from "@tanstack/react-router";
import { Link, Outlet } from "@tanstack/react-router";
import { DialogTrigger } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { deleteHunt, setHunts } from "@/redux/slices/hunt";
import { dashboardRoute } from "@/pages/dashboard/dashboard";
import { EditHuntDialog } from "./components/edit-hunt-dialog";
import { CreateHuntDialog } from "./components/create-hunt-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function HuntsPage() {
    const dispatch = useDispatch();
    const hunts = useSelector((state: RootState) => state.hunt.hunts);

    const handleDelete = async (id: string) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/hunts/${id}`, {
                method: "DELETE",
                credentials: "include"
            })

            dispatch(deleteHunt(id))
            toast.success("Hunt deleted!", { duration: 1500 })
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete hunt!", { duration: 1500 })
        }

    }

    return <div className="text-zinc-200">
        <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">
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


            {hunts &&
                <TableBody>
                    {hunts.map((hunt) => <TableRow key={`hunt_${hunt.id}`}>
                        <TableCell>
                            <Link to={`/dashboard/hunts/$id`} params={{ id: hunt.id }} className="hover:underline">{hunt.name}</Link>
                        </TableCell>
                        <TableCell>{hunt.start}€</TableCell>
                        <TableCell>-400€</TableCell>
                        <TableCell className="flex items-center gap-4">
                            <Link to={`/dashboard/hunts/$id`} params={{ id: hunt.id }}>View</Link>

                            <div>/</div>

                            <EditHuntDialog hunt_id={hunt.id} current_name={hunt.name} current_start={hunt.start} >
                                <DialogTrigger asChild>
                                    <button>
                                        Edit
                                    </button>
                                </DialogTrigger>
                            </EditHuntDialog>

                            <div>/</div>

                            <button onClick={() => handleDelete(hunt.id)}>
                                Delete
                            </button>
                        </TableCell>
                    </TableRow>
                    ).reverse()}
                </TableBody>
            }
        </Table>
    </div >
}

function HuntsLayout() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHunts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/hunts`, { credentials: "include" })
                const data: Hunt[] = await response.json();

                dispatch(setHunts(data))
            } catch (error) {
                console.error(error)
                toast.error("Failed to fetch hunts!", {
                    duration: 1500
                })
            } finally {
                setLoading(false)
            }
        }

        fetchHunts();
    }, [])

    if (loading) return <Loader />

    return <Outlet />
}

export const huntsRouteLayout = new Route({
    getParentRoute: () => dashboardRoute,
    id: "huntslayout",
    component: HuntsLayout
})

export const huntsRoute = new Route({
    getParentRoute: () => huntsRouteLayout,
    path: "hunts",
    component: HuntsPage
})