import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { z } from "zod";
import React, { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
    name: z.string().min(1),
    start: z.number().nonnegative().min(0.01)
})

type Props = {
    hunt_id: number
    current_name: string
    current_start: number
    children: React.ReactNode
}

export function EditHuntDialog({ current_name, current_start, hunt_id, children }: Props) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(current_name);
    const [start, setStart] = useState(current_start.toString());

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true)

        try {
            const data = formSchema.parse({
                start: parseFloat(start), name
            });

            await fetch(`${import.meta.env.VITE_API_URL}/hunts`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ ...data, hunt_id })
            })

            setOpen(false)
            setStart("")
            setName("")

            queryClient.invalidateQueries({ queryKey: ["hunts"] })
        } catch (error: any) {
            console.error("Validation error:", error);
            return;
        } finally {
            setLoading(false)
        }
    };


    return <Dialog open={open} onOpenChange={setOpen}>
        {children}


        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Bonushunt</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <div>
                        <Label className="text-zinc-300">Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <Label className="text-zinc-300">Start</Label>
                        <Input value={start} onChange={(e) => setStart(e.target.value)} />
                    </div>
                </div>

                <div className="mt-5 flex justify-end">
                    <Button type="submit" disabled={loading} variant={"secondary"}>Update</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
}