import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

type Props = {
    className?: string
}

export function Loader({ className }: Props) {
    return <div className="text-zinc-300">
        <LoaderIcon className={cn("w-14 h-14 animate-spin", className)} />
    </div>
}