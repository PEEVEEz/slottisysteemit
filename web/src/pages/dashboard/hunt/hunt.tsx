import { Bonus, Hunt } from "../../../types";
import { MoreHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../../../components/loader";
import { Link, useNavigate, useParams } from "react-router-dom"
import { AddBonusDialog } from "./components/add-bonus-dialog";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "../../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";

export function HuntPage() {
    const params = useParams<{ id: string }>();

    const { isLoading, data, refetch } = useQuery<Hunt & { bonuses: Bonus[] }>({
        queryKey: ["hunts"],
        queryFn: () => fetch("http://localhost:3001/hunts/" + params.id, { credentials: "include" }).then((res) => res.json())
    })

    if (isLoading) {
        return <Loader />
    }

    if (!data) {
        useNavigate()("/");
        return null;
    }

    return <div className="text-zinc-200">
        <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">
                <Link to={"/dashboard"}>Hunts</Link> / {data?.name}
            </div>

            <AddBonusDialog hunt_id={data.id} onSend={refetch} />
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

            {data && data.bonuses &&
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
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
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