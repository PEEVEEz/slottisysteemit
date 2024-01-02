import { toast } from "sonner";
import { Hunt } from "@/types/types";
import { dashboardRoute } from "./dashboard";
import { Loader } from "@/components/loader";
import { Link } from "@tanstack/react-router";
import { Route } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DialogTrigger } from "@/components/ui/dialog";
import { EditHuntDialog } from "./components/edit-hunt-dialog";
import { CreateHuntDialog } from "./components/create-hunt-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function HuntsPage() {
    const { isLoading, data, refetch } = useQuery<Hunt[]>({
        queryKey: ["hunts"],
        refetchOnWindowFocus: false,
        queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/hunts`, { credentials: "include" }).then((res) => res.json()),
    })

    if (isLoading) {
        return <Loader />
    }

    const handleDelete = async (id: string) => {
        await fetch(`${import.meta.env.VITE_API_URL}/hunts/${id}`, {
            method: "DELETE",
            credentials: "include"
        })

        await refetch();

        toast.success("Hunt deleted!", {
            duration: 1500
        })
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


            {data &&
                <TableBody>
                    {data.map((v, k) => <TableRow key={`action_dropdown_${k}`}>
                        <TableCell>
                            <Link to={`/dashboard/hunts/$id`} params={{ id: v._id }} className="hover:underline">{v.name}</Link>
                        </TableCell>
                        <TableCell>{v.start}€</TableCell>
                        <TableCell>-400€</TableCell>
                        <TableCell className="flex items-center gap-4">
                            <Link to={`/dashboard/hunts/$id`} params={{ id: v._id }}>View</Link>

                            <div>/</div>

                            <EditHuntDialog hunt_id={v._id} current_name={v.name} current_start={v.start} >
                                <DialogTrigger asChild>
                                    <button>
                                        Edit
                                    </button>
                                </DialogTrigger>
                            </EditHuntDialog>

                            <div>/</div>

                            <button onClick={() => handleDelete(v._id)}>
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

export const huntsRoute = new Route({
    getParentRoute: () => dashboardRoute,
    path: "/hunts",
    component: HuntsPage
})