import { z } from "zod";
import { Bonus } from "@/types/types";
import { PlusIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { FormEvent, useState } from "react";
import { Loader } from "@/components/loader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { addBonus } from "@/redux/slices/hunt";
import { Button } from "@/components/ui/button";
import { Autocomplete } from "@/components/autocomplete";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const formSchema = z.object({
    game: z.string().min(1),
    bet: z.number().nonnegative().min(0.01)
});

type Props = {
    hunt_id: string
}

export function AddBonusDialog({ hunt_id }: Props) {
    const dispatch = useDispatch();
    const [bet, setBet] = useState("");
    const [game, setGame] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState<string[]>([]);

    const handleSearch = async (value: string) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/game?name=${value}`);
        const data = await response.json();
        setGames(data);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true)

        try {
            const data = formSchema.parse({
                bet: parseFloat(bet), game
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/hunts/bonus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ ...data, hunt_id })
            })

            setOpen(false)

            setBet("")
            setGame("")
            setGames([])

            const responseData: Bonus = await response.json();
            dispatch(addBonus({
                hunt_id,
                bonus: responseData
            }))
        } catch (error: any) {
            console.error("Validation error:", error);
            return;
        } finally {
            setLoading(false)
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <PlusIcon />
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add bonus</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <div>
                            <Label className="text-zinc-300">Game</Label>
                            <Autocomplete handleSearch={handleSearch} items={games} name="game" value={game} setValue={setGame} />
                        </div>

                        <div>
                            <Label className="text-zinc-300">Bet</Label>
                            <Input type="number" onChange={(e) => setBet(e.target.value)} value={bet} name="bet" />
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end">
                        <Button disabled={loading} type="submit" variant={"secondary"}>
                            {loading ? (
                                <Loader className="w-6 h-6" />
                            ) : "Add"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
