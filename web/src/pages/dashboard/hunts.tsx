import { Hunt } from "../../types";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../../components/loader";
import { CreateHuntDialog } from "./components/create-hunt-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";

export function Hunts() {
    const { isLoading, data, refetch } = useQuery<Hunt[]>({
        queryKey: ["hunts"],
        queryFn: () => fetch("http://localhost:3001/hunts", { credentials: "include" }).then((res) => res.json())
    })

    if (isLoading) {
        return <Loader />
    }

    return <div className="text-zinc-200">
        <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">
                Hunts
            </div>

            <CreateHuntDialog onSend={refetch} />
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

            {data && data.length &&
                <TableBody>
                    {data.map((v, k) => <TableRow key={`action_dropdown_${k}`}>
                        <TableCell><Link to={`/dashboard/hunts/${v.id}`}>{v.name}</Link></TableCell>
                        <TableCell>{v.start}€</TableCell>
                        <TableCell>-400€</TableCell>
                        <TableCell className="flex items-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreHorizontal />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="*:cursor-pointer">
                                    <DropdownMenuItem asChild>
                                        <Link to={`/dashboard/hunts/${v.id}`}>View</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
            }
        </Table>
    </div >
}