import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

import { z } from "zod";
import { FormEvent, useState } from "react";

const formSchema = z.object({
    name: z.string().min(1),
    start: z.number().nonnegative().min(0.01)
})

type Props = {
    onSend: () => void
}

export function CreateHuntDialog({ onSend }: Props) {
    const [name, setName] = useState("");
    const [start, setStart] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true)

        try {
            const data = formSchema.parse({
                start: parseFloat(start), name
            });

            await fetch("http://localhost:3001/hunts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data)
            })

            setOpen(false)
            setStart("")
            setName("")
            onSend()
        } catch (error: any) {
            console.error("Validation error:", error);
            return;
        } finally {
            setLoading(false)
        }
    };


    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            <PlusIcon />
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>New Bonushunt</DialogTitle>
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
                    <Button type="submit" disabled={loading} variant={"secondary"}>Create</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
}