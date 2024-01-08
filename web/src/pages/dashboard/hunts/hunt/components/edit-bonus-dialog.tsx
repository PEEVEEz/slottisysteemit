import { z } from "zod";
import { useDispatch } from "react-redux";
import { Loader } from "@/components/loader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateBonus } from "@/redux/slices/hunt";
import React, { FormEvent, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const formSchema = z.object({
    bet: z.number().nonnegative().min(0.01)
});

type Props = {
    hunt_id: string,
    bonus_id: string
    current_bet: number | string,
    children: React.ReactNode
}

export function EditBonusDialog({ hunt_id, bonus_id, children, current_bet }: Props) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bet, setBet] = useState(current_bet.toString());

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true)

        try {
            const data = formSchema.parse({
                bet: parseFloat(bet),
            });

            await fetch(`${import.meta.env.VITE_API_URL}/hunts/bonus`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ ...data, bonus_id })
            })

            setOpen(false)
            setBet("")

            dispatch(updateBonus({
                hunt_id,
                bonus_id,
                bet: data.bet
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
            {children}

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit bonus</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <div>
                            <Label className="text-zinc-300">Bet</Label>
                            <Input type="number" onChange={(e) => setBet(e.target.value)} value={bet} name="bet" />
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end">
                        <Button disabled={loading} type="submit" variant={"secondary"}>
                            {loading ? (
                                <Loader className="w-6 h-6" />
                            ) : "Confirm"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
