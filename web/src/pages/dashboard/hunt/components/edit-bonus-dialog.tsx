import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


const formSchema = z.object({
    bet: z.number().nonnegative().min(0.01)
});

type Props = {
    hunt_id: number,
    bonus_id: number
    current_bet: number | string,
    children: React.ReactNode
}

export function EditBonusDialog({ hunt_id, bonus_id, children, current_bet }: Props) {
    const [bet, setBet] = useState(current_bet.toString());
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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
                body: JSON.stringify({ ...data, hunt_id, bonus_id })
            })

            setOpen(false)
            setBet("")

            queryClient.invalidateQueries({ queryKey: ["hunt"] })
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
                            Confirm
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
